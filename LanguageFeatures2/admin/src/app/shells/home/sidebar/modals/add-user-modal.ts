import { DialogController } from "aurelia-dialog";
import { autoinject } from 'aurelia-dependency-injection';

@autoinject
export class AddUserModal {
  data: IUser;
  isLoading: boolean = false;

  constructor(private dialogController: DialogController) {

  }

  activate() {
  }


  async ok(e: MouseEvent) {
    this.dialogController.close(true, this.data);
  }
}
