using System.ComponentModel.DataAnnotations;

namespace SquirrelsBackend.Models
{
    public class Siska
    {
        [Key]
        public int Id { get; private set; }
        [Required]
        [MaxLength(20)]
        public string Name { get; private set; }
        [Required]
        [MaxLength(50)]
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
