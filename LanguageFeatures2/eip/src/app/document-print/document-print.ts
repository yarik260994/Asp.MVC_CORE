import { customElement, autoinject, bindingMode } from 'aurelia-framework';
import { bindable } from 'aurelia-templating';
import { SettingsHelper } from '../settingsHelper';
import { Button } from '../../../custom_typings/Buttons/Button';
import { Router } from 'aurelia-router';
import { HttpClient } from 'aurelia-http-client';
import { NotificationService } from 'aurelia-notify';

@autoinject
@customElement("document-print")
export class DocumentPrint {
    settingsHelper: SettingsHelper;
    @bindable documentFromTable: string;
    @bindable button: Button;
    showPrintDoc: boolean = false;
    message:string="";
    @bindable({ defaultBindingMode: bindingMode.twoWay }) showPrintControl: boolean;

    constructor(private http: HttpClient, private notificationService: NotificationService, settingsHelper: SettingsHelper, private router: Router) {
        this.settingsHelper = settingsHelper;
    }

    activate(params: any, routeConfig: any, navigationInstruction: any) {
        this.button = this.settingsHelper.getButton(params.id);
    }

    attached() {
        this.printDoc();
    }

    printDoc(): void {
        let buttonMessage = "";
        let buttonDoc = "";

        if (this.button.Table) {
            this.button.Table.Message ? buttonMessage = this.button.Table.Message : "";
            this.documentFromTable ? buttonDoc = this.documentFromTable : this.button.Table.PrintDocument ? buttonDoc = this.button.Table.PrintDocument : "";
        }
        if (this.button.Print) {
            this.button.Print.Message ? buttonMessage = this.button.Print.Message : "";
            this.button.Print.Document ? buttonDoc = this.button.Print.Document : "";
        }

        this.message = buttonMessage.replace(/<-doc->/g, buttonDoc).replace(/<-br->/g, "<br>");

        this.showPrintDoc = true;
        this.http
            .createRequest(`/api/print-kiosk/print-document`)
            .asPost()
            .withContent({ documentPath: `${this.settingsHelper.imgUrl}/?filename=${encodeURIComponent(buttonDoc)}` })
            .send()
            .then(() => { this.redirect(); })
            .catch(() => { this.notificationService.warning("Ошибка при печати", { timeout: 3000 }); this.redirect(); });
    }

    private redirect(): void {
        this.showPrintControl = false;
        
        if (this.button.Print) {
            if (/_/.test(this.button.Id)) {
                this.router.navigateToRoute("level-button", { id: this.button.Id.replace(/_[^_]+$/, '') });
            }
            else {
                this.router.navigateToRoute("main");
            }
        }
    }
}