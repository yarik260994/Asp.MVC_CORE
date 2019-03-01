using Infolio.Core.Applications.Containers.WebServer.Middlewares;
using Infolio.Core.Applications.Logger;
using Infolio.SkeletonApp.AppSettings;
using Infolio.SkeletonApp.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Infolio.SkeletonApp.Controllers
{
    [RoutePrefix("storage")]
    public class StorageController : ApiController
    {
        private readonly KioskSettings _settings;
        public StorageController(KioskSettings settings)
        {
            _settings = settings;
        }

        [HttpPost]
        [Route("upload")]
        public async Task<IHttpActionResult> Upload(RequestContext context)
        {
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                    throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

                var provider = new MultipartMemoryStreamProvider();
                await Request.Content.ReadAsMultipartAsync(provider);

                foreach (var file in provider.Contents)
                {
                    var filename  = Path.GetFileName( file.Headers.ContentDisposition.FileName.Trim('\"'));
                    var buffer = await file.ReadAsByteArrayAsync();
                    //Do whatever you want with filename and its binaray data.
                    using (var stream = new FileStream($@"{_settings.Configuration.PathToUpload}\{filename}", FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                }

                return Ok();
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при загрузке файлов");
                throw;
            }
        }

        [Route("getfilelist")]
        [HttpPost]
        public List<Models.FileInfo> GetFileCount(RequestContext context)
        {
            try
            {
                var filePath = FileUtils.GetAllFile($@"{_settings.Configuration.PathToUpload}", _settings.Configuration.ExtensionOfImages);

                return filePath;
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при взятии файлов");
                throw;
            }
        }


        [HttpGet]
        [Route("get-picture")]
        public HttpResponseMessage GetPicture(RequestContext context,string filename)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(filename))
                {
                    var path = _settings.Configuration.PathToUpload;
                    var response = new HttpResponseMessage();
                    response.Content = new StreamContent(File.Open(path + "/" + filename, FileMode.Open));
                    return response;
                }
                else
                {
                    context.Logger.Error().WriteLine("Пустое имя изображения");
                    return null;
                }
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при взятии изображения");
                throw;
            }
}
        //добавлен оддельный метод на случай если устройству для печати понадобятся дополнительные параметры querystring
        [HttpGet]
        [Route("get-document")]
        public HttpResponseMessage GetDocument(RequestContext context, string filename)
        {
            try
            {
                    var path = _settings.Configuration.PathToUpload;
                var response = new HttpResponseMessage();
                response.Content = new StreamContent(File.Open(path + "/" + filename, FileMode.Open));
                return response;
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при взятии документа");
                throw;
            }
        }

        [Route("get-img")]
        [HttpPost]
        public List<Models.FileInfo> GetImg(RequestContext context)
        {
            try
            {
                return FileUtils.GetAllImg($@"{_settings.Configuration.PathToUpload}", _settings.Configuration.ExtensionOfImages); ;
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при взятии списка картинок");
                throw;
            }
        }

        [Route("get-print-file")]
        [HttpPost]
        public List<Models.FileInfo> GetPrintFile(RequestContext context)
        {
            try
            {
                return FileUtils.GetAllPrintFile($@"{_settings.Configuration.PathToUpload}", _settings.Configuration.ExtensionOfImages); ;
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при взятии списка файлов для печати");
                throw;
            }
        }

    }
}
