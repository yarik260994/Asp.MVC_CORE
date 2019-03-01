import "XRXWebservices";
import { FrameworkConfiguration } from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
    config.globalResources([
        //custom-attributes
        "./custom-attributes/height-100-relative.eip",
        "./elements/loader/loader",
        //value-converters
        "./value-converters/debug",        
    ]);
}
