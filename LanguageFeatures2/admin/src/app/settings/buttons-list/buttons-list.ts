import { customElement, autoinject, bindingMode, TaskQueue } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { AddCustomButton } from '../add-custom-button/add-custom-button';
import { RemoveModal } from '../remove-modal/remove-modal';
import { HttpClient } from 'aurelia-http-client';
import { NotificationService } from 'aurelia-notify';
import { bindable } from 'aurelia-templating';
import { Button } from '../../../../custom_typings/Buttons/Button';

@autoinject
@customElement("buttons-list")
export class ButtonsList {
    mainButtons: Button[] = [];
    @bindable({ defaultBindingMode: bindingMode.twoWay }) level: number = 1;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) selectedButton: Button;
    showLoader: boolean = false;
    private _currentLevelButtons: Button[] = this.mainButtons;
    private _prevLevels: Button[][] = [];
    @bindable printFileList: IFileModel[] = [];
    jsonButtons: string = "";
      

    get currentLevelButtons(): Button[] {
        return this._currentLevelButtons;
    }
    set currentLevelButtons(value: Button[]) {
        this._currentLevelButtons = value;
        this.level = this._prevLevels.length + 1;
    }

    constructor(private http: HttpClient, private notificationService: NotificationService, private dialogService: DialogService,private taskQueue:TaskQueue) {
    }

    selectButton(button: Button) {
        this.selectedButton = button;
    }

    remove(): void {
        this.dialogService.open({ viewModel: RemoveModal, model: {} })
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    var index = this.currentLevelButtons.indexOf(this.selectedButton, 0);
                    if (index > -1) {
                        this.selectedButton = null;
                        this.currentLevelButtons.splice(index, 1);
                    }
                }
            });
    }

    attached() {
        this.getButtons();
    }

    async getButtons(): Promise<any> {
        this.showLoader = true;
        this.http
            .createRequest(`/api/settings-kiosk/get-buttons`)
            .asPost()
            .send()
            .then(data => {
                this.showLoader = false;
                this.mainButtons = data.content;
                this.taskQueue.queueTask(() => { 
                    this.jsonButtons=JSON.stringify(this.mainButtons);  
                }); 
                this.currentLevelButtons = this.mainButtons;
            }).catch(() => { this.notificationService.warning("Ошибка при чтении данных", { timeout: 3000 }); this.showLoader = false; });
    }

    public itemDropped(item: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement): void {
        let buttonIndex: number = Number(item.dataset["index"]);
        let siblingIndex: number = sibling ? Number(sibling.dataset["index"]) : -1;
        let button: Button = this.currentLevelButtons.splice(buttonIndex, 1)[0];

        if (sibling) {
            this.currentLevelButtons.splice((buttonIndex < siblingIndex) ? siblingIndex - 1 : siblingIndex, 0, button);
        } else {
            this.currentLevelButtons.push(button);
        }
    }

    onBtnSaveClick(): void {
        this.showLoader = true;
        this.http
            .createRequest(`/api/settings-kiosk/save-buttons`)
            .asPost()
            .withContent(this.mainButtons)
            .send()
            .then(() => { this.notificationService.success("Данные сохранены", { timeout: 3000 }); this.showLoader = false; this.jsonButtons=JSON.stringify(this.mainButtons);  })
            .catch(() => { this.notificationService.warning("Ошибка при сохранении данных", { timeout: 3000 }); this.showLoader = false; });
    }

    add() {
        this.dialogService.open({ viewModel: AddCustomButton })
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    let button: Button = response.output as Button;
                    if (button.Print && this.printFileList.length > 0) {
                        button.Print.Document = this.printFileList[0].FileName;
                    }
                    this.currentLevelButtons.push(button);
                    this.selectButton(button)
                }
            });
    }

    public onNextLevel(): void {
        if (this.selectedButton && this.selectedButton.Level) {
            this._prevLevels.push(this.currentLevelButtons);
            this.currentLevelButtons = this.selectedButton.Level.Buttons;
            this.selectedButton = null;
        }
    }

    onPrevLevel(): void {
        this.currentLevelButtons = this._prevLevels.pop();
        this.selectedButton = null;
    }
}   