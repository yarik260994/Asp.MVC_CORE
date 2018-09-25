using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LanguageFeatures2.Models
{
    public class Product
    {
        public string Name { get; set; }
        public decimal? Price { get; set; }
        public string Category { get; set; } = "Watersports";

        public Product Related{ get; set; }
        public static Product [] GetProducts()
        {
            Product kayak = new Product { Name = "Kayak", Price = 275M, Category="Water Craft" };
            Product lifeJacket = new Product { Name = "LifeJacket", Price = 322M };
            kayak.Related = lifeJacket;
            return new Product[] { kayak, lifeJacket,null };
        }
    }
}
