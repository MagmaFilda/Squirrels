namespace SquirrelsBackend.Models
{
    public enum Rarity { Common, Rare, Epic, Legendary}
    public class Squirrel
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public Rarity Rarity { get; private set; }
        public int WhereCanBeOpen { get; private set; } // id sisky

        public Squirrel() { }
    }
}
