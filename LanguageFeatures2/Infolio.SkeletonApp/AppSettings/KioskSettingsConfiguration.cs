using Infolio.Core.Applications.Containers.Features;
using Infolio.Core.DynamicConfiguration.Attributes;
using System.ComponentModel;

namespace Infolio.SkeletonApp.AppSettings
{
    /// <summary>
    /// Конфигурация фичи
    /// </summary>
    public class KioskSettingsConfiguration : FeatureConfiguration
    {
        [DisplayName("Path To Upload")]
        [PropertyTooltip("Path To Upload")]
#if DEBUG
        [PropertyDefaultValue(@"\\10.176.255.101\#Exchange\Ymaslay\Upload")]
#endif
        public string PathToUpload
        {
            get; set;
        }
        [DisplayName("Extension Of Images")]
        [PropertyTooltip("Extension Of Images")]
        [PropertyDefaultValue("png,jpg,gif")]
        public string ExtensionOfImages
        {
            get; set;
        }
        [DisplayName("XML File Name")]
        [PropertyTooltip("XML File Name")]
        [PropertyDefaultValue("settings.xml")]

        public string XMLFileName
        {
            get; set;
        }
    }
}