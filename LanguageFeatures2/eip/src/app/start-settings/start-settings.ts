import { autoinject} from "aurelia-framework";
import { Router } from "aurelia-router";
import { HttpClient } from "aurelia-http-client";
import { NotificationService } from 'aurelia-notify';

@autoinject
export class StartSettings {
    serverUrl:string;
    constructor(private router: Router, private notificationService: NotificationService,private httpClient:HttpClient){

    }

    saveUrl(){
        this.httpClient
        .createRequest(`${this.serverUrl}/api/storage/getfilelist`)
        .asPost()
        .send()
        .then(data => {
            localStorage.setItem("serverUrl",this.serverUrl);
            this.router.navigateToRoute("main");
            this.httpClient.configure(x => {
                x.withBaseUrl(this.serverUrl);
            });
        }).catch(() => { this.notificationService.danger("Введен неправильный URL", { timeout: 4000 }); }); 
    }
}