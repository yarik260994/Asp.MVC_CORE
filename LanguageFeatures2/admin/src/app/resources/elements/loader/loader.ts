import { customElement, autoinject } from 'aurelia-framework';

@autoinject
@customElement("loader")
export class loader {
    numberOfCircles: number = 12;
}