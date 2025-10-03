using TaskApi.Models;

namespace TaskApi.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task SaveChangesAsync();
    }
}
