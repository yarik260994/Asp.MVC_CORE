import { Router } from "aurelia-router";
import {Aurelia, customElement, bindable, containerless, autoinject } from "aurelia-framework";
import { AuthorizationHelper } from "../AuthorizationHelper";


@customElement("nav-bar")
@containerless
@autoinject
export class Navbar {
    @bindable router: Router;

    aurelia: Aurelia;
    constructor(aurelia:Aurelia) {
        this.aurelia = aurelia;
    }    

    logout():void { 
        AuthorizationHelper.clearAuthorized();
        this.aurelia.setRoot('app/login/login');
    }
}