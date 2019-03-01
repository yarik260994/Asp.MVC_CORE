import { Router, RouterConfiguration, ConfiguresRouter } from "aurelia-router"
import { autoinject } from "aurelia-framework";
import { containerless } from "aurelia-templating";
import { AuthorizationHelper } from "../../AuthorizationHelper";

@autoinject
@containerless    
export class CompaniesRouter implements ConfiguresRouter {
    router: Router;
    isAuthorized: boolean = false;

    constructor() {
      this.isAuthorized=AuthorizationHelper.isAuthorized();
    }
    configureRouter(config: RouterConfiguration, router: Router) {
        this.router = router;
          // конфигурируем child-роутер приложения
        config.map([
            {
                route: "",
                name: "empty",
                viewPorts: {
                    sidebar: { moduleId: "./sidebar/sidebar-shell" },
                    shell: { moduleId: null}
                },
                nav: false
            },
            {
                route: "user/:id",
                name: "user",
                viewPorts: {
                    sidebar: { moduleId: "./sidebar/sidebar-shell" },
                    shell: { moduleId: "./users/users-shell" }
                },
                nav: false
            }
           
        ]);
  
        config.mapUnknownRoutes({ route: "", redirect: "" });
    }
}