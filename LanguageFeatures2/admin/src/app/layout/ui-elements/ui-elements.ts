import { bindable } from 'aurelia-templating';
import { customElement, autoinject, bindingMode } from 'aurelia-framework';

@autoinject
@customElement("ui-elements")
export class UIElements {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) style: StyleSettings;
    @bindable title: string;
    @bindable showBackgroundSelector: boolean = true;

    onBoldClick():void { 
        if (this.style.fontWeight === "bold") this.style.fontWeight = "normal";
        else this.style.fontWeight = "bold";
    }

    onItalicClick(): void { 
        if (this.style.fontStyle === "italic") this.style.fontStyle = "normal";
        else this.style.fontStyle = "italic";
    }

    onUnderlineClick(): void { 
        if (this.style.textDecoration === "underline") this.style.textDecoration = "none";
        else this.style.textDecoration = "underline";
    }
}   