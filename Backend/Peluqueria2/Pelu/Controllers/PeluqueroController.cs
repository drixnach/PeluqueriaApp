using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pelu.Models;
using Pelu.Models.DTOs;

namespace Pelu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeluqueroController : ControllerBase
    {
        private readonly PeluqueriaDbContext _context;

        public PeluqueroController(PeluqueriaDbContext context)
        {
            _context = context;
        }

        // GET: api/Peluquero
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PeluqueroReadDto>>> GetPeluqueros()
        {
            var peluqueros = await _context.Peluqueros
                .Include(p => p.Peluqueria)
                .Include(p => p.PeluqueroxServicios)
                    .ThenInclude(px => px.Servicio)
                .ToListAsync();

            var dtoList=peluqueros.Select(p => new PeluqueroReadDto
            {
                PeluqueroId = p.PeluqueroId,
                Nombre = p.Nombre,
                Apellido = p.Apellido,
                Telefono = p.Telefono,
                FechaContratacion = p.FechaContratacion.HasValue ? p.FechaContratacion.Value.ToDateTime(TimeOnly.MinValue) : default(DateTime),
                Cuil = p.Cuil,
                NombrePeluqueria = p.Peluqueria?.Nombre,
                Servicios = p.PeluqueroxServicios
                    .Select(px => px.Servicio.Nombre)
                    .ToList()
            }).ToList();

            return Ok(dtoList);
        }

        // GET: api/Peluquero/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<PeluqueroReadDto>>> GetPeluquero(int id)
        {
            var peluquero = await _context.Peluqueros
           .Include(p => p.Peluqueria)
           .Include(p => p.PeluqueroxServicios)
               .ThenInclude(px => px.Servicio)
           .FirstOrDefaultAsync(p => p.PeluqueroId == id);

            if (peluquero == null) return NotFound();

            var dto = new PeluqueroReadDto
            {
                PeluqueroId = peluquero.PeluqueroId,
                Nombre = peluquero.Nombre,
                Apellido = peluquero.Apellido,
                Telefono = peluquero.Telefono,
                FechaContratacion = peluquero.FechaContratacion.HasValue ? peluquero.FechaContratacion.Value.ToDateTime(TimeOnly.MinValue) : default(DateTime),
                Cuil = peluquero.Cuil,
                NombrePeluqueria = peluquero.Peluqueria ?.Nombre,
                Servicios = peluquero.PeluqueroxServicios
                    .Select(px => px.Servicio.Nombre)
                    .ToList()
            };

            return Ok(dto);
        }

        // PUT: api/Peluquero/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPeluquero(int id, PeluqueroCreateDto dto)
        {
            var peluquero = await _context.Peluqueros
            .Include(p => p.PeluqueroxServicios) 
            .FirstOrDefaultAsync(p => p.PeluqueroId == id);

            if (peluquero == null) return NotFound();

            int? direccionId = dto.DireccionId;

            // Si viene una dirección embebida y no hay Id, crearla
            if (dto.Direccion != null && !direccionId.HasValue)
            {
                var nuevaDireccion = new Direccion
                {
                    Calle = dto.Direccion.Calle,
                    Altura = dto.Direccion.Altura,
                    Ciudad = dto.Direccion.Ciudad,
                    Provincia = dto.Direccion.Provincia,
                    CodigoPostal = dto.Direccion.CodigoPostal,
                    Pais = dto.Direccion.Pais
                };

                _context.Direccions.Add(nuevaDireccion);
                await _context.SaveChangesAsync();
                direccionId = nuevaDireccion.DireccionId;
            }
        

            peluquero.Nombre = dto.Nombre;
            peluquero.Apellido = dto.Apellido;
            peluquero.Telefono = dto.Telefono;
            peluquero.PeluqueriaId = dto.PeluqueriaId;
            peluquero.FechaContratacion = DateOnly.FromDateTime(dto.FechaContratacion);
            peluquero.Cuil = dto.Cuil;
            peluquero.DireccionId = direccionId??peluquero.DireccionId  ;

            _context.PeluqueroxServicios.RemoveRange(peluquero.PeluqueroxServicios);

            if (dto.ServicioIds != null && dto.ServicioIds.Any())
            {
                var nuevos = dto.ServicioIds.Distinct()
                    .Select(sid => new PeluqueroxServicio { PeluqueroId = id, ServicioId = sid });
                await _context.PeluqueroxServicios.AddRangeAsync(nuevos);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {            
                    return NotFound();     
            }

            return NoContent();
        }

        // POST: api/Peluquero
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PeluqueroReadDto>> PostPeluquero(PeluqueroCreateDto dto)
        {
            // Validar que la peluquería exista
            var peluqueriaExiste = await _context.Peluqueria.AnyAsync(p => p.PeluqueriaId == dto.PeluqueriaId);
            if (!peluqueriaExiste) return NotFound("Peluquería no encontrada");

            int? direccionId=dto.DireccionId;

            // Si viene un objeto Dirección, crearla
            if (dto.Direccion != null && !direccionId.HasValue)
            {
                var nuevaDireccion = new Direccion
                {
                    Calle = dto.Direccion.Calle,
                    Altura = dto.Direccion.Altura,
                    Ciudad = dto.Direccion.Ciudad,
                    Provincia = dto.Direccion.Provincia,
                    CodigoPostal = dto.Direccion.CodigoPostal,
                    Pais = dto.Direccion.Pais
                };

                _context.Direccions.Add(nuevaDireccion);
                await _context.SaveChangesAsync();
                direccionId = nuevaDireccion.DireccionId;
            }
            

            var peluquero = new Peluquero
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Telefono = dto.Telefono,
                PeluqueriaId = dto.PeluqueriaId,
                FechaContratacion = DateOnly.FromDateTime(dto.FechaContratacion),
                Cuil = dto.Cuil,
                DireccionId = direccionId
            };

            _context.Peluqueros.Add(peluquero);
            await _context.SaveChangesAsync();

            if (dto.ServicioIds != null && dto.ServicioIds.Any())
            {
                foreach(var servicioId in dto.ServicioIds)
                {
                    _context.PeluqueroxServicios.Add(new PeluqueroxServicio
                    {
                        PeluqueroId = peluquero.PeluqueroId,
                        ServicioId = servicioId
                    });
                }
                await _context.SaveChangesAsync();
            }

            var peluqueria = await _context.Peluqueria.FindAsync(dto.PeluqueriaId);

            var servicios= await _context.PeluqueroxServicios
                .Where(px => px.PeluqueroId == peluquero.PeluqueroId)
                .Include(px => px.Servicio)
                .Select(px => px.Servicio.Nombre)
                .ToListAsync();

            var resultado = new PeluqueroReadDto
            {
                PeluqueroId = peluquero.PeluqueroId,
                Nombre = peluquero.Nombre,
                Apellido = peluquero.Apellido,
                Telefono = peluquero.Telefono,
                FechaContratacion = peluquero.FechaContratacion.HasValue ? peluquero.FechaContratacion.Value.ToDateTime(TimeOnly.MinValue) : default(DateTime),
                Cuil = peluquero.Cuil,
                NombrePeluqueria = peluqueria?.Nombre,
                Servicios= servicios
            };

            return CreatedAtAction("GetPeluquero", new { id = peluquero.PeluqueroId }, resultado);
        }

        // DELETE: api/Peluquero/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePeluquero(int id)
        {
            var peluquero=await _context.Peluqueros
                .Include(p => p.PeluqueroxServicios)
                .Include(p => p.HorariosPeluqueros)
                .FirstOrDefaultAsync(p => p.PeluqueroId == id);

            if (peluquero==null)
            {
                return NotFound("Peluquero no encontrado");
            }

            if(peluquero.PeluqueroxServicios.Any())
            {
               _context.PeluqueroxServicios.RemoveRange(peluquero.PeluqueroxServicios);
            }

            if(peluquero.HorariosPeluqueros.Any())
            {
                _context.HorariosPeluqueros.RemoveRange(peluquero.HorariosPeluqueros);
            }

            _context.Peluqueros.Remove(peluquero);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        //GET: api/Peluquero/{id}/Horarios
        [HttpGet("{id}/Horarios")]

        public async Task<ActionResult<IEnumerable<HorariosPeluqueroReadDTO>>>GetHorariosPeluquero(int id)
        {
            var horarios= await _context.HorariosPeluqueros.Where(h=>h.PeluqueroId==id).ToListAsync();

            var result= horarios.Select(h=>new HorariosPeluqueroReadDTO
            {
                HorarioPeluqueroId = h.HorarioPeluqueroId,
                DiaSemana = h.DiaSemana?? 0,
                HoraInicio = h.HoraInicio?? default,
                HoraFin = h.HoraFin?? default,
            });

            return Ok(result);
        }

        // POST: api/Peluquero/{id}/Horarios
        [HttpPost("{id}/Horarios")]

        public async Task<ActionResult<HorariosPeluqueroReadDTO>>PostHorario(int id,[FromBody] HorariosPeluqueroCreateDTO dto)
        {
            var peluqueroExiste= await _context.Peluqueros.AnyAsync(p => p.PeluqueroId == id);
            if(!peluqueroExiste) return NotFound("Peluquero no encontrado");

            var solapa=await _context.HorariosPeluqueros.AnyAsync(h =>h.PeluqueroId == id && h.DiaSemana == dto.DiaSemana && !(dto.HoraFin<=dto.HoraInicio || dto.HoraInicio>=dto.HoraFin));

            if(solapa) return BadRequest("El horario esta solapado con otro existente");

            var horario = new HorariosPeluquero
            {
                PeluqueroId = id,
                DiaSemana = dto.DiaSemana,
                HoraInicio = dto.HoraInicio,
                HoraFin = dto.HoraFin
            };

            _context.HorariosPeluqueros.Add(horario);
            await _context.SaveChangesAsync();

            var result= new HorariosPeluqueroReadDTO
            {
                HorarioPeluqueroId = horario.HorarioPeluqueroId,
                DiaSemana = horario.DiaSemana ?? 0,
                HoraInicio = horario.HoraInicio ?? default,
                HoraFin = horario.HoraFin ?? default,
            };

            return CreatedAtAction(nameof(GetHorariosPeluquero), new { id = id }, result);
        }

        //DELETE: api/Peluquero/{id}/Horarios/{horarioId}
        [HttpDelete("{id}/Horarios/{horarioId}")]

        public async Task<IActionResult>DeleteHorario(int id, int horarioId)
        {
            var horario = await _context.HorariosPeluqueros.FirstOrDefaultAsync(h => h.HorarioPeluqueroId == horarioId && h.PeluqueroId == id);
            if (horario == null) return NotFound();
            _context.HorariosPeluqueros.Remove(horario);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
