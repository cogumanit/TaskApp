namespace TaskApi.DTOs
{
    public class TaskResponseDto
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsDone { get; set; } = false;
        public DateTime? DueDate { get; set; }
        public string Category { get; set; } = string.Empty;
        public int? EstimateHours { get; set; }
    }
}