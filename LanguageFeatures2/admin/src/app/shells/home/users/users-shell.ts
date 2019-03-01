import { HttpClient, HttpResponseMessage } from 'aurelia-http-client';
import { autoinject } from 'aurelia-dependency-injection';

@autoinject
export class UsersShell {

    userId: any;

    constructor(
        private http: HttpClient) {
    }

    activate(params: any, routeConfig: any, navigationInstruction: any) {
        // Получение параметра роутера
        this.userId = params.id;
    }

    attached() {
        // пример запроса к серверу
        this.http
            .createRequest(`/api/testing/success`)
            .asGet()
            .send()
            .then((r: HttpResponseMessage) => {
                console.log("%c Success: " + r.content.Value, "background: green; color: white");
            });
    }
}