import { DialogController } from "aurelia-dialog";
import { autoinject } from 'aurelia-dependency-injection';
import { HttpClient } from 'aurelia-http-client';
import { NotificationService } from 'aurelia-notify';

@autoinject
export class AddFileModal {
  file: File = null;
  showLoader: boolean = false;

  constructor(private dialogController: DialogController, private http: HttpClient, private notificationService: NotificationService) {

  }

  async ok(e: MouseEvent) {
    var form = new FormData()
    form.append('file', this.file[0])
    this.showLoader = true;

    this.http
      .post(`/api/storage/upload`, form)
      .then(response => {
        this.dialogController.close(true);
        this.showLoader = false;
        this.notificationService.success("Файл загружен", { timeout: 3000 });
      })
      .catch(error => {
        console.log(error);
        this.notificationService.warning("Ошибка при загрузке файла", { timeout: 3000 });
      });
  }
}
