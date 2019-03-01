using Infolio.Core.Applications.Containers.WebServer.Middlewares;
using Infolio.Core.Applications.Logger;
using Infolio.SkeletonApp.AppSettings;
using Infolio.SkeletonApp.Models;
using Infolio.SkeletonApp.Models.Buttons;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web.Http;
using System.Xml.Serialization;

namespace Infolio.SkeletonApp.Controllers
{
    [RoutePrefix("settings-kiosk")]
    public class SettingsController : ApiController
    {
        private readonly KioskSettings _settings;
        public SettingsController(KioskSettings settings)
        {
            _settings = settings;
        }


        [HttpPost]
        [Route("get-buttons")]
        public List<Button> GetButtons(RequestContext context)
        {
            try
            {
                return SettingsHelper.GetSettings(_settings).Buttons;
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при взятии настройки кнопок");
                throw;
            }
        }


        [HttpPost]
        [Route("get-settings")]
        public Settings GetSettings(RequestContext context)
        {
            try
            {
                return SettingsHelper.GetSettings(_settings);
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при взятии настроек");
                throw;
            }
        }

        [HttpPost]
        [Route("save-buttons")]
        public void SaveButtons(List<Button> buttons, RequestContext context)
        {
            try
            {
                var settings = SettingsHelper.GetSettings(_settings);

                settings.Buttons = buttons;

                using (var writer = new StreamWriter(_settings.Configuration.XMLFileName, false))
                {
                    (new XmlSerializer(settings.GetType())).Serialize(writer, settings);
                }
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при сохранении данных");
                throw;
            }
        }
    }
}
