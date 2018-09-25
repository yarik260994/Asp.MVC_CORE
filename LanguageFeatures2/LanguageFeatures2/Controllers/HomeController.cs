using LanguageFeatures2.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace LanguageFeatures2.Controllers
{
    public class HomeController: Controller
    {
        public ViewResult Index()
        {
            List<string> productList = new List<string>();

            foreach (Product p in Product.GetProducts())
            {
                productList.Add($"Name:{p?.Name ?? "<no name>"}, Price:{p?.Price ?? 0}, RelatedName:{p?.Related?.Name?? "<no name>"}, {p?.Category}");
            }

            return View(productList);
        }
    }
}
