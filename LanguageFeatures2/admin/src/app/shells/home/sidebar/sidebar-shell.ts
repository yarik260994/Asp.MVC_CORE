import { autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { AddUserModal } from './modals/add-user-modal';
import { activationStrategy } from 'aurelia-router';

@autoinject
export class SidebarShell {
    users: IUser[] = [];
    constructor(private dialogService: DialogService) {
    }

    determineActivationStrategy() {
        return activationStrategy.invokeLifecycle;
    }

    attached() {
        this.reload();
    }

    async reload(): Promise<any> {
        this.users = [];
        for (let i = 0; i < 10; i++) {
            this.users.push({
                Id: i,
                Name: `User ${i}`,
                Created: new Date().toLocaleString()
            })
        }
    }

    add() {
        // пример использования модального окна
        this.dialogService.open({ viewModel: AddUserModal, model: {} })
        .whenClosed(response => {
            if (!response.wasCancelled) {
                this.users.push(<IUser>{ Id: this.users.length, Name: response.output.Name, Created: new Date().toLocaleString() })
            }
        });
    }

    delete(user: IUser, e: CustomEvent) {
        if (this.users.length == 1) return;
        var i = this.users.findIndex(u => u.Id == user.Id);
        this.users.splice(i, 1);
    }

}