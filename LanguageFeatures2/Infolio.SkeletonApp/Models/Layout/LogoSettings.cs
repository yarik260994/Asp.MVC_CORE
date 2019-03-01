using System.Xml;
using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Models.Layout
{
    public class LogoSettings
    {
        [XmlAttribute]
        public string src { get; set; }

        [XmlAttribute]
        public int Foreground; //Отказались от Enum, потому что не смогли прибиндить
    }
}