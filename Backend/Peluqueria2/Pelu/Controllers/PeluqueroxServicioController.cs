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
    public class PeluqueroxServicioController : Controller
    {
        readonly PeluqueriaDbContext _context;
        public PeluqueroxServicioController(PeluqueriaDbContext context)
        {
            _context = context;
        }

        // GET: PeluqueroxServicio/Peluquero/5
        [HttpGet("Peluquero/{id}")]
        public async Task<ActionResult<IEnumerable<PeluqueroxServicioReadDTO>>> GetServicioxPeluquero(int id)
        {
            var servicios = await _context.PeluqueroxServicios
                 .Where(ps => ps.PeluqueroId == id)
                 .Include(ps => ps.Servicio)
                 .ToListAsync();

            var result = servicios.Select(ps => new PeluqueroxServicioReadDTO
            {
                EmpleadoxServicioID = ps.EmpleadoxServicioId,
                PeluqueroId = ps.PeluqueroId ?? 0,
                ServicioId = ps.ServicioId ?? 0,
                NombreServicio = ps.Servicio.Nombre
            });
            return Ok(result);
        }


        // POST: PeluqueroxServicioController/Peluquero/5
        [HttpPost("Peluquero/{id}")]

        public async Task<ActionResult<PeluqueroxServicioReadDTO>> PostServicioPeluquero(int id, PeluqueroxServicioCreateDTO dto)
        {
            var peluqueroExiste = await _context.Peluqueros.AnyAsync(p => p.PeluqueroId == id);
            if(!peluqueroExiste)
            {
                return NotFound($"No se encontró el peluquero");
            }

            var servicioExiste = await _context.Servicios.AnyAsync(s => s.ServicioId == dto.ServicioId);
            if(!servicioExiste)
            {
                return NotFound($"No se encontró el servicio");
            }

            var yaAsignadio=await _context.PeluqueroxServicios.AnyAsync(ps => ps.PeluqueroId == id && ps.ServicioId == dto.ServicioId);
            if(yaAsignadio)
            {
                return BadRequest($"El servicio ya está asignado al peluquero");
            }

            var psNuevo = new PeluqueroxServicio
            {
                PeluqueroId = id,
                ServicioId = dto.ServicioId
            };

            _context.PeluqueroxServicios.Add(psNuevo);
            await _context.SaveChangesAsync();

            var result=new PeluqueroxServicioReadDTO
            {
                EmpleadoxServicioID = psNuevo.EmpleadoxServicioId,
                PeluqueroId = psNuevo.PeluqueroId ?? 0,
                ServicioId = psNuevo.ServicioId ?? 0,
                NombreServicio = (await _context.Servicios.FindAsync(dto.ServicioId))?.Nombre
            };
            return CreatedAtAction("GetServicioxPeluquero", new { id = psNuevo.PeluqueroId }, result);
        }

        //DELETE:api/PeluqueroxServicio/Peluquero/5/Servicio/3

        [HttpDelete("Peluquero/{peluqueroId}/Servicio/{servicioId}")]
        public async Task<ActionResult> DeleteServicioPeluquero(int peluqueroId, int servicioId)
        {
            var ps = await _context.PeluqueroxServicios.FirstOrDefaultAsync(ps => ps.PeluqueroId == peluqueroId && ps.ServicioId == servicioId);
            if (ps == null)
            {
                return NotFound();
            }

            _context.PeluqueroxServicios.Remove(ps);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
        