//
//  Copyright (c) 2013 Xerox Corporation. All Rights Reserved.
//
using System;

namespace Infolio.SkeletonApp
{
    /// <summary>
    /// Overloaded Exception to store EIP specific data
    /// </summary>
    public class EipSoapException : Exception
    {
        public string SubCode = "";
        public string Detail = "";

        /// <summary>
        /// Capture the Reason
        /// </summary>
        /// <param name="Reason"></param>
        public EipSoapException(string Reason)
            : base(Reason)
        {
        }

        /// <summary>
        /// Capture the Reason and SubCode
        /// </summary>
        /// <param name="Reason"></param>
        /// <param name="SubCode"></param>
        public EipSoapException(string Reason, string SubCode)
            : base(Reason)
        {
            this.SubCode = SubCode;
        }

        /// <summary>
        /// Capture the Reason, SubCode, and Detail
        /// </summary>
        /// <param name="Reason"></param>
        /// <param name="SubCode"></param>
        /// <param name="Detail"></param>
        public EipSoapException(string Reason, string SubCode, string Detail)
            : base(Reason)
        {
            this.SubCode = SubCode;
            this.Detail = Detail;
        }
    }
}
