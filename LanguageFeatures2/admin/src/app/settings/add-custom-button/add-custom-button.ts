import { DialogController } from "aurelia-dialog";
import { autoinject } from 'aurelia-dependency-injection';
import { Button } from "../../../../custom_typings/Buttons/Button";

@autoinject
export class AddCustomButton {
  buttonTypes: ButtonType[] = [];

  selectedButtonType: ButtonType = this.buttonTypes[0];
  constructor(private dialogController: DialogController) {

  }


  activate() {
    this.buttonTypes = [
      { id: 0, name: 'Таблица' } as ButtonType,
      { id: 1, name: 'Инфо-таблица' } as ButtonType,
      { id: 2, name: 'Печать' } as ButtonType,
      { id: 3, name: 'Уровень N' } as ButtonType
    ];
  }

  async ok(e: MouseEvent) {
    var button: Button;

    switch (this.selectedButtonType.id) {
        case 0: {
        button = { Text: "Таблица", Table: { ColumnWidths: [], Info: null, Common: { ColumnsCount: 0, PrintFileColumn: false }, Table: [] }, Level: null, Print: null } as Button;
        break;
      }
      case 1: {
        button = { Text: "Инфо-таблица", Table: {ColumnWidths: [],Common:null,Table:[], Info: {ImageNumberColumn: false } }, Level: null, Print: null } as Button;
        break;
      }
      case 2: {
        button = { Text: "Печать", Print: {}, Level: null, Table: null } as Button;
        break;
      }
      case 3: {
        button = { Text: "Уровень N", Level: { Buttons: []}, Print: null, Table: null } as Button;
        break;
      }

    }
    this.dialogController.close(true, button);
  }
}
