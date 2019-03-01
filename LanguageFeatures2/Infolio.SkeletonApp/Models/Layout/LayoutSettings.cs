using Infolio.SkeletonApp.Models.Style;
using System.Xml;
using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Models.Layout
{
    public class LayoutSettings
    {
        [XmlAttribute]
        public int Variant { get; set; }//Отказались от Enum, потому что не смогли прибиндить
        [XmlAttribute]
        public string EventName { get; set; }
        public LogoSettings Logo { get; set; }
        public BackgroundSettings Background { get; set; }
        public StyleSettings Name { get; set; }
        public StyleSettings FirstLevelButtons { get; set; }
        public StyleSettings PrintButtons { get; set; }
        //Добавили новые поля в модель
        public StyleSettings WindowTitles { get; set; }
        public StyleSettings PrintMessages { get; set; }
        public StyleSettings Table { get; set; }

        [XmlAttribute]
        public string TableGridColor { get; set; }

        [XmlAttribute]
        public int TableGridSize { get; set; }//Предполагается в пунктах
    }
}