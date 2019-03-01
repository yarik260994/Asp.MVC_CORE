// Возможно здесь будет проверка прав
import { HttpClient } from 'aurelia-http-client';
import { inject } from 'aurelia-framework';
import { AureliaConfiguration } from 'aurelia-configuration';

export class AuthorizationHelper {
    static getToken(): string {
        return sessionStorage.getItem("auth_token");
    }

    static getRefreshToken(): string {
        return sessionStorage.getItem("refresh_token");
    }

    static setRefreshToken(refresh_token: string) {
        sessionStorage.setItem("refresh_token", refresh_token);
    }

    static isAuthorized(): boolean {
        if (sessionStorage.getItem("auth_token")) return true;
        return false;
    }

    static setToken(auth_token: string): void {
        sessionStorage.setItem("auth_token", auth_token);
    }

    static clearAuthorized(): void {
        sessionStorage.clear();
    }

    public userLogin: string;
    public password: string;

    constructor(@inject private http: HttpClient, @inject private configure: AureliaConfiguration) {
    }

    public grantOrRefreshToken(): Promise<boolean> {
        let scope = "XeroxInformationKiosk";
        let refreshToken = AuthorizationHelper.getRefreshToken();

        const requestContent = refreshToken
            ? `refresh_token=${refreshToken}&grant_type=refresh_token` //refresh
            : `scope=${scope}&grant_type=client_credentials`; //grant
        let authEndpoint = this.configure.get("authorization.authEndpoint");
        let authPath = this.configure.get("authorization.authPath");
        var authStr = btoa(this.userLogin + ":" + this.password);

        return this.http.createRequest(`${authEndpoint}${authPath}`)
            .asPost()
            .withContent(requestContent)
            .withHeader("Authorization", `Basic ${authStr}`)
            .withHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
            .send()
            .then((response) => {
                AuthorizationHelper.setToken(response.content.access_token);
                AuthorizationHelper.setRefreshToken(response.content.refresh_token);

                setTimeout(() => {
                    if (AuthorizationHelper.getRefreshToken()) this.grantOrRefreshToken();
                }, (0.1 * response.content.expires_in) * 1000);
                
                return true;
            })
            .catch(() => {
                AuthorizationHelper.setToken("");
                return false;
            });
    }
}