namespace SquirrelsBackend.Models
{
    public class ReturnInventory
    {
        public string Name { get; private set; }
        public int Count { get; private set; }

        public ReturnInventory(string name, int count)
        {
            Name = name;
            Count = count;
        }
    }

    public class RegisterRequest
    {
        public string Username { get; private set; }
        public string Password { get; private set; }
        public string Email { get; private set; }
    }
    public class LoginRequest
    {
        public string Username { get; private set; }
        public string Password { get; private set; }
    }
}
