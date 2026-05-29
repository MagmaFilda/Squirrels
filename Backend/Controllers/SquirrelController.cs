using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SquirrelsBackend.Data;
using SquirrelsBackend.Models;

namespace SquirrelsBackend.Controllers
{
    [ApiController]
    [Route("api/squirrels")]
    public class SquirrelsController : ControllerBase
    {
        private readonly AppDbContext dbData;
        private Services services;
        private PasswordHasher<User> hasher;

        public SquirrelsController(AppDbContext context)
        {
            dbData = context;
            services = new Services();
            hasher = new();
        }

        [HttpGet("catalog")]
        public IActionResult ReadSquirrelsToCatalog()
        {
            return Ok(dbData.Squirrels);
        }
        [HttpGet("inventory/{userId}")]
        public async Task<IActionResult> GetInventory(int userId)
        {
            var users = await dbData.Users.Include(u => u.Squirrels).ToListAsync();
            var user = users.Find(u => u.Id == userId);
            if (user == null)
            {
                return NotFound();
            }

            List<ReturnInventory> returnData = new List<ReturnInventory>();
            foreach (var item in user.Squirrels)
            {
                Squirrel squirrel = await dbData.Squirrels.FindAsync(item.SquirrelId);
                ReturnInventory returnSquirrel = new ReturnInventory(squirrel, item.Count);
                returnData.Add(returnSquirrel);
            }

            return Ok(returnData);
        }
        [HttpGet("readMoney/{userId}")]
        public async Task<IActionResult> ReadMoney(int userId)
        {
            var user = await dbData.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            string returningMoney = "0";
            if (user.Money < 10000)
            {
                returningMoney = user.Money.ToString();
            }
            else if (user.Money < 1000000)
            {
                returningMoney = MathF.Round(user.Money / 1000) + "K";
            }
            else if (user.Money >= 1000000)
            {
                returningMoney = MathF.Round(user.Money / 1000000) + "M";
            }

            return Ok(returningMoney);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest registerData)
        {
            if (registerData == null)
            {
                return NotFound();
            }

            var checkingUser = await dbData.Users.FirstOrDefaultAsync(u => u.Name == registerData.Username);

            if (checkingUser != null || registerData.Username.Length < 3 || registerData.Username.Length > 12)
            {
                return BadRequest();
            }

            User newUser = new User(registerData.Username, registerData.Password, registerData.Email);

            dbData.Users.Add(newUser);
            await dbData.SaveChangesAsync();

            return Ok();
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest loginData)
        {
            var user = await dbData.Users.FirstOrDefaultAsync(u => u.Name == loginData.Username);
            if (user == null)
            {
                return NotFound();
            }
            var result = hasher.VerifyHashedPassword(user, user.Password, loginData.Password);
            if (result == PasswordVerificationResult.Success)
            {
                return Ok(user.Id);
            }
            else
            {
                return BadRequest();
            }               
        }
        [HttpPost("openSiska/{siskaId}/{userId}")]
        public async Task<IActionResult> OpenSiska(int siskaId, int userId)
        {
            var user = await dbData.Users.FindAsync(userId);
            var openingSiska = await dbData.Sisky.FindAsync(siskaId);
            if (openingSiska == null || user == null)
            {
                return NotFound();
            }
            if (openingSiska.Cost <= user.Money)
            {
                Rarity openedRarity = services.GetRandomRarity(openingSiska);
                Squirrel[] raritySquirrels = await dbData.Squirrels.Where(s => s.Rarity == openedRarity).ToArrayAsync();

                Random random = new Random();
                int generatedSquirrelId = random.Next(0, raritySquirrels.Length);
                int realSquirrelId = raritySquirrels[generatedSquirrelId].Id;
                var squirrelInInventory = await dbData.UserSquirrels.FindAsync(userId, realSquirrelId);

                if (squirrelInInventory == null)
                {
                    squirrelInInventory = new UserSquirrel(userId, realSquirrelId);
                    dbData.UserSquirrels.Add(squirrelInInventory);

                    user.Squirrels.Add(squirrelInInventory);
                }
                else
                {
                    squirrelInInventory.Count++;
                }
                var returningSquirrel = await dbData.Squirrels.FindAsync(realSquirrelId);
                user.Money -= openingSiska.Cost;
                await dbData.SaveChangesAsync();

                return Ok(returningSquirrel.Name);
            }
            else
            {
                return BadRequest();
            }

            
        }
        [HttpDelete("sell/{userId}/{squirrelId}/{count}")]
        public async Task<IActionResult> SellSquirrel(int userId, int squirrelId, int count)
        {
            var user = await dbData.Users.FindAsync(userId);
            var squirrel = await dbData.Squirrels.FindAsync(squirrelId);
            var inventorySlot = await dbData.UserSquirrels.FindAsync(userId, squirrelId);
            if (user == null || squirrel  == null || inventorySlot == null)
            {
                return NotFound();
            }
            
            if (count <= inventorySlot.Count)
            {
                if (inventorySlot.Count == count)
                {
                    dbData.UserSquirrels.Remove(inventorySlot);
                }
                else
                {
                    inventorySlot.Count -= count;
                }
                user.Money += squirrel.Cost;

                await dbData.SaveChangesAsync();

                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}