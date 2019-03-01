using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LanguageFeatures2.Models
{
    public class Product
    {
        public Product(bool inStock=true) {
            InStock = inStock;
        }

        public string Name { get; set; }
        public decimal? Price { get; set; }
        public string Category { get; set; } = "Watersports";
        public bool? InStock { get; }

        public Product Related{ get; set; }
        public static Product [] GetProducts()
        {
            Product kayak = new Product(true) { Name = "Kayak", Price = 275M, Category="Water Craft" };
            Product lifeJacket = new Product(false) { Name = "LifeJacket", Price = 322M };
            kayak.Related = lifeJacket;
            return new Product[] { kayak, lifeJacket,null };
        }
    }
}
