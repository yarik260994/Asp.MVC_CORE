import { autoinject } from "aurelia-framework";
import { Button } from "../../../custom_typings/Buttons/Button";
import { SettingsHelper } from "../settingsHelper";

@autoinject
export class InfoTable {
    showPrintDoc: boolean = false;
    button: Button;

    constructor( private settingsHelper: SettingsHelper) {
    }

    activate(params: any, routeConfig: any, navigationInstruction: any) {
        this.button = this.settingsHelper.getButton(params.id);
    }

    print(): void { 
        this.showPrintDoc = true;   
    }
}