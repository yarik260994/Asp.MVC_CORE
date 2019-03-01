//
//  Copyright (c) 2012 Xerox Corporation. All Rights Reserved.
//
using Microsoft.Web.Services3.Design;
using Microsoft.Web.Services3.Security.Tokens;
using System;
using System.Net;
using System.Web.Services.Protocols;
using System.Xml;
using Xerox.EIP.JobManagement;

namespace Infolio.SkeletonApp
{
    public class JobManagementServiceHelper
    {
        private JobManagementService ServiceProxy = new JobManagementService();
        private const string FMT_URL = "https://{0}/{1}";
        private const string FMT_NOSSL_URL = "http://{0}/{1}";
        private bool bSecured = false;
        private string sPassword = "";
        private string sUser = "";
        private string sDevice = "";
        private string sWebserviceLocation = "webservices/JobManagement/1";
        private SoapProtocolVersion spvSoapVersion = SoapProtocolVersion.Soap12;
        private bool bRequiresLogin = false;

        public string ApplicationLabel
        {
            get { return "EIP WSE Job Management Client"; }
        }
      
        /// <summary>
        /// Device to connect to
        /// </summary>
        public string Device
        {
            get { return sDevice; }
            set { sDevice = value; }
        }

        /// <summary>
        /// Apply user and password
        /// </summary>
        public bool RequiresLogin
        {
            get { return bRequiresLogin; }
            set { bRequiresLogin = value; }
        }

        /// <summary>
        /// User name to use if required
        /// </summary>
        public string User
        {
            get { return sUser; }
            set { sUser = value; }
        }

        /// <summary>
        /// Password to use if required
        /// </summary>
        public string Password
        {
            get { return sPassword; }
            set { sPassword = value; }
        }

        /// <summary>
        /// Connection security option
        /// </summary>
        public bool Secured
        {
            get { return bSecured; }
            set { bSecured = value; }
        }

        /// <summary>
        /// Soap version used by the client
        /// </summary>
        public SoapProtocolVersion SoapVersion
        {
            get { return spvSoapVersion; }
            set { spvSoapVersion = value; }
        }

        public JobManagementServiceHelper()
        {
            ServiceProxy.RequireMtom = false;
        }

        /// <summary>
        /// Initialize the helper settings and create any needed objects based on the settings provided
        /// </summary>
        public void Connect()
        {
            ServiceProxy.SoapVersion = spvSoapVersion;
            ServiceProxy.Destination = new Microsoft.Web.Services3.Addressing.EndpointReference(BuildUri(sDevice));
            if (bRequiresLogin)
            {
                ServiceProxy.SetClientCredential<UsernameToken>(CreateUserNameToken());
                ServiceProxy.SetPolicy(CreateClientPolicy());
            }

            // The Target framework for this project is set to .NET Framework 4.6, which supports TLSv1.2, TLSv1.1 and TLSv1.0 by default.
            // TLSv1.2 and TLSv1.1 are also supported in .NET Framework 4.5, but not as default protocols.
            // If your project Target framework is set to .NET Framework 4.5, 
            // to support TLSv1.2 or TLSv1.1 connection, uncomment the following line of code.
            // ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
        }

        /// <summary>
        /// Create the security token
        /// </summary>
        /// <returns>Username Token</returns>
        protected Microsoft.Web.Services3.Security.Tokens.UsernameToken CreateUserNameToken()
        {
            Microsoft.Web.Services3.Security.Tokens.UsernameToken nametoken;
            PasswordOption UserNameTokenPasswordOption = PasswordOption.SendHashed;
            nametoken = new Microsoft.Web.Services3.Security.Tokens.UsernameToken(sUser, sPassword, UserNameTokenPasswordOption);
            return nametoken;
        }

        /// <summary>
        /// Create the security policy
        /// </summary>
        /// <returns></returns>
        protected Microsoft.Web.Services3.Design.Policy CreateClientPolicy()
        {
            Microsoft.Web.Services3.Design.Policy ClientPolicy = new Microsoft.Web.Services3.Design.Policy();
            ClientPolicy.Assertions.Add(new UsernameOverTransportAssertion());
            return ClientPolicy;
        }

        /// <summary>
        /// convenience property making the constructed service url available to callers.
        /// </summary>
        public string Url
        {
            get
            {
                return ServiceProxy.Destination.Address.Value.AbsoluteUri;
            }
        }

        /// <summary>
        /// Builds the Uri to connect to based on the settings provided
        /// </summary>
        /// <param name="Destination"></param>
        /// <returns></returns>
        private System.Uri BuildUri(string Destination)
        {
            System.Uri DestinationUri = null;
            if (bSecured)
            {
                DestinationUri = new System.Uri(String.Format(FMT_URL, Destination, sWebserviceLocation));
            }
            else
            {
                DestinationUri = new System.Uri(String.Format(FMT_NOSSL_URL, Destination, sWebserviceLocation));
            }
            return DestinationUri;
        }

        #region Webservice calls

        public GetInterfaceVersionResponseType GetInterfaceVersion()
        {
            try
            {
                return ServiceProxy.GetInterfaceVersion(new GetInterfaceVersionRequestType());
            }
            catch (Exception Error)
            {
                throw HandleExceptions(Error);
            }
        }

        public byte[] ListActiveJobQueue()
        {
            try
            {
                ServiceProxy.RequireMtom = true;
                ListJobQueueRequestType req = new ListJobQueueRequestType();
                ListQueueResponseType resp = new ListQueueResponseType();
                resp = ServiceProxy.ListActiveJobQueue(req);
                ServiceProxy.RequireMtom = false;
                return resp.Bytes;
            }
            catch (Exception Error)
            {
                ServiceProxy.RequireMtom = false;
                throw HandleExceptions(Error);
            }
        }

        public byte[] ListCompletedJobQueue()
        {
            try
            {
                ServiceProxy.RequireMtom = true;
                ListJobQueueRequestType req = new ListJobQueueRequestType();
                ListQueueResponseType resp = new ListQueueResponseType();
                resp = ServiceProxy.ListCompletedJobQueue(req);
                ServiceProxy.RequireMtom = false;
                return resp.Bytes;
            }
            catch (Exception Error)
            {
                ServiceProxy.RequireMtom = false;
                throw HandleExceptions(Error);
            }
        }

        public GetJobDetailsResponseType GetJobDetails(GetJobDetailsRequestType req)
        {
            try
            {
                return ServiceProxy.GetJobDetails(req);
            }
            catch (Exception Error)
            {
                throw HandleExceptions(Error);
            }
        }

        public PauseJobResponseType PauseJob(JobRequestType request)
        {
            try
            {
                return ServiceProxy.PauseJob(request);
            }
            catch (Exception Error)
            {
                throw HandleExceptions(Error);
            }
        }

        public CancelJobResponseType CancelJob(JobRequestType request)
        {
            try
            {
                return ServiceProxy.CancelJob(request);
            }
            catch (Exception Error)
            {
                throw HandleExceptions(Error);
            }
        }

        public ResumeJobResponseType ResumeJob(JobRequestType request)
        {
            try
            {
                return ServiceProxy.ResumeJob(request);
            }
            catch (Exception Error)
            {
                throw HandleExceptions(Error);
            }
        }

        public byte[] ListActiveJobQueueSecure(bool UseAuth, string User, string Password)
        {
            try
            {
                ServiceProxy.RequireMtom = true;
                ListJobQueueSecureRequestType req = new ListJobQueueSecureRequestType();
                if (UseAuth)
                {
                    req.UserAuthCredentials = new UserAuthCredentialsType();
                    if (User.Contains("\\"))
                    {
                        string[] FindDomain = User.Split('\\');
                        req.UserAuthCredentials.Domain = FindDomain[0];
                        req.UserAuthCredentials.Username = FindDomain[1];
                    }
                    else
                    {
                        req.UserAuthCredentials.Username = User;
                    }
                    req.UserAuthCredentials.Password = Password;
                }
                ListQueueResponseType resp = new ListQueueResponseType();
                resp = ServiceProxy.ListActiveJobQueueSecure(req);
                ServiceProxy.RequireMtom = false;
                return resp.Bytes;
            }
            catch (Exception Error)
            {
                ServiceProxy.RequireMtom = false;
                throw HandleExceptions(Error);
            }
        }

        public byte[] ListCompletedJobQueueSecure(bool UseAuth, string User, string Password)
        {
            try
            {
                ServiceProxy.RequireMtom = true;
                ListJobQueueSecureRequestType req = new ListJobQueueSecureRequestType();
                if (UseAuth)
                {
                    req.UserAuthCredentials = new UserAuthCredentialsType();
                    if (User.Contains("\\"))
                    {
                        string[] FindDomain = User.Split('\\');
                        req.UserAuthCredentials.Domain = FindDomain[0];
                        req.UserAuthCredentials.Username = FindDomain[1];
                    }
                    else
                    {
                        req.UserAuthCredentials.Username = User;
                    }
                    req.UserAuthCredentials.Password = Password;
                }
                ListQueueResponseType resp = new ListQueueResponseType();
                resp = ServiceProxy.ListCompletedJobQueueSecure(req);
                ServiceProxy.RequireMtom = false;
                return resp.Bytes;
            }
            catch (Exception Error)
            {
                ServiceProxy.RequireMtom = false;
                throw HandleExceptions(Error);
            }
        }

        public GetJobDetailsSecureResponseType GetJobDetailsSecure(GetJobDetailsSecureRequestType req)
        {
            try
            {
                return ServiceProxy.GetJobDetailsSecure(req);
            }
            catch (Exception Error)
            {
                throw HandleExceptions(Error);
            }
        }

        public PauseJobSecureResponseType PauseJobSecure(JobSecureRequestType request)
        {
            try
            {
                return ServiceProxy.PauseJobSecure(request);
            }
            catch (Exception Error)
            {
                throw HandleExceptions(Error);
            }
        }

        public CancelJobSecureResponseType CancelJobSecure(JobSecureRequestType request)
        {
            try
            {
                return ServiceProxy.CancelJobSecure(request);
            }
            catch (Exception Error)
            {
                throw HandleExceptions(Error);
            }
        }

        public ResumeJobSecureResponseType ResumeJobSecure(JobSecureRequestType request)
        {
            try
            {
                return ServiceProxy.ResumeJobSecure(request);
            }
            catch (Exception Error)
            {
                throw HandleExceptions(Error);
            }
        }       
        #endregion

        /// <summary>
        /// Attempt to determine what type of exception was generated to display appropriate information
        /// to the user.
        /// </summary>
        /// <param name="Generic">Basic exception item</param>
        /// <returns>Specific information for the user or the original exception</returns>
        private Exception HandleExceptions(Exception Generic)
        {
            if (Generic is SoapException)
            {
                return ParseSoapException((SoapException)Generic);
            }
            else if (Generic is FormatException)
            {
                return ParseFormatException((FormatException)Generic);
            }
            else if (Generic is WebException)
            {
                WebException securityError = (WebException)Generic;

                if ((securityError.Status == WebExceptionStatus.ProtocolError) &&
                    (securityError.Response.ContentLength == -1))
                {//Check to see if this is because the request was not set to SSL and the device is expecting only SSL
                    return new WebException(securityError.Message + " Verify device SSL settings.");
                }
            }
            return Generic;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="soapExc"></param>
        /// <returns></returns>
        private Exception ParseFormatException(FormatException soapExc)
        {
            XmlDocument detailDoc = new XmlDocument();
            XmlNode node = detailDoc.CreateNode(XmlNodeType.Element,
                SoapException.DetailElementName.Name,
                SoapException.DetailElementName.Namespace);
            XmlNode Details = detailDoc.CreateNode(XmlNodeType.Element,
                "InvalidArgumentException",
                SoapException.DetailElementName.Namespace);

            node.AppendChild(Details);

            string FormatError = "One or more arguments were incorrectly specified.";
            SoapException SoapExc = new SoapException(FormatError, new XmlQualifiedName(""), "", node);
            return ParseSoapException(SoapExc);
        }

        /// <summary>
        /// Parse the detail section of the input soap exception to identify the
        /// error.  The soap exception's Message slot is usually sufficient
        /// information, but this shows how to parse the error for more details 
        /// if desired.
        /// </summary>
        /// <param name="soapExc">the soap exception to parse</param>
        /// <returns>an Exception whose message indicates the parsed result, or the original soap exception if it could not be parsed.</returns>
        private Exception ParseSoapException(SoapException soapExc)
        {
            if ((soapExc.Detail == null) || (soapExc.Detail.InnerXml == null) || (soapExc.Detail.InnerXml == ""))
            {
                string SubCode = "";
                if (soapExc.SubCode != null)
                {
                    SubCode = soapExc.SubCode.Code.Name;
                }
                string Reason = soapExc.Message;

                return new EipSoapException(Reason, SubCode);
            }

            XmlDocument detailDoc = new XmlDocument();
            try
            {
                detailDoc.LoadXml(soapExc.Detail.InnerXml);
            }
            catch (Exception)
            {
                try
                {
                    detailDoc.LoadXml(soapExc.Detail.OuterXml);
                }
                catch (Exception)
                {
                    return new XmlException("Unable to parse soap exception detail!", soapExc);
                }
            }

            return HandleSoapException(soapExc, detailDoc);
        }

        /// <summary>
        /// Add exceptions here
        /// </summary>
        /// <param name="soapExc">the soap exception to parse</param>
        /// <param name="detailDoc">an XML document containing the details section of the soap fault</param>
        /// <returns>an Exception whose message indicates the parsed result, or the original soap exception if it could not be parsed.</returns>
        private Exception HandleSoapException(SoapException soapExc, XmlDocument detailDoc)
        {
            string SubCode = "";
            if (soapExc.SubCode != null)
            {
                SubCode = soapExc.SubCode.Code.Name;
            }
            string Reason = soapExc.Message;

            switch (detailDoc.DocumentElement.LocalName)
            {
                case "Detail":
                case "detail":
                    if (soapExc.Detail.InnerXml == "")
                    {
                        return new Exception("Invalid \"Detail\" fault element, tag is empty.");
                    }
                    return new EipSoapException(Reason, SubCode, soapExc.Detail.InnerXml);
                case "FailedAuthentication":
                    return new EipSoapException(Reason, SubCode);
                default:
                    return soapExc;
            }
        }
    }
}
