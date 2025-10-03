using TaskApi.Models;

namespace TaskApi.Services
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
