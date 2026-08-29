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
    public class ServicioController : ControllerBase
    {
        private readonly PeluqueriaDbContext _context;

        public ServicioController(PeluqueriaDbContext context)
        {
            _context = context;
        }

        // GET: api/Servicio
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServicioReadDTO>>> GetServicios()
        {
            var servicios = await _context.Servicios.ToListAsync();
            var result = servicios.Select(s => new ServicioReadDTO
            {
                ServicioId = s.ServicioId,
                Nombre = s.Nombre,
                Descripcion = s.Descripcion,
                Duracion = s.Duracion ?? 0,
                Precio = s.Precio ?? 0,
            });
            return Ok(result);
        }
       

        // GET api/Servicio/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServicioReadDTO>> GetServicio(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);

            if (servicio == null) return NotFound();

            var dto= new ServicioReadDTO
            {
                ServicioId = servicio.ServicioId,
                Nombre = servicio.Nombre,
                Descripcion = servicio.Descripcion,
                Duracion = servicio.Duracion ?? 0,
                Precio = servicio.Precio ?? 0,
            };
            return Ok(dto);
        }

        // POST api/Servicio
        [HttpPost]
        public async Task<ActionResult<ServicioReadDTO>> PostServicio([FromBody] ServicioCreateDTO dto)
        {
            var s= new Servicio
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                Duracion = dto.Duracion,
                Precio = dto.Precio
            };

            _context.Servicios.Add(s);
            await _context.SaveChangesAsync();

            var result = new ServicioReadDTO
            {
                ServicioId = s.ServicioId,
                Nombre = s.Nombre,
                Descripcion = s.Descripcion,
                Duracion = s.Duracion ?? 0,
                Precio = s.Precio ?? 0,
            };

            return CreatedAtAction(nameof(GetServicio), new { id = s.ServicioId }, result);
        }

        // PUT api/Servicio/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServicio(int id, ServicioCreateDTO dto)
        {
            var servicio = await _context.Servicios.FindAsync(id);
            if (servicio == null) return NotFound();

            servicio.Nombre = dto.Nombre;
            servicio.Descripcion = dto.Descripcion;
            servicio.Duracion = dto.Duracion;
            servicio.Precio = dto.Precio;

            _context.Entry(servicio).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE api/Servicio/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServicio(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);
            if (servicio == null) return NotFound();

            _context.Servicios.Remove(servicio);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
