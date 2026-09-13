using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pelu.Models
{
    public partial class Usuarios
    {
        [Key]
        public int UsuarioId { get; set; }

        [Required]
        public string Email { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";

        [Required]
        public string Rol { get; set; } = "";

        public int? ClienteId { get; set; }
        [ForeignKey("ClienteId")]
        public virtual Cliente? Cliente { get; set; }

        public int? PeluqueroId { get; set; }
        [ForeignKey("PeluqueroId")]
        public virtual Peluquero? Peluquero { get; set; }

    }
}
