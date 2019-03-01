/* 
 * XrxWebservices.js
 * Copyright (C) Xerox Corporation, 2007, 2008, 2009, 2010, 2011, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to Xerox webservices.
 *
 * @revision    10/07/2007
 *              09/21/2012 
 *              10/15/2012  AHB Updated
 *              06/20/2013  3.10    AHB Added Synchronous behavior
 *              07/26/2013  3.11    AHB Added Mtom constants
 *              08/01/2013  3.12    AHB Added xrxParseStringSoap12ErrorResponse
 *              08/30/2013  3.0.13  AHB Added WsXConfig
 *                                  Added Authorization XRXWsSecurity.js
 *                                  Added Mtom
 *              07/20/2014  3.0.14  TC  Updated the XRX_WEBSERVICES_LIBRARY_VERSION to 
 *										3.0.14.
 *              08/17/2015  3.5.01  TC  Updated the XRX_WEBSERVICES_LIBRARY_VERSION to 
 *										3.5.01.
 *              10/29/2015  3.5.02  TC  Added 'xmlns:xop="http://www.w3.org/2004/08/xop/include"' 
 *										to  XRX_SOAPSTART_MTOM.
 *				06/20/2016  4.0.01  TC  Change the XMLHttpRequest object to a local variable in xrxCallAjax().
 *				01/19/2017  4.0.02  TC  Updated the version number.
 *				04/12/2017  4.0.03  TC  Updated the version number for the mustUnderstand="1" change.
 *
 *  When changing the version don't forget to change the version in the global below.
 */
 
/****************************  CONSTANTS  *******************************/

// Overall Webservices Library Version
var XRX_WEBSERVICES_LIBRARY_VERSION = "4.0.03"; 

var XRX_XML_TYPE_BOOLEAN = 'xsi:type="xsd:boolean"';

var XRX_XML_TYPE_NONE = '';

var XRX_SOAP11_SOAPSTART = '<?xml version="1.0" encoding="utf-8"?>'
    + '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
    + 'xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" '
    + 'xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" '
    + 'xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
    + '<soap:Body>';

var XRX_SOAPSTART = '<?xml version="1.0" encoding="utf-8"?>' +
    '<soap:Envelope' +
    ' xmlns:soap="http://www.w3.org/2003/05/soap-envelope"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    ' xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing"' +
    ' xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"' +
    ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
    '<env:Header xmlns:env="http://www.w3.org/2003/05/soap-envelope">' + 
    '</env:Header>' +
    '<soap:Body>';

var XRX_SOAPEND = '</soap:Body></soap:Envelope>';
    
var XRX_SOAPSTART_MTOM = '<soap:Envelope' + 
	' xmlns:xop="http://www.w3.org/2004/08/xop/include"' +
    ' xmlns:soap="http://www.w3.org/2003/05/soap-envelope"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    ' xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing"' +
    ' xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"' +
    ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
    '<env:Header xmlns:env="http://www.w3.org/2003/05/soap-envelope">' + 
    '</env:Header>' +
    '<soap:Body>';

var XRX_MIME_BOUNDARY = '----MIMEBoundary635101843208985196\r\n';

var XRX_MIME_BOUNDARY_END = '\r\n----MIMEBoundary635101843208985196\r\n';

var XRX_MIME_HEADER = 'content-id: <0.635101843208985196@example.org>\r\n'
        + 'content-type: application/xop+xml; charset=utf-8; type="application/soap+xml; charset=utf-8"\r\n'
        + 'content-transfer-encoding: binary\r\n\r\n';



/****************************  FUNCTIONS  *****************************/

/**
* This function calls the low level Ajax function to send the request.
*
* @param	url					destination address
* @param	envelope			xml string for body of message
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param	headers				array of optional headers in format {name:value} or null (optional)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @param    async               asynchronous = true, synchronous = false
* @return   If Async return will be a blank string - If Synch return will either be the response or an error string starting with "Failure"
*/
function xrxCallWebservice( url, envelope, callback_success, callback_failure, timeout, headers, username, password, async )
{
	return xrxCallAjax( url, envelope, "POST", ((headers != undefined)?headers:null), callback_success, callback_failure, timeout, username, password, async );
}

/**
* This function is the low level Ajax function to send the request.
*
* @param	url					destination address
* @param	envelope			xml string for body of message
* @param	type				request type (GET or POST)
* @param	headers				array of arrays containing optional headers to set on the request or null
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    username            optional username for ajax request
* @param    password            optional password for ajax request
* @param    async               asynchronous = true, synchronous = false
* @return   If Async return will be a blank string - If Synch return will either be the response or an error string starting with "Failure"
*/
function xrxCallAjax( url, envelope, type, headers, callback_success, callback_failure, timeout, username, password, async )
{
	// Ajax Request Object
	var xrxXmlhttp = new XMLHttpRequest();
	
	// Ajax Request Xml
	var xrxEnvelope = null;
	
	// Storage for Success Callback Function Address
	var xrxAjaxSuccessCallback = null;
	
	// Storage for Failure Callback Function Address
	var xrxAjaxFailureCallback = null;

	if(async == undefined)
	    async = true;

	xrxEnvelope = envelope;
	xrxAjaxSuccessCallback = ((callback_success == undefined)?null:callback_success);
	xrxAjaxFailureCallback = ((callback_failure == undefined)?null:callback_failure);

	try
	{
	    if((username == undefined) || (password == undefined) || (username == null) || (password == null))
	        xrxXmlhttp.open( type, url, async );
	    else
	        xrxXmlhttp.open( type, url, async, username, password );
	}
	catch(exc)
	{
        var errString = "";
        var uaString = navigator.userAgent;
        if(!async && (uaString != undefined) && (uaString != null) && ((uaString = uaString.toLowerCase()).indexOf( "galio" ) >= 0))
            errString = "FAILURE: Synchronous Ajax Does Not Work in FirstGenBrowser!";
        else
            errString = "FAILURE: Failure to Open Ajax Object!";
	    xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, 0, errString );
	    return errString;
	}
	if(headers != null)
	{
		for(var i = 0;i < headers.length;++i)
		{
			xrxXmlhttp.setRequestHeader( headers[i][0], headers[i][1] );
		}
	} else
	{
	    xrxXmlhttp.setRequestHeader("SOAPAction", '""');
	    xrxXmlhttp.setRequestHeader( "Content-Type", "text/xml" );
	}
	if(async)
	{
		// response function
	    xrxXmlhttp.onreadystatechange = function() 
	    {
		    if((xrxXmlhttp != null) && (xrxXmlhttp.readyState == 4))
		    {
			    try
			    {
					xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, xrxXmlhttp.status, xrxXmlhttp.responseText );
			    }
			    catch( e )
			    {
				    xrxAjaxFailureCallback( xrxEnvelope, "<comm_error>" + e.toString() + "</comm_error>", 0 );
			    }
		    }
	    }
	    xrxXmlhttp.send( xrxEnvelope );
	    if((timeout != undefined) && (timeout != null) && (timeout > 0) && (xrxAjaxFailureCallback != null)) {
			var msg = "<comm_error>COMM TIMEOUT(" + timeout + " sec)</comm_error>";
			setTimeout( "xrxAjaxFailureCallback( xrxEnvelope, msg, -99 )", timeout * 1000 );
		}
	} else
	{
	    try
	    {
	        xrxXmlhttp.send( xrxEnvelope );
	        xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, xrxXmlhttp.status, xrxXmlhttp.responseText );
	    }
	    catch( e )
	    {
	        return "FAILURE: comm_error " + (((e != null) && (e.message != null))? e.message : "Exception" );
	    }
        return ((xrxXmlhttp.status == 200) ? "" : "FAILURE: " + xrxXmlhttp.status + " - ") + xrxXmlhttp.responseText;
    }
    return "";
}



/**
* This function calls the callbacks if they were given a value.
*
* @param    status      status code
* @param    response    websertvice response
*/
function xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, status, response )
{
    if((response == undefined) || (response == null))
        response = "";
    if(status != 200) 
    {
	    if(xrxAjaxFailureCallback != null) 
		    xrxAjaxFailureCallback( xrxEnvelope, response, status );
    } else 
    {
	    if(xrxAjaxSuccessCallback != null) 
		    xrxAjaxSuccessCallback( xrxEnvelope, response );
    }
}

// Helper functions

/**
* This function pulls the Mtom data from the response.
*
* @param	response	webservice response in string form
* @return	string		job data
*/
function findMtomData( response, idString, idString2 )
{
    var index = response.indexOf( idString );
    if((index > 0) && ((index = response.indexOf( idString, index + 1 )) > 0))
        return response.substring( index, response.lastIndexOf( idString2 ) + 1 );
    return "FAILURE: Cannot Locate Mtom Data!";
}

/**
* This function parses the interface version.
*
* @param	response	webservice response in string form
* @return	array	[MajorVersion],[MinorVersion],[Revision]
*/
function xrxParseInterfaceVersion( response )
{
	var result = new Array();
	var dom = xrxStringToDom( response );
	var data = xrxGetTheElement( dom, "InterfaceVersion" );
	var node = xrxFindElement( data, ["MajorVersion"] );
	if(node != null) result['MajorVersion'] = xrxGetValue( node );
	var node = xrxFindElement( data, ["MinorVersion"] );
	if(node != null) result['MinorVersion'] = xrxGetValue( node );
	var node = xrxFindElement( data, ["Revision"] );
	if(node != null) result['Revision'] = xrxGetValue( node );
	return result;
}

/**
* This function returns the parsed interface values.
*
* @param	response	    webservice response in string form
* @return	string		    Major.Minor.Revision
*/
function xrxParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

/**
* This function parses the error response.
*
* @param	response	webservice response in string form
* @return	fault portion of response in DOM form or null
*/
function xrxParseErrorResponse( response )
{
	var data = null;
	if((response != null) && (response != ""))
		data = xrxFindElement( xrxStringToDom( response ), ["Fault"] );
	return data;
}

/**
* This function parses the error response.
*
* @param	response	webservice response in string form
* @return	fault portion of response in DOM form or null
*/
function xrxParseStringSoap12ErrorResponse( response )
{
    var subcode = "";
    var reason = "";
    if((typeof(response) != "undefined") && (response != null))
    {
	    var index = response.indexOf( "Subcode" );
	    if(index > 0)
	        if((index = response.indexOf( "Value", index )) > 0)
	            if((index = response.indexOf( ">", index )) > 0)
	                subcode = response.substring( index + 1, response.indexOf( "<", index ) );
	    if((index = response.indexOf( "Reason" )) > 0)
	        if((index = response.indexOf( "Text" )) > 0)
	            if((index = response.indexOf( ">", index )) > 0)
	                reason = response.substring( index + 1, response.indexOf( "<", index ) );
	}
	if((subcode != "") || (reason != ""))
	    return subcode + ":" + reason;
	else
	    return "General Failure:" + response;
}

