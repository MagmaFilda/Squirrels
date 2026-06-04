namespace SquirrelsBackend.Models
{
    public class ReturnInventory
    {
        public Squirrel ReturningSquirrel {  get; private set; }
        public int Count { get; private set; }

        public ReturnInventory(Squirrel squirrel, int count)
        {
            ReturningSquirrel = squirrel;
            Count = count;
        }
    }

    public class RegisterRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
    }
    public class LoginRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
    public class LeaderboardReturn
    {
        public string? Username { get; private set; }
        public int Count { get; private set; }

        public LeaderboardReturn(string username, int count)
        {
            Username = username;
            Count = count;
        }
    }
    public class NewSquirrelRequest
    {
        public string? name { get; set; }
        public string? desc { get; set; }
        public Rarity rarity { get; set; }
        public int strength { get; set; }
        public int speed { get; set; }
        public int health { get; set; }
        public int cost { get; set; }
    }
}
