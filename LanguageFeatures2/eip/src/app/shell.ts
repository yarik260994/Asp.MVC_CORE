import { autoinject } from "aurelia-framework";
import { Router, RouterConfiguration, RouteConfig, ConfiguresRouter } from "aurelia-router"

@autoinject
export class ShellRouter implements ConfiguresRouter {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    let serverUrl:string= localStorage.getItem("serverUrl")

    config.map([
      {
        route: "main",
        name: "main",
        moduleId: "./main/main",
        nav: true,
        settings: {
        }
      },
      {
        route: "level-button/:id",
        name: "level-button",
        moduleId: "./level-button/level-button",
        nav: false,
        settings: {
        }
      },
      {
        route: "info-table/:id",
        name: "info-table",
        moduleId: "./info-table/info-table",
        nav: false,
        settings: {
        }
      },
      {
        route: "button-table/:id",
        name: "button-table",
        moduleId: "./button-table/button-table",
        nav: false,
        settings: {
        }
      },
      {
        route: "document-print/:id?",
        name: "document-print",
        moduleId: "./document-print/document-print",
        nav: false,
        settings: {
        }
      },
      {
        route: "start-settings",
        name: "start-settings",
        moduleId: "./start-settings/start-settings",
        nav: false,
        settings: {
        }
      }
    ]);
    if(!serverUrl) config.mapUnknownRoutes({ route: "", redirect: "start-settings" } as RouteConfig);  
    else  config.mapUnknownRoutes({ route: "", redirect: "main" } as RouteConfig);
  }
}