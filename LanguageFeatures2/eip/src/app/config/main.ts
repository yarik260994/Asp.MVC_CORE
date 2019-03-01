import { Aurelia } from "aurelia-framework"
import environment from "./environment";
import { AureliaConfiguration } from "aurelia-configuration";
import { DialogConfiguration } from "aurelia-dialog";
import { ServicesConfiguration } from "../resources/xrx-services/configuration";
import { HttpClient } from "aurelia-http-client";

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .feature("app/resources")
        .plugin("aurelia-configuration", (config: AureliaConfiguration) => {
            config.setDirectory("");
            config.setConfig("application.json");
        })
        .plugin("aurelia-dialog", (config: DialogConfiguration) => {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.startingZIndex = 1000;
        })
        .plugin('aurelia-notify');

    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    aurelia.start()
        .then(() => {
            //получаем инстанс конфигурации Xrx
            var config: ServicesConfiguration = aurelia.container.get(ServicesConfiguration);
            config.host = "http://127.0.0.1"; //боевой хост
            //config.host = "http://13.213.28.193"; //тестовый хост для взаимодействия
            configureInternal(aurelia);
            aurelia.setRoot("app/shell");
        });
}
function configureInternal(aurelia: Aurelia) {
    const container = aurelia.container;
    const httpClient: HttpClient = container.get(HttpClient);

    httpClient.configure(x => {
        x.withBaseUrl("");
    });
}