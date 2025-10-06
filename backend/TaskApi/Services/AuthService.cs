using Microsoft.AspNetCore.Identity;
using TaskApi.DTOs;
using TaskApi.Models;
using TaskApi.Repositories;

namespace TaskApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ITokenService _tokenService;

        // injects constructor, dependencies are hidden
        public AuthService(IUserRepository userRepo, IPasswordHasher<User> passwordHasher, ITokenService tokenService)
        {
            _userRepo = userRepo; // private fields
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userRepo.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                return new AuthResponseDto { Message = "User already exists." };

            var user = new User
            {
                Email = dto.Email
            };
            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            await _userRepo.AddUserAsync(user);
            await _userRepo.SaveChangesAsync();

            var token = _tokenService.GenerateToken(user);

            return new AuthResponseDto { Token = token, Message = "Registration successful" };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null)
                return new AuthResponseDto { Message = "Invalid credentials" };

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
                return new AuthResponseDto { Message = "Invalid credentials" };

            var token = _tokenService.GenerateToken(user);

            return new AuthResponseDto { Token = token, Message = "Login successful" };
        }
    }
}
