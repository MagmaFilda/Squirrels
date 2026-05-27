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

        public SquirrelsController(AppDbContext context)
        {
            dbData = context;
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
        public async Task<IActionResult> Login(string username, string password)
        {
            var user = await dbData.Users.FirstOrDefaultAsync(u => u.Name == username);
            if (user == null)
            {
                return NotFound();
            }
            if (user.Password != password)
            {
                return BadRequest();
            } 

            return Ok();
        }
        [HttpPost("getSquirrel")]
        public async Task<IActionResult> GetSquirrel(int squirrelId, int userId)
        {
            var user = await dbData.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            var squirrelInInventory = await dbData.UserSquirrels.FindAsync(userId, squirrelId);

            if (squirrelInInventory == null)
            {
                squirrelInInventory = new UserSquirrel(userId, squirrelId);
                dbData.UserSquirrels.Add(squirrelInInventory);

                user.Squirrels.Add(squirrelInInventory);
            }
            else
            {
                squirrelInInventory.Count++;
            }
            await dbData.SaveChangesAsync();

            return Ok();
        }
    }
}
