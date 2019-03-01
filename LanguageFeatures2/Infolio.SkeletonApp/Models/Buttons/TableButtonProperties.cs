using Newtonsoft.Json;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Models.Buttons
{
    public class TableButtonProperties
    {
        [XmlAttribute]
        public string Title { get; set; }

        [XmlAttribute]
        public string Message { get; set; }

        [XmlAttribute]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string PrintDocument { get; set; }

        public List<string> ColumnWidths { get; set; }

        public List<Row> Table { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public CommonTableProperties Common { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public InfoTableProperties Info { get; set; }
    }
}