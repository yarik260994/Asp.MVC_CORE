using System.Collections.Generic;
using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Models.Buttons
{
    public class LevelButtonProperties
    {
        [XmlAttribute]
        public string Title { get; set; }

        public List<Button> Buttons { get; set; }
    }
}