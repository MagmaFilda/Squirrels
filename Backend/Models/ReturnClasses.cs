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
    public class NewSquirrelRequest
    {
        public List<string>? names { get; set; }
        public List<string>? descs { get; set; }
        public List<Rarity>? rarities { get; set; }
        public List<int>? strengths { get; set; }
        public List<int>? speeds { get; set; }
        public List<int>? healths { get; set; }
        public List<int>? costs { get; set; }
    }
}
