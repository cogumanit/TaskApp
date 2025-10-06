using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TaskApi.Data;
using TaskApi.Models;
using TaskApi.DTOs;
using System.Security.Claims;

namespace TaskApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TasksController(AppDbContext db) => _db = db;

        // Helper method to get current user ID
        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("User not authenticated");
            
            return Guid.Parse(userIdClaim);
        }

        // READ ALL: GET /api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetAll()
        {
            var userId = GetCurrentUserId();
            
            var items = await _db.Tasks
                .Where(t => t.UserId == userId)
                .OrderBy(t => t.IsDone)
                .ThenBy(t => t.DueDate)
                .Select(t => new TaskResponseDto
                {
                    Id = t.Id,
                    UserId = t.UserId,
                    Title = t.Title,
                    IsDone = t.IsDone,
                    DueDate = t.DueDate,
                    Category = t.Category,
                    EstimateHours = t.EstimateHours
                })
                .ToListAsync();

            return Ok(items);
        }

        // READ ONE: GET /api/tasks/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskResponseDto>> GetById(int id)
        {
            var userId = GetCurrentUserId();
            
            var item = await _db.Tasks
                .Where(t => t.Id == id && t.UserId == userId)
                .Select(t => new TaskResponseDto
                {
                    Id = t.Id,
                    UserId = t.UserId,
                    Title = t.Title,
                    IsDone = t.IsDone,
                    DueDate = t.DueDate,
                    Category = t.Category,
                    EstimateHours = t.EstimateHours
                })
                .FirstOrDefaultAsync();
            
            if (item == null) return NotFound();

            return Ok(item);
        }

        // CREATE: POST /api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskResponseDto>> Create([FromBody] TaskResponseDto dto)
        {
            var userId = GetCurrentUserId();
            
            // Validation
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest("Title is required.");

            if (string.IsNullOrWhiteSpace(dto.Category))
                return BadRequest("Category is required.");

            if (dto.EstimateHours < 0)
                return BadRequest("Estimate hours must be non-negative.");

            var taskItem = new TaskItem
            {
                UserId = userId,
                Title = dto.Title,
                IsDone = dto.IsDone,
                DueDate = dto.DueDate,
                Category = dto.Category,
                EstimateHours = dto.EstimateHours
            };

            _db.Tasks.Add(taskItem);
            await _db.SaveChangesAsync();

            var response = new TaskResponseDto
            {
                Id = taskItem.Id,
                UserId = taskItem.UserId,
                Title = taskItem.Title,
                IsDone = taskItem.IsDone,
                DueDate = taskItem.DueDate,
                Category = taskItem.Category,
                EstimateHours = taskItem.EstimateHours
            };

            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }

        // UPDATE: PUT /api/tasks/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaskResponseDto dto)
        {
            var userId = GetCurrentUserId();
            
            // Validation
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest("Title is required.");

            if (string.IsNullOrWhiteSpace(dto.Category))
                return BadRequest("Category is required.");

            if (dto.EstimateHours < 0)
                return BadRequest("Estimate hours must be non-negative.");

            var taskItem = await _db.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            
            if (taskItem == null) 
                return NotFound();

            // Update properties
            taskItem.Title = dto.Title;
            taskItem.IsDone = dto.IsDone;
            taskItem.DueDate = dto.DueDate;
            taskItem.Category = dto.Category;
            taskItem.EstimateHours = dto.EstimateHours;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: DELETE /api/tasks/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetCurrentUserId();
            
            var item = await _db.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            
            if (item == null) 
                return NotFound();

            _db.Tasks.Remove(item);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}