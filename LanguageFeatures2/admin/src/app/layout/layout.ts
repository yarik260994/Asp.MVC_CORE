import { autoinject } from 'aurelia-dependency-injection';
import { HttpClient } from 'aurelia-http-client';
import { DialogService } from 'aurelia-dialog';
import { ResetModal } from './modals/reset-modal';
import { NotificationService } from 'aurelia-notify';
import { ChangeNavModal } from '../resources/elements/modals/change-nav-modal';
import { TaskQueue } from 'aurelia-framework';


@autoinject
export class LayoutOption {
    fourSections: boolean = true;
    threeSections: boolean;
    layoutSettings: LayoutSettings;
    imgList: IFileModel[] = [];
    showLayout: boolean = true;
    showLoader: boolean = false;
    jsonlayoutSettings:string="";

    constructor(private http: HttpClient, private notificationService: NotificationService, private dialogService: DialogService,private taskQueue:TaskQueue) {

    }

    onSaveClick(): void {
        this.showLoader = true;
        this.http
            .createRequest(`/api/layout-kiosk/save-layout`)
            .asPost()
            .withContent(this.layoutSettings)
            .send()
            .then(() => { this.notificationService.success("Данные сохранены", { timeout: 3000 }); this.showLoader = false;  this.jsonlayoutSettings=JSON.stringify(this.layoutSettings); })
            .catch(() => { this.notificationService.warning("Ошибка при сохранении данных", { timeout: 3000 }); this.showLoader = false; });
    }

    attached() {
        this.getLayoutSettings();
        this.getAllImg();
    }

    public getLayoutSettings(): void {
        this.showLoader = true;
        this.http
            .createRequest(`/api/layout-kiosk/get-layout`)
            .asPost()
            .send()
            .then(data => {
                this.layoutSettings = data.content;
                this.taskQueue.queueTask(() => {
                    this.jsonlayoutSettings=JSON.stringify(this.layoutSettings);
                });  
                this.showLoader = false;
            }).catch(() => {
                this.showLoader = false;
                this.showLayout = false;
                this.notificationService.warning("Ошибка при взятии данных", {
                    timeout: 3000
                });
            });
    }


    onResetClick() {
        this.dialogService.open({ viewModel: ResetModal, model: this })
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    this.http
                        .createRequest(`/api/layout-kiosk/set-default-settings`)
                        .asPost()
                        .send()
                        .then(data => {
                            this.layoutSettings = data.content;
                            this.showLoader = false;
                            this.taskQueue.queueTask(() => {
                                this.jsonlayoutSettings=JSON.stringify(this.layoutSettings);
                            });  
                            this.notificationService.success("сброс настроек прошел успешно", {
                                timeout: 3000
                            });
                        }).catch(() => {
                            this.showLoader = false;
                            this.showLayout = false;
                            this.notificationService.warning("Ошибка при сбросе настроек", {
                                timeout: 3000
                            });
                        });
                }
            });
    }

    getAllImg(): void {
        this.http
            .createRequest(`/api/storage/get-img`)
            .asPost()
            .send()
            .then(data => {
                this.imgList = data.content;
            });
    }

    canDeactivate() {

        return new Promise((resolve, reject) => {
            let layoutSettings=JSON.stringify(this.layoutSettings)/*.replace(/"/g,"")*/;
            if (this.jsonlayoutSettings !== layoutSettings) {
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
}

