using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace TaskApi.Models
{
    //  EF Core maps this to a DB table. (will create the the table in the db after migrations)
    public class TaskItem
    {
        public int Id { get; set; } // Primary Key by convention (Table: Tasks, Column: Id)
        public string Title { get; set; } = ""; // Required (we'll also validate in the controller)
        public bool IsDone { get; set; } = false; // Simple status flag
        public DateTime? DueDate { get; set; } // Nullable → optional due date

        [Required]
        [MaxLength(50)]
        public required string Category { get; set; } // add Categoy column (string, required, max length 50)
        public int? EstimateHours { get; set; } // add estimate hours column (int, optional, default 0)
        
    }
}