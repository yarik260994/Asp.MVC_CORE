export class ServicesXml {

    getElement(info: any, name: string): any {
        return xrxGetTheElement(info, name);
    }

    getElementValue(info: any, name: string): any {
        return xrxGetElementValue(info, name);
    }

    stringToDom(str: string): any {
        return xrxStringToDom(str);
    }
}

declare function xrxStringToDom(str: string): any;
declare function xrxGetElementValue(info: any, name: string): any;
declare function xrxGetTheElement(info: any, name: string): any;