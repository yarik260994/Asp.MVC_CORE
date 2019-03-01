import { autoinject } from 'aurelia-dependency-injection';
import { HttpClient } from 'aurelia-http-client';
import { DialogService } from 'aurelia-dialog';
import { AddFileModal } from './modals/add-file-modal';
import { NotificationService } from 'aurelia-notify';

@autoinject
export class Storage {
    downloadedFiles: IFileModel[] = [];
    showStorage: boolean= true;
    showLoader: boolean = false;

    constructor(private http: HttpClient, private dialogService: DialogService,private notificationService:NotificationService) {

    }

    addNewFile() {
        this.dialogService.open({ viewModel: AddFileModal, model: {} })
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    this.updateForm();
                }  
            });
    }

    attached() {
        this.updateForm();
    }

    updateForm() {
        this.showLoader = true;
        this.http
            .createRequest(`/api/storage/getfilelist`)
            .asPost()
            .send()
            .then(data => {
                this.showLoader = false;
                this.downloadedFiles = data.content;
            }).catch(() => { this.showLoader = false;this.showStorage = false; this.notificationService.warning("Ошибка при загрузке списка файлов", { timeout: 3000 }); });
    }
}
