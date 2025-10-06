using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

// ENCAPSULATION - hide password hash, role etc.
namespace TaskApi.Models
{
    //  EF Core maps this to a DB table. (will create the the table in the db after migrations)
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "User";

        // [Required]
        // [MaxLength(50)]
        // public required string Category { get; set; } // add Categoy column (string, required, max length 50)
        // public int? EstimateHours { get; set; } // add estimate hours column (int, optional, default 0)

    }
}