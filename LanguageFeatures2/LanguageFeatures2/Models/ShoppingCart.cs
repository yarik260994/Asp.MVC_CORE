using System.Collections;
using System.Collections.Generic;

namespace LanguageFeatures2.Models
{
    public class ShoppingCart: IEnumerable<Product>
    {
        public ShoppingCart(IEnumerable<Product> products)
        {
            Products = products;
        }

        public IEnumerable<Product> Products { get; set; }

        public IEnumerator<Product> GetEnumerator()
        {
            return Products.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return Products.GetEnumerator();
        }
    }
}
