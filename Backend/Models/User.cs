using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace SquirrelsBackend.Models
{
    public class User
    {
        public int Id { get; private set; }
        public string? Name { get; private set; }
        public string? Password { get; private set; }
        public string? Email { get; private set; }
        public int Money { get; set; }
        public List<UserSquirrel>? Squirrels { get; private set; }

        public User() { }
        public User(string name, string password, string email)
        {
            Name = name;
            Password = password;
            Email = email;
            Money = 0;

            Squirrels = new List<UserSquirrel>();

            HashPassword();
        }
        private void HashPassword()
        {
            PasswordHasher<User> hasher = new();
            if (Password != null)
            {
                string hashedPassword = hasher.HashPassword(this, Password);
                Password = hashedPassword;
            }
        }
    }
}
