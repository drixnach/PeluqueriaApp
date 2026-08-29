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
    public class ClientesController : ControllerBase
    {
        private readonly PeluqueriaDbContext _context;

        public ClientesController(PeluqueriaDbContext context)
        {
            _context = context;
        }

        // GET: api/Clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteReadDto>>> GetClientes()
        {
            var clientes = await _context.Clientes.ToListAsync();
            var clientesDto = clientes.Select(c => new ClienteReadDto
            {
                ClienteId = c.ClienteId,
                Nombre = c.Nombre,
                Apellido = c.Apellido,
                Correo = c.Correo,
                Telefono = c.Telefono,
                Sexo= c.Sexo
            }).ToList();

            return clientesDto;
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteReadDto>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            var clienteDto = new ClienteReadDto
            {
                ClienteId = cliente.ClienteId,
                Nombre = cliente.Nombre,
                Apellido = cliente.Apellido,
                Correo = cliente.Correo,
                Telefono = cliente.Telefono,
                Sexo=cliente.Sexo
            };

            return clienteDto;
        }

        // PUT: api/Clientes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, ClienteCreateDTO dto)

        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null) return NotFound();

            cliente.Nombre = dto.Nombre??cliente.Nombre;
            cliente.Apellido = dto.Apellido??cliente.Apellido;
            cliente.Correo = dto.Correo??cliente.Correo;
            cliente.Sexo = dto.Sexo??cliente.Sexo;
            cliente.Telefono = dto.Telefono??cliente.Telefono;

            _context.Entry(cliente).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

            // POST: api/Clientes
            // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
            [HttpPost]
        public async Task<ActionResult<ClienteReadDto>> PostCliente(ClienteCreateDTO clienteDto)
        {
            var cliente = new Cliente
            {
                Nombre = clienteDto.Nombre,
                Apellido = clienteDto.Apellido,
                Correo = clienteDto.Correo,
                Sexo = clienteDto.Sexo,
                Telefono = clienteDto.Telefono
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCliente", new { id = cliente.ClienteId }, cliente);
        }

        // DELETE: api/Clientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null) return NotFound();

            
            var turnosCliente = await _context.Turnos
                .Where(t => t.ClienteId == id)
                .ToListAsync();

            
            var turnoIds = turnosCliente.Select(t => t.TurnoId).ToList();

            
            var detalles = _context.DetalleTurnos
                .Where(d => turnoIds.Contains((int)d.TurnoId));
            _context.DetalleTurnos.RemoveRange(detalles);

            
            _context.Turnos.RemoveRange(turnosCliente);
            _context.Clientes.Remove(cliente);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.ClienteId == id);
        }
    }
}
