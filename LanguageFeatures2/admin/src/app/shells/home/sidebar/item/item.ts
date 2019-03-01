import { Router } from 'aurelia-router';
import { bindable } from 'aurelia-templating';
import { customElement, autoinject } from 'aurelia-framework';

@autoinject
@customElement("user-item")
export class UserItem {
    @bindable data: IUser = undefined;
    @bindable isLoading: boolean = false;
    @bindable delete: any;

    constructor(private router: Router) {
    }

    showUserInfo(e: CustomEvent) {
        // производим переход на другой url с параметром (как в конфигурации child-роутера)
        this.router.navigateToRoute("user", { id: this.data.Id });
    }
}   