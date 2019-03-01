import { customElement, autoinject, bindingMode } from 'aurelia-framework';
import { bindable } from 'aurelia-templating';  
import { Button } from '../../../../custom_typings/Buttons/Button';

@autoinject
@customElement("level-button-editor")
export class LevelButtonEditor {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) levelButton: Button;
    @bindable onNextLevel: Function;
}   