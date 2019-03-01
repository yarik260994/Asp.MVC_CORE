using Infolio.Core.Applications.Containers.WebServer.Middlewares;
using Infolio.Core.Applications.Logger;
using Infolio.SkeletonApp.AppSettings;
using Infolio.SkeletonApp.Models.Layout;
using System;
using System.IO;
using System.Web.Http;
using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Controllers
{
    [RoutePrefix("layout-kiosk")]
    public class LayoutController : ApiController
    {
        private readonly KioskSettings _settings;
        public LayoutController(KioskSettings settings)
        {
            _settings = settings;
        }

        [HttpPost]
        [Route("save-layout")]
        public void SaveLayoutAsync(LayoutSettings layoutSett, RequestContext context)
        {
            try
            {
                SaveLayoutToXml(layoutSett);
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при сохранении данных");
                throw;
            }

        }

        [HttpPost]
        [Route("set-default-settings")]
        public LayoutSettings SetDefaultSettings(RequestContext context)
        {
            try
            {
                var settings = SettingsHelper.GetDefaultSettings();

                using (var writer = new StreamWriter(_settings.Configuration.XMLFileName, false))
                {
                    (new XmlSerializer(settings.GetType())).Serialize(writer, settings);
                }

                return settings.Layout;
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при сбросе настроек");
                throw;
            }
        }

        private LayoutSettings SaveLayoutToXml(LayoutSettings layout)
        {
            var settings = SettingsHelper.GetSettings(_settings);
            settings.Layout = layout;

            using (var writer = new StreamWriter(_settings.Configuration.XMLFileName, false))
            {
                (new XmlSerializer(settings.GetType())).Serialize(writer, settings);
            }
            return settings.Layout;
        }

        [HttpPost]
        [Route("get-layout")]
        public LayoutSettings GetLayout(RequestContext context)
        {
            try
            {
                return SettingsHelper.GetSettings(_settings).Layout;
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при взятии варианта верстки");
                throw;
            }
        }
    }
}