function xrxParsePayload( text, name )
{
    var result = "";
    var index;
    if((index = text.indexOf( ":" + name + ">" )) < 0)
        if((index = text.indexOf( "<" + name + ">" )) < 0)
            if((index = text.indexOf( ":" + name + " " )) < 0)
                index = text.indexOf( "<" + name + " " );
    if(index >= 0)
    {
        var fullname = xrxGetWholeName( text, name, index );
        index = text.indexOf( ">", index ) + 1;
        var index2 = text.indexOf( "/" + fullname, index );
        if(index2 > 0)
            result = text.substring( index, index2 - 1 );
    }
    return result;
}

function xrxGetWholeName( text, name, index )
{
    var result;
    var start = xrxBackSearch( text, '<', index );
    if((start >= 0) && (start < index))
        result = text.substring( start + 1, start + ((index - start) + name.length + 1) );
    else
        result = "";
    return result;
}

function xrxBackSearch( text, theChar, index )
{
    var result;
    for(result = index;(text.charAt( result ) != theChar) && (result >= 0);--result);
    return result;
}

/*************************  Support Files  *****************************/

/**
* This function returns the Library version.
*
* @return	string	version string
*/
function xrxGetWebservicesLibraryVersion()
{
    return XRX_WEBSERVICES_LIBRARY_VERSION;
}

/**
* This function creates an xml tag in a string.
*
* @param	label		tag
* @param	type		attribute
* @param	value		text value
*/
function xrxCreateTag( label, type, value )
{
    if(type == "")
    {
        return( "<" + label + ">" + value + "</" + label + ">" );
    }
    else
    {
        return( "<" + label + " " + type + ">" + value + "</" + label + ">" );
    }
}

/*************************  ASync Framework  *****************************/

// Singleton object
var xrxASyncFramework = new XrxASyncFramework();

/**
* This constructor creates an object that handles some of the complexities
* of async programming. It works on the idea of a 'framework'. This framework
* is an array that holds a series of steps each with its function to call if
* the previous level was successful and one to call if not. Storage of 
* intermediate values is accomplished by the store and recall functions.
*
* A typical setup would be:
*	framework = new Array();
*	framework[0] = ["loadTemplates"];
*	framework[1] = ["finishLoadTemplates","commFailure"];
*	framework[2] = ["finishInitiateScan","commFailure"];
*	xrxASyncFramework.load( framework );
*	xrxASyncFramework.start();
*
* The function loadTemplates would be called first. Somewhere in that function a 
* Ajax call will be made. When it returns the AsyncFramework will execute the 
* first function call of the next layer if the Ajax call was successful and the 
* second if a failure. This will continue until the framework is no longer called 
* or all layers are executed.
* 
* A traditional function with a webservice would be as you normally create it but with the exception of the success callback and the failure callback are fixed
* values of xrxASyncSuccessCallback and xrxASyncFailureCallback, as below:
*
* function getDefaultApplication()
* {
*    xrxWsXConfigGetPathwayDefaultApplication( "http://127.0.0.1", "Services", adminUserString, adminPasswordString, xrxASyncSuccessCallback, xrxASyncFailureCallback, 30, true );
* }
*
* Your callback functions remain the same with two additions, one, You get the parameters by calling for them and you finish with a mandatory call:
*
* function gda_success( request, response )
* {
*     response = xrxASyncFramework.recall( "p1" ); // calls for parameter 1 (0 based parameter list) which is the response
*     var app = new AppInfo( xrxWsXConfigParseGetPathwayDefaultApplication( response ) ).name;
*     if(app != null)
*     {
*         document.getElementById( 'defaultApplication' ).innerHTML = app;
*         for(var i = 0;i < applicationLen;++i)
*             if(applicationList[i].name == app)
*             {
*                 selectedApplicationIndex = i;
*                 selectApplication();
*                 break;
*             }
*     }
*     xrxASyncCallback( null, 0 ); // returns control to the framework
* }
*
* So in the following framework the first call is made and if failure goes to your error handler gen_failure() and your handler can decide if the framework continues.
* If successful it drops down to the next which is your success handler:
*
* framework = new Array();
* framework.push( ["getDefaultApplication", "gen_failure"] );
* framework.push( ["gda_success"] );
* xrxASyncFramework.load( framework );
* xrxASyncFramework.start();
*
* You can also add any normal non-webservice functions to the list and when you call xrxASyncCallback the second parameter can be 0 for success or 1 for failure.
*
*/
function XrxASyncFramework()
{
	this.framework = null;
	this.queue = new Array();
	this.step = 0;
	this.cancel = false;
	this.parameters = null;
	
	this.load = xrxASyncLoadFramework;
	this.start = xrxASyncStartFramework;
	this.stop = xrxASyncStopFramework;
	this.restart = xrxASyncStartFramework;
	this.store = xrxASyncStoreParameter;
	this.recall = xrxASyncGetParameter;
	this.clear = xrxASyncClear;
	this.success = xrxASyncSuccessCallback;
	this.failure = xrxASyncFailureCallback;
}

/**
* This function loads a new framework and returns internal values
* to default.
*
* @param	framework	framework to load
*/
function xrxASyncLoadFramework( framework )
{
	this.framework = framework;
	this.step = 0;
	this.cancel = false;
	this.parameters = new Array();
}

/**
* This function clears the data from the framework.
*/
function xrxASyncClear()
{
	this.cancel = true;
	this.parameters = null;
	this.framework = new Array();
	this.step = 0;
}

/**
* This function starts the framework executing.
*/
function xrxASyncStartFramework()
{
	eval( this.framework[this.step++][0] + "()" );
}

/**
* This function stops the framework.
*/
function xrxASyncStopFramework()
{
	this.cancel = true;
}

/**
* This function stores a given value.
*
* @param	name	name of stored value
* @param	value	value to store
*/
function xrxASyncStoreParameter( name, value )
{
	this.parameters[name] = value;
}

/**
* This function retreives a previously stored value.
*
* @param	name	name of stored value
*/
function xrxASyncGetParameter( name )
{
	return this.parameters[name];
}

/*************************  External Functions  *****************************/

/**
* This function is called upon successful conclusion of a webservice call.
*/
function xrxASyncSuccessCallback()
{
	xrxASyncCallback( arguments, 0 );
}

/**
* This function is called upon a failed conclusion of a webservice call.
*/
function xrxASyncFailureCallback()
{
	xrxASyncCallback( arguments, 1 );
}

/**
* This function is handles the callback. The arguments are stored 
* under p1 ... pn.
*
* @param	params	arguments sent from Ajax handler
* @param	code	0=successful, 1=failure
*/
function xrxASyncCallback( params, code )
{
	if(xrxASyncFramework.parameters != null)
	    if(params != null)
		    for(var i = 0;i < params.length;++i)
			    xrxASyncFramework.store( ("p" + i), params[i] );
	if(!xrxASyncFramework.cancel)
		if(xrxASyncFramework.framework[xrxASyncFramework.step] != undefined)
			if(xrxASyncFramework.framework[xrxASyncFramework.step] != null)
				eval( xrxASyncFramework.framework[xrxASyncFramework.step++][code] + "()" );
}

/*************************  End of File  *****************************/

define("XRXWebservices", ["XRXXmlHandler","XRXSession","XRXTemplate","XRXScanV2","XRXJobManagement","XRXDeviceConfig","XRXUtilities","XRXPrint","XRXWsSnmp"], function(){});


/* 
* XrxXmlHandler.js
* Copyright (C) Xerox Corporation, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013.  All rights reserved.
*
* This file contains functions to handle XML as the Galio Ant browser 
* does not have XML support at this time.
*
*  Revisions
*               07/11/2011  BRP Updated to allow faster XML parsing
*               10/15/2012  AHB Updated
*               08/01/2013  AHB Updated formatting
*               08/30/2013  AHB Commented out error alert
*/

/****************************  Constants  *****************************/

/****************************  XML Parser  *****************************/

/**
* This is the top level call to get a DOM structure from a text XML message.
*
* @param thedoc		string XML
* @return Dom structure representing text given
*/
function xrxStringToDom( thedoc )
{
	return( new DOMParser().parseFromString( thedoc, "text/xml" ) );
}

/**************  XML Conversion Dom to String  ******************/

/**
* This function writes a XML DOM structure to a well formed 
* XML text representation.
*
* @param document	xml document
*/
function xrxDomToString( doc )
{
	return new XMLSerializer().serializeToString( doc );
}

/**********************  Helper Functions  *******************************/

/**
* This function makes the DOM call to get a new XML document.
*/
function xrx_getXmlDocument()
{
	return xrx_getXmlDocumentNS( "", "root" );
}

/**
* This function makes the DOM call to get a new XML document.
*/
function xrx_getXmlDocumentNS( ns, name )
{
	return document.implementation.createDocument( ns, name, null );
}

/**
* This function gets the element name of the node and strips off any 
* namespace prefix.
*
* @param node	node to get the name of
* @return unqualified name of node
*/
function xrxGetElementName( node )
{
	var name = "";
	try
	{
		var names = (node.nodeName).split( ":" );
		name = names[names.length - 1];
	}
	catch( e )
	{}
	return name;
}

/**
* This function searches the given DOM structure for nodes
* with the given name.
*
* @param xmldoc		XML document
* @param name		name of node to search for
* @return	array of nodes with given name or null
*/
function xrxFindElements( xmldoc, name )
{
	var result = null;
	var pos = 0;
	if(name == xrxGetElementName( xmldoc ))
	{
		result = new Array();
		result[pos++] = xmldoc;
	}
	var number = xmldoc.childNodes.length;
	for(var i = 0;i < number;++i)
	{
		if(name == xrxGetElementName( xmldoc.childNodes[i] ))
		{
			if(result == null) 
			    result = new Array();
			result[pos++] = xmldoc.childNodes[i];
		} else
		{
			if(xmldoc.childNodes[i].nodeType != 3)
			{
				var children = xrxFindElements( xmldoc.childNodes[i], name );
				if(children != null)
				{
					if(result == null) 
					    result = new Array();
					for(var x = 0;x < children.length;++x) 
					    result[pos++] = children[x];
                }
            }
        }
    }
    return result;
}

