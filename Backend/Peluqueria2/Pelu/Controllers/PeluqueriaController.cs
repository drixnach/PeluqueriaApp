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
    public class PeluqueriaController : ControllerBase
    {
        private readonly PeluqueriaDbContext _context;

        public PeluqueriaController(PeluqueriaDbContext context)
        {
            _context = context;
        }


        // GET: api/<ValuesController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PeluqueriaReadDTO>>> Getpeluquerias()
        {
            var peluquerias = await _context.Peluqueria.Include(p => p.Direccion).ToListAsync();

            var result = peluquerias.Select(p => new PeluqueriaReadDTO
            {
                PeluqueriaId = p.PeluqueriaId,
                Nombre = p.Nombre,
                Telefono = p.Telefono,
                DireccionId = p.DireccionId,
                DireccionTexto = p.Direccion != null ? $"{p.Direccion.Calle} {p.Direccion.Altura} {p.Direccion.Ciudad} " : null

            }).ToList();

            return Ok(result);
        }

        // GET api/Peluqueria/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PeluqueriaReadDTO>> GetPeluqueria(int id)
        {
            var peluqueria = await _context.Peluqueria.Include(p => p.Direccion).FirstOrDefaultAsync(p => p.PeluqueriaId == id);

            if (peluqueria == null)
            {
                return NotFound();
            }

            var dto = new PeluqueriaReadDTO
            {
                PeluqueriaId = peluqueria.PeluqueriaId,
                Nombre = peluqueria.Nombre,
                Telefono = peluqueria.Telefono,
                DireccionId = peluqueria.DireccionId,
                DireccionTexto = peluqueria.Direccion != null ? $"{peluqueria.Direccion.Calle} {peluqueria.Direccion.Altura} {peluqueria.Direccion.Ciudad} " : null
            };

            return Ok(dto);
        }

        // POST api/Peluqueria
        [HttpPost]
        public async Task<ActionResult<PeluqueriaReadDTO>> PostPeluqueria(PeluqueriaCreateDTO dto)
        {
            if (string.IsNullOrEmpty(dto.Nombre)) return BadRequest("El nombre es requerido");


            var peluqueria = new Peluqueria
            {
                Nombre = dto.Nombre,
                Telefono = dto.Telefono,
                DireccionId = dto.DireccionId
            };

            _context.Peluqueria.Add(peluqueria);
            await _context.SaveChangesAsync();

            await _context.Entry(peluqueria).Reference(p => p.Direccion).LoadAsync();

            var result = new PeluqueriaReadDTO
            {
                PeluqueriaId = peluqueria.PeluqueriaId,
                Nombre = peluqueria.Nombre,
                Telefono = peluqueria.Telefono,
                DireccionId = peluqueria.DireccionId,
                DireccionTexto = peluqueria.Direccion != null ? $"{peluqueria.Direccion.Calle} {peluqueria.Direccion.Altura} {peluqueria.Direccion.Ciudad} " : null
            };

            return CreatedAtAction(nameof(GetPeluqueria), new { id = peluqueria.PeluqueriaId }, result);
        }

        // PUT api/Peluqueria/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPeluqueria(int id, PeluqueriaCreateDTO dto)
        {
            var p = await _context.Peluqueria.FindAsync(id);

            if (p == null) return NotFound();

            p.Nombre = dto.Nombre;
            p.Telefono = dto.Telefono;
            p.DireccionId = dto.DireccionId;

            _context.Entry(p).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE api/Peluqueria/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePeluqueria(int id)
        {
            var p = await _context.Peluqueria.FindAsync(id);

            if (p == null) return NotFound();
            _context.Peluqueria.Remove(p);
            await _context.SaveChangesAsync();
            return NoContent();
            {
            }
        }

        //GET api/Peluqueria/5/Horarios
        [HttpGet("{id}/Horarios")]

        public async Task<ActionResult<IEnumerable<HorariosPeluqueriaReadDTO>>> GetHorarios(int id)
        {
            var horarios= await _context.HorariosPeluqueria.Where(h => h.PeluqueriaId == id).ToListAsync();

            var result=horarios.Select(h=>new HorariosPeluqueriaReadDTO
            {
                HorarioPeluqueriaId = h.HorarioPeluqueriaId,
                DiaSemana = h.DiaSemana?? 0,
                HoraAbierto = h.HoraAbierto?? default,
                HoraCerrado = h.HoraCerrado ?? default
            }).ToList();

            return Ok(result);
        }

        // POST api/Peluqueria/5/Horarios
        [HttpPost("{id}/Horarios")]

        public async Task<ActionResult<HorariosPeluqueriaReadDTO>>PostHorario(int id, HorariosPeluqueriaCreateDTO dto)
        {
            var peluqueria = await _context.Peluqueria.AnyAsync(p=> p.PeluqueriaId == id);

            if (!peluqueria) return NotFound("Peluqueria no encontrada");

            var solap=await _context.HorariosPeluqueria.AnyAsync(h=>
            h.PeluqueriaId == id &&
            h.DiaSemana==dto.DiaSemana&&
            !(dto.HoraCerrado<=h.HoraAbierto||dto.HoraAbierto >= h.HoraCerrado)
            );

            if (solap) return BadRequest("El horario esta solapado");

            var horario=new HorariosPeluqueria
            {
                PeluqueriaId = id,
                DiaSemana = dto.DiaSemana,
                HoraAbierto = dto.HoraAbierto,
                HoraCerrado = dto.HoraCerrado
            };

            _context.HorariosPeluqueria.Add(horario);
            await _context.SaveChangesAsync();

            var result = new HorariosPeluqueriaReadDTO
            {
                HorarioPeluqueriaId = horario.HorarioPeluqueriaId,
                DiaSemana = horario.DiaSemana ?? 0,
                HoraAbierto = horario.HoraAbierto ?? default,
                HoraCerrado = horario.HoraCerrado ?? default
            };
            return CreatedAtAction(nameof(GetHorarios), new { id = id }, result);
        }

        //Delete api/Peluqueria/5/Horarios/{horarioId}
        [HttpDelete("{id}/Horarios/{horarioId}")]

        public async Task<IActionResult> DeleteHorario(int id,int horarioId)
        {
            var horario= await _context.HorariosPeluqueria.FirstOrDefaultAsync(h => h.PeluqueriaId == id && h.HorarioPeluqueriaId == horarioId);
            if (horario == null) return NotFound();
            _context.HorariosPeluqueria.Remove(horario);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
