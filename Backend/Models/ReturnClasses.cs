namespace SquirrelsBackend.Models
{
    public class ReturnInventory
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        public Rarity Rarity { get; private set; }
        public int Strength { get; private set; }
        public int Speed { get; private set; }
        public int Durability { get; private set; }
        public int Cost { get; private set; }
        public int Count { get; private set; }

        public ReturnInventory(Squirrel squirrel, int count)
        {
            Name = squirrel.Name;
            Description = squirrel.Description;
            Rarity = squirrel.Rarity;
            Strength = squirrel.Strength;
            Speed = squirrel.Speed;
            Durability = squirrel.Durability;
            Cost = squirrel.Cost;
            Count = count;
        }
    }

    public class RegisterRequest
    {
        public string Username { get; set; }
        public string?Password { get; set; }
        public string Email { get; set; }
    }
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