/***************************************************************************
* This function searches the given DOM structure for first node
* with the given name.
*
* @param xmldoc		XML document
* @param name		name of node to search for
* @return	array[0] of node with given name or null
***************************************************************************/
function xrxFindFirstElement( xmldoc, name ) 
{
    var result = null;
    var pos = 0;
    if (name == xrxGetElementName(xmldoc)) 
    {
        result = new Array();
        result[pos++] = xmldoc;
    }
    if (result == null) 
    {
        var number = xmldoc.childNodes.length;
        for (var i = 0; i < number; ++i) 
        {
            if (name == xrxGetElementName(xmldoc.childNodes[i])) 
            {
                if (result == null) 
                {
                    result = new Array();
                    result[pos++] = xmldoc.childNodes[i];
                    break;
                }
            } else 
            {
                if (xmldoc.childNodes[i].nodeType != 3) 
                {
                    var children = xrxFindFirstElement(xmldoc.childNodes[i], name);
                    if (children != null) 
                    {
                        if (result == null) 
                        {
                            result = new Array();
                            result[pos++] = children[0];
                        }
                    }
				}
			} 	
		}
	}
	return result;
}

/**
* This function searches the given DOM structure for the node 
* with the given name. This is done by searching given structure 
* for nodes with the given name and returning the first one. This 
* assumes the section of DOM structure given will only have one 
* node by that name.
*
* @param root		DOM structure
* @param name		name of node to search for
* @return	first node found with given name or null
*/
function xrxGetTheElement( root, name )
{
	var list = xrxFindElements( root, name );
    return (((list != null) && (list.length > 0)) ? list[0] : null);
}

/***************************************************************************
* This function searches the given DOM structure for the first node 
* with the given name. This is done by searching given structure 
* and returning the first one. 
*
* @param root		DOM structure
* @param name		name of node to search for
* @return	first node found with given name or null
***************************************************************************/
function xrxGetTheFirstElement( root, name ) 
{
    var list = xrxFindFirstElement(root, name);
	return (((list != null) && (list.length > 0))?list[0]:null);
}

/**
* This function searches the given DOM structure for the node 
* with the given name. This is done by searching given structure 
* for nodes with the given name and returning the first one. This 
* assumes the section of DOM structure given will only have one 
* node by that name.
*
* @param    root		    DOM structure
* @param    elements		array forming path names of node to search for
* @return	first node found with given name or null
*/
function xrxFindElement( root, elements )
{
	var list;
	var node = root;
	for(var i = 0;((node != null) && (i < elements.length));++i)
	{
		list = xrxFindElements( node, elements[i] );
        node = ((list != null) ? list[0] : null);
	}
	return node;
}

/**
* This function searches the given DOM structure for the node 
* with the given name and returns its value.
*
* @param root		DOM structure
* @param name		name of node to search for
* @return	value of first node found with given name or empty 
*			string or null if node not found
*/
function xrxGetElementValue( root, name )
{
	return xrxGetValue( xrxGetTheElement( root, name ) );
}

/***************************************************************************
* This function searches the given DOM structure for the first node 
* with the given name and returns its value.
*
* @param root		DOM structure
* @param name		name of node to search for
* @return	value of first node found with given name or empty 
*			string or null if node not found
***************************************************************************/
function xrxGetFirstElementValue( root, name ) 
{
    return xrxGetValue(xrxGetTheFirstElement( root, name ));
}

/**
* This function gets the value of the given element from a text string child
* if one exists.
*
* @param	el		given element
* @return	string	value of text string child or "" if tag there but empty 
*					or null if tag is not there
*/
function xrxGetValue( el )
{
	if(el != null)
		if(el.hasChildNodes())
		{
			var node = el.firstChild;
			while(node != null)
				if(node.nodeType == 3)
					return node.nodeValue;
				else
					node = node.nextSibling;
			return "";
		} else
		{
			return "";
		}
	else
		return null;
}

/**
* This function builds a node in a Xml Structure recursively using the 
* arguments given.
*
* @param	xmlDoc	xml document being built
* @param	params	array structure defining structure (see buildRequest()
*/
function xrxCreateNode( xmlDoc, params )
{
	return xrxCreateNodeNS( xmlDoc, xrxns, params );
}

/**
* This function builds a node in a Xml Structure recursively using the 
* arguments given.
*
* @param	xmlDoc	xml document being built
* @params	ns	namespace
* @param	params	array structure defining structure (see buildRequest()
*/
function xrxCreateNodeNS( xmlDoc, ns, params )
{
	var names = params[0].split( ":" );
	var node = xmlDoc.createElementNS( ns, names[names.length - 1] );
	if(names.length == 2) 
	    node.prefix = names[0];
	if(params.length > 1)
	{
		var child;
		for(var i = 1;i < params.length;++i)
		{
			if(typeof( params[i] ) != "string")
			{
				child = xrxCreateNodeNS( xmlDoc, ns, params[i] );
			} else
			{
				if(params[i] == "attribute")
				{
					node.setAttribute( params[i+1], params[i+2] );
					i += 2;
				} else
				{
					child = xmlDoc.createTextNode( params[i] );
				}
			}
			node.appendChild( child );
		}
	}
	return node;
}
 
 /**
 * This function builds a node using the current namespace value.
 *
 * @param xmlDoc	xml document being built
 * @param name		name of node to create
 * @return	created node
 */
 function xrxCreateSingleNode( xmlDoc, name )
 {
	return xmlDoc.createElementNS( xrxns, name );
 }
 
 /**
 * This function finds all elements of a given class.
 *
 * @param className	name of desired class
 * @return	array of nodes with given class
 */
function xrxGetElementsByClassName( className )
{
    var found = new Array();
    var tags = document.getElementsByTagName( "*" );
    var names;
    for(var i = 0;i < tags.length;i++)
    {
        names = tags[i].className.split(" ");
        for(var x = 0;x < names.length;x++)
            if(names[x] == className) 
                found.push( tags[i] );
    }
    return found;
}

/***************************  Support Functions  ****************************/

/**
* This function extends the String class to include a function to 
* trim whitespace from both ends.
*/
function xrxWSTrim( str )
{
    return xrxWSLtrim( xrxWSRtrim( str ) );
}

/**
* This function extends the String class to include a function to 
* trim whitespace from the left end.
*/
function xrxWSLtrim( str )
{
	var i;
	for(i = 0;i < str.length;++i) 
	    if(str.charAt(i) != ' ') 
	        break;
	if(i > 0) 
	    return str.substring( i, str.length );
    return str;
}

/**
* This function extends the String class to include a function to 
* trim whitespace from the right end.
*/
function xrxWSRtrim( str )
{
    var i;
	for(i = (str.length - 1);i >= 0;--i) 
	    if(str.charAt(i) != ' ') 
	        break;
	if(i < (str.length - 1)) 
	    return str.substring( 0, i );
    return str;
}

/*
* Function to replace characters in a string. Replacement is global. Necessary as current 
* browser has problems with String.replace().
*
* @param text	string to modify
* @param str	string to search for
* @param rstr	replacement string
* @return modified string
*/
function xrxReplaceChars( text, str, rstr )
{
	var result = new Array();
    try
    {
	    var index = text.indexOf( str );
	    var l = str.length;
	    var start = 0;
	    var cell = 0;
	    while(index >= 0)
	    {
		    result[cell++] = text.substring( start, index );
		    result[cell++] = rstr;
		    start = index + l;
		    index = text.indexOf( str, start );
	    }
	}
	catch( e )
	{
	    //alert(e);
	}
    result[cell] = text.substring( start );
	return( result.join( "" ) );
}

/*
* Function to unescape the escaped characters in a xml payload.
*
* @param text	string to modify
*/
function xrxUnescape( text )
{
	//text = unescape( text );
	text = xrxReplaceChars( text, "&lt;", "<" );
	text = xrxReplaceChars( text, "&gt;", ">" );
	//text = xrxReplaceChars( text, "&#xA;", "\\n" );
	text = xrxReplaceChars( text, "&quot;", "\"" );
	text = xrxReplaceChars( text, "&amp;", "&" );
	return text;
}


/**************************  End of File  *******************************************/

define("XRXXmlHandler", [],function(){});

/* 
 * XrxSession.js
 * Copyright (C) Xerox Corporation, 2007, 2008, 2009, 2010, 2011, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Session Api webservices.
 *
 * @revision    04/26/2012  AHB Added xrxSessionParseGetInterfaceVersion
 *              04/2012 TC  Added SetSession functionality
 *              10/15/2012  AHB Updated
 *              08/01/2013  AHB Added synchronous behavior and updated constants
 *				06/11/2015  TC  Use XRX_SOAP11_SOAPSTART instead of XRX_SOAPSTART.
 *				09/01/2016  TC  Use XRX_SESSION_SOAPSTART instead of XRX_SOAP11_SOAPSTART.
 */

/****************************  CONSTANTS  *******************************/

var XRX_SESSION_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/office/cuisession/1"';

var XRX_SESSION_PATH = '/webservices/office/cuisession/1';

var XRX_SESSION_SOAPSTART = '<?xml version="1.0" encoding="utf-8"?>'
	+ '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
	+ 'xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
	+ '<soap:Body>';

/****************************  FUNCTIONS  *******************************/


//  Session Interface Version


/**
* This function gets the Session interface version and returns the parsed values.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxSessionGetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SESSION_PATH;
    var sendReq = xrxSessionGetInterfaceVersionRequest();
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the Session interface version request.
*
* @return	string	xml request
*/
function xrxSessionGetInterfaceVersionRequest()
{
	return	XRX_SESSION_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_SESSION_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxSessionParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","Revision"] ) );
}


//  Exit Application


/**
* This function initiates an exit from EIP. There is no success callback
* because EIP will exit upon success of the webservice call.
*
* @param	url					destination address
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxSessionExitApplication( url, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SESSION_PATH;
	var sendReq = xrxSessionExitApplicationRequest();
	return xrxCallWebservice( sendUrl, sendReq, null, callback_failure, timeout, null, null, null, async );
}    

/**
* This function builds the Exit Application request.
*
* @return	string	xml request
*/
function xrxSessionExitApplicationRequest()
{
	return	XRX_SESSION_SOAPSTART 
		    + xrxCreateTag( 'ExitApplicationRequest', XRX_SESSION_NAMESPACE, '' ) 
		    + XRX_SOAPEND;
}


//  GetSessionInfo


/**
* This function retrieves the SessionInfo data.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxSessionGetSessionInfo( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SESSION_PATH;
	var sendReq = xrxSessionGetSessionInfoRequest();
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
} 

/**
* This function This function builds the request.
*
* @return	string	xml request
*/
function xrxSessionGetSessionInfoRequest()
{
	return	XRX_SESSION_SOAPSTART 
		    + xrxCreateTag( 'GetSessionInformationRequest', XRX_SESSION_NAMESPACE, '' ) 
		    + XRX_SOAPEND;
}

/**
* This function returns the parsed payload.
*
* @param	response	webservice response in DOM form
* @return	string		xml payload in string form
*/
function xrxSessionParseSessionPayload( response )
{
	return xrxGetElementValue( response, "Information" );
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxSessionParseGetSessionInfo( response )
{
	var data = xrxSessionParseSessionPayload( xrxStringToDom( response ) );
	if(data != null) 
	    data = xrxStringToDom( xrxUnescape( data ) );
	return data;
}


//  SetSessionInfo


/**
* This function sets the SessionInfo data. 
*
* @param	url					destination address
* @param    payload             xml payload containing the session data
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0 = no timeout)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxSessionSetSessionInfo( url, payload, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SESSION_PATH;
	var sendReq = xrxSessionSetSessionInfoRequest( payload );
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the request.
*
* @param    session_info   payload to include
* @return	string	xml request
*/
function xrxSessionSetSessionInfoRequest( session_info )
{
	return XRX_SESSION_SOAPSTART +
		    xrxCreateTag( 'SetSessionParametersRequest', XRX_SESSION_NAMESPACE,
			xrxCreateTag( 'SessionInfoSchema_SetSessionParametersPayload', XRX_SESSION_NAMESPACE, session_info )) 
			+ XRX_SOAPEND;
}

/*************************  End of File  *****************************/


define("XRXSession", [],function(){});


/* 
 * XrxTemplate.js
 * Copyright (C) Xerox Corporation, 2012.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Template Api webservices.
 *
 * @revision    04/26/2012 added GetInterfaceVersion and ReplaceTemplate
 *              10/15/2012 AHB Updated
 */

/****************************  CONSTANTS  *******************************/

var XRX_TEMPLATE_SOAPSTART = 
		'<?xml version=\"1.0\" encoding=\"utf-8\"?>'
		+ '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" '
		+ 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
		+ 'xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body>';

var XRX_TEMPLATE_SOAPEND = '</soap:Body></soap:Envelope>';

var XRX_TEMPLATE_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/office/template_management/1/"';

var XRX_TEMPLATE_PATH = '/webservices/office/template_management/1';

/****************************  FUNCTIONS  *******************************/

//  Template Interface Version

/**
* This function gets the Template interface version.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplateGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_TEMPLATE_PATH;
    var sendReq = xrxTemplateGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Template interface version request.
*
* @return	string	xml request
*/
function xrxTemplateGetInterfaceVersionRequest()
{
	return	XRX_TEMPLATE_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_TEMPLATE_NAMESPACE, '' ) 
			+ XRX_TEMPLATE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxTemplateParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","Revision"] ) );
}

//  Get Template List

/**
* This function gets the Template List from the device.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplateGetTemplateList( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateGetTemplateListRequest();
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Get Template List request.
*
* @return	string	xml request
*/
function xrxTemplateGetTemplateListRequest()
{
	return	XRX_TEMPLATE_SOAPSTART
			+ xrxCreateTag( 'ListTemplatesRequest', XRX_TEMPLATE_NAMESPACE, '' ) 
			+ XRX_TEMPLATE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	array		associative array of the form
*						name = checksum
*/
function xrxTemplateParseGetTemplateList( response )
{
	var result = new Array();
	try
	{
	    var data = xrxGetTheElement( xrxStringToDom( response ), "TemplateEntries" );
	    var entries = xrxFindElements( data, "TemplateEntry" );
	    var name, checksum;
	    if(entries != null)
		    for(var i = 0;i < entries.length;++i)
			    if(((name = xrxGetElementValue( entries[i], "TemplateName" )) != null) &&
				    ((checksum = xrxGetElementValue( entries[i], "TemplateChecksum" )) != null))
			    result[name] = checksum;
    }
    catch( e )
    {
    }
	return result;
}

//  Get Template

/**
* This function gets the template from the device.
*
* @param	url					destination address
* @param	template			name of template
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplateGetTemplate( url, template, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateGetTemplateRequest( template );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Get Template request.
*
* @param	template	template name
* @return	string	xml request
*/
function xrxTemplateGetTemplateRequest( template )
{
	return	XRX_TEMPLATE_SOAPSTART
			    + xrxCreateTag( 'GetTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, template ) ) 
			    + XRX_TEMPLATE_SOAPEND;
}
/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		template content or null
*/
function xrxTemplateParseGetTemplate( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ["GetTemplateResponse","TemplateContent"] );
	return xrxGetValue( data );
}

//  Put Template

/**
* This function puts the provided template on the device.
*
* @param	url					destination address
* @param	templateName		template name
* @param	template			template content data
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplatePutTemplate( url, templateName, template, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplatePutTemplateRequest( templateName, template );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the Put Template request.
*
* @param	templateName	template name
* @param	template		template content data
* @return	string	xml request
*/
function xrxTemplatePutTemplateRequest( templateName, template )
{
	return	XRX_TEMPLATE_SOAPSTART
			    + xrxCreateTag( 'PutTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, templateName )
			    + xrxCreateTag( 'templateContent', XRX_XML_TYPE_NONE, template ) ) 
			    + XRX_TEMPLATE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		checksum or null
*/
function xrxTemplateParsePutTemplate( response )
{
	var result = new Array();
	var data = xrxFindElement( xrxStringToDom( response ), ["ChecksumResponse","TemplateChecksum"] );
	return xrxGetValue( data );
}

//  Replace Template

/**
* This function puts the provided template content in the given template already on the device.
*
* @param	url					destination address
* @param	templateName		template name
* @param	templateContent		template content data
* @param	priorChecksum		checksum of template currently on device
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplateReplaceTemplate( url, templateName, templateContent, priorChecksum, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateReplaceTemplateRequest( templateName, templateContent, priorChecksum );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the Replace Template request.
*
* @param	templateName	    template name
* @param	templateContent		template content data
* @return	string	xml request
*/
function xrxTemplateReplaceTemplateRequest( templateName, templateContent, priorChecksum )
{
	return	XRX_TEMPLATE_SOAPSTART
			    + xrxCreateTag( 'ReplaceTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, templateName )
			    + xrxCreateTag( 'templateContent', XRX_XML_TYPE_NONE, templateContent ) 
			    + xrxCreateTag( 'priorChecksum', XRX_XML_TYPE_NONE, priorChecksum ) ) 
			    + XRX_TEMPLATE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		checksum or null
*/
function xrxTemplateParseReplaceTemplate( response )
{
	var result = new Array();
	var data = xrxFindElement( xrxStringToDom( response ), ["ChecksumResponse","TemplateChecksum"] );
	return xrxGetValue( data );
}

//  Delete Template

/**
* This function deletes the template from the device.
*
* @param	url					destination address
* @param	template			template name
* @param	checksum			template checksum
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplateDeleteTemplate( url, template, checksum, callback_success, 
									callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateDeleteTemplateRequest( template, checksum );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Delete Template request.
*
* @param	template	template content data
* @param	checksum	template checksum
* @return	string	xml request
*/
function xrxTemplateDeleteTemplateRequest( template, checksum )
{
	return	XRX_TEMPLATE_SOAPSTART
			    + xrxCreateTag( 'DeleteTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, template )
			    + xrxCreateTag( 'priorChecksum', XRX_XML_TYPE_NONE, checksum ) ) 
			    + XRX_TEMPLATE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	boolean		true if successful
*/
function xrxTemplateParseDeleteTemplate( response )
{
	if(xrxGetTheElement( xrxStringToDom( response ), "VoidResponse" ) != null)
		return true;
	else
		return false;
}

/*************************  End of File  *****************************/

define("XRXTemplate", [],function(){});

/* 
 * XrxScan.js
 * Copyright (C) Xerox Corporation, 2007.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Scan Api webservices.
 *
 * @revision    10/07/2007
 *              10/15/2012  AHB Removed GetResourceSimple
 *				08/27/2013  NS	Scan Extension API is renamed to ScanExtension(Version1) API in EIP 3.0 SDK
 */

/****************************  GLOBALS  *******************************/

var XRX_SCAN_SOAPSTART = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<SOAP-ENV:Envelope'+
        ' xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"'+
        ' xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"'+
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'+
        ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"'+
        ' xmlns:wsa="http://schemas.xerox.com/office/wsd/wsa.xsd"'+
        ' xmlns:asdl="http://schemas.xmlsoap.org/ws/2004/08/addressing"'+
        ' xmlns:dpws="http://schemas.xmlsoap.org/ws/2006/02/devprof"'+
        ' xmlns:xrxscn="http://schemas.xerox.com/office/wsd">'+
        ' <SOAP-ENV:Header>'+
        ' </SOAP-ENV:Header>'+
        ' <SOAP-ENV:Body id="_0">';

var XRX_SCAN_SOAPEND = '</SOAP-ENV:Body></SOAP-ENV:Envelope>';

var XRX_SCAN_EXTRAATTRIBS = '<To xsi:type="asdl:AttributedURI" '+
        'xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"></To>'+
        '<ServiceId xsi:type="xsd:anyURI" '+
        'xmlns="http://schemas.xmlsoap.org/ws/2006/02/devprof"></ServiceId>'+
        '<Action xsi:type="asdl:AttributedURI" '+
        'xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"></Action>'+
        '<MessageID xsi:type="asdl:AttributedURI" '+
        'xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"></MessageID>';

var XRX_SCAN_NAMESPACE = 'xmlns="http://schemas.xerox.com/office/wsd"';

var XRX_SCAN_PATH = '/webservices/office/wsdxrxscan/1';

/****************************  FUNCTIONS  *******************************/

//  Scan Interface Version

/**
* This function gets the Scan interface version and returns the parsed values.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxScanGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SCAN_PATH;
    var sendReq = xrxScanGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Scan interface version request.
*
* @return	string	xml request
*/
function xrxScanGetInterfaceVersionRequest()
{
	return	XRX_SCAN_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_SCAN_NAMESPACE, '' ) 
			+ XRX_SCAN_SOAPEND;
}

//  Initiate Scan

/**
* This function initiates a Scan.
*
* @param	url					destination address
* @param	template			name of template
* @param	isPool				flag to determine if template in pool (true)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxScanInitiateScan( url, template, isPool, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SCAN_PATH;
	var sendReq = xrxScanInitiateScanRequest( template, isPool );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}   

/**
* This function builds the Initate Scan request.
*
* @return	string	xml request
*/
function xrxScanInitiateScanRequest( template, isPool )
{
	return	XRX_SCAN_SOAPSTART 
			+ xrxCreateTag( 'InitiateScanRequest', XRX_SCAN_NAMESPACE,
			xrxCreateTag( 'ScanTemplateID', XRX_XML_TYPE_NONE, template ) 
			+ xrxCreateTag( 'IsFromTemplatePool', XRX_XML_TYPE_BOOLEAN, isPool ) 
			+ XRX_SCAN_EXTRAATTRIBS ) + XRX_SCAN_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	jobID
*/
function xrxScanParseInitiateScan( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ["InitiateScanResponse","JobID"] );
	return xrxGetValue( data );
}
 
/*************************  End of File  *****************************/

define("XRXScan", [],function(){});

/* 
 * XrxScanV2.js
 * Copyright (C) Xerox Corporation, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox ScanV2 Api webservices.
 *
 * @revision 03/02/2012		TC		Created.
 *			 10/25/2012		TC		Updated the comments.
 *			 11/01/2012		TC		Validate the url passed in and give it default value
 *									if the url is null or empty.
 *			 11/02/2012		AHB		Added InitiateScanJobWithTemplate.
 *			 08/27/2013     NS	    ScanV2 API is renamed to ScanExtension(Version2) API in EIP 3.0 SDK.
 *			 07/11/2014		TC		Add the optional token parameter to xrxScanV2InitiateScanJob() and
 *									its helper function xrxScanV2InitiateScanJobRequest().
 *			 07/16/2014		TC		Remove xrxScanV2GetImage() and its helper functions 
 *									xrxScanV2GetImageRequest() and findMtomData() because
 *									making the GetImageFile() call from a browser is not recommended.
 *			 07/16/2014		TC		Remove the redundant xrxScanV2ParseInitiateScanJobWithTemplate() function.
 */

/****************************  GLOBALS  *******************************/

var XRX_SCANV2_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/scanservice/2"';

var XRX_SCANV2_PATH = '/webservices/ScanService/2';

/****************************  FUNCTIONS  *******************************/


//  Scan Interface Version


/**
* This function gets the Scan interface version and returns the parsed values.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxScanV2GetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SCANV2_PATH;
    var sendReq = xrxScanV2GetInterfaceVersionRequest();
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the Scan interface version request.
*
* @return	string	xml request
*/
function xrxScanV2GetInterfaceVersionRequest()
{
	return	XRX_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_SCANV2_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxScanV2ParseGetInterfaceVersion(response) 
{
    var data = xrxStringToDom(response);
    return xrxGetValue(xrxFindElement( data, ["Version", "MajorVersion"])) + "."
	    + xrxGetValue(xrxFindElement( data, ["Version", "MinorVersion"])) + "."
	    + xrxGetValue(xrxFindElement( data, ["Version", "Revision"]));
}


//  Initiate Scan Job with a job ticket


/**
* This function initiates a Scan Job with a job ticket
*
* @param	url					destination address
* @param	scanV2JobTicket     scanV2 job ticket (string of escaped Xml)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @param    token               Security token as a string. (optional)
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxScanV2InitiateScanJob( url, scanV2JobTicket, callback_success, callback_failure, timeout, async, token )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SCANV2_PATH;
	var sendReq = xrxScanV2InitiateScanJobRequest( scanV2JobTicket, token );

	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the Initate Scan Job request.
*
* @param    jobTicket   job ticket in string form
* @param    token       Security token as a string. (optional)
* @return	string	    xml request
*/
function xrxScanV2InitiateScanJobRequest(scanV2JobTicket, token)
{
	var tokenTag = '';
	if (token != null && token != undefined && token != '')
	{
		tokenTag = xrxCreateTag( 'Token', '', token );
	}

	return	XRX_SOAPSTART
			+ xrxCreateTag( 'InitiateScanWithTicketRequest', XRX_SCANV2_NAMESPACE, scanV2JobTicket + tokenTag )
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    jobID
*/
function xrxScanV2ParseInitiateScanJob( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ["InitiateScanWithTicketResponse","JobID"] );
	return xrxGetValue( data );
}


//  Initiate Scan Job with a template


/**
* This function initiates a Scan Job with a template
*
* @param	url					destination address
* @param	templateName        Template name
* @param    isPool              boolean in string form - whether on device (false) or template pool (true)
* @param    token               token in string form
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxScanV2InitiateScanJobWithTemplate( url, templateName, isPool, token, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SCANV2_PATH;
	var sendReq = xrxScanV2InitiateScanJobWithTemplateRequest( templateName, isPool, token );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the Initate Scan Job request.
*
* @param    templateName    name of template
* @param    isPool          boolean in string form - whether on device (false) or template pool (true)
* @param    token           token in string form
* @return	string	        xml request
*/
function xrxScanV2InitiateScanJobWithTemplateRequest( templateName, isPool, token )
{
	return	XRX_SOAPSTART
			+ xrxCreateTag( 'InitiateScanWithTemplateRequest', XRX_SCANV2_NAMESPACE, 
			    xrxCreateTag( 'ScanTemplateID', '', templateName)
			    + xrxCreateTag( 'IsFromTemplatePool', '', isPool )
			    + xrxCreateTag( 'Token', '', token ) )
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    jobID
*/
function xrxScanV2ParseInitiateScanJobWithTemplate( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ["InitiateScanWithTemplateResponse","JobID"] );
	return xrxGetValue( data );
}
 
/*************************  End of File  *****************************/

define("XRXScanV2", ["XRXScan"], function(){});

/* 
 * XRXJobManagement.js
 * Copyright (C) Xerox Corporation, 2011, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Job Management Api 
 * webservices.
 *
 * @revision    06/26/2012
 *              10/15/2012  AHB Updated with missing methods
 *              11/01/2012  AHB Corrected comment in header for return value in xrxJobMgmtParseGetJobDetails
 *              07/31/2013  AHB Added MTOM methods and new Secure methods, made corrections
 *              08/08/2013  AHB Bug fix to parse queues - unescape only secure
 *                              Fixed Queue Secure Requests to not include a Credentials element if user and pass blank
 *              08/16/2013  AHB Added Ws-Security
 */

/****************************  GLOBALS  *******************************/

var XRX_JOBMGMT_NAMESPACE = 'xmlns="http://xml.namespaces.xerox.com/enterprise/JobManagement/1"';

var XRX_JOBMGMT_PATH = '/webservices/JobManagement/1';

/****************************  FUNCTIONS  *******************************/


//  Job Management Interface Version


/**
* This function gets the Job Management interface version and returns the parsed values.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtGetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtGetInterfaceVersionRequest();
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the Job Management interface version request.
*
* @return	string	xml request
*/
function xrxJobMgmtGetInterfaceVersionRequest()
{
	return	XRX_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_JOBMGMT_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	    webservice response in string form
* @return	string		    Major.Minor.Revision
*/
function xrxJobMgmtParseGetInterfaceVersion( response )
{
	return xrxParseGetInterfaceVersion( response );
}


//  ListActiveQueue


/**
* This function gets jobs in the active queue
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtListActiveQueue( url, callback_success, callback_failure, timeout, async ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtListActiveQueueRequest();
	var headers = new Array();
	headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers, null, null, async );
}   

/**
* This function builds the request.
*   
* @return	string	    xml request
*/
function xrxJobMgmtListActiveQueueRequest()
{
    var resq = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART_MTOM
			+ xrxCreateTag( 'ListActiveJobQueueRequest', XRX_JOBMGMT_NAMESPACE, '' )
			+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
    return resq;
}

/**
* This function returns the job state values.
*
* @param	response	        webservice response in string form
* @return	array		        xml payload in DOM form
*/
function xrxJobMgmtParseListActiveQueue( response )
{
	return xrxJobMgmtParseListQueue( response );
}


//  ListActiveQueueSecure


/**
* This function gets jobs in the active queue
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtListActiveQueueSecure( url, admin, adminPassword, username, password, callback_success, callback_failure, timeout, async ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtListActiveQueueSecureRequest( admin, adminPassword, username, password );
	var headers = new Array();
	headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers, null, null, async );
}   

/**
* This function builds the request.
*   
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @return	string	    xml request
*/
function xrxJobMgmtListActiveQueueSecureRequest( admin, adminPassword, username, password )
{
    var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART_MTOM
			+ xrxCreateTag( 'ListActiveJobQueueSecureRequest', XRX_JOBMGMT_NAMESPACE, 
			    (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			        ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			        + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ):"") )
			+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword );
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the job list.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxJobMgmtParseListActiveQueueSecure( response )
{
	return xrxJobMgmtParseListQueueSecure( response );
}


//  ListCompletedQueue


/**
* This function gets jobs in the completed queue
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtListCompletedQueue( url, callback_success, callback_failure, timeout, async ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtListCompletedQueueRequest();
	var headers = new Array();
	headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers, null, null, async );
}   

/**
* This function builds the request.
*   
* @return	string	    xml request
*/
function xrxJobMgmtListCompletedQueueRequest()
{
    var resq = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART_MTOM
			+ xrxCreateTag( 'ListCompletedJobQueueRequest', XRX_JOBMGMT_NAMESPACE, '' )
			+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
    return resq;
}

/**
* This function returns the job list.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxJobMgmtParseListCompletedQueue( response )
{
	return xrxJobMgmtParseListQueue( response );
}


//  ListCompletedQueueSecure


/**
* This function gets jobs in the completed queue
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtListCompletedQueueSecure( url, admin, adminPassword, username, password, callback_success, callback_failure, timeout, async ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtListCompletedQueueSecureRequest( admin, adminPassword, username, password );
	var headers = new Array();
	headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers, null, null, async );
}   

/**
* This function builds the request.
*   
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @return	string	    xml request
*/
function xrxJobMgmtListCompletedQueueSecureRequest( admin, adminPassword, username, password )
{
    var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART_MTOM
			+ xrxCreateTag( 'ListCompletedJobQueueSecureRequest', XRX_JOBMGMT_NAMESPACE, 
			    (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			        ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			        + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ) : "") )
			+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword );
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the job list.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxJobMgmtParseListCompletedQueueSecure( response )
{
	return xrxJobMgmtParseListQueueSecure( response );
}

/***************************  Queue Support Functions  ************************************/

/**
* This function returns the job list.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxJobMgmtParseListQueue( response )
{
	return xrxStringToDom( findMtomData( response, "<?xml version", ">" ) );
}

/**
* This function returns the job list.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxJobMgmtParseListQueueSecure( response )
{
	return xrxStringToDom( xrxUnescape( findMtomData( response, "&lt;?xml version", "&gt;" ) ) );
}


//  GetJobDetails


/**
* This function gets job details for a specific job referenced by the job id
*
* @param	url					destination address
* @param    jobType             job type
* @param	jobId			    job id
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtGetJobDetails( url, jobType, jobId, callback_success, callback_failure, timeout, async ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtGetJobDetailsRequest( jobType, 'JobId', jobId );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This LEGACY function gets job details for a specific job providing the job id
*
* @param	url					destination address
* @param    jobType             job type
* @param    jobIdType           job id type (not used)
* @param	jobId			    job id
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
*/
function xrxGetJobDetails( url, jobType, jobIdType, jobId, callback_success, callback_failure, timeout, async ) 
{
    xrxJobMgmtGetJobDetails( url, jobType, jobId, callback_success, callback_failure, timeout, async  );
}   

/**
* This function builds the request.
*
* @param    jobType     job type
* @param    jobIdType   job id type
* @param	jobId		job id     
* @return	string	    xml request
*/
function xrxJobMgmtGetJobDetailsRequest( jobType, jobIdType, jobId )
{
    var resq = XRX_SOAPSTART 
			+ xrxCreateTag( 'GetJobDetailsRequest', XRX_JOBMGMT_NAMESPACE,
			    xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			        xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			        + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			    + xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType ) ) 
			+ XRX_SOAPEND;
    return resq;
}

/**
* This function returns the job state values.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxJobMgmtParseGetJobDetails( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "JobInfoXmlDocument" );
	if(data != null) 
	    data = xrxStringToDom( xrxUnescape( data ) );
	return data;
}

/**
* This LEGACY function returns the job values.
*
* @param	response	webservice response in string form
* @return	string	    xml payload in DOM form
*/
function xrxParseGetJobDetails( response )
{
	return xrxJobMgmtParseGetJobDetails( response );
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    JobStateReason
*/
function xrxJobMgmtParseJobStateReasons( response )
{
	var payloadNode = xrxFindElement( xrxStringToDom( response ), ["JobInfoXmlDocument"] );
	var payload = xrxGetValue( payloadNode );
	var data = xrxFindElement( xrxStringToDom( xrxUnescape( payload ) ), ["JobInfo","JobStateReasons"] );
	return xrxGetValue( data );
}


//  GetJobDetailsSecure


/**
* This function gets job details for a specific job referenced by the job id
*
* @param	url					destination address
* @param    jobType             job type
* @param	jobId			    job id
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtGetJobDetailsSecure( url, jobType, jobId, admin, adminPassword, username, password, callback_success, callback_failure, timeout, async ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtGetJobDetailsSecureRequest( jobType, 'JobId', jobId, admin, adminPassword, username, password );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}
   

/**
* This function builds the request.
*
* @param    jobType             job type
* @param    jobIdType           job id type
* @param	jobId		        job id   
* @param	admin			    admin username (blank will not be included)
* @param	adminPassword	    admin password (blank will not be included)
* @param	username	        username for user credentials (blank will not be included)
* @param	password	        password for user credentials (blank will not be included)
* @param	pin     	        pin for job (blank will not be included)  
* @return	string	    xml request
*/
function xrxJobMgmtGetJobDetailsSecureRequest( jobType, jobIdType, jobId, admin, adminPassword, username, password )
{
    var result = XRX_SOAPSTART 
			+ xrxCreateTag( 'GetJobDetailsSecureRequest', XRX_JOBMGMT_NAMESPACE,
			    xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			        xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			        + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			    + xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType )
			    + (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			        ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			        + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ):"") )
			+ XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword );
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the job state values.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxJobMgmtParseGetJobDetailsSecure( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "JobInfoXmlDocument" );
	if(data != null) 
	    data = xrxStringToDom( xrxUnescape( data ) );
	return data;
}


