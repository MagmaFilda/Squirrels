using SquirrelsBackend.Models;

namespace SquirrelsBackend.Controllers
{
    public class Services
    {
        public Rarity GetRandomRarity(Siska openedSiska)
        {
            List<int> siskaChances = new List<int>() { openedSiska.Common, openedSiska.Rare, openedSiska.Epic, openedSiska.Legendary };
            Random random = new Random();
            Rarity rarity = Rarity.Common;

            int roll = random.Next(0, 101);
            float actualChance = 0f;

            for (int i = 0; i < siskaChances.Count; i++)
            {
                actualChance += siskaChances[i];
                if (roll <= actualChance)
                {
                    rarity = (Rarity)i;
                    break;
                }
            }
            return rarity;
        }
    }
}
