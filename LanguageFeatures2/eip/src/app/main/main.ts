import { autoinject } from "aurelia-framework";
import { SettingsHelper } from "../settingsHelper";
import { NotificationService } from 'aurelia-notify';
import { LayoutVariant } from "../enums/LayoutVariant";
import { LogoPosition } from "../enums/LogoPosition";

@autoinject
export class Main {
    showLoader: boolean = false;
    layoutVariant: LayoutVariant = new LayoutVariant();
    logoPosition: LogoPosition = new LogoPosition();
    
    constructor(private settingsHelper: SettingsHelper, private notificationService: NotificationService) {
    
    }

    async attached() {
        this.showLoader = true;
        this.settingsHelper.init().then(() => {
            this.showLoader = false;
        }).catch((err) => {
            this.showLoader = false;
            this.notificationService.warning(err.message, { timeout: 3000 });
        });
    }
}