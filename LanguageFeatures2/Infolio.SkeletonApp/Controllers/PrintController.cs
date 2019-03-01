using Infolio.Core.Applications.Containers.WebServer.Middlewares;
using Infolio.Core.Applications.Logger;
using Infolio.SkeletonApp.AppSettings;
using Infolio.SkeletonApp.Models;
using Microsoft.Owin;
using System;
using System.Linq;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Web.Http;
using System.Xml;
using UIControls;
using Xerox.EIP.CloudPrint;

namespace Infolio.SkeletonApp.Controllers
{
    [RoutePrefix("print-kiosk")]
    public class PrintController : ApiController
    {
        private readonly KioskSettings _settings;
        private static InitiatePrintJobURLResponseType ipjResponse = new InitiatePrintJobURLResponseType();
        private static DeviceConnection ClientConn = new UIControls.DeviceConnection();
        private static JobManagementServiceHelper JobManagementProxy = new JobManagementServiceHelper();

        public PrintController(KioskSettings settings)
        {
            _settings = settings;
        }


        [HttpPost]
        [Route("print-document")]
        public void PrintDocument(RequestContext context, DocumentPathModel docPath)
        {
            const int MAX_SECONDS = 180;
            try
            {
                string xeroxIp = GetXeroxIp();
                StartPrint(docPath.documentPath, xeroxIp);

                for(int i=0; i<MAX_SECONDS;i++)
                {
                    System.Threading.Thread.Sleep(2000);
                    if (HaveActiveJob(xeroxIp)) { break; }
                }
            }
            catch (Exception ex)
            {
                context.Logger.Error().WithUserData(ex).WriteLine("Ошибка при печати");
                throw;
            }
        }

        private string GetXeroxIp() {
            var MS_OwinContext = Request.Properties["MS_OwinContext"] as OwinContext;
            if (MS_OwinContext == null || MS_OwinContext.Request == null || string.IsNullOrEmpty(MS_OwinContext.Request.RemoteIpAddress))
                throw new Exception("Ошибка при получении IP адреса");

            return MS_OwinContext.Request.RemoteIpAddress;
        }

        private bool ListActiveJobQueue()
        {
            byte[] jobManagementInfoResponse = JobManagementProxy.ListActiveJobQueue();
            string sJobList = System.Text.UTF8Encoding.UTF8.GetString(jobManagementInfoResponse);

            var xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(sJobList);
            return  xmlDoc.GetElementsByTagName("JobId").Cast<XmlNode>().Any(a => ((XmlElement)a).InnerText == ipjResponse.JobId);
        }


        private bool HaveActiveJob(string xeroxIp)
        {
            ClientConn = new UIControls.DeviceConnection();
            ClientConn.Name = "ClientConnection";
            ClientConn.SecureSocketLayer = false;
            ClientConn.Server = xeroxIp;

            System.Net.ServicePointManager.ServerCertificateValidationCallback = SSLCheck;
            JobManagementProxy.Device = ClientConn.Server;
            JobManagementProxy.Secured = ClientConn.SecureSocketLayer;
            //Initialize the object with the above settings
            JobManagementProxy.Connect();

            //Display the URL that we connected to
            ClientConn.ConnectionURL = JobManagementProxy.Url;
            //Populate the UI
            return ListActiveJobQueue();
        }

        private void StartPrint(string url, string xeroxIp)
        {
            ClientConn = new UIControls.DeviceConnection();
            ClientConn.Name = "ClientConnection";
            ClientConn.SecureSocketLayer = false;
            ClientConn.Server = xeroxIp;
            ClientConn.ShowDeviceTrust = true;
            ClientConn.ShowPassword = false;
            ClientConn.ShowServiceURL = true;
            ClientConn.ShowUsePlainText = false;
            ClientConn.ShowUserName = false;
            ClientConn.ShowUseWSSecurity = false;
            ClientConn.TrustAuthentication = true;
            ClientConn.TrustExpired = true;
            ClientConn.TrustName = true;
            ClientConn.UsePlainText = false;
            ClientConn.UseWSSecurity = true;

            ClientConn.UseWSSecurity = true;
            System.Net.ServicePointManager.ServerCertificateValidationCallback = SSLCheck;
            var CloudPrintProxy = new WSPrintServiceHelper();
            CloudPrintProxy.Device = ClientConn.Server;
            CloudPrintProxy.Secured = ClientConn.SecureSocketLayer;
            CloudPrintProxy.Connect();
            ClientConn.ConnectionURL = CloudPrintProxy.Url;
            var InterfaceVersion = CloudPrintProxy.GetInterfaceVersion();
            
            var ipjRequest = new InitiatePrintJobURLRequestType();
            ipjRequest.PrintDocumentURL = url;
            ipjResponse = CloudPrintProxy.InitiatePrintJobURL(ipjRequest);
        }

        public static bool SSLCheck(object sender, System.Security.Cryptography.X509Certificates.X509Certificate certificate, X509Chain chain, System.Net.Security.SslPolicyErrors sslPolicyErrors)
        {
            if ((sslPolicyErrors & SslPolicyErrors.RemoteCertificateChainErrors) == SslPolicyErrors.RemoteCertificateChainErrors)
            {
                return ClientConn.TrustAuthentication;
            }
            else if ((sslPolicyErrors & SslPolicyErrors.RemoteCertificateNameMismatch) == SslPolicyErrors.RemoteCertificateNameMismatch)
            {
                return ClientConn.TrustName;
            }
            else if ((sslPolicyErrors & SslPolicyErrors.RemoteCertificateNotAvailable) == SslPolicyErrors.RemoteCertificateNotAvailable)
            {
                return ClientConn.TrustExpired;
            }
            else if (sslPolicyErrors == SslPolicyErrors.None)
            {
                return true;
            }

            return false;
        }
    }
}
