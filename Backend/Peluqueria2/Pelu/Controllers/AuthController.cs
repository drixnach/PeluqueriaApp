using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pelu.Models.DTOs;
using Pelu.Models;
using Pelu.Services;

namespace Pelu.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PeluqueriaDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(PeluqueriaDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        //Parte Cliente

        [AllowAnonymous]
        [HttpPost("RgisterCliente")]
        public async Task <IActionResult>RegisterCliente(RegisterClienteRequest request)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Email == request.Email))
                return BadRequest("El correo electrónico ya está registrado.");

            var cliente = new Cliente
            {
                Nombre = request.Nombre,
                Apellido = request.Apellido,
                Correo = request.Email,
                Sexo = request.sexo,
                Telefono = request.Telefono
            };
            _context.Clientes.Add(cliente); 
            await _context.SaveChangesAsync();

            var usuario = new Usuarios
            {
                Email = request.Email,
                Rol = "Cliente",
                ClienteId = cliente.ClienteId
            };
            var hasher = new PasswordHasher<Usuarios>();
            usuario.Password = hasher.HashPassword(usuario, request.Password);  

            _context.Usuarios.Add(usuario);

            await _context.SaveChangesAsync();

            return Ok(new {mensaje= "Cliente registrado exitosamente" });

        }

        //Parte Peluquero/Admin

        [Authorize(Roles = "Admin")]
        [HttpPost("Register-Staff")]

        public async Task<IActionResult>RegisterStaff(RegisterStaffRequest request)
        {
            if (request.Rol != "Admin" && request.Rol != "Peluquero")
            {
                return BadRequest("Rol invalido");
            }

            if (request.Rol == "Peluquero" && request.PeluqueroId == null)
            {
                return BadRequest("Se requiere PeluqueroId para el rol Peluquero");
            }

            if (await _context.Usuarios.AnyAsync(u => u.Email == request.Email))
                return BadRequest("El correo electrónico ya está registrado.");

            var usuario = new Usuarios
            {
                Email = request.Email,
                Rol = request.Rol,
                PeluqueroId = request.Rol == "Peluquero" ? request.PeluqueroId : null
            };

            var hasher = new PasswordHasher<Usuarios>();
            usuario.Password = hasher.HashPassword(usuario, request.Password);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario registrado exitosamente" });
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<IActionResult>Login(LoginRequest request)
        {
            var usuario = await _context.Usuarios
                .Include(u=>u.Cliente)
                .Include(u=>u.Peluquero)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario == null)
                return Unauthorized("Correo electrónico o contraseña incorrectos.");    

            var hasher = new PasswordHasher<Usuarios>();
            var resultado = hasher.VerifyHashedPassword(usuario, usuario.Password, request.Password);

            if (resultado == PasswordVerificationResult.Failed)
                return Unauthorized("Correo electrónico o contraseña incorrectos.");

            var token = _tokenService.GenerarToken(usuario);

            return Ok(new
            {
                token,
                rol = usuario.Rol,
                nombre = usuario.Cliente?.Nombre ?? usuario.Peluquero?.Nombre
            });

        }

        [AllowAnonymous]
        [HttpPost("bootstrap-admin")]
        public async Task<IActionResult> BootstrapAdmin(RegisterStaffRequest request)
        {
            if (await _context.Usuarios.AnyAsync())
                return BadRequest("Ya existe al menos un usuario. Este endpoint solo funciona con la tabla vacía.");

            var usuario = new Usuarios
            {
                Email = request.Email,
                Rol = "Admin"
            };

            var hasher = new PasswordHasher<Usuarios>();
            usuario.Password = hasher.HashPassword(usuario, request.Password);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Admin creado correctamente." });
        }

    }
}
