import { customElement } from 'aurelia-framework';
import { autoinject } from 'aurelia-dependency-injection';
import { bindable } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';
import { Button } from '../../../../custom_typings/Buttons/Button';
import * as moment from 'moment';
import { DateTimeVariant } from '../../../../custom_typings/Buttons/DateTimeVariant';
import { NotificationService } from 'aurelia-notify';

@autoinject
@customElement("grid")
export class Grid {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) tableButton: Button;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) rowToAdd: string[];
    selectedRow: string[] = null;
    editableRow: string[] = null;
    @bindable printFileList: IFileModel[] = [];
    @bindable imageList: IFileModel[] = [];
    @bindable ({ defaultBindingMode: bindingMode.twoWay }) editPercentRow: string[] = [];
    editableDetaTime: Date;
    addDetaTime: Date;
    @bindable dateTimeColumn: DateTimeVariant;
    @bindable printFileColumn: boolean;
    @bindable columnsCount: number;
    @bindable urlForImg: string;
    @bindable showImgNumber: boolean;

    esc(uriComponent: string): string {
        return encodeURIComponent(uriComponent);
    }

    constructor(private notificationService: NotificationService) {
        
    }

    public itemDropped(item: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement): void {
        let rowIndex: number = Number(item.dataset["index"]);
        let siblingIndex: number = sibling ? Number(sibling.dataset["index"]) : -1;
        let row: string[] = this.tableButton.Table.Table.splice(rowIndex, 1)[0];

        if (sibling) {
            this.tableButton.Table.Table.splice((rowIndex < siblingIndex) ? siblingIndex - 1 : siblingIndex, 0, row);
        } else {
            this.tableButton.Table.Table.push(row);
        }

        if (this.tableButton.Table.Info && this.showImgNumber) {
            for (let index = 0; index < this.tableButton.Table.Table.length; index++) {
                this.tableButton.Table.Table[index][0] =(index + 1).toString();
            }
            this.refresh();
        }
    }

    addRow(): void {
        if (this.dateTimeColumn == DateTimeVariant.DateTime) {
            this.rowToAdd[0] = moment(this.addDetaTime).format("DD.MM.YYYY HH:mm");
        }
        if (this.dateTimeColumn == DateTimeVariant.Time) {
            this.rowToAdd[0] = moment(this.addDetaTime).format("HH:mm");
        }

        if (this.tableButton.Table.Info && this.showImgNumber) {

            this.rowToAdd[0] = (this.tableButton.Table.Table.length + 1).toString();
        }

        for (let index = 0; index <  this.rowToAdd.length; index++) {
            this.rowToAdd[index]=this.rowToAdd[index].replace(/\n/g,"<br />");
        }

        this.tableButton.Table.Table.push(this.rowToAdd.slice());
    }

    onEditClick(index: number): void {
        if (this.dateTimeColumn == DateTimeVariant.DateTime) {
            this.editableDetaTime = this.tableButton.Table.Table[index][0] != "" ? moment(this.tableButton.Table.Table[index][0], "DD.MM.YYYY HH:mm").toDate() : new Date();
        }
        if (this.dateTimeColumn == DateTimeVariant.Time) {
            this.editableDetaTime = this.tableButton.Table.Table[index][0] != "" ? moment(this.tableButton.Table.Table[index][0], "HH:mm").toDate() : new Date();
        }
        for (let i = 0; i <  this.tableButton.Table.Table[index].length; i++) {
            this.tableButton.Table.Table[index][i]=this.tableButton.Table.Table[index][i].replace(/<br \/>/g,"\n");
        }
        this.editableRow = this.tableButton.Table.Table[index].slice();
        this.selectedRow = this.tableButton.Table.Table[index];
    }

    public onOkClick(index: number) {
        if (this.dateTimeColumn == DateTimeVariant.DateTime) {
            this.editableRow[0] = moment(this.editableDetaTime).format("DD.MM.YYYY HH:mm");
        }
        if (this.dateTimeColumn == DateTimeVariant.Time) {
            this.editableRow[0] = moment(this.editableDetaTime).format("HH:mm");
        }

        for (let i = 0; i <  this.editableRow.length; i++) {
            this.editableRow[i]=this.editableRow[i].replace(/\n/g,"<br />");
        }

        this.tableButton.Table.Table[index] = this.editableRow.slice();
        this.refresh();
    }

   public refresh() { 
        //никак по-другому мы не смогли заставить показать обновленные данные
        //https://github.com/aurelia/binding/issues/509
        let tmp: string[][] = this.tableButton.Table.Table.slice();
        this.tableButton.Table.Table.splice(0, this.tableButton.Table.Table.length);
        tmp.forEach(row => this.tableButton.Table.Table.push(row.slice()));
        this.selectedRow = null;
    }

    onCancel(): void {
        this.selectedRow = null;
    }

    onDeleteClick(index: number) {
        this.tableButton.Table.Table.splice(index, 1);
    }

    saveClick(): void {

        if (Grid.checkPercent(this.editPercentRow)) {
            this.tableButton.Table.ColumnWidths = this.editPercentRow.slice();
            this.notificationService.success("Ширина колонок применена. Сохраните изменения дискеткой слева.", { timeout: 6000 });
        } else {
            this.notificationService.warning("Все ячейки должны содержать положительные числа и их сумма должна быть равна 100", { timeout: 3000 });
        }
    }

    static checkPercent(editPercentRow: string[]): boolean {
        let sum: number = 0;
        let isNumber: boolean = true;

        editPercentRow.forEach(element => {
            if (isNaN(Number(element)) || Number(element) < 1) {
                isNumber = false;
                return
            };
            sum = sum + parseInt(element);
        });

        if (sum != 100) {
            return false;
        }
        return isNumber;
    }
}