using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pelu.Models;
using Pelu.Models.DTOs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Pelu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DireccionController : ControllerBase
    {
        private readonly PeluqueriaDbContext _context;

        public DireccionController(PeluqueriaDbContext context)
        {
            _context = context;
        }

        // GET: api/Direccion
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DireccionReadDTO>>>GetDirecciones()
        {
            var direcciones = await _context.Direccions.AsNoTracking().ToListAsync();

            var result=direcciones.Select(d=> new DireccionReadDTO
            {
                DireccionId = d.DireccionId,
                Calle = d.Calle,
                Altura = d.Altura,
                Ciudad = d.Ciudad,
                Provincia = d.Provincia,
                CodigoPostal = d.CodigoPostal,
                Pais = d.Pais
            }).ToList();

            return Ok(result);
        }

        // GET api/Direccion/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DireccionReadDTO>>GetDireccion(int id)
        {
            var d = await _context.Direccions.FindAsync(id);
            if (d == null) return NotFound();

            var result = new DireccionReadDTO
            {
                DireccionId = d.DireccionId,
                Calle = d.Calle,
                Altura = d.Altura,
                Ciudad = d.Ciudad,
                Provincia = d.Provincia,
                CodigoPostal = d.CodigoPostal,
                Pais = d.Pais
            };
            return Ok(result);
        }

        // POST api/Direccion
        [HttpPost]
        public async Task<ActionResult<DireccionReadDTO>> PostDireccion(DireccionCreateDTO dto)
        {
            var direccion = new Direccion
            {
                Calle = dto.Calle,
                Altura = dto.Altura,
                Ciudad = dto.Ciudad,
                Provincia = dto.Provincia,
                CodigoPostal = dto.CodigoPostal,
                Pais = dto.Pais
            };

            _context.Direccions.Add(direccion);
            await _context.SaveChangesAsync();

            var result = new DireccionReadDTO
            {
                DireccionId = direccion.DireccionId,
                Calle = direccion.Calle,
                Altura = direccion.Altura,
                Ciudad = direccion.Ciudad,
                Provincia = direccion.Provincia,
                CodigoPostal = direccion.CodigoPostal,
                Pais = direccion.Pais
            };

            return CreatedAtAction(nameof(GetDireccion), new { id = result.DireccionId }, result);
        }

        // PUT api/Direccion/5
        [HttpPut("{id}")]
        public async Task<ActionResult<DireccionReadDTO>> PutDireccion(int id, DireccionCreateDTO dto)
        {
            var direccion = await _context.Direccions.FindAsync(id);

            if (direccion == null) return NotFound();

            direccion.Calle = dto.Calle;
            direccion.Altura = dto.Altura;
            direccion.Ciudad = dto.Ciudad;
            direccion.Provincia = dto.Provincia;
            direccion.CodigoPostal = dto.CodigoPostal;
            direccion.Pais = dto.Pais;

            _context.Entry(direccion).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();

        }

        // DELETE api/Direccion/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDireccion(int id)
        {
            var direccion = await _context.Direccions.FindAsync(id);
            if (direccion == null) return NotFound();
            
            _context.Direccions.Remove(direccion);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
