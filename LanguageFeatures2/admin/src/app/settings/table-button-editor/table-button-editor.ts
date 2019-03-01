import { TaskQueue, customElement, bindingMode } from 'aurelia-framework';
import { bindable } from 'aurelia-templating';
import { autoinject } from 'aurelia-dependency-injection';
import { DateTimeVariant } from "../../../../custom_typings/Buttons/DateTimeVariant";
import { DateTimeOption } from "../../../../custom_typings/Buttons/DateTimeOption";
import { Button } from '../../../../custom_typings/Buttons/Button';
import { CommonTableImplementation } from './CommonTableImplementation';
import { Grid } from '../grid/grid';
import * as moment from 'moment';
import { TableEditor } from '../TableEditor';


@autoinject
@customElement("table-button-editor")
export class TableButtonEditor extends TableEditor {
  @bindable printFileList: IFileModel[] = [];
  dateTimeTypes: DateTimeOption[] = [
    { name: "", value: null } as DateTimeOption,
    { name: "Время", value: DateTimeVariant.Time } as DateTimeOption,
    { name: "Дата/время", value: DateTimeVariant.DateTime } as DateTimeOption
  ];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) tableButton: Button;
  rowToAdd: string[] = [];
  @bindable ({ defaultBindingMode: bindingMode.twoWay }) editPercentRow: string[] = [];
  grid: Grid;

  constructor(private taskQueue:TaskQueue) {
    super();
  }

  tableButtonChanged() {
    this.taskQueue.queueTask(() => {
      this.tableButton.Table.Common = new CommonTableImplementation(this.tableButton.Table.Common);
      this.changeColumnsCount();
      this.showDocumentForPrint = this.initDocumentToPrint(this.tableButton);
    });  
  }

  onDateTimeColumnChanged(): void {
    let dt: Date;
    this.tableButton.Table.Table.forEach(row => {
      if (this.tableButton.Table.Common.DateTimeColumn == DateTimeVariant.DateTime) {
        dt = row[0] && row[0].length > 0 ? moment(row[0], "HH:mm").toDate() : new Date();
        row[0] = moment(dt).format("DD.MM.YYYY HH:mm");;
      }
      else {
        dt = row[0] && row[0].length > 0 ? moment(row[0], "DD.MM.YYYY HH:mm").toDate() : new Date();
        row[0] = moment(dt).format("HH:mm");
      }
    });
    //никак по-другому мы не смогли заставить показать обновленные данные
    //https://github.com/aurelia/binding/issues/509
    let tmp: string[][] = this.tableButton.Table.Table.slice();
    this.tableButton.Table.Table.splice(0, this.tableButton.Table.Table.length);
    tmp.forEach(row => this.tableButton.Table.Table.push(row.slice()));
  }

  changeColumnsCount(): void {
    this.grid.onCancel();
    this.rowToAdd = [];
    let showPrintFile: boolean = this.tableButton.Table.Common.PrintFileColumn;
    let neededColumnsCount: number = this.getNeededColumnCount();
    this.tableButton.Table.Table.forEach(row => {
      TableEditor.adjustRow(row, showPrintFile, neededColumnsCount);
    });

    TableEditor.adjustRow(this.rowToAdd, showPrintFile, neededColumnsCount);
    TableEditor.adjustRow(this.tableButton.Table.ColumnWidths, showPrintFile, neededColumnsCount);

    this.editPercentRow = this.checkPercent(this.getNeededColumnCount(), this.tableButton);
  }

  private getNeededColumnCount(): number {
    return this.tableButton.Table.Common.ColumnsCount
      + (this.tableButton.Table.Common.DateTimeColumn != null ? 1 : 0)
      + (this.tableButton.Table.Common.PrintFileColumn ? 1 : 0);
  }

  onDateTimeChecked(value: boolean) {
    this.grid.onCancel();
    this.tableButton.Table.Common.DateTimeColumn = value ? DateTimeVariant.Time : null;
    this.tableButton.Table.Table.forEach(row => {
      TableEditor.adjustByDateTime(row, value);
    });

    TableEditor.adjustByDateTime(this.rowToAdd, value);

    TableEditor.adjustByDateTime(this.tableButton.Table.ColumnWidths, value);

    this.editPercentRow = this.checkPercent(this.getNeededColumnCount(), this.tableButton);
  }

  onFileToPrintChecked(value: boolean) {
    this.grid.onCancel();
    this.tableButton.Table.Common.PrintFileColumn = value;
    this.tableButton.Table.Table.forEach(row => {
      TableEditor.adjustByFileToPrint(row, value);
    });
    TableEditor.adjustByFileToPrint(this.rowToAdd, value);

    TableEditor.adjustByFileToPrint(this.tableButton.Table.ColumnWidths, value);
    this.editPercentRow = this.checkPercent(this.getNeededColumnCount(), this.tableButton);
  }

  

  public itemDropped(item: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement): void {
    this.grid.itemDropped(item, target, source, sibling);
  }
}   