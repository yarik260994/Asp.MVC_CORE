import { AuthorizationHelper } from "../AuthorizationHelper";
import { inject, newInstance,Aurelia } from 'aurelia-framework';
import { ValidationRules, validationMessages, ValidationController } from 'aurelia-validation';

export class Login {
    userLogin: string = "";
    password: string = "";
    showMessageRules: ValidationRules;
    token: { refresh_token: string };

    constructor(
        @newInstance(ValidationController) private controller: ValidationController,
        @inject private authorizationHelper: AuthorizationHelper,
        @inject private aurelia: Aurelia) {
        validationMessages['required'] = `Введите \${$displayName}`;

        ValidationRules.customRule(
            'showMessage',
            (value, obj) => false,
            `Неверное имя или пароль`
        );

        this.showMessageRules = ValidationRules
            .ensureObject().satisfiesRule('showMessage')
            .rules

        ValidationRules
            .ensure((l: Login) => l.userLogin).displayName('имя пользователя').required()
            .ensure((l: Login) => l.password).displayName('пароль').required()
            .on(Login);
    }

    onLoginClick(): void {
        this.controller.validate()
            .then(result => {
                if (result.valid) {
                    this.authorizationHelper.userLogin = this.userLogin;
                    this.authorizationHelper.password = this.password;
                    this.authorizationHelper.grantOrRefreshToken()
                        .then((isAuthorized: boolean) => {
                            if (isAuthorized) {
                                this.aurelia.setRoot('app/shell');
                            }
                            else {
                                this.controller.validate({ object: this, rules: this.showMessageRules });
                            }
                        });

                }
            });
    }
}

