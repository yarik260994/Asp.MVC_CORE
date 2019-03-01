using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Models.Buttons
{
    public class InfoTableProperties
    {
        [XmlAttribute]
        public bool ImageNumberColumn { get; set; }
    }
}