//  Cancel Job


/**
* This function cancels the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobType             job type
* @param    jobId               job Id for desired job
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtCancelJob( url, jobType, jobId, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtCancelJobRequest( jobType, 'JobId', jobId );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param    jobType     job type
* @param    jobIdType   job id type
* @param	jobId		job id 
* @return	string	xml request
*/
function xrxJobMgmtCancelJobRequest( jobType, jobIdType, jobId )
{
	return XRX_SOAPSTART +
        xrxCreateTag( 'CancelJobRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			    xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			    + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			+ xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType ) ) 
        + XRX_SOAPEND;
}


//  Cancel Job Secure


/**
* This function cancels the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobType             job type
* @param    jobId               job Id for desired job
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @param	pin     			pin for job (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtCancelJobSecure( url, jobType, jobId, admin, adminPassword, username, password, pin, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtCancelJobSecureRequest( jobType, 'JobId', jobId, admin, adminPassword, username, password, pin );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param    jobType             job type
* @param    jobIdType           job id type
* @param	jobId		        job id 
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @param	pin     			pin for job (blank will not be included)
* @return	string	xml request
*/
function xrxJobMgmtCancelJobSecureRequest( jobType, jobIdType, jobId, admin, adminPassword, username, password, pin )
{
	var result = XRX_SOAPSTART +
        xrxCreateTag( 'CancelJobSecureRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			    xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			    + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			+ xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType )
            + (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			    ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			    + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ):"")
			    + ((pin != "")?xrxCreateTag( 'PinNumber', XRX_XML_TYPE_NONE, pin ):"") ) 
        + XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword );
    }
    catch(e)
    {}
    return result;
}


//  Pause Job


/**
* This function pauses the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobType             job type
* @param    jobId               job Id for desired job
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtPauseJob( url, jobType, jobId, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtPauseJobRequest( jobType, 'JobId', jobId );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param    jobId               job Id for desired job
* @return	string	xml request
*/
function xrxJobMgmtPauseJobRequest( jobType, jobIdType, jobId )
{
	return XRX_SOAPSTART +
        xrxCreateTag( 'PauseJobRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			        xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			        + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			    + xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType ) ) 
        + XRX_SOAPEND;
}


//  Pause Job Secure


/**
* This function pauses the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobType             job type
* @param    jobId               job Id for desired job
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @param	pin     			pin for job (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtPauseJobSecure( url, jobType, jobId, admin, adminPassword, username, password, pin, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtPauseJobSecureRequest( jobType, 'JobId', jobId, admin, adminPassword, username, password, pin );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param    jobType             job type
* @param    jobIdType           Id Type ('JobId' or 'ClientId')
* @param    jobId               job Id for desired job
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @return	string	xml request
*/
function xrxJobMgmtPauseJobSecureRequest( jobType, jobIdType, jobId, admin, adminPassword, username, password, pin )
{
	var result = XRX_SOAPSTART +
        xrxCreateTag( 'PauseJobSecureRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			    xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			    + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			+ xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType )
			+ (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			    ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			    + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ):"")
			    + ((pin != "")?xrxCreateTag( 'PinNumber', XRX_XML_TYPE_NONE, pin ):"") ) 
        + XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword );
    }
    catch(e)
    {}
    return result;
}


//  Resume Job


/**
* This function resumes the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobType             job type
* @param    jobId               job Id for desired job
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtResumeJob( url, jobType, jobId, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtResumeJobRequest( jobType, 'JobId', jobId );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param    jobId               job Id for desired job
* @return	string	xml request
*/
function xrxJobMgmtResumeJobRequest( jobType, jobIdType, jobId )
{
	return XRX_SOAPSTART +
        xrxCreateTag( 'ResumeJobRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			    xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			    + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			+ xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType ) ) 
        + XRX_SOAPEND;
}


//  Resume Job Secure


/**
* This function resumes the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobType             job type
* @param    jobId               job Id for desired job
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @param	pin     			pin for job (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxJobMgmtResumeJobSecure( url, jobType, jobId, admin, adminPassword, username, password, pin, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtResumeJobSecureRequest( jobType, 'JobId', jobId, admin, adminPassword, username, password, pin );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param    jobType             job type
* @param    jobIdType           Id Type ('JobId' or 'ClientId')
* @param    jobId               job Id for desired job
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @return	string	xml request
*/
function xrxJobMgmtResumeJobSecureRequest( jobType, jobIdType, jobId, admin, adminPassword, username, password, pin )
{
	var result = XRX_SOAPSTART +
        xrxCreateTag( 'ResumeJobSecureRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			    xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			    + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			+ xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType )
			+ (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			    ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			    + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ):"")
			    + ((pin != "")?xrxCreateTag( 'PinNumber', XRX_XML_TYPE_NONE, pin ):"") ) 
        + XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword );
    }
    catch(e)
    {}
    return result;
}

/*************************  End of File  *****************************/

define("XRXJobManagement", [],function(){});

﻿/* 
 * XRXDeviceConfig.js
 * Copyright (C) Xerox Corporation, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox DeviceConfig Api webservices.
 *
 * @revision    04/05/2012
 *              09/21/2012  AHB Expanded functionality to parse payload
 *              10/15/2012  AHB Updated
 *              12/20/2012  AHB Added xrxGetDeviceInformation pass thru to remain compatible with other versions
 *              08/01/2013  AHB Added synchronous behavior
 *				01/26/2017  TC  Fixed a typo in xrxDeviceConfigGetInterfaceVersion() parameters.
 */

/****************************  CONSTANTS  *******************************/

var XRX_DEVICECONFIG_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/office/device_configuration/1"';

var XRX_DEVICECONFIG_PATH = '/webservices/office/device_configuration/1';

/****************************  FUNCTIONS  *******************************/


//  DeviceConfig Interface Version


/**
* This function gets the DeviceConfig interface version and returns the parsed values.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxDeviceConfigGetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_DEVICECONFIG_PATH;
    var sendReq = xrxDeviceConfigGetInterfaceVersionRequest();
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the DeviceConfig interface version request.
*
* @return	string	xml request
*/
function xrxDeviceConfigGetInterfaceVersionRequest()
{
	return	XRX_SOAP11_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_DEVICECONFIG_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxDeviceConfigParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","Revision"] ) );
}


//  GetDeviceConfigInfo


