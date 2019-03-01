import { autoinject } from "aurelia-framework";
import { Button } from "../../../custom_typings/Buttons/Button";
import { SettingsHelper } from "../settingsHelper";

@autoinject
export class ButtonTable {
    public showPrintDoc: boolean = false;
    button: Button;
    tableDocName: string;

    constructor(private settingsHelper: SettingsHelper) {
    }

    activate(params: any, routeConfig: any, navigationInstruction: any) {
        this.button = this.settingsHelper.getButton(params.id);
    }

    print(): void {
        this.showPrintDoc = true;
    }

    printDoc(docName: string): void {
        this.showPrintDoc = true;
        this.tableDocName = docName;
    }
}