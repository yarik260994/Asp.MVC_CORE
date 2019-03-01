import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { NotificationService } from 'aurelia-notify';
import { Button } from '../../../custom_typings/Buttons/Button';
import { ButtonsList } from './buttons-list/buttons-list';
import { TableButtonEditor } from './table-button-editor/table-button-editor';
import { InfoTableButtonEditor } from './info-table-button-editor/info-table-button-editor';
import { ChangeNavModal } from '../resources/elements/modals/change-nav-modal';
import { DialogService } from 'aurelia-dialog';

@autoinject    
export class Settings {
    public currentButton: Button;
    printFileList: IFileModel[] = [];
    buttonsList: ButtonsList;
    public level: number = 1;
    tableButtonEditor: TableButtonEditor;
    infoTableButtonEditor: InfoTableButtonEditor
   

    constructor(private http: HttpClient,private notificationService: NotificationService, private dialogService: DialogService) { 
    }

    attached() {
       this.getAllPrintFiles();   
   }


    getAllPrintFiles(): void {
        this.http
            .createRequest(`/api/storage/get-print-file`)
            .asPost()
            .send()
            .then(data => {
                this.printFileList = data.content;
            })
            .catch(() => {
                this.notificationService.warning("Ошибка при взятии списка файлов для печати", { timeout: 3000 });
            });
    }  

    onNextLevel(): void {
        this.buttonsList.onNextLevel();
    } 

    itemDropped(item: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement): void {
        if (source.dataset["type"] == "ButtonsList") {
            this.buttonsList.itemDropped(item, target, source, sibling);
        }

        if (source.dataset["type"] == "TableButtonEditor") {
            if (this.currentButton.Table.Common) {
                this.tableButtonEditor.itemDropped(item, target, source, sibling);
            } else {
                this.infoTableButtonEditor.itemDropped(item, target, source, sibling);
            }
        }
    } 

    canDeactivate() {

        return new Promise((resolve, reject) => {
            let mainButtons=JSON.stringify(this.buttonsList.mainButtons);
            if (this.buttonsList.jsonButtons !== mainButtons  ) {
                this.dialogService.open({ viewModel: ChangeNavModal, model: {} })
                    .whenClosed(response => {
                        if (response.wasCancelled) {
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
            }
            else resolve(true);
        });
    }

    static readonly levelNames: string[] =
        [, 'Второй', 'Третий', 'Четвертый', 'Пятый', 'Шестой', 'Седьмой', 'Восьмой', 'Девятый', 'Десятый'];
    getLevelName(idx: number): string {
        return (idx < 2) ? "Главный экран"
            : ((idx <= Settings.levelNames.length ? Settings.levelNames[idx - 1] : idx + '-й') + ' уровень');
    } 
}