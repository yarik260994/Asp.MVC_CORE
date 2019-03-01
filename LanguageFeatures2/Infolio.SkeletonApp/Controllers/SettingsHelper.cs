using Infolio.SkeletonApp.AppSettings;
using Infolio.SkeletonApp.Models;
using Infolio.SkeletonApp.Models.Buttons;
using Infolio.SkeletonApp.Models.Layout;
using Infolio.SkeletonApp.Models.Style;
using System.Collections.Generic;
using System.IO;
using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Controllers
{
    public static class SettingsHelper
    {
        public static Settings GetSettings(KioskSettings settings)
        {
            if (File.Exists(settings.Configuration.XMLFileName))
            {
                using (var reader = new StreamReader(settings.Configuration.XMLFileName))
                {
                    return (Settings)(new XmlSerializer(typeof(Settings))).Deserialize(reader);
                }
            }
            else
            {
                return GetDefaultSettings();
            }
        }

        private static readonly string defaultBackgroundColor = "00ffff";
        private static readonly string defaultTextColor = "000000";

        public static StyleSettings SetDefaultStyle()
        {
            return new StyleSettings()
            {
                backgroundColor = defaultBackgroundColor,
                color = defaultTextColor,
                fontFamily = "Times New Roman",
                fontSize = 20,
                fontWeight = "normal",
                textDecoration = "none",
                fontStyle = "normal",
            };
        }

        public static Settings GetDefaultSettings()
        {
            Settings settings = new Settings();

            settings.Layout = new LayoutSettings
            {

                Variant = 1,//Четыре секции

                EventName = "",
                Logo = new LogoSettings
                {
                    Foreground = 2,//вверху слева
                    src = "",//Логотип img
                },
                Background = new BackgroundSettings
                {
                    backgroundColor = defaultBackgroundColor,
                    backgroundImage = ""//Цвет фона/изображение img
                },
            };

            settings.Layout.Name = SetDefaultStyle();
            settings.Layout.FirstLevelButtons = SetDefaultStyle();
            settings.Layout.PrintButtons = SetDefaultStyle();
            settings.Layout.WindowTitles = SetDefaultStyle();
            settings.Layout.PrintMessages = SetDefaultStyle();
            settings.Layout.Table = SetDefaultStyle();

            settings.Layout.TableGridColor = defaultTextColor;
            settings.Layout.TableGridSize = 1;//размер шрифта

            settings.Buttons = new List<Button>();

            return settings;
        }
    }
}

