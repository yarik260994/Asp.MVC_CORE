using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Models.Buttons
{
    public class PrintButtonProperties
    {
        [XmlAttribute]
        public string Message { get; set; }

        [XmlAttribute]
        public string Document { get; set; }
    }
}