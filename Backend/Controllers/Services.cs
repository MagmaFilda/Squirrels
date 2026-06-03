using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SquirrelsBackend.Models;

namespace SquirrelsBackend.Controllers
{
    public class Services
    {
        public Rarity GetRandomRarity(Siska openedSiska)
        {
            List<int> siskaChances = new List<int>() { openedSiska.Common, openedSiska.Rare, openedSiska.Epic, openedSiska.Legendary };
            Random random = new Random();
            Rarity rarity = Rarity.Common;

            int roll = random.Next(1, 101);
            float actualChance = 0f;

            for (int i = 0; i < siskaChances.Count; i++)
            {
                actualChance += siskaChances[i];
                if (roll <= actualChance)
                {
                    rarity = (Rarity)i;
                    break;
                }
            }
            return rarity;
        }

        public string GenerateToken(User user, IConfiguration configuration)
        {
            if (user.Name == null) { return(""); }

            var claims = new List<Claim> 
            {
                new Claim("UserId", user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
