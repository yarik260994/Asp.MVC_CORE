using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Models.Buttons
{
    public class CommonTableProperties
    {
        [XmlAttribute]
        [JsonConverter(typeof(StringEnumConverter))]
        public DateTimeVariant DateTimeColumn { get; set; }

        [XmlAttribute]
        public bool PrintFileColumn { get; set; }

        [XmlAttribute]
        public int ColumnsCount { get; set; }
    }
}
