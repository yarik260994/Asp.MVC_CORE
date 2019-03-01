using Newtonsoft.Json;
using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Models.Buttons
{
    public class Button
    {
        [XmlAttribute]
        public string Text { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public PrintButtonProperties Print { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public LevelButtonProperties Level { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public TableButtonProperties Table { get; set; }
    }
}