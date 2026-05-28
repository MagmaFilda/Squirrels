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

        public SquirrelsController(AppDbContext context)
        {
            dbData = context;
            services = new Services();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInventory(int id)
        {
            var users = await dbData.Users.Include(u => u.Squirrels).ToListAsync();
            var user = users.Find(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            List<ReturnInventory> returnData = new List<ReturnInventory>();
            foreach (var item in user.Squirrels)
            {
                Squirrel squirrel = await dbData.Squirrels.FindAsync(item.SquirrelId);
                ReturnInventory returnSquirrel = new ReturnInventory(squirrel.Name, item.Count);
                returnData.Add(returnSquirrel);
            }

            return Ok(returnData);
        }
        [HttpGet("readMoney/{id}")]
        public async Task<IActionResult> ReadMoney(int id)
        {
            var user = await dbData.Users.FindAsync(id);
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
            var checkingUsername = await dbData.Users.FirstOrDefaultAsync(u => u.Name == registerData.Username);

            if (checkingUsername != null)
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
            if (user.Password != loginData.Password)
            {
                return BadRequest();
            }

            return Ok(user.Id);
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
    }
}