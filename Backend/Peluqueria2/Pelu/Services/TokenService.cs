namespace Pelu.Services;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Pelu.Models;

public class TokenService
{
    private readonly IConfiguration _config;
    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerarToken(Usuarios usuario)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.UsuarioId.ToString()),
            new Claim(ClaimTypes.Email, usuario.Email),
            new Claim(ClaimTypes.Role, usuario.Rol)
        };

        if (usuario.ClienteId.HasValue)
        {
            claims.Add(new Claim("ClienteId", usuario.ClienteId.Value.ToString()));
        }

        if (usuario.PeluqueroId.HasValue)
        {
            claims.Add(new Claim("PeluqueroId", usuario.PeluqueroId.Value.ToString()));
        }

        var key= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token=new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(8),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}