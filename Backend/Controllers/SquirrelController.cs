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

        private int adminId = 28;

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
        [HttpGet("leaderboard")]
        public async Task<IActionResult> LoadLeaderboard()
        {
            List<User> users = await dbData.Users.Include(u => u.Squirrels).ToListAsync();

            List<int> legendarySquirrels = await dbData.Squirrels.Where(s => s.Rarity == Rarity.Legendary).Select(s => s.Id).ToListAsync();
            List<LeaderboardReturn> returnData = users.Select(u => new LeaderboardReturn(u.Name!, 
                u.Squirrels!.Where(us => legendarySquirrels.Contains(us.SquirrelId)).Sum(us => us.Count)
                )).OrderByDescending(x => x.Count).Take(10).ToList();

            return Ok(returnData);
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
            if (user.Squirrels == null) { return NotFound(); }

            List<ReturnInventory> returnData = new List<ReturnInventory>();
            foreach (var item in user.Squirrels)
            {
                Squirrel? squirrel = await dbData.Squirrels.FindAsync(item.SquirrelId);
                if (squirrel == null) { return NotFound(); }
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
            if (registerData.Username == null || registerData.Password == null || registerData.Email == null) { return NotFound(); }

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
            if (user.Password == null || loginData.Password == null) { return NotFound(); }

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

                    if (user.Squirrels == null) { return NotFound(user.Squirrels); }
                    user.Squirrels.Add(squirrelInInventory);
                }
                else
                {
                    squirrelInInventory.Count++;
                }
                var returningSquirrel = await dbData.Squirrels.FindAsync(realSquirrelId);
                
                user.Money -= openingSiska.Cost;
                await dbData.SaveChangesAsync();

                if (returningSquirrel == null) { return NotFound(returningSquirrel); }
                OpenSquirrelReturn returnSquirrelData = new OpenSquirrelReturn(returningSquirrel.Name, returningSquirrel.Rarity);

                return Ok(returnSquirrelData);
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
                    if (user.Squirrels != null) { user.Squirrels.Remove(inventorySlot); }                
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
        //Admin endpoints
        [Authorize]
        [HttpGet("isAdmin")]
        public async Task<IActionResult> IsAdmin()
        {
            int userId = int.Parse(User.FindFirst("UserId")!.Value);
            var user = await dbData.Users.FindAsync(userId);
            if (user == null) { return NotFound(); }

            if (userId == adminId)
            {
                return Ok();
            }
            return BadRequest();
        }
        [Authorize]
        [HttpGet("getUsers")]
        public async Task<IActionResult> ReadAllUsers()
        {
            int userId = int.Parse(User.FindFirst("UserId")!.Value);
            var user = await dbData.Users.FindAsync(userId);
            if (user == null) { return NotFound(); }

            if (userId == adminId)
            {
                var users = await dbData.Users.Include(u => u.Squirrels).ToListAsync();

                List<UserReturn> allUsers = users.Select(u => new UserReturn(u.Name, u.Money, u.Squirrels))
                    .OrderByDescending(x => x.Money).ToList();
                return Ok(allUsers);
            }
            return BadRequest();
        }
        [Authorize]
        [HttpPut("changeMoney/{targetUserName}/{amount}")]
        public async Task<IActionResult> ChangeMoney(string targetUserName, int amount)
        {
            int userId = int.Parse(User.FindFirst("UserId")!.Value);
            var user = await dbData.Users.FindAsync(userId);
            if (user == null) { return NotFound(); }

            if (userId == adminId)
            {
                var targetUser = await dbData.Users.FirstOrDefaultAsync(u => u.Name == targetUserName);
                if (targetUser == null) { return NotFound(); }

                targetUser.Money += amount;
                if (user.Money < 0) {  targetUser.Money = 0; }
                return Ok(targetUser.Money);
            }
            return BadRequest();
        }
        [Authorize]
        [HttpPost("addSquirrelToDatabase")]
        public async Task<IActionResult> NewSquirrelInDatabase(NewSquirrelRequest squirrelData)
        {
            int userId = int.Parse(User.FindFirst("UserId")!.Value);
            var user = await dbData.Users.FindAsync(userId);
            if (user == null) { return NotFound(); }

            if (userId == adminId)
            {
                Squirrel newSquirrel = new Squirrel(squirrelData.name, squirrelData.desc, squirrelData.rarity,
                    squirrelData.strength, squirrelData.speed, squirrelData.health, squirrelData.cost);
                dbData.Squirrels.Add(newSquirrel);
                
                await dbData.SaveChangesAsync();
                return Ok();
            } 
           return BadRequest(adminId);         
        }
        [Authorize]
        [HttpDelete("changeUserSquirrels/{targetUserName}/{squirrelId}/{amount}")]
        public async Task<IActionResult> AddSquirrelToUser(string targetUserName, int squirrelId, int amount)
        {
            int userId = int.Parse(User.FindFirst("UserId")!.Value);
            var user = await dbData.Users.FindAsync(userId);
            if (user == null) { return NotFound(); }

            if (userId == adminId)
            {
                var targetUser = await dbData.Users.FirstOrDefaultAsync(u => u.Name == targetUserName);
                if (targetUser == null) { return NotFound(targetUserName); }

                var squirrelInInventory = await dbData.UserSquirrels.FindAsync(targetUser.Id, squirrelId);

                if (squirrelInInventory == null)
                {
                    if (amount <= 0) { return BadRequest(); }

                    squirrelInInventory = new UserSquirrel(targetUser.Id, squirrelId);
                    squirrelInInventory.Count = amount;
                    dbData.UserSquirrels.Add(squirrelInInventory);

                    if (targetUser.Squirrels == null) { return NotFound(targetUser.Squirrels); }
                    targetUser.Squirrels.Add(squirrelInInventory);
                }
                else
                {
                    if (squirrelInInventory.Count + amount > 0)
                    {
                        squirrelInInventory.Count += amount;
                    }
                    else
                    {
                        dbData.UserSquirrels.Remove(squirrelInInventory);
                        if (targetUser.Squirrels != null) { targetUser.Squirrels.Remove(squirrelInInventory); }
                    }
                }
            }
            return BadRequest();
        }
    }
}