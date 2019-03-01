import { customElement } from 'aurelia-framework';
import { bindable } from 'aurelia-templating';
import { Button } from "../../../custom_typings/Buttons/Button";
import { SettingsHelper } from "../settingsHelper";
import { LayoutVariant } from "../enums/LayoutVariant";
import { autoinject } from 'aurelia-dependency-injection';

@autoinject
@customElement("buttons-list")
export class ButtonsList {
    @bindable settingsHelper: SettingsHelper;
    @bindable button: Button;
    layoutVariant: LayoutVariant = new LayoutVariant();
}