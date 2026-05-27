namespace SquirrelsBackend.Models
{
    public class Siska
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public int Cost { get; private set; }
        // Chances
        public int Common {  get; private set; }
        public int Rare { get; private set; }
        public int Epic { get; private set; }
        public int Legendary { get; private set; }

        public Siska() { }
    }
}
