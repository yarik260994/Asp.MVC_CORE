import { customElement, autoinject, bindingMode } from 'aurelia-framework';
import { bindable } from 'aurelia-templating';  
import { Button } from '../../../../custom_typings/Buttons/Button';

@autoinject
@customElement("print-button-editor")
export class PrintButtonEditor {
    @bindable printFileList: IFileModel[] = []; 
    @bindable({ defaultBindingMode: bindingMode.twoWay }) printButton: Button;
}   