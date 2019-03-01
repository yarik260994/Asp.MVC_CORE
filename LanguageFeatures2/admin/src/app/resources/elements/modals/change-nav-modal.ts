import { autoinject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';

@autoinject
export class ChangeNavModal {

  constructor(private dialogController: DialogController) {

  }
  
  async ok(e: MouseEvent) {
    this.dialogController.close(true);
  }
}
