import { FrameworkConfiguration } from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
    config.globalResources([
        "./elements/loader/loader",
        "./elements/color-selector/color-selector"
    ])
}
