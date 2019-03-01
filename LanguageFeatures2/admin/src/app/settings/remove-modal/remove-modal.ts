import { DialogController } from "aurelia-dialog";
import { autoinject } from 'aurelia-dependency-injection';

@autoinject
export class RemoveModal {
  isLoading: boolean = false;

  constructor(private dialogController: DialogController) {

  }

  async ok(e: MouseEvent) {
    this.dialogController.close(true);
  }
}
