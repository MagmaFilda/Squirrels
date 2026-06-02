using System.ComponentModel.DataAnnotations;

namespace SquirrelsBackend.Models
{
    public enum Rarity { Common, Rare, Epic, Legendary}
    public class Squirrel
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public Rarity Rarity { get; private set; }
        // Stats
        public int Strength { get; private set; }
        public int Speed { get; private set; }
        public int Durability { get; private set; } // "health"
        // Sell
        public int Cost { get; private set; }

        public Squirrel() { }
    }
}
