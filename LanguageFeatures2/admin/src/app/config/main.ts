import { DialogConfiguration } from "aurelia-dialog";
import environment from "./environment";
import { Aurelia } from "aurelia-framework";
import { HttpClient } from 'aurelia-http-client';
import { AureliaConfiguration } from 'aurelia-configuration';
import { AuAuthInterceptor } from '../AuAuthInterceptor';


export function configure(aurelia: Aurelia) {
    // конфигурируем приложение, подключаем используемые плагины
    aurelia.use
        .standardConfiguration()

        .feature("app/resources")
        .plugin("aurelia-dialog", (config: DialogConfiguration) => {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.startingZIndex = 1000;
        })
        .plugin("aurelia-configuration", (config: AureliaConfiguration) => {
            config.setDirectory("");
            config.setConfig("application.json");
        })
        .plugin('aurelia-validation')
        .plugin('aurelia-notify')
        .plugin('aurelia-dragula')
        .plugin('aurelia-flatpickr');
    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    aurelia.start()
        .then(() => {
            configureInternal(aurelia);
            aurelia.setRoot("app/shell");
        });
}

function configureInternal(aurelia: Aurelia) {
    const container = aurelia.container;
    const httpClient: HttpClient = container.get(HttpClient);
    const aureliaConfiguration: AureliaConfiguration = container.get(AureliaConfiguration);

    httpClient.configure(x => {
        let port = aureliaConfiguration.get("api.port");
        let host = aureliaConfiguration.get("api.host");
        x.withBaseUrl('http://' + host + ':' + port);
        x.withInterceptor(container.get(AuAuthInterceptor))
    });
}
