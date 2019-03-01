import { HttpRequestMessage, Interceptor } from "aurelia-http-client";
import { AuthorizationHelper } from "./AuthorizationHelper";

export class AuAuthInterceptor implements Interceptor {
    
    request(message: HttpRequestMessage) {
        let authHeaderName = "Authorization";
        if (message.headers.has(authHeaderName))
            return message;
        let token: string = AuthorizationHelper.getToken();
        
        message.headers.add(authHeaderName, `Bearer ${token}`);
        return message;
    }
}