using Newtonsoft.Json;
using System.Xml;
using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Models.Style
{
    /// <summary>
    /// https://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-ElementCSSInlineStyle
    /// </summary>
    public class StyleSettings
    {
        [XmlAttribute]
        public string color { get; set; }

        [XmlAttribute]
        public string fontFamily { get; set; }

        [XmlAttribute]
        public int fontSize { get; set; }//Предполагается в пунктах

        [XmlAttribute]
        public string fontWeight { get; set; }

        [XmlAttribute]
        public string fontStyle { get; set; }

        [XmlAttribute]
        public string textDecoration { get; set; }

        [XmlAttribute]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string backgroundColor { get; set; }
    }
}