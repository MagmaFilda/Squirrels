namespace SquirrelsBackend.Models
{
    public class UserSquirrel
    {
        public int UserId { get; private set; }
        public int SquirrelId { get; private set; }
        public int Count { get; set; }

        public UserSquirrel() { }
        public UserSquirrel(int userId, int squirrelId)
        {
            UserId = userId;
            SquirrelId = squirrelId;
            Count = 1;
        }
    }
}
