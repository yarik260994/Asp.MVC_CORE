using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Models.Layout
{
    /// <summary>
    /// https://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-ElementCSSInlineStyle
    /// </summary>
    public class BackgroundSettings
    {
        [XmlAttribute]
        public string backgroundImage { get; set; }

        [XmlAttribute]
        public string backgroundColor { get; set; }
    }
}