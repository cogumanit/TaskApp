namespace TaskApi.Models
{
 // POCO = Plain Old CLR Object. EF Core maps this to a DB table.
 public class TaskItem
 {
 public int Id { get; set; } // Primary Key by convention (Table: Tasks, Column: Id)
 public string Title { get; set; } = ""; // Required (we'll also validate in the controller)
 public bool IsDone { get; set; } = false; // Simple status flag
 public DateTime? DueDate { get; set; } // Nullable → optional due date
 }
}