using LanguageFeatures2.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace LanguageFeatures2.Controllers
{
    public class HomeController: Controller
    {
        public async System.Threading.Tasks.Task<ViewResult> Index() {
            long? length = await MyAsyncMethod.GetPageLengthAsync();

            return View(new string[] { $"{length}" });
        }
    }
}
