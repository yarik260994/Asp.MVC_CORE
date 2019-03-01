import { DialogController } from "aurelia-dialog";
import { autoinject } from 'aurelia-dependency-injection';
import { LayoutOption } from "../layout";

@autoinject
export class ResetModal {
  layoutOptions: LayoutOption;
  constructor(private dialogController: DialogController ) {

  }

  activate(layoutOptions: LayoutOption) {
    this.layoutOptions = layoutOptions;
  }

  async ok(e: MouseEvent) {
    this.layoutOptions.getLayoutSettings();
    this.dialogController.close(true);
  }
}
