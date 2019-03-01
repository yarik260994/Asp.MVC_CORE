import { customElement } from 'aurelia-framework';
import { bindable } from 'aurelia-templating';
import { SettingsHelper } from "../settingsHelper";

@customElement("back-panel")
export class BackPanel {
    @bindable settingsHelper: SettingsHelper;
    @bindable text: string;
    @bindable Id: string;
    isChild:boolean;
    routeName:string;
    parentId:string;
    className:string;

    IdChanged():void{
        this.isChild=/_/.test(this.Id);
        this.routeName=this.isChild ? 'level-button' : 'main';
        this.parentId=this.Id.replace(/_[^_]+$/, '');
    }
}