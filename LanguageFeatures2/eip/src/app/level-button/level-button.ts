﻿import { autoinject } from "aurelia-framework";
import { Button } from "../../../custom_typings/Buttons/Button";
import { SettingsHelper } from "../settingsHelper";

@autoinject
export class LevelButton {
    button: Button;
    constructor(private settingsHelper: SettingsHelper) {
    }

    activate(params: any, routeConfig: any, navigationInstruction: any) {
        this.button = this.settingsHelper.getButton(params.id);
    }
}