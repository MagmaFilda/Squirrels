using Microsoft.AspNetCore.Authorization;
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
        private readonly IConfiguration configuration;
        private Services services;
        private PasswordHasher<User> hasher;

        public SquirrelsController(AppDbContext context, IConfiguration configuration)
        {
            dbData = context;
            services = new Services();
            hasher = new();
            this.configuration = configuration;
        }

        [HttpGet("catalog")]
        public IActionResult ReadSquirrelsToCatalog()
        {
            return Ok(dbData.Squirrels);
        }
        [Authorize]
        [HttpGet("inventory")]
        public async Task<IActionResult> GetInventory()
        {
            int userId = int.Parse(User.FindFirst("UserId")!.Value);

            var users = await dbData.Users.Include(u => u.Squirrels).ToListAsync();
            var user = users.Find(u => u.Id == userId);
            if (user == null)
            {
                return NotFound();
            }

            List<ReturnInventory> returnData = new List<ReturnInventory>();
            foreach (var item in user.Squirrels)
            {
                Squirrel? squirrel = await dbData.Squirrels.FindAsync(item.SquirrelId);
                ReturnInventory returnSquirrel = new ReturnInventory(squirrel, item.Count);
                returnData.Add(returnSquirrel);
            }

            return Ok(returnData.OrderBy(s => s.ReturningSquirrel.Id));
        }
        [Authorize]
        [HttpGet("readMoney")]
        public async Task<IActionResult> ReadMoney()
        {
            int userId = int.Parse(User.FindFirst("UserId")!.Value);

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
                string token = services.GenerateToken(user, configuration);
                return Ok(new{token = token});
            }
            else
            {
                return BadRequest();
            }               
        }
        //[HttpPost("addSquirrel")]
        //public async Task<IActionResult> NewSquirrel(NewSquirrelRequest squirrelData)
        //{
        //    for (int i = 0; i < squirrelData.names.Count; i++)
        //    {
        //        Squirrel squirrel = new Squirrel(squirrelData.names[i], squirrelData.descs[i], squirrelData.rarities[i],
        //            squirrelData.strengths[i], squirrelData.speeds[i], squirrelData.healths[i], squirrelData.costs[i]);
        //        dbData.Squirrels.Add(squirrel);
        //    }

        //    await dbData.SaveChangesAsync();
        //    return Ok();
        //}
        //[HttpPost("addSiska")]
        //public async Task<IActionResult> NewSiska(string name, int cost, int common, int rare, int epic, int legendary)
        //{
        //    Siska siska = new Siska(name, "", cost, common, rare, epic, legendary);
        //    dbData.Sisky.Add(siska);

        //    await dbData.SaveChangesAsync();
        //    return Ok(siska);
        //}
        [Authorize]
        [HttpPost("openSiska/{siskaId}")]
        public async Task<IActionResult> OpenSiska(int siskaId)
        {
            int userId = int.Parse(User.FindFirst("UserId")!.Value);

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
        [Authorize]
        [HttpDelete("sell/{squirrelId}/{count}")]
        public async Task<IActionResult> SellSquirrel(int squirrelId, int count)
        {
            int userId = int.Parse(User.FindFirst("UserId")!.Value);

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
                user.Money += squirrel.Cost*count;

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