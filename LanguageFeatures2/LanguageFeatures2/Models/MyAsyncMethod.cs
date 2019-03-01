using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace LanguageFeatures2.Models
{
    public class MyAsyncMethod
    {
        public static async Task<long?> GetPageLengthAsync()
        {
            HttpClient client = new HttpClient();
            var httpMessage = await client.GetAsync("https://apress.com");

            return httpMessage.Content.Headers.ContentLength; 
        }
    }
}
