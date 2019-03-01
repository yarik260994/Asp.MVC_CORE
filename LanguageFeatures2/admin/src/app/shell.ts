import {Aurelia, autoinject } from "aurelia-framework";
import { RouterConfiguration, NavigationInstruction, Next, Router, RouteConfig, ConfiguresRouter, Redirect } from "aurelia-router"
import { AuthorizationHelper } from "./AuthorizationHelper";

@autoinject
export class ShellRouter implements ConfiguresRouter {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.addAuthorizeStep(AuthorizeRouterStep);
    // конфигурируем главный роутер приложения
    config.map([
      {
        route: "layout",
        name: "layout",
        moduleId: "./layout/layout",
        nav: true,
        settings: {
          icon: "account",
          position: "bottom",
          title: "Вариант верстки"
        },
      },
      {
        route: "settings",
        name: "settings",
        moduleId: "./settings/settings",
        nav: true,
        settings: {
          icon: "account",
          position: "bottom",
          title: "Настройка"
        },  
      },
      {
        route: "storage",
        name: "storage",
        moduleId: "./storage/storage",
        nav: true,
        settings: {
          icon: "account",
          position: "bottom",
          title: "Хранилище"
        },
      }
    ]);

    config.mapUnknownRoutes({ route: "", redirect: "layout" } as RouteConfig);
 
  }
}

@autoinject
export class AuthorizeRouterStep {

  constructor(private aurelia: Aurelia) {
  }

  run(instruction: NavigationInstruction, next: Next): Promise<any> {    
    if (!AuthorizationHelper.isAuthorized()) {
      this.aurelia.setRoot('app/login/login');
      return next.cancel(new Redirect("/", { replace: true }));
    }

    return next();
  }
}