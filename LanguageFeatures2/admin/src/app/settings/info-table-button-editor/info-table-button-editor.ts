import {TaskQueue, customElement,bindingMode } from 'aurelia-framework';
import { autoinject } from 'aurelia-dependency-injection';
import { bindable } from 'aurelia-templating';
import { Button } from '../../../../custom_typings/Buttons/Button';
import { Grid } from '../grid/grid';
import { TableEditor } from '../TableEditor';
import { HttpClient } from 'aurelia-http-client';
import { AureliaConfiguration } from 'aurelia-configuration';


@autoinject
@customElement("info-table-button-editor")
export class InfoTableButtonEditor extends TableEditor {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) tableButton: Button;
    @bindable printFileList: IFileModel[] = [];
    grid: Grid;
    @bindable ({ defaultBindingMode: bindingMode.twoWay }) editPercentRow: string[] = [];
    rowToAdd: string[] = [];
    imageList: IFileModel[];
    urlForImg: string;

    
    constructor(private taskQueue:TaskQueue,private http: HttpClient,private configure: AureliaConfiguration) {
        super();
    }

    tableButtonChanged() {
        this.taskQueue.queueTask(() => {
            this.rowToAdd=[];
            this.getAllImg();
            this.getUrlForImg();
            TableEditor.adjustRow(this.tableButton.Table.ColumnWidths, false, this.getNeededColumnCount());
            TableEditor.adjustRow(this.rowToAdd, false, this.getNeededColumnCount());
            this.editPercentRow = this.checkPercent(this.getNeededColumnCount(), this.tableButton);
            this.showDocumentForPrint = this.initDocumentToPrint(this.tableButton);
        });
    }

    private getNeededColumnCount(): number {
        return 2
          + (this.tableButton.Table.Info.ImageNumberColumn ? 1 : 0);
      }
   
    getAllImg(): void {
        this.http
            .createRequest(`/api/storage/get-img`)
            .asPost()
            .send()
            .then(data => {
                this.imageList = data.content;
            });
    }

    getUrlForImg() { 
        var port = this.configure.get("api.port");
        var host = this.configure.get("api.host");
        this.urlForImg = `http://${host}:${port}/api/storage/get-picture`;
    }

    onShowNumberChecked(value: boolean) {
        this.rowToAdd=[];
        this.grid.onCancel();
        this.tableButton.Table.Table.forEach(row => {
          TableEditor.adjustByDateTime(row, value);
        });
    
        TableEditor.adjustByDateTime(this.rowToAdd, value);
        TableEditor.adjustByDateTime(this.tableButton.Table.ColumnWidths, value);

        if (this.tableButton.Table.Info && value) {
                     for (let index = 0; index < this.tableButton.Table.Table.length; index++) {
                         this.tableButton.Table.Table[index][0] =(index + 1).toString();
                     }
                 }
        this.editPercentRow = this.checkPercent(this.getNeededColumnCount(), this.tableButton);
      }

    public itemDropped(item: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement): void {
        this.grid.itemDropped(item, target, source, sibling);
      }
    
}