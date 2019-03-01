using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LanguageFeatures2.Models
{
    public static class MyExtentionMethod
    {
        public static decimal TotalPrice(this IEnumerable<Product> cartParam)
        {
            decimal price = 0;
            foreach (var product in cartParam)
            {
                price += product?.Price?? 0;
            }
            return price;
        }

        public static int AllUsers(this IEnumerable<Users> users)
        {
            int userCount=0;
            foreach (var user in users)
            {
                userCount++;
            }
            return userCount;
        }
    }
}