/**
* This function retrieves the DeviceConfigInfo data.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxDeviceConfigGetDeviceInformation( url, callback_success, callback_failure, timeout, async )
{
    return xrxDeviceConfigGetDeviceInfo( url, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function retrieves the DeviceConfigInfo data.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxDeviceConfigGetDeviceInfo( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_DEVICECONFIG_PATH;
	var sendReq = xrxDeviceConfigGetDeviceInfoRequest();
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the DeviceConfig Info data request.
*
* @return	string	xml request
*/
function xrxDeviceConfigGetDeviceInfoRequest()
{
	return	XRX_SOAP11_SOAPSTART 
			+ xrxCreateTag( 'GetDeviceInformationRequest', XRX_DEVICECONFIG_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxDeviceConfigParseGetDeviceInfo( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "Information" );
	if(data != null) 
	    data = xrxStringToDom( xrxUnescape( data ) );
	return data;
}

/**
* This function returns the the payload of the response.
*
* @param	response	webservice response in string form
* @return	string		escaped xml payload in string form
*/
function xrxDeviceConfigParseGetDeviceInfoPayload( response )
{
	return xrxParsePayload( response, "Information" );
}


//  GetDeviceCapabilities


/**
* This function retrieves the DeviceCapabilities data.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxDeviceConfigGetDeviceCapabilities( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_DEVICECONFIG_PATH;
	var sendReq = xrxDeviceConfigGetDeviceCapabilitiesRequest();
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
} 

/**
* This function builds the DeviceConfig Capabilities data request.
*
* @return	string	xml request
*/
function xrxDeviceConfigGetDeviceCapabilitiesRequest()
{
	return	XRX_SOAP11_SOAPSTART 
			+ xrxCreateTag( 'VoidRequest', XRX_DEVICECONFIG_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxDeviceConfigParseGetDeviceCapabilities( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "JobModelCapabilities_DeviceJobProcessingCapabilities" );
	if(data != null) 
	    data = xrxStringToDom( xrxUnescape( data ) );
	return data;
}

/**
* This function returns the the payload of the response.
*
* @param	response	webservice response in string form
* @return	string		escaped xml payload in string form
*/
function xrxDeviceConfigParseGetDeviceCapabilitiesPayload( response )
{
    return xrxParsePayload( response, "JobModelCapabilities_DeviceJobProcessingCapabilities" );
}

/*************************  End of File  *****************************/



define("XRXDeviceConfig", [],function(){});

/*
* XRXUtiities
* Functions that will be of use and workaround problems on the device.
*
* Version
*   1.0     04/18/13 AHB Create first version with Browser ID, Widget ID and DomAttrEvent functions
*   1.1     05/15/13 AHB Added new utilities: GetCurrentBrowserVersion
*
*/

//  Get Xerox Widget Version

/**
* This function gets the Xerox Widget version.
*
* @return string Rev2 widget version string or "Rev 1"
*/
function getXeroxWidgetVersion()
{
	var version = "Xerox Widgets ";
	try
	{
		version += "Rev 2 " + xrxGetWidgetCodeVersion();
	} catch( e )
	{
		version += "Rev 1";
	}
	return version;
}

//  Identify Current Browser

/**
* This function identifies the browser currently handling the page
*
* @return   string      "FirstGenBrowser" or "SecondGenBrowser" or "Unknown" or "No User Agent"
*/
function xrxIdentifyCurrentBrowser()
{
    var uaString = navigator.userAgent;
    return (((uaString != undefined) && (uaString != null)) ? (((uaString = uaString.toLowerCase()).indexOf( "galio" ) >= 0) ? 
        "FirstGenBrowser" : ((uaString.indexOf( "webkit" ) >= 0) ? "SecondGenBrowser" : "Unknown" )) : "No User Agent" );
}

//  Get Current Browser Version

/**
* This function gets the version of the browser currently handling the page
*
* @return   string      browser version
*/
function xrxGetCurrentBrowserVersion()
{
    return navigator.appVersion;
}

//  Send DomAttrModified event

/**
* This function initiates a DomAttrEvent for use in the Second Gen EIP Browser which lacks this event.
*
* @param	node				Dom element to generate the event
* @param	bubbles             Boolean - state of bubble thru
* @param	cancelable          Boolean - whether event can be cancelled
* @param	attrName            Name of the attribute
* @param	prevValue           Previous value of the attribute or null 
* @param	newValue            New value of the attribute or null 
* @param	modType			    Type of attribute modification (Addition, Removal, Modification) (case insensitive)
* @param	ifNecessary			(optional)  true - function will only execute if current browser is NOT firstGen (default), false - fires anyways
* @return   boolean             True = event was sent, False = failed to process
*/
function xrxSendDomAttrModifiedEvent( node, bubbles, cancelable, attrName, prevValue, newValue, modType, ifNecessary )
{
    if(((ifNecessary != undefined) && !ifNecessary) || (xrxIdentifyCurrentBrowser() != "FirstGenBrowser"))
        return xrxFireDomAttrModifiedEvent( node, bubbles, cancelable, attrName, prevValue, newValue, modType );
    else 
        return false;
}

//  Fire DomAttrModified event

/**
* This function initiates a DomAttrEvent.
*
* @param	node				Dom element to generate the event
* @param	bubbles             Boolean - state of bubble thru
* @param	cancelable          Boolean - whether event can be cancelled
* @param	attrName            Name of the attribute
* @param	prevValue           Previous value of the attribute or null 
* @param	newValue            New value of the attribute or null 
* @param	modType			    Type of attribute modification (Addition, Removal, Modification) (case insensitive)
* @return   boolean             True = event was sent, False = failed to process
*/
function xrxFireDomAttrModifiedEvent( node, bubbles, cancelable, attrName, prevValue, newValue, modType )
{
    try
    {
	    var evt = xrxCreateDomAttrModifiedEvent( node, bubbles, cancelable, attrName, prevValue, newValue, modType );
        node.dispatchEvent( evt );
        return true;
    }
    catch(e)
    {
        return false;
    }
}

//  Create DomAttrModified event

/**
* This function creates a DomAttrEvent.
*
* @param	node				Dom element to generate the event
* @param	bubbles             Boolean - state of bubble thru
* @param	cancelable          Boolean - whether event can be cancelled
* @param	attrName            Name of the attribute
* @param	prevValue           Previous value of the attribute or null 
* @param	newValue            New value of the attribute or null 
* @param	modType			    Type of attribute modification (Addition, Removal, Modification) (case insensitive)
* @return   event               null if failed else event created
*/
function xrxCreateDomAttrModifiedEvent( node, bubbles, cancelable, attrName, prevValue, newValue, modType )
{
    try
    {
	    var evt = document.createEvent( "MutationEvent");
        evt.initMutationEvent(
            "DOMAttrModified",
            bubbles,
            cancelable,
            node,
            prevValue || "",
            newValue || "",
            attrName,
            (((modType = modType.toLowerCase()) == "removal") ? evt.REMOVAL: ((modType == "addition") ? evt.ADDITION : evt.MODIFICATION))
        );
        return evt;
    }
    catch(e)
    {
        return null;
    }
}

/**
* This function gets values from local storage IF we are using the Second Gen EIP Browser.
*
* @param	key					key string to retreive value
* @param	defaultValue		value to return if stored value unavailable
* @return   stored value or default value
*/
function xrxGetLocalStorageData( key, defaultValue ) 
{
    if(typeof( defaultValue ) == "undefined")
        defaultValue = "";
    var last = defaultValue;
    if(xrxIdentifyCurrentBrowser() == "SecondGenBrowser")
    {
        try 
        {
            if((last = localStorage.getItem( key )) == null)
                last = defaultValue;
        }
        catch(err) 
        {
            //assume error is that localStorage is not created yet, so use default
            last = defaultValue;
        }
    }
    return last;
}

/**
* This function sets the value into local storage IF we are using the Second Gen EIP Browser.
*
* @param	key					key string to retreive value
* @param	value		        value to store
*/
function xrxSetLocalStorageData( key, value ) 
{
    if(xrxIdentifyCurrentBrowser() == "SecondGenBrowser")
        localStorage.setItem( key, value );
}

//  Make Asynchronous Ajax Call Indirectly

// Global
var xrxAjaxService = null;

/**
* This function calls the high level Ajax function in the XeroxJavascriptLibrary.
*
* @param	url					destination address
* @param	envelope			xml string for body of message
* @param	headers				array of optional headers in format {name:value} or null (optional)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    username            optional username for ajax request
* @param    password            optional password for ajax request
*/
function xrxCallWebserviceIndirect( url, envelope, headers, callback_success, callback_failure, timeout, username, password )
{
    xrxAjaxService = new XRXAjaxParameters( url, envelope, "POST", headers, callback_success, callback_failure, timeout, username, password );
    setTimeout( 'xrxAjaxService.callWebservice()', 0 );       
}

/**
* This function calls the low level Ajax function in the XeroxJavascriptLibrary.
*
* @param	url					destination address
* @param	envelope			xml string for body of message
* @param	type				request type (GET or POST)
* @param	headers				array of arrays containing optional headers to set on the request or null
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    username            optional username for ajax request
* @param    password            optional password for ajax request
*/
function xrxCallAjaxIndirect( url, envelope, type, headers, callback_success, callback_failure, timeout, username, password )
{
    xrxAjaxService = new XRXAjaxParameters( url, envelope, type, headers, callback_success, callback_failure, timeout, username, password );
    setTimeout( 'xrxAjaxService.callAjax()', 0 ); 
}

function XRXAjaxParameters( url, envelope, type, headers, callback_success, callback_failure, timeout, username, password )
{
    this.url = url;
    this.envelope = envelope;
    this.type = type;
    this.headers = headers;
    this.callback_success = callback_success;
    this.callback_failure = callback_failure;
    this.timeout = timeout;
    this.username = username;
    this.password = password;
    this.callWebservice = xrxCallWebserviceContinue;
    this.callAjax = xrxCallAjaxContinue;
}

function xrxCallWebserviceContinue()
{
    xrxCallWebservice( this.url, this.envelope, this.callback_success, this.callback_failure, this.timeout, this.headers, this.username, this.password );
}

function xrxCallAjaxContinue()
{
    xrxCallAjax( this.url, this.envelope, this.type, this.headers, this.callback_success, this.callback_failure, this.timeout, this.username, this.password );
}
define("XRXUtilities", [],function(){});

/* 
 * XRXPrint.js
 * Copyright (C) Xerox Corporation, 2011.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Print Api webservices.
 *
 * @revision 	10/03/2011	TC	Created.
 * 				10/22/2012  TC 	Added xrxPrintParseGetInterfaceVersion() function,
 *								added error checking and comments.
 */

/****************************  CONSTANTS  *******************************/

var XRX_PRINT_SOAPSTART = '<?xml version="1.0" encoding="UTF-8"?>' +
 '<SOAP-ENV:Envelope' +
                        ' xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope"' +
                        ' xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding"' +
                        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
                        ' xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
 '<SOAP-ENV:Body>';

var XRX_PRINT_SOAPEND = '</SOAP-ENV:Body></SOAP-ENV:Envelope>';

var XRX_PRINT_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/WS-PrintService/1"';

var XRX_PRINT_PATH = '/webservices/WS-PrintService/1';

/****************************  FUNCTIONS  *******************************/

//  Print Interface Version

/**
* This function gets the print interface version.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxPrintGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
	if((url == null) || (url == ""))
		url = "http://127.0.0.1";
    var sendUrl = url + XRX_PRINT_PATH;
    var sendReq = xrxPrintGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the get interface version request.
* 
*/
function xrxPrintGetInterfaceVersionRequest()
{
	return XRX_PRINT_SOAPSTART 
		+ xrxCreateTag('GetInterfaceVersionRequest', XRX_PRINT_NAMESPACE, '') 
		+ XRX_PRINT_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxPrintParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

//  Initiate Print Job

/**
* This function initiates a Print Job.
*
* @param	url			        WS-PrintService device destination address
* @param    printJobUrl         the url that contains the files to be printed
* @param    username            username for login to printJobUrl if authentication is required, '' if authentication is not required
* @param    password            password for login to printJobUrl if authentication is required, '' if authentication is not required
* @param    printJobTicket      print job ticket (string of escaped xml)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout			    function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxPrintInitiatePrintJobURL( url, printJobUrl, username, password, printJobTicket, callback_success, callback_failure, timeout)
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_PRINT_PATH;
	var sendReq = xrxPrintInitiatePrintJobURLRequest( printJobUrl, username, password, printJobTicket );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the initiate print job request.
* 
* @param    printJobUrl         the url that contains the files to be printed
* @param    username            username for login to printJobUrl if authentication is required, '' if authentication is not required
* @param    password            password for login to printJobUrl if authentication is required, '' if authentication is not required
* @param    printJobTicket      print job ticket (string of escaped xml)
*
* @return	string	xml request
*/
function xrxPrintInitiatePrintJobURLRequest( printJobUrl, username, password, printJobTicket )
{
	var printJobUrlTag = xrxCreateTag('PrintDocumentURL', '', printJobUrl);
	var usernameTag = ""; 
	var passwordTag = "";

	if (username != "")
	{
		usernameTag = xrxCreateTag('UserName', '', username);
		passwordTag = xrxCreateTag('Password', '', password);
    }

	var printJobTicketTag = (printJobTicket != null)? xrxCreateTag( 'JobModelSchemaCommon_PrintJobTicket', '', printJobTicket ) : '';

	return XRX_PRINT_SOAPSTART 
		+ xrxCreateTag('InitiatePrintJobURLRequest', XRX_PRINT_NAMESPACE, printJobUrlTag + printJobTicketTag + usernameTag + passwordTag) 
		+ XRX_PRINT_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		jobID
*/
function xrxPrintParseInitiatePrintJobURL( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ['InitiatePrintJobURLResponse','JobId'] );
	var jobID = xrxGetValue( data );

	return jobID;
}



/*************************  End of File  *****************************/

define("XRXPrint", [],function(){});

/* 
 * XRXWsSnmp.js
 * Copyright (C) Xerox Corporation, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox WS-SNMP Api webservices.
 *
 * @revision    01/24/2013 TC      	Created.
 * 		        03/11/2013 TC	    Updated after code review.
 * 		        06/25/2013 AHB	    Added Synchronous capability.
 * 		        07/07/2013 AHB	    Moved url check to XRXWebservices.
 * 		        08/01/2013 AHB	    Updated Constants.
 */

/****************************  CONSTANTS  *******************************/

var XRX_SNMP_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/SNMP/1"';

var XRX_SNMP_PATH = '/webservices/SNMP/1';


/****************************  FUNCTIONS  *******************************/


//  WsSnmp Get Interface Version


/**
* This function gets the EIP WsSnmp interface version.
*
* @param	url			        destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout			    function to call an error routine after a set amount 
*						        of seconds (0[default] = no timeout)(optional)
* @param	async	            asynchronous = true synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE"
*/
function xrxWsSnmpGetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SNMP_PATH;
    var sendReq = xrxWsSnmpGetInterfaceVersionRequest();
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the WsSnmp get interface version request.
*
* @return	string	xml request
*/
function xrxWsSnmpGetInterfaceVersionRequest()
{
	return	XRX_SOAPSTART
		    + xrxCreateTag( 'GetInterfaceVersionRequest', XRX_SNMP_NAMESPACE, '' ) 
		    + XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxWsSnmpParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}


//  Get


/**
* This function retrieves a data value associated with a specific OID.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded in xrxWsSnmpGetRequest function.
*
* @param	url			        destination address
* @param	communityString		SNMP get community string
* @param	oid			        OID string
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout			    function to call an error routine after a set amount 
*						        of seconds (0[default] = no timeout)(optional)
* @param	async	            asynchronous = true synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE"
*/
function xrxWsSnmpGet( url, communityString, oid, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SNMP_PATH;
    var sendReq = xrxWsSnmpGetRequest( communityString, oid );
	
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
} 

/**
* This function builds the WsSnmp Get request.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded.
*
* @param	communityString	SNMP get community string
* @param	oid			    OID string
* @return	string	        xml request
*/
function xrxWsSnmpGetRequest( communityString, oid )
{
	return	XRX_SOAPSTART
		    + xrxCreateTag( 'GetRequest', XRX_SNMP_NAMESPACE, xrxCreateTag( 'SNMPVersion', '', '2c' )
				   + xrxCreateTag( 'SNMPv2cData', '', xrxCreateTag( 'communityString', '', communityString ) )
				   + xrxCreateTag( 'OID', '', oid ) ) 
		    + XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	An object of { OID:'', Type:'', returnValue:'' }	
*/
function xrxWsSnmpParseGet( response )
{
    var data = {};
    var domObj = xrxStringToDom( response );
    data.OID = xrxGetElementValue( domObj, 'OID' );
    data.Type = xrxGetElementValue( domObj, 'Type' );
    data.returnValue = xrxGetElementValue( domObj, 'returnValue' );
    return data;
}


//  WsSnmp GetNext


/**
* This function obtains the OID and the value of the next item in the MIB tree.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded in xrxWsSnmpGetNextRequest function.
*
* @param	url			        destination address
* @param	communityString	    SNMP get community string
* @param	oid			        OID string
* @param	callback_success    function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout			    function to call an error routine after a set amount 
*						        of seconds (0[default] = no timeout)(optional)
* @param	async	            asynchronous = true synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE"
*/
function xrxWsSnmpGetNext( url, communityString, oid, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SNMP_PATH;
    var sendReq = xrxWsSnmpGetNextRequest( communityString, oid );
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
} 

/**
* This function builds the WsSnmp GetNext request.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded.
*
* @param	communityString	SNMP get community string
* @param	oid			    OID string
* @return	string	        xml request
*/
function xrxWsSnmpGetNextRequest( communityString, oid )
{
	return	XRX_SOAPSTART
		    + xrxCreateTag( 'GetNextRequest', XRX_SNMP_NAMESPACE, xrxCreateTag( 'SNMPVersion', '', '2c' )
				    + xrxCreateTag( 'SNMPv2cData', '', xrxCreateTag( 'communityString', '', communityString ) )
				    + xrxCreateTag( 'OID', '', oid ) ) 
		    + XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	An object of { OID:'', Type:'', returnValue:'' }
*/
function xrxWsSnmpParseGetNext( response )
{
    var data = {};
    var domObj = xrxStringToDom( response );
    data.OID = xrxGetElementValue( domObj, 'OID' );
    data.Type = xrxGetElementValue( domObj, 'Type');
    data.returnValue = xrxGetElementValue( domObj, 'returnValue');
    return data;
}


// WsSnmp Set


/**
* This function sets a data value associated with a specific OID.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded in xrxWsSnmpSetRequest function.
*
* @param	url			        destination address
* @param	communityString		SNMP set private community string
* @param	oidArr			    Array of oids. Each oid contains an OID string, an OID type and a Set Value.
* 					            So the array looks like this: [ oidString, oidType, setValue, oidString, oidType, setValue, ...].
* @param	callback_success	function to callback upon successful completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout			    function to call an error routine after a set amount 
*					            of seconds (0 = no timeout)
* @param	async	            asynchronous = true synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE"
*/
function xrxWsSnmpSet( url, communityString, oidArr, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var len = oidArr.length;
    if ((len >= 3) && (len%3 == 0))
    {
	    var sendUrl = url + XRX_SNMP_PATH;
	    var sendReq = xrxWsSnmpSetRequest(communityString, oidArr);
	    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
    } else
    {
	    return "FAILURE: Xerox Javascript Library - Invalid OID Array provided";
    }
}

/**
* This function builds the request.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded.
*
* @param	communityString	SNMP set private community string
* @param	oidArr			Array of oids. Each oid contains an OID string, an OID type and a Set Value.
* 					        So the array looks like this: [ oidString, oidType, setValue, oidString, oidType, setValue, ...].
* @return	string	xml request if oidArr contains the right number of parameters or error string otherwise. 
*/
function xrxWsSnmpSetRequest( communityString, oidArr )
{
    var len = oidArr.length;
    if ((len >= 3) && (len%3 == 0))
    {
	    var oidTags = '';
	    for( var i = 0; i < len; i = i + 3)
	    {
	        oidTags += xrxCreateTag( 'theOID', '', xrxCreateTag( 'OID', '', oidArr[i] ) +
				        xrxCreateTag( 'Type', '', oidArr[i+1] ) +
				        xrxCreateTag( 'setValue', '', oidArr[i+2] ) );
	    }
	    return	XRX_SOAPSTART
		        + xrxCreateTag( 'SetRequest', XRX_SNMP_NAMESPACE, xrxCreateTag( 'SNMPVersion', '', '2c' )
				        + xrxCreateTag( 'SNMPv2cData', '', xrxCreateTag( 'communityString', '', communityString ) )
				        + oidTags ) 
		        + XRX_SOAPEND;
    } else
    {
	    return "FAILURE: Xerox Javascript Library - Invalid OID Array provided";
    }
}

/*************************  End of File  *****************************/

define("XRXWsSnmp", [],function(){});


define("XRXMassStorage", [],function(){});

define("XRXMassStorage", [],function(){});
