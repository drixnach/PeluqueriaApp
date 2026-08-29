using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pelu.Models;   
using Pelu.Models.DTOs;


namespace Pelu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurnoController : ControllerBase
    {
        private readonly PeluqueriaDbContext _context;

        public TurnoController(PeluqueriaDbContext context)
        {
            _context = context;
        }

        // GET: api/Turno
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TurnosReadDTO>>> GetTurnos()
        {
            var turnos = await _context.Turnos
                .Include(t => t.Cliente)
                .Include(t => t.Peluquero)
                .Include(t => t.Peluqueria)
                .Include(t => t.DetalleTurnos)
                    .ThenInclude(d => d.Servicio)
                .ToListAsync();

            var result = turnos.Select(t => new TurnosReadDTO
            {
                TurnoId = t.TurnoId,
                FechaInicioTurno = t.FechaInicioTurno ?? default(DateTime),
                FechaFinTurno = t.FechaFinTurno ?? default(DateTime),
                NombreCliente = t.Cliente.Nombre,
                NombrePeluquero = t.Peluquero.Nombre,
                NombrePeluqueria = t.Peluqueria.Nombre,
                Servicios=t.DetalleTurnos.Select(d=>new ServiciosTurnoDTO
                {
                    ServicioId = d.ServicioId ?? 0,
                    Nombre = d.Servicio?.Nombre,
                    Precio = d.Precio ?? 0
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        // GET api/Turno/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TurnosReadDTO>> GetTurno(int id)
        {
            var t = await _context.Turnos

                .Include(x => x.Cliente)
                .Include(x => x.Peluquero)
                .Include(x => x.Peluqueria)
                .FirstOrDefaultAsync(x => x.TurnoId == id);

            if (t == null) return NotFound();

            var detalles = await _context.DetalleTurnos
                .Where(d => d.TurnoId == id)
                .Include(d => d.Servicio)
                .ToListAsync();

            var dto = new TurnosReadDTO
            {
                TurnoId = t.TurnoId,
                FechaInicioTurno = t.FechaInicioTurno ?? default(DateTime),
                FechaFinTurno = t.FechaFinTurno ?? default(DateTime),
                NombreCliente = t.Cliente?.Nombre,
                NombrePeluquero = t.Peluquero?.Nombre,
                NombrePeluqueria = t.Peluqueria?.Nombre,
                Servicios=detalles.Select(d => new ServiciosTurnoDTO
                {
                    ServicioId = d.ServicioId ?? 0,
                    Nombre = d.Servicio?.Nombre,
                    Precio = d.Precio ?? 0
                }).ToList()
            };

            return Ok(dto);
        }

        // POST api/Turno
        [HttpPost]
        public async Task<ActionResult<TurnosReadDTO>> PostTurno(TurnosCreateDTO dto)
        {
            if (dto.FechaFinTurno < dto.FechaInicioTurno)
            {
                return BadRequest("La fecha de fin no puede ser anterior a la fecha de inicio.");
            }

            //Valida que la pelu exista
            var PeluExiste =await _context.Peluqueria.AnyAsync(p=>p.PeluqueriaId == dto.peluqueriaId);
            if (!PeluExiste) return NotFound("Peluqueria no encontrada");

            //Valida que la pelu este abierta ese dia
            var diaSemana = (int)dto.FechaInicioTurno.DayOfWeek;
            var horario=await _context.HorariosPeluqueria.FirstOrDefaultAsync(h=>h.PeluqueriaId==dto.peluqueriaId && h.DiaSemana == diaSemana);
            if (horario == null) return BadRequest("No hay horario disponible para la peluquería en ese día.");


            //Valida que el turno este dentro del horario de la pelu
            var horaInicioTurno = TimeOnly.FromDateTime(dto.FechaInicioTurno);
            var horaFinTurno = TimeOnly.FromDateTime(dto.FechaFinTurno);

            if(horaInicioTurno < horario.HoraAbierto || horaFinTurno > horario.HoraCerrado)
            {
                return BadRequest("El turno debe estar dentro del horario de la peluquería.");
            }

            //Valida que el peluquero tenga horario ese dia
            var horarioPeluquero =await _context.HorariosPeluqueros.FirstOrDefaultAsync(h=> h.PeluqueroId == dto.PeluqueroId && h.DiaSemana == diaSemana);

            if( horarioPeluquero == null)
            {
                return BadRequest("El peluquero no tiene horario disponible para ese día.");
            }

            if (horaInicioTurno < horarioPeluquero.HoraInicio || horaFinTurno > horarioPeluquero.HoraFin)
            {
                return BadRequest("El turno debe estar dentro del horario del peluquero.");
            }

            //valida que no se solape con otro turno
            var solapado = await _context.Turnos.AnyAsync(t =>
                t.PeluqueriaId == dto.peluqueriaId &&
                t.PeluqueroId == dto.PeluqueroId &&
                t.FechaInicioTurno < dto.FechaFinTurno &&
                t.FechaFinTurno > dto.FechaInicioTurno);

            if (solapado) return BadRequest("El turno se solapa con otro turno existente en la misma peluquería.");

            var turno = new Turno
            {
                ClienteId = dto.ClienteId,
                PeluqueroId = dto.PeluqueroId,
                PeluqueriaId = dto.peluqueriaId,
                FechaInicioTurno = dto.FechaInicioTurno,
                FechaFinTurno = dto.FechaFinTurno,
                FechaCreacion = DateTime.Now,
            };

            _context.Turnos.Add(turno);
            await _context.SaveChangesAsync();

            foreach (var servicioId in dto.ServiciosIds)
            {
                var servicio=await _context.Servicios.FindAsync(servicioId);
                if(servicio==null) { continue; }

                var asignado = await _context.PeluqueroxServicios.AnyAsync(ps => ps.PeluqueroId == dto.PeluqueroId && ps.ServicioId == servicioId);
                if(!asignado) return BadRequest($"El peluquero no ofrece el servicio con id {servicioId} ");

                    var detalle = new DetalleTurno
                {
                    TurnoId = turno.TurnoId,
                    ServicioId = servicioId,
                    Precio = servicio.Precio
                };
                _context.DetalleTurnos.Add(detalle);
            }
            await _context.SaveChangesAsync();

            await _context.Entry(turno).Reference(t => t.Cliente).LoadAsync();
            await _context.Entry(turno).Reference(t => t.Peluquero).LoadAsync();
            await _context.Entry(turno).Reference(t => t.Peluqueria).LoadAsync();

            var detalles=await _context.DetalleTurnos
                .Where (d => d.TurnoId == turno.TurnoId)
                .Include(d => d.Servicio)
                .ToListAsync();

            var result = new TurnosReadDTO
            {
                TurnoId = turno.TurnoId,
                FechaInicioTurno = turno.FechaInicioTurno ?? default(DateTime),
                FechaFinTurno = turno.FechaFinTurno ?? default(DateTime),
                NombreCliente = turno.Cliente?.Nombre,
                NombrePeluquero = turno.Peluquero?.Nombre,
                NombrePeluqueria = turno.Peluqueria?.Nombre,
                Servicios=detalles.Select(d => new ServiciosTurnoDTO
                {
                    ServicioId = d.ServicioId ?? 0,
                    Nombre = d.Servicio?.Nombre,
                    Precio = d.Precio ?? 0
                }).ToList()
            };

            return CreatedAtAction(nameof(GetTurno), new { id = turno.TurnoId }, result);
        }

        // PUT api/Turno/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTurno(int id, TurnosCreateDTO dto)
        {
            var turno = await _context.Turnos.FindAsync(id);
            if (turno == null) return NotFound();


            //Valida que la pelu exista
            var PeluExiste = await _context.Peluqueria.AnyAsync(p => p.PeluqueriaId == dto.peluqueriaId);
            if(!PeluExiste) return NotFound("Peluqueria no encontrada");

            //Valida que la pelu este abierta ese dia
            var diaSemana = (int)dto.FechaInicioTurno.DayOfWeek;
            var horarioPelu=await _context.HorariosPeluqueria.FirstOrDefaultAsync(h => h.PeluqueriaId == dto.peluqueriaId && h.DiaSemana == diaSemana);

            if(horarioPelu == null) return BadRequest("La peluquería no está abierta ese día");

            //Valida que el turno este dentro del horario de la pelu
            var horaInicioTurno = TimeOnly.FromDateTime(dto.FechaInicioTurno);
            var horaFinTurno = TimeOnly.FromDateTime(dto.FechaFinTurno);

            if(horaInicioTurno < horarioPelu.HoraAbierto || horaFinTurno > horarioPelu.HoraCerrado)
            {
                return BadRequest("El turno debe estar dentro del horario de la peluquería.");
            }

            //Valida que el peluquero tenga horario ese dia
            var horarioPeluquero=await _context.HorariosPeluqueros.FirstOrDefaultAsync(h => h.PeluqueroId == dto.PeluqueroId && h.DiaSemana == diaSemana);

            if(horarioPeluquero == null) return BadRequest("El peluquero no tiene horario ese día");
            if(horaInicioTurno < horarioPeluquero.HoraInicio || horaFinTurno > horarioPeluquero.HoraFin)
            {
                return BadRequest("El turno debe estar dentro del horario del peluquero.");
            }

            //valida que no se solape con otro turno

            var solapa=await _context.Turnos.AnyAsync(t =>
                t.TurnoId != id &&
                t.PeluqueriaId == dto.peluqueriaId &&
                t.PeluqueroId == dto.PeluqueroId &&
                t.FechaInicioTurno < dto.FechaFinTurno &&
                t.FechaFinTurno > dto.FechaInicioTurno);

            if(solapa) return BadRequest("El turno se solapa con otro turno existente en la misma peluquería.");


            turno.ClienteId = dto.ClienteId;
            turno.PeluqueroId = dto.PeluqueroId;
            turno.PeluqueriaId = dto.peluqueriaId;
            turno.FechaInicioTurno = dto.FechaInicioTurno;
            turno.FechaFinTurno = dto.FechaFinTurno;

            _context.Entry(turno).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            // Actualiza los servicios actuales del turno
            var servicioActual =_context.DetalleTurnos.Where(d => d.TurnoId == id);
            _context.DetalleTurnos.RemoveRange(servicioActual);
            await _context.SaveChangesAsync();

            foreach(var servicioId in dto.ServiciosIds)
            {
                var servicio = await _context.Servicios.FindAsync(servicioId);
                if (servicio == null) { continue; }

                var asignado=await _context.PeluqueroxServicios.AnyAsync(ps => ps.PeluqueroId == dto.PeluqueroId && ps.ServicioId == servicioId);
                if (!asignado) return BadRequest($"El servicio con id {servicioId} no está asignado al peluquero.");

                var detalle = new DetalleTurno
                {
                    TurnoId = turno.TurnoId,
                    ServicioId = servicioId,
                    Precio = servicio.Precio
                };

                _context.DetalleTurnos.Add(detalle);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE api/Turno/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTurno(int id)
        {
            var turno = await _context.Turnos.FindAsync(id);
            if (turno == null) return NotFound();


            var detalles = _context.DetalleTurnos.Where(d => d.TurnoId == id);
            _context.DetalleTurnos.RemoveRange(detalles);

            _context.Turnos.Remove(turno);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
