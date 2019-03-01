define('app/AuAuthInterceptor',["require", "exports", "./AuthorizationHelper"], function (require, exports, AuthorizationHelper_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var AuAuthInterceptor = (function () {
        function AuAuthInterceptor() {
        }
        AuAuthInterceptor.prototype.request = function (message) {
            var authHeaderName = "Authorization";
            if (message.headers.has(authHeaderName))
                return message;
            var token = AuthorizationHelper_1.AuthorizationHelper.getToken();
            message.headers.add(authHeaderName, "Bearer " + token);
            return message;
        };
        return AuAuthInterceptor;
    }());
    exports.AuAuthInterceptor = AuAuthInterceptor;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define('app/AuthorizationHelper',["require", "exports", "aurelia-http-client", "aurelia-framework", "aurelia-configuration"], function (require, exports, aurelia_http_client_1, aurelia_framework_1, aurelia_configuration_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var AuthorizationHelper = (function () {
        function AuthorizationHelper(http, configure) {
            this.http = http;
            this.configure = configure;
        }
        AuthorizationHelper.getToken = function () {
            return sessionStorage.getItem("auth_token");
        };
        AuthorizationHelper.getRefreshToken = function () {
            return sessionStorage.getItem("refresh_token");
        };
        AuthorizationHelper.setRefreshToken = function (refresh_token) {
            sessionStorage.setItem("refresh_token", refresh_token);
        };
        AuthorizationHelper.isAuthorized = function () {
            if (sessionStorage.getItem("auth_token"))
                return true;
            return false;
        };
        AuthorizationHelper.setToken = function (auth_token) {
            sessionStorage.setItem("auth_token", auth_token);
        };
        AuthorizationHelper.clearAuthorized = function () {
            sessionStorage.clear();
        };
        AuthorizationHelper.prototype.grantOrRefreshToken = function () {
            var _this = this;
            var scope = "XeroxInformationKiosk";
            var refreshToken = AuthorizationHelper.getRefreshToken();
            var requestContent = refreshToken
                ? "refresh_token=" + refreshToken + "&grant_type=refresh_token"
                : "scope=" + scope + "&grant_type=client_credentials";
            var authEndpoint = this.configure.get("authorization.authEndpoint");
            var authPath = this.configure.get("authorization.authPath");
            var authStr = btoa(this.userLogin + ":" + this.password);
            return this.http.createRequest("" + authEndpoint + authPath)
                .asPost()
                .withContent(requestContent)
                .withHeader("Authorization", "Basic " + authStr)
                .withHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                .send()
                .then(function (response) {
                AuthorizationHelper.setToken(response.content.access_token);
                AuthorizationHelper.setRefreshToken(response.content.refresh_token);
                setTimeout(function () {
                    if (AuthorizationHelper.getRefreshToken())
                        _this.grantOrRefreshToken();
                }, (0.1 * response.content.expires_in) * 1000);
                return true;
            })
                .catch(function () {
                AuthorizationHelper.setToken("");
                return false;
            });
        };
        AuthorizationHelper = __decorate([
            __param(0, aurelia_framework_1.inject), __param(1, aurelia_framework_1.inject),
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient, aurelia_configuration_1.AureliaConfiguration])
        ], AuthorizationHelper);
        return AuthorizationHelper;
    }());
    exports.AuthorizationHelper = AuthorizationHelper;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/shell',["require", "exports", "aurelia-framework", "aurelia-router", "./AuthorizationHelper"], function (require, exports, aurelia_framework_1, aurelia_router_1, AuthorizationHelper_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShellRouter = (function () {
        function ShellRouter() {
        }
        ShellRouter.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.addAuthorizeStep(AuthorizeRouterStep);
            config.map([
                {
                    route: "layout",
                    name: "layout",
                    moduleId: "./layout/layout",
                    nav: true,
                    settings: {
                        icon: "account",
                        position: "bottom",
                        title: "Вариант верстки"
                    },
                },
                {
                    route: "settings",
                    name: "settings",
                    moduleId: "./settings/settings",
                    nav: true,
                    settings: {
                        icon: "account",
                        position: "bottom",
                        title: "Настройка"
                    },
                },
                {
                    route: "storage",
                    name: "storage",
                    moduleId: "./storage/storage",
                    nav: true,
                    settings: {
                        icon: "account",
                        position: "bottom",
                        title: "Хранилище"
                    },
                }
            ]);
            config.mapUnknownRoutes({ route: "", redirect: "layout" });
        };
        ShellRouter = __decorate([
            aurelia_framework_1.autoinject
        ], ShellRouter);
        return ShellRouter;
    }());
    exports.ShellRouter = ShellRouter;
    var AuthorizeRouterStep = (function () {
        function AuthorizeRouterStep(aurelia) {
            this.aurelia = aurelia;
        }
        AuthorizeRouterStep.prototype.run = function (instruction, next) {
            if (!AuthorizationHelper_1.AuthorizationHelper.isAuthorized()) {
                this.aurelia.setRoot('app/login/login');
                return next.cancel(new aurelia_router_1.Redirect("/", { replace: true }));
            }
            return next();
        };
        AuthorizeRouterStep = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_framework_1.Aurelia])
        ], AuthorizeRouterStep);
        return AuthorizeRouterStep;
    }());
    exports.AuthorizeRouterStep = AuthorizeRouterStep;
});



define('app/config/environment',["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: false
    };
});



define('app/config/main',["require", "exports", "./environment", "aurelia-http-client", "aurelia-configuration", "../AuAuthInterceptor"], function (require, exports, environment_1, aurelia_http_client_1, aurelia_configuration_1, AuAuthInterceptor_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature("app/resources")
            .plugin("aurelia-dialog", function (config) {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.startingZIndex = 1000;
        })
            .plugin("aurelia-configuration", function (config) {
            config.setDirectory("");
            config.setConfig("application.json");
        })
            .plugin('aurelia-validation')
            .plugin('aurelia-notify')
            .plugin('aurelia-dragula')
            .plugin('aurelia-flatpickr');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        aurelia.start()
            .then(function () {
            configureInternal(aurelia);
            aurelia.setRoot("app/shell");
        });
    }
    exports.configure = configure;
    function configureInternal(aurelia) {
        var container = aurelia.container;
        var httpClient = container.get(aurelia_http_client_1.HttpClient);
        var aureliaConfiguration = container.get(aurelia_configuration_1.AureliaConfiguration);
        httpClient.configure(function (x) {
            var port = aureliaConfiguration.get("api.port");
            var host = aureliaConfiguration.get("api.host");
            x.withBaseUrl('http://' + host + ':' + port);
            x.withInterceptor(container.get(AuAuthInterceptor_1.AuAuthInterceptor));
        });
    }
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/layout/layout',["require", "exports", "aurelia-dependency-injection", "aurelia-http-client", "aurelia-dialog", "./modals/reset-modal", "aurelia-notify", "../resources/elements/modals/change-nav-modal", "aurelia-framework"], function (require, exports, aurelia_dependency_injection_1, aurelia_http_client_1, aurelia_dialog_1, reset_modal_1, aurelia_notify_1, change_nav_modal_1, aurelia_framework_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var LayoutOption = (function () {
        function LayoutOption(http, notificationService, dialogService, taskQueue) {
            this.http = http;
            this.notificationService = notificationService;
            this.dialogService = dialogService;
            this.taskQueue = taskQueue;
            this.fourSections = true;
            this.imgList = [];
            this.showLayout = true;
            this.showLoader = false;
            this.jsonlayoutSettings = "";
        }
        LayoutOption.prototype.onSaveClick = function () {
            var _this = this;
            this.showLoader = true;
            this.http
                .createRequest("/api/layout-kiosk/save-layout")
                .asPost()
                .withContent(this.layoutSettings)
                .send()
                .then(function () { _this.notificationService.success("Данные сохранены", { timeout: 3000 }); _this.showLoader = false; _this.jsonlayoutSettings = JSON.stringify(_this.layoutSettings); })
                .catch(function () { _this.notificationService.warning("Ошибка при сохранении данных", { timeout: 3000 }); _this.showLoader = false; });
        };
        LayoutOption.prototype.attached = function () {
            this.getLayoutSettings();
            this.getAllImg();
        };
        LayoutOption.prototype.getLayoutSettings = function () {
            var _this = this;
            this.showLoader = true;
            this.http
                .createRequest("/api/layout-kiosk/get-layout")
                .asPost()
                .send()
                .then(function (data) {
                _this.layoutSettings = data.content;
                _this.taskQueue.queueTask(function () {
                    _this.jsonlayoutSettings = JSON.stringify(_this.layoutSettings);
                });
                _this.showLoader = false;
            }).catch(function () {
                _this.showLoader = false;
                _this.showLayout = false;
                _this.notificationService.warning("Ошибка при взятии данных", {
                    timeout: 3000
                });
            });
        };
        LayoutOption.prototype.onResetClick = function () {
            var _this = this;
            this.dialogService.open({ viewModel: reset_modal_1.ResetModal, model: this })
                .whenClosed(function (response) {
                if (!response.wasCancelled) {
                    _this.http
                        .createRequest("/api/layout-kiosk/set-default-settings")
                        .asPost()
                        .send()
                        .then(function (data) {
                        _this.layoutSettings = data.content;
                        _this.showLoader = false;
                        _this.taskQueue.queueTask(function () {
                            _this.jsonlayoutSettings = JSON.stringify(_this.layoutSettings);
                        });
                        _this.notificationService.success("сброс настроек прошел успешно", {
                            timeout: 3000
                        });
                    }).catch(function () {
                        _this.showLoader = false;
                        _this.showLayout = false;
                        _this.notificationService.warning("Ошибка при сбросе настроек", {
                            timeout: 3000
                        });
                    });
                }
            });
        };
        LayoutOption.prototype.getAllImg = function () {
            var _this = this;
            this.http
                .createRequest("/api/storage/get-img")
                .asPost()
                .send()
                .then(function (data) {
                _this.imgList = data.content;
            });
        };
        LayoutOption.prototype.canDeactivate = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var layoutSettings = JSON.stringify(_this.layoutSettings);
                if (_this.jsonlayoutSettings !== layoutSettings) {
                    _this.dialogService.open({ viewModel: change_nav_modal_1.ChangeNavModal, model: {} })
                        .whenClosed(function (response) {
                        if (response.wasCancelled) {
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                }
                else
                    resolve(true);
            });
        };
        LayoutOption = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient, aurelia_notify_1.NotificationService, aurelia_dialog_1.DialogService, aurelia_framework_1.TaskQueue])
        ], LayoutOption);
        return LayoutOption;
    }());
    exports.LayoutOption = LayoutOption;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define('app/login/login',["require", "exports", "../AuthorizationHelper", "aurelia-framework", "aurelia-validation"], function (require, exports, AuthorizationHelper_1, aurelia_framework_1, aurelia_validation_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Login = (function () {
        function Login(controller, authorizationHelper, aurelia) {
            this.controller = controller;
            this.authorizationHelper = authorizationHelper;
            this.aurelia = aurelia;
            this.userLogin = "";
            this.password = "";
            aurelia_validation_1.validationMessages['required'] = "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 ${$displayName}";
            aurelia_validation_1.ValidationRules.customRule('showMessage', function (value, obj) { return false; }, "\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0438\u043C\u044F \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C");
            this.showMessageRules = aurelia_validation_1.ValidationRules
                .ensureObject().satisfiesRule('showMessage')
                .rules;
            aurelia_validation_1.ValidationRules
                .ensure(function (l) { return l.userLogin; }).displayName('имя пользователя').required()
                .ensure(function (l) { return l.password; }).displayName('пароль').required()
                .on(Login);
        }
        Login.prototype.onLoginClick = function () {
            var _this = this;
            this.controller.validate()
                .then(function (result) {
                if (result.valid) {
                    _this.authorizationHelper.userLogin = _this.userLogin;
                    _this.authorizationHelper.password = _this.password;
                    _this.authorizationHelper.grantOrRefreshToken()
                        .then(function (isAuthorized) {
                        if (isAuthorized) {
                            _this.aurelia.setRoot('app/shell');
                        }
                        else {
                            _this.controller.validate({ object: _this, rules: _this.showMessageRules });
                        }
                    });
                }
            });
        };
        Login = __decorate([
            __param(0, aurelia_framework_1.newInstance(aurelia_validation_1.ValidationController)),
            __param(1, aurelia_framework_1.inject),
            __param(2, aurelia_framework_1.inject),
            __metadata("design:paramtypes", [aurelia_validation_1.ValidationController,
                AuthorizationHelper_1.AuthorizationHelper,
                aurelia_framework_1.Aurelia])
        ], Login);
        return Login;
    }());
    exports.Login = Login;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/nav-bar/nav-bar',["require", "exports", "aurelia-router", "aurelia-framework", "../AuthorizationHelper"], function (require, exports, aurelia_router_1, aurelia_framework_1, AuthorizationHelper_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Navbar = (function () {
        function Navbar(aurelia) {
            this.aurelia = aurelia;
        }
        Navbar.prototype.logout = function () {
            AuthorizationHelper_1.AuthorizationHelper.clearAuthorized();
            this.aurelia.setRoot('app/login/login');
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", aurelia_router_1.Router)
        ], Navbar.prototype, "router", void 0);
        Navbar = __decorate([
            aurelia_framework_1.customElement("nav-bar"),
            aurelia_framework_1.containerless,
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_framework_1.Aurelia])
        ], Navbar);
        return Navbar;
    }());
    exports.Navbar = Navbar;
});



define('app/resources/index',["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            "./elements/loader/loader",
            "./elements/color-selector/color-selector"
        ]);
    }
    exports.configure = configure;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/settings/settings',["require", "exports", "aurelia-framework", "aurelia-http-client", "aurelia-notify", "../resources/elements/modals/change-nav-modal", "aurelia-dialog"], function (require, exports, aurelia_framework_1, aurelia_http_client_1, aurelia_notify_1, change_nav_modal_1, aurelia_dialog_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Settings = (function () {
        function Settings(http, notificationService, dialogService) {
            this.http = http;
            this.notificationService = notificationService;
            this.dialogService = dialogService;
            this.printFileList = [];
            this.level = 1;
        }
        Settings_1 = Settings;
        Settings.prototype.attached = function () {
            this.getAllPrintFiles();
        };
        Settings.prototype.getAllPrintFiles = function () {
            var _this = this;
            this.http
                .createRequest("/api/storage/get-print-file")
                .asPost()
                .send()
                .then(function (data) {
                _this.printFileList = data.content;
            })
                .catch(function () {
                _this.notificationService.warning("Ошибка при взятии списка файлов для печати", { timeout: 3000 });
            });
        };
        Settings.prototype.onNextLevel = function () {
            this.buttonsList.onNextLevel();
        };
        Settings.prototype.itemDropped = function (item, target, source, sibling) {
            if (source.dataset["type"] == "ButtonsList") {
                this.buttonsList.itemDropped(item, target, source, sibling);
            }
            if (source.dataset["type"] == "TableButtonEditor") {
                if (this.currentButton.Table.Common) {
                    this.tableButtonEditor.itemDropped(item, target, source, sibling);
                }
                else {
                    this.infoTableButtonEditor.itemDropped(item, target, source, sibling);
                }
            }
        };
        Settings.prototype.canDeactivate = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var mainButtons = JSON.stringify(_this.buttonsList.mainButtons);
                if (_this.buttonsList.jsonButtons !== mainButtons) {
                    _this.dialogService.open({ viewModel: change_nav_modal_1.ChangeNavModal, model: {} })
                        .whenClosed(function (response) {
                        if (response.wasCancelled) {
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                }
                else
                    resolve(true);
            });
        };
        Settings.prototype.getLevelName = function (idx) {
            return (idx < 2) ? "Главный экран"
                : ((idx <= Settings_1.levelNames.length ? Settings_1.levelNames[idx - 1] : idx + '-й') + ' уровень');
        };
        Settings.levelNames = [, 'Второй', 'Третий', 'Четвертый', 'Пятый', 'Шестой', 'Седьмой', 'Восьмой', 'Девятый', 'Десятый'];
        Settings = Settings_1 = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient, aurelia_notify_1.NotificationService, aurelia_dialog_1.DialogService])
        ], Settings);
        return Settings;
        var Settings_1;
    }());
    exports.Settings = Settings;
});



define('app/settings/TableEditor',["require", "exports", "./grid/grid"], function (require, exports, grid_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var TableEditor = (function () {
        function TableEditor() {
            this.showDocumentForPrint = false;
        }
        TableEditor.prototype.initDocumentToPrint = function (tableButton) {
            if (tableButton.Table.PrintDocument) {
                return true;
            }
            else {
                return false;
            }
        };
        TableEditor.prototype.checkPercent = function (neededColumnsCount, tableButton) {
            if (!grid_1.Grid.checkPercent(tableButton.Table.ColumnWidths) || tableButton.Table.ColumnWidths.length != neededColumnsCount) {
                tableButton.Table.ColumnWidths = [];
                var columnWidth = 100 / neededColumnsCount;
                for (var i = 0; i < neededColumnsCount; i++) {
                    tableButton.Table.ColumnWidths.push(columnWidth.toString());
                }
            }
            return tableButton.Table.ColumnWidths.slice();
        };
        TableEditor.prototype.onDocumentToPrintChecked = function (tableButton) {
            if (!this.showDocumentForPrint) {
                tableButton.Table.PrintDocument = "";
            }
        };
        TableEditor.adjustByDateTime = function (row, value) {
            if (value) {
                row.unshift("");
            }
            else {
                row.shift();
            }
        };
        TableEditor.adjustByFileToPrint = function (row, value) {
            if (value) {
                row.push("");
            }
            else {
                row.pop();
            }
        };
        TableEditor.adjustRow = function (row, showPrintFile, neededColumnsCount) {
            while (row.length < neededColumnsCount) {
                if (showPrintFile) {
                    row.splice(row.length - 1, 0, "");
                }
                else {
                    row.push("");
                }
            }
            while (row.length > neededColumnsCount) {
                if (showPrintFile) {
                    row.splice(row.length - 2, 1);
                }
                else {
                    row.pop();
                }
            }
        };
        return TableEditor;
    }());
    exports.TableEditor = TableEditor;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/storage/storage',["require", "exports", "aurelia-dependency-injection", "aurelia-http-client", "aurelia-dialog", "./modals/add-file-modal", "aurelia-notify"], function (require, exports, aurelia_dependency_injection_1, aurelia_http_client_1, aurelia_dialog_1, add_file_modal_1, aurelia_notify_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Storage = (function () {
        function Storage(http, dialogService, notificationService) {
            this.http = http;
            this.dialogService = dialogService;
            this.notificationService = notificationService;
            this.downloadedFiles = [];
            this.showStorage = true;
            this.showLoader = false;
        }
        Storage.prototype.addNewFile = function () {
            var _this = this;
            this.dialogService.open({ viewModel: add_file_modal_1.AddFileModal, model: {} })
                .whenClosed(function (response) {
                if (!response.wasCancelled) {
                    _this.updateForm();
                }
            });
        };
        Storage.prototype.attached = function () {
            this.updateForm();
        };
        Storage.prototype.updateForm = function () {
            var _this = this;
            this.showLoader = true;
            this.http
                .createRequest("/api/storage/getfilelist")
                .asPost()
                .send()
                .then(function (data) {
                _this.showLoader = false;
                _this.downloadedFiles = data.content;
            }).catch(function () { _this.showLoader = false; _this.showStorage = false; _this.notificationService.warning("Ошибка при загрузке списка файлов", { timeout: 3000 }); });
        };
        Storage = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient, aurelia_dialog_1.DialogService, aurelia_notify_1.NotificationService])
        ], Storage);
        return Storage;
    }());
    exports.Storage = Storage;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('app/layout/modals/reset-modal',["require", "exports", "aurelia-dialog", "aurelia-dependency-injection"], function (require, exports, aurelia_dialog_1, aurelia_dependency_injection_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResetModal = (function () {
        function ResetModal(dialogController) {
            this.dialogController = dialogController;
        }
        ResetModal.prototype.activate = function (layoutOptions) {
            this.layoutOptions = layoutOptions;
        };
        ResetModal.prototype.ok = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.layoutOptions.getLayoutSettings();
                    this.dialogController.close(true);
                    return [2];
                });
            });
        };
        ResetModal = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
        ], ResetModal);
        return ResetModal;
    }());
    exports.ResetModal = ResetModal;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/layout/ui-elements/ui-elements',["require", "exports", "aurelia-templating", "aurelia-framework"], function (require, exports, aurelia_templating_1, aurelia_framework_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIElements = (function () {
        function UIElements() {
            this.showBackgroundSelector = true;
        }
        UIElements.prototype.onBoldClick = function () {
            if (this.style.fontWeight === "bold")
                this.style.fontWeight = "normal";
            else
                this.style.fontWeight = "bold";
        };
        UIElements.prototype.onItalicClick = function () {
            if (this.style.fontStyle === "italic")
                this.style.fontStyle = "normal";
            else
                this.style.fontStyle = "italic";
        };
        UIElements.prototype.onUnderlineClick = function () {
            if (this.style.textDecoration === "underline")
                this.style.textDecoration = "none";
            else
                this.style.textDecoration = "underline";
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], UIElements.prototype, "style", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", String)
        ], UIElements.prototype, "title", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Boolean)
        ], UIElements.prototype, "showBackgroundSelector", void 0);
        UIElements = __decorate([
            aurelia_framework_1.autoinject,
            aurelia_framework_1.customElement("ui-elements")
        ], UIElements);
        return UIElements;
    }());
    exports.UIElements = UIElements;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('app/settings/add-custom-button/add-custom-button',["require", "exports", "aurelia-dialog", "aurelia-dependency-injection"], function (require, exports, aurelia_dialog_1, aurelia_dependency_injection_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddCustomButton = (function () {
        function AddCustomButton(dialogController) {
            this.dialogController = dialogController;
            this.buttonTypes = [];
            this.selectedButtonType = this.buttonTypes[0];
        }
        AddCustomButton.prototype.activate = function () {
            this.buttonTypes = [
                { id: 0, name: 'Таблица' },
                { id: 1, name: 'Инфо-таблица' },
                { id: 2, name: 'Печать' },
                { id: 3, name: 'Уровень N' }
            ];
        };
        AddCustomButton.prototype.ok = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var button;
                return __generator(this, function (_a) {
                    switch (this.selectedButtonType.id) {
                        case 0: {
                            button = { Text: "Таблица", Table: { ColumnWidths: [], Info: null, Common: { ColumnsCount: 0, PrintFileColumn: false }, Table: [] }, Level: null, Print: null };
                            break;
                        }
                        case 1: {
                            button = { Text: "Инфо-таблица", Table: { ColumnWidths: [], Common: null, Table: [], Info: { ImageNumberColumn: false } }, Level: null, Print: null };
                            break;
                        }
                        case 2: {
                            button = { Text: "Печать", Print: {}, Level: null, Table: null };
                            break;
                        }
                        case 3: {
                            button = { Text: "Уровень N", Level: { Buttons: [] }, Print: null, Table: null };
                            break;
                        }
                    }
                    this.dialogController.close(true, button);
                    return [2];
                });
            });
        };
        AddCustomButton = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
        ], AddCustomButton);
        return AddCustomButton;
    }());
    exports.AddCustomButton = AddCustomButton;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('app/settings/buttons-list/buttons-list',["require", "exports", "aurelia-framework", "aurelia-dialog", "../add-custom-button/add-custom-button", "../remove-modal/remove-modal", "aurelia-http-client", "aurelia-notify", "aurelia-templating"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, add_custom_button_1, remove_modal_1, aurelia_http_client_1, aurelia_notify_1, aurelia_templating_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ButtonsList = (function () {
        function ButtonsList(http, notificationService, dialogService, taskQueue) {
            this.http = http;
            this.notificationService = notificationService;
            this.dialogService = dialogService;
            this.taskQueue = taskQueue;
            this.mainButtons = [];
            this.level = 1;
            this.showLoader = false;
            this._currentLevelButtons = this.mainButtons;
            this._prevLevels = [];
            this.printFileList = [];
            this.jsonButtons = "";
        }
        Object.defineProperty(ButtonsList.prototype, "currentLevelButtons", {
            get: function () {
                return this._currentLevelButtons;
            },
            set: function (value) {
                this._currentLevelButtons = value;
                this.level = this._prevLevels.length + 1;
            },
            enumerable: true,
            configurable: true
        });
        ButtonsList.prototype.selectButton = function (button) {
            this.selectedButton = button;
        };
        ButtonsList.prototype.remove = function () {
            var _this = this;
            this.dialogService.open({ viewModel: remove_modal_1.RemoveModal, model: {} })
                .whenClosed(function (response) {
                if (!response.wasCancelled) {
                    var index = _this.currentLevelButtons.indexOf(_this.selectedButton, 0);
                    if (index > -1) {
                        _this.selectedButton = null;
                        _this.currentLevelButtons.splice(index, 1);
                    }
                }
            });
        };
        ButtonsList.prototype.attached = function () {
            this.getButtons();
        };
        ButtonsList.prototype.getButtons = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.showLoader = true;
                    this.http
                        .createRequest("/api/settings-kiosk/get-buttons")
                        .asPost()
                        .send()
                        .then(function (data) {
                        _this.showLoader = false;
                        _this.mainButtons = data.content;
                        _this.taskQueue.queueTask(function () {
                            _this.jsonButtons = JSON.stringify(_this.mainButtons);
                        });
                        _this.currentLevelButtons = _this.mainButtons;
                    }).catch(function () { _this.notificationService.warning("Ошибка при чтении данных", { timeout: 3000 }); _this.showLoader = false; });
                    return [2];
                });
            });
        };
        ButtonsList.prototype.itemDropped = function (item, target, source, sibling) {
            var buttonIndex = Number(item.dataset["index"]);
            var siblingIndex = sibling ? Number(sibling.dataset["index"]) : -1;
            var button = this.currentLevelButtons.splice(buttonIndex, 1)[0];
            if (sibling) {
                this.currentLevelButtons.splice((buttonIndex < siblingIndex) ? siblingIndex - 1 : siblingIndex, 0, button);
            }
            else {
                this.currentLevelButtons.push(button);
            }
        };
        ButtonsList.prototype.onBtnSaveClick = function () {
            var _this = this;
            this.showLoader = true;
            this.http
                .createRequest("/api/settings-kiosk/save-buttons")
                .asPost()
                .withContent(this.mainButtons)
                .send()
                .then(function () { _this.notificationService.success("Данные сохранены", { timeout: 3000 }); _this.showLoader = false; _this.jsonButtons = JSON.stringify(_this.mainButtons); })
                .catch(function () { _this.notificationService.warning("Ошибка при сохранении данных", { timeout: 3000 }); _this.showLoader = false; });
        };
        ButtonsList.prototype.add = function () {
            var _this = this;
            this.dialogService.open({ viewModel: add_custom_button_1.AddCustomButton })
                .whenClosed(function (response) {
                if (!response.wasCancelled) {
                    var button = response.output;
                    if (button.Print && _this.printFileList.length > 0) {
                        button.Print.Document = _this.printFileList[0].FileName;
                    }
                    _this.currentLevelButtons.push(button);
                    _this.selectButton(button);
                }
            });
        };
        ButtonsList.prototype.onNextLevel = function () {
            if (this.selectedButton && this.selectedButton.Level) {
                this._prevLevels.push(this.currentLevelButtons);
                this.currentLevelButtons = this.selectedButton.Level.Buttons;
                this.selectedButton = null;
            }
        };
        ButtonsList.prototype.onPrevLevel = function () {
            this.currentLevelButtons = this._prevLevels.pop();
            this.selectedButton = null;
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], ButtonsList.prototype, "level", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], ButtonsList.prototype, "selectedButton", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Array)
        ], ButtonsList.prototype, "printFileList", void 0);
        ButtonsList = __decorate([
            aurelia_framework_1.autoinject,
            aurelia_framework_1.customElement("buttons-list"),
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient, aurelia_notify_1.NotificationService, aurelia_dialog_1.DialogService, aurelia_framework_1.TaskQueue])
        ], ButtonsList);
        return ButtonsList;
    }());
    exports.ButtonsList = ButtonsList;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/settings/grid/grid',["require", "exports", "aurelia-framework", "aurelia-dependency-injection", "aurelia-templating", "aurelia-binding", "moment", "aurelia-notify"], function (require, exports, aurelia_framework_1, aurelia_dependency_injection_1, aurelia_templating_1, aurelia_binding_1, moment, aurelia_notify_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Grid = (function () {
        function Grid(notificationService) {
            this.notificationService = notificationService;
            this.selectedRow = null;
            this.editableRow = null;
            this.printFileList = [];
            this.imageList = [];
            this.editPercentRow = [];
        }
        Grid_1 = Grid;
        Grid.prototype.esc = function (uriComponent) {
            return encodeURIComponent(uriComponent);
        };
        Grid.prototype.itemDropped = function (item, target, source, sibling) {
            var rowIndex = Number(item.dataset["index"]);
            var siblingIndex = sibling ? Number(sibling.dataset["index"]) : -1;
            var row = this.tableButton.Table.Table.splice(rowIndex, 1)[0];
            if (sibling) {
                this.tableButton.Table.Table.splice((rowIndex < siblingIndex) ? siblingIndex - 1 : siblingIndex, 0, row);
            }
            else {
                this.tableButton.Table.Table.push(row);
            }
            if (this.tableButton.Table.Info && this.showImgNumber) {
                for (var index = 0; index < this.tableButton.Table.Table.length; index++) {
                    this.tableButton.Table.Table[index][0] = (index + 1).toString();
                }
                this.refresh();
            }
        };
        Grid.prototype.addRow = function () {
            if (this.dateTimeColumn == "DateTime") {
                this.rowToAdd[0] = moment(this.addDetaTime).format("DD.MM.YYYY HH:mm");
            }
            if (this.dateTimeColumn == "Time") {
                this.rowToAdd[0] = moment(this.addDetaTime).format("HH:mm");
            }
            if (this.tableButton.Table.Info && this.showImgNumber) {
                this.rowToAdd[0] = (this.tableButton.Table.Table.length + 1).toString();
            }
            for (var index = 0; index < this.rowToAdd.length; index++) {
                this.rowToAdd[index] = this.rowToAdd[index].replace(/\n/g, "<br />");
            }
            this.tableButton.Table.Table.push(this.rowToAdd.slice());
        };
        Grid.prototype.onEditClick = function (index) {
            if (this.dateTimeColumn == "DateTime") {
                this.editableDetaTime = this.tableButton.Table.Table[index][0] != "" ? moment(this.tableButton.Table.Table[index][0], "DD.MM.YYYY HH:mm").toDate() : new Date();
            }
            if (this.dateTimeColumn == "Time") {
                this.editableDetaTime = this.tableButton.Table.Table[index][0] != "" ? moment(this.tableButton.Table.Table[index][0], "HH:mm").toDate() : new Date();
            }
            for (var i = 0; i < this.tableButton.Table.Table[index].length; i++) {
                this.tableButton.Table.Table[index][i] = this.tableButton.Table.Table[index][i].replace(/<br \/>/g, "\n");
            }
            this.editableRow = this.tableButton.Table.Table[index].slice();
            this.selectedRow = this.tableButton.Table.Table[index];
        };
        Grid.prototype.onOkClick = function (index) {
            if (this.dateTimeColumn == "DateTime") {
                this.editableRow[0] = moment(this.editableDetaTime).format("DD.MM.YYYY HH:mm");
            }
            if (this.dateTimeColumn == "Time") {
                this.editableRow[0] = moment(this.editableDetaTime).format("HH:mm");
            }
            for (var i = 0; i < this.editableRow.length; i++) {
                this.editableRow[i] = this.editableRow[i].replace(/\n/g, "<br />");
            }
            this.tableButton.Table.Table[index] = this.editableRow.slice();
            this.refresh();
        };
        Grid.prototype.refresh = function () {
            var _this = this;
            var tmp = this.tableButton.Table.Table.slice();
            this.tableButton.Table.Table.splice(0, this.tableButton.Table.Table.length);
            tmp.forEach(function (row) { return _this.tableButton.Table.Table.push(row.slice()); });
            this.selectedRow = null;
        };
        Grid.prototype.onCancel = function () {
            this.selectedRow = null;
        };
        Grid.prototype.onDeleteClick = function (index) {
            this.tableButton.Table.Table.splice(index, 1);
        };
        Grid.prototype.saveClick = function () {
            if (Grid_1.checkPercent(this.editPercentRow)) {
                this.tableButton.Table.ColumnWidths = this.editPercentRow.slice();
                this.notificationService.success("Ширина колонок применена. Сохраните изменения дискеткой слева.", { timeout: 6000 });
            }
            else {
                this.notificationService.warning("Все ячейки должны содержать положительные числа и их сумма должна быть равна 100", { timeout: 3000 });
            }
        };
        Grid.checkPercent = function (editPercentRow) {
            var sum = 0;
            var isNumber = true;
            editPercentRow.forEach(function (element) {
                if (isNaN(Number(element)) || Number(element) < 1) {
                    isNumber = false;
                    return;
                }
                ;
                sum = sum + parseInt(element);
            });
            if (sum != 100) {
                return false;
            }
            return isNumber;
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], Grid.prototype, "tableButton", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], Grid.prototype, "rowToAdd", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Array)
        ], Grid.prototype, "printFileList", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Array)
        ], Grid.prototype, "imageList", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], Grid.prototype, "editPercentRow", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", String)
        ], Grid.prototype, "dateTimeColumn", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Boolean)
        ], Grid.prototype, "printFileColumn", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Number)
        ], Grid.prototype, "columnsCount", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", String)
        ], Grid.prototype, "urlForImg", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Boolean)
        ], Grid.prototype, "showImgNumber", void 0);
        Grid = Grid_1 = __decorate([
            aurelia_dependency_injection_1.autoinject,
            aurelia_framework_1.customElement("grid"),
            __metadata("design:paramtypes", [aurelia_notify_1.NotificationService])
        ], Grid);
        return Grid;
        var Grid_1;
    }());
    exports.Grid = Grid;
});



var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/settings/info-table-button-editor/info-table-button-editor',["require", "exports", "aurelia-framework", "aurelia-dependency-injection", "aurelia-templating", "../TableEditor", "aurelia-http-client", "aurelia-configuration"], function (require, exports, aurelia_framework_1, aurelia_dependency_injection_1, aurelia_templating_1, TableEditor_1, aurelia_http_client_1, aurelia_configuration_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var InfoTableButtonEditor = (function (_super) {
        __extends(InfoTableButtonEditor, _super);
        function InfoTableButtonEditor(taskQueue, http, configure) {
            var _this = _super.call(this) || this;
            _this.taskQueue = taskQueue;
            _this.http = http;
            _this.configure = configure;
            _this.printFileList = [];
            _this.editPercentRow = [];
            _this.rowToAdd = [];
            return _this;
        }
        InfoTableButtonEditor.prototype.tableButtonChanged = function () {
            var _this = this;
            this.taskQueue.queueTask(function () {
                _this.rowToAdd = [];
                _this.getAllImg();
                _this.getUrlForImg();
                TableEditor_1.TableEditor.adjustRow(_this.tableButton.Table.ColumnWidths, false, _this.getNeededColumnCount());
                TableEditor_1.TableEditor.adjustRow(_this.rowToAdd, false, _this.getNeededColumnCount());
                _this.editPercentRow = _this.checkPercent(_this.getNeededColumnCount(), _this.tableButton);
                _this.showDocumentForPrint = _this.initDocumentToPrint(_this.tableButton);
            });
        };
        InfoTableButtonEditor.prototype.getNeededColumnCount = function () {
            return 2
                + (this.tableButton.Table.Info.ImageNumberColumn ? 1 : 0);
        };
        InfoTableButtonEditor.prototype.getAllImg = function () {
            var _this = this;
            this.http
                .createRequest("/api/storage/get-img")
                .asPost()
                .send()
                .then(function (data) {
                _this.imageList = data.content;
            });
        };
        InfoTableButtonEditor.prototype.getUrlForImg = function () {
            var port = this.configure.get("api.port");
            var host = this.configure.get("api.host");
            this.urlForImg = "http://" + host + ":" + port + "/api/storage/get-picture";
        };
        InfoTableButtonEditor.prototype.onShowNumberChecked = function (value) {
            this.rowToAdd = [];
            this.grid.onCancel();
            this.tableButton.Table.Table.forEach(function (row) {
                TableEditor_1.TableEditor.adjustByDateTime(row, value);
            });
            TableEditor_1.TableEditor.adjustByDateTime(this.rowToAdd, value);
            TableEditor_1.TableEditor.adjustByDateTime(this.tableButton.Table.ColumnWidths, value);
            if (this.tableButton.Table.Info && value) {
                for (var index = 0; index < this.tableButton.Table.Table.length; index++) {
                    this.tableButton.Table.Table[index][0] = (index + 1).toString();
                }
            }
            this.editPercentRow = this.checkPercent(this.getNeededColumnCount(), this.tableButton);
        };
        InfoTableButtonEditor.prototype.itemDropped = function (item, target, source, sibling) {
            this.grid.itemDropped(item, target, source, sibling);
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], InfoTableButtonEditor.prototype, "tableButton", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Array)
        ], InfoTableButtonEditor.prototype, "printFileList", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], InfoTableButtonEditor.prototype, "editPercentRow", void 0);
        InfoTableButtonEditor = __decorate([
            aurelia_dependency_injection_1.autoinject,
            aurelia_framework_1.customElement("info-table-button-editor"),
            __metadata("design:paramtypes", [aurelia_framework_1.TaskQueue, aurelia_http_client_1.HttpClient, aurelia_configuration_1.AureliaConfiguration])
        ], InfoTableButtonEditor);
        return InfoTableButtonEditor;
    }(TableEditor_1.TableEditor));
    exports.InfoTableButtonEditor = InfoTableButtonEditor;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/settings/level-button-editor/level-button-editor',["require", "exports", "aurelia-framework", "aurelia-templating"], function (require, exports, aurelia_framework_1, aurelia_templating_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var LevelButtonEditor = (function () {
        function LevelButtonEditor() {
        }
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], LevelButtonEditor.prototype, "levelButton", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Function)
        ], LevelButtonEditor.prototype, "onNextLevel", void 0);
        LevelButtonEditor = __decorate([
            aurelia_framework_1.autoinject,
            aurelia_framework_1.customElement("level-button-editor")
        ], LevelButtonEditor);
        return LevelButtonEditor;
    }());
    exports.LevelButtonEditor = LevelButtonEditor;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/settings/print-button-editor/print-button-editor',["require", "exports", "aurelia-framework", "aurelia-templating"], function (require, exports, aurelia_framework_1, aurelia_templating_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var PrintButtonEditor = (function () {
        function PrintButtonEditor() {
            this.printFileList = [];
        }
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Array)
        ], PrintButtonEditor.prototype, "printFileList", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], PrintButtonEditor.prototype, "printButton", void 0);
        PrintButtonEditor = __decorate([
            aurelia_framework_1.autoinject,
            aurelia_framework_1.customElement("print-button-editor")
        ], PrintButtonEditor);
        return PrintButtonEditor;
    }());
    exports.PrintButtonEditor = PrintButtonEditor;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('app/settings/remove-modal/remove-modal',["require", "exports", "aurelia-dialog", "aurelia-dependency-injection"], function (require, exports, aurelia_dialog_1, aurelia_dependency_injection_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var RemoveModal = (function () {
        function RemoveModal(dialogController) {
            this.dialogController = dialogController;
            this.isLoading = false;
        }
        RemoveModal.prototype.ok = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.dialogController.close(true);
                    return [2];
                });
            });
        };
        RemoveModal = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
        ], RemoveModal);
        return RemoveModal;
    }());
    exports.RemoveModal = RemoveModal;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/settings/table-button-editor/CommonTableImplementation',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var CommonTableImplementation = (function () {
        function CommonTableImplementation(src) {
            this.ColumnsCount = 1;
            this.DateTimeColumn = null;
            this.PrintFileColumn = false;
            if (src) {
                if (src.DateTimeColumn != "DateTime" && src.DateTimeColumn != "Time")
                    src.DateTimeColumn = null;
                this.ColumnsCount = src.ColumnsCount;
                this.DateTimeColumn = src.DateTimeColumn;
                this.PrintFileColumn = src.PrintFileColumn;
            }
        }
        Object.defineProperty(CommonTableImplementation.prototype, "DateTimeColumnExists", {
            get: function () {
                return this.DateTimeColumn != null;
            },
            set: function (val) {
                this.DateTimeColumn = val ? "Time" : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommonTableImplementation.prototype, "ColumnsCountString", {
            get: function () {
                return this.ColumnsCount.toString();
            },
            set: function (val) {
                var valNumber = parseInt(val);
                if (!valNumber || valNumber == NaN || valNumber < 0) {
                    this.ColumnsCount = 0;
                }
                else {
                    this.ColumnsCount = valNumber;
                }
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            aurelia_framework_1.computedFrom('DateTimeColumn'),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [Boolean])
        ], CommonTableImplementation.prototype, "DateTimeColumnExists", null);
        __decorate([
            aurelia_framework_1.computedFrom('ColumnsCount'),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [String])
        ], CommonTableImplementation.prototype, "ColumnsCountString", null);
        return CommonTableImplementation;
    }());
    exports.CommonTableImplementation = CommonTableImplementation;
});



var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/settings/table-button-editor/table-button-editor',["require", "exports", "aurelia-framework", "aurelia-templating", "aurelia-dependency-injection", "./CommonTableImplementation", "moment", "../TableEditor"], function (require, exports, aurelia_framework_1, aurelia_templating_1, aurelia_dependency_injection_1, CommonTableImplementation_1, moment, TableEditor_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var TableButtonEditor = (function (_super) {
        __extends(TableButtonEditor, _super);
        function TableButtonEditor(taskQueue) {
            var _this = _super.call(this) || this;
            _this.taskQueue = taskQueue;
            _this.printFileList = [];
            _this.dateTimeTypes = [
                { name: "", value: null },
                { name: "Время", value: "Time" },
                { name: "Дата/время", value: "DateTime" }
            ];
            _this.rowToAdd = [];
            _this.editPercentRow = [];
            return _this;
        }
        TableButtonEditor.prototype.tableButtonChanged = function () {
            var _this = this;
            this.taskQueue.queueTask(function () {
                _this.tableButton.Table.Common = new CommonTableImplementation_1.CommonTableImplementation(_this.tableButton.Table.Common);
                _this.changeColumnsCount();
                _this.showDocumentForPrint = _this.initDocumentToPrint(_this.tableButton);
            });
        };
        TableButtonEditor.prototype.onDateTimeColumnChanged = function () {
            var _this = this;
            var dt;
            this.tableButton.Table.Table.forEach(function (row) {
                if (_this.tableButton.Table.Common.DateTimeColumn == "DateTime") {
                    dt = row[0] && row[0].length > 0 ? moment(row[0], "HH:mm").toDate() : new Date();
                    row[0] = moment(dt).format("DD.MM.YYYY HH:mm");
                    ;
                }
                else {
                    dt = row[0] && row[0].length > 0 ? moment(row[0], "DD.MM.YYYY HH:mm").toDate() : new Date();
                    row[0] = moment(dt).format("HH:mm");
                }
            });
            var tmp = this.tableButton.Table.Table.slice();
            this.tableButton.Table.Table.splice(0, this.tableButton.Table.Table.length);
            tmp.forEach(function (row) { return _this.tableButton.Table.Table.push(row.slice()); });
        };
        TableButtonEditor.prototype.changeColumnsCount = function () {
            this.grid.onCancel();
            this.rowToAdd = [];
            var showPrintFile = this.tableButton.Table.Common.PrintFileColumn;
            var neededColumnsCount = this.getNeededColumnCount();
            this.tableButton.Table.Table.forEach(function (row) {
                TableEditor_1.TableEditor.adjustRow(row, showPrintFile, neededColumnsCount);
            });
            TableEditor_1.TableEditor.adjustRow(this.rowToAdd, showPrintFile, neededColumnsCount);
            TableEditor_1.TableEditor.adjustRow(this.tableButton.Table.ColumnWidths, showPrintFile, neededColumnsCount);
            this.editPercentRow = this.checkPercent(this.getNeededColumnCount(), this.tableButton);
        };
        TableButtonEditor.prototype.getNeededColumnCount = function () {
            return this.tableButton.Table.Common.ColumnsCount
                + (this.tableButton.Table.Common.DateTimeColumn != null ? 1 : 0)
                + (this.tableButton.Table.Common.PrintFileColumn ? 1 : 0);
        };
        TableButtonEditor.prototype.onDateTimeChecked = function (value) {
            this.grid.onCancel();
            this.tableButton.Table.Common.DateTimeColumn = value ? "Time" : null;
            this.tableButton.Table.Table.forEach(function (row) {
                TableEditor_1.TableEditor.adjustByDateTime(row, value);
            });
            TableEditor_1.TableEditor.adjustByDateTime(this.rowToAdd, value);
            TableEditor_1.TableEditor.adjustByDateTime(this.tableButton.Table.ColumnWidths, value);
            this.editPercentRow = this.checkPercent(this.getNeededColumnCount(), this.tableButton);
        };
        TableButtonEditor.prototype.onFileToPrintChecked = function (value) {
            this.grid.onCancel();
            this.tableButton.Table.Common.PrintFileColumn = value;
            this.tableButton.Table.Table.forEach(function (row) {
                TableEditor_1.TableEditor.adjustByFileToPrint(row, value);
            });
            TableEditor_1.TableEditor.adjustByFileToPrint(this.rowToAdd, value);
            TableEditor_1.TableEditor.adjustByFileToPrint(this.tableButton.Table.ColumnWidths, value);
            this.editPercentRow = this.checkPercent(this.getNeededColumnCount(), this.tableButton);
        };
        TableButtonEditor.prototype.itemDropped = function (item, target, source, sibling) {
            this.grid.itemDropped(item, target, source, sibling);
        };
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Array)
        ], TableButtonEditor.prototype, "printFileList", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], TableButtonEditor.prototype, "tableButton", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], TableButtonEditor.prototype, "editPercentRow", void 0);
        TableButtonEditor = __decorate([
            aurelia_dependency_injection_1.autoinject,
            aurelia_framework_1.customElement("table-button-editor"),
            __metadata("design:paramtypes", [aurelia_framework_1.TaskQueue])
        ], TableButtonEditor);
        return TableButtonEditor;
    }(TableEditor_1.TableEditor));
    exports.TableButtonEditor = TableButtonEditor;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/shells/home/home-router',["require", "exports", "aurelia-framework", "aurelia-templating", "../../AuthorizationHelper"], function (require, exports, aurelia_framework_1, aurelia_templating_1, AuthorizationHelper_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var CompaniesRouter = (function () {
        function CompaniesRouter() {
            this.isAuthorized = false;
            this.isAuthorized = AuthorizationHelper_1.AuthorizationHelper.isAuthorized();
        }
        CompaniesRouter.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.map([
                {
                    route: "",
                    name: "empty",
                    viewPorts: {
                        sidebar: { moduleId: "./sidebar/sidebar-shell" },
                        shell: { moduleId: null }
                    },
                    nav: false
                },
                {
                    route: "user/:id",
                    name: "user",
                    viewPorts: {
                        sidebar: { moduleId: "./sidebar/sidebar-shell" },
                        shell: { moduleId: "./users/users-shell" }
                    },
                    nav: false
                }
            ]);
            config.mapUnknownRoutes({ route: "", redirect: "" });
        };
        CompaniesRouter = __decorate([
            aurelia_framework_1.autoinject,
            aurelia_templating_1.containerless,
            __metadata("design:paramtypes", [])
        ], CompaniesRouter);
        return CompaniesRouter;
    }());
    exports.CompaniesRouter = CompaniesRouter;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('app/storage/modals/add-file-modal',["require", "exports", "aurelia-dialog", "aurelia-dependency-injection", "aurelia-http-client", "aurelia-notify"], function (require, exports, aurelia_dialog_1, aurelia_dependency_injection_1, aurelia_http_client_1, aurelia_notify_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddFileModal = (function () {
        function AddFileModal(dialogController, http, notificationService) {
            this.dialogController = dialogController;
            this.http = http;
            this.notificationService = notificationService;
            this.file = null;
            this.showLoader = false;
        }
        AddFileModal.prototype.ok = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var form;
                return __generator(this, function (_a) {
                    form = new FormData();
                    form.append('file', this.file[0]);
                    this.showLoader = true;
                    this.http
                        .post("/api/storage/upload", form)
                        .then(function (response) {
                        _this.dialogController.close(true);
                        _this.showLoader = false;
                        _this.notificationService.success("Файл загружен", { timeout: 3000 });
                    })
                        .catch(function (error) {
                        console.log(error);
                        _this.notificationService.warning("Ошибка при загрузке файла", { timeout: 3000 });
                    });
                    return [2];
                });
            });
        };
        AddFileModal = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController, aurelia_http_client_1.HttpClient, aurelia_notify_1.NotificationService])
        ], AddFileModal);
        return AddFileModal;
    }());
    exports.AddFileModal = AddFileModal;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/resources/elements/color-selector/color-selector',["require", "exports", "aurelia-templating", "aurelia-framework"], function (require, exports, aurelia_templating_1, aurelia_framework_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserItem = (function () {
        function UserItem() {
            this.showColor = false;
            this.colors = ["000000", "434343", "666666", "999999", "B7B7B7", "CCCCCC", "D9D9D9", "EFEFEF", "F3F3F3", "FFFFFF", "980000", "FF0000", "FF9900", "FFFF00", "00FF00", "00FFFF", "4A86E8", "0000FF", "9900FF", "FF00FF", "E6B8AF", "F4CCCC", "FCE5CD", "FFF2CC", "D9EAD3", "D0E0E3", "C9DAF8", "CFE2F3", "D9D2E9", "EAD1DC", "DD7E6B", "EA9999", "F9CB9C", "FFE599", "B6D7A8", "A2C4C9", "A4C2F4", "9FC5E8", "B4A7D6", "D5A6BD", "CC4125", "E06666", "F6B26B", "FFD966", "93C47D", "76A5AF", "6D9EEB", "6FA8DC", "8E7CC3", "C27BA0", "A61C00", "CC0000", "E69138", "F1C232", "6AA84F", "45818E", "3C78D8", "3D85C6", "674EA7", "A64D79", "85200C", "990000", "B45F06", "BF9000", "38761D", "134F5C", "1155CC", "0B5394", "351C75", "741B47", "5B0F00", "660000", "783F04", "7F6000", "274E13", "0C343D", "1C4587", "073763", "20124D", "4C1130"];
        }
        UserItem.prototype.onClickShowColor = function () {
            this.showColor = !this.showColor;
        };
        UserItem.prototype.onSelectedColor = function (color) {
            this.showColor = false;
            this.selectedColor = color;
        };
        UserItem.prototype.onBlurHideColor = function (event) {
            this.showColor = (event.relatedTarget && event.relatedTarget.classList.contains("colorscheme"));
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], UserItem.prototype, "selectedColor", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", String)
        ], UserItem.prototype, "colorSelectorType", void 0);
        UserItem = __decorate([
            aurelia_framework_1.autoinject,
            aurelia_framework_1.customElement("color-selector")
        ], UserItem);
        return UserItem;
    }());
    exports.UserItem = UserItem;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('app/resources/elements/loader/loader',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var loader = (function () {
        function loader() {
            this.numberOfCircles = 12;
        }
        loader = __decorate([
            aurelia_framework_1.autoinject,
            aurelia_framework_1.customElement("loader")
        ], loader);
        return loader;
    }());
    exports.loader = loader;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('app/resources/elements/modals/change-nav-modal',["require", "exports", "aurelia-dependency-injection", "aurelia-dialog"], function (require, exports, aurelia_dependency_injection_1, aurelia_dialog_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChangeNavModal = (function () {
        function ChangeNavModal(dialogController) {
            this.dialogController = dialogController;
        }
        ChangeNavModal.prototype.ok = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.dialogController.close(true);
                    return [2];
                });
            });
        };
        ChangeNavModal = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
        ], ChangeNavModal);
        return ChangeNavModal;
    }());
    exports.ChangeNavModal = ChangeNavModal;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('app/shells/home/sidebar/sidebar-shell',["require", "exports", "aurelia-framework", "aurelia-dialog", "./modals/add-user-modal", "aurelia-router"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, add_user_modal_1, aurelia_router_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var SidebarShell = (function () {
        function SidebarShell(dialogService) {
            this.dialogService = dialogService;
            this.users = [];
        }
        SidebarShell.prototype.determineActivationStrategy = function () {
            return aurelia_router_1.activationStrategy.invokeLifecycle;
        };
        SidebarShell.prototype.attached = function () {
            this.reload();
        };
        SidebarShell.prototype.reload = function () {
            return __awaiter(this, void 0, void 0, function () {
                var i;
                return __generator(this, function (_a) {
                    this.users = [];
                    for (i = 0; i < 10; i++) {
                        this.users.push({
                            Id: i,
                            Name: "User " + i,
                            Created: new Date().toLocaleString()
                        });
                    }
                    return [2];
                });
            });
        };
        SidebarShell.prototype.add = function () {
            var _this = this;
            this.dialogService.open({ viewModel: add_user_modal_1.AddUserModal, model: {} })
                .whenClosed(function (response) {
                if (!response.wasCancelled) {
                    _this.users.push({ Id: _this.users.length, Name: response.output.Name, Created: new Date().toLocaleString() });
                }
            });
        };
        SidebarShell.prototype.delete = function (user, e) {
            if (this.users.length == 1)
                return;
            var i = this.users.findIndex(function (u) { return u.Id == user.Id; });
            this.users.splice(i, 1);
        };
        SidebarShell = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogService])
        ], SidebarShell);
        return SidebarShell;
    }());
    exports.SidebarShell = SidebarShell;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/shells/home/users/users-shell',["require", "exports", "aurelia-http-client", "aurelia-dependency-injection"], function (require, exports, aurelia_http_client_1, aurelia_dependency_injection_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var UsersShell = (function () {
        function UsersShell(http) {
            this.http = http;
        }
        UsersShell.prototype.activate = function (params, routeConfig, navigationInstruction) {
            this.userId = params.id;
        };
        UsersShell.prototype.attached = function () {
            this.http
                .createRequest("/api/testing/success")
                .asGet()
                .send()
                .then(function (r) {
                console.log("%c Success: " + r.content.Value, "background: green; color: white");
            });
        };
        UsersShell = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient])
        ], UsersShell);
        return UsersShell;
    }());
    exports.UsersShell = UsersShell;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app/shells/home/sidebar/item/item',["require", "exports", "aurelia-router", "aurelia-templating", "aurelia-framework"], function (require, exports, aurelia_router_1, aurelia_templating_1, aurelia_framework_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserItem = (function () {
        function UserItem(router) {
            this.router = router;
            this.data = undefined;
            this.isLoading = false;
        }
        UserItem.prototype.showUserInfo = function (e) {
            this.router.navigateToRoute("user", { id: this.data.Id });
        };
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Object)
        ], UserItem.prototype, "data", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Boolean)
        ], UserItem.prototype, "isLoading", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Object)
        ], UserItem.prototype, "delete", void 0);
        UserItem = __decorate([
            aurelia_framework_1.autoinject,
            aurelia_framework_1.customElement("user-item"),
            __metadata("design:paramtypes", [aurelia_router_1.Router])
        ], UserItem);
        return UserItem;
    }());
    exports.UserItem = UserItem;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('app/shells/home/sidebar/modals/add-user-modal',["require", "exports", "aurelia-dialog", "aurelia-dependency-injection"], function (require, exports, aurelia_dialog_1, aurelia_dependency_injection_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddUserModal = (function () {
        function AddUserModal(dialogController) {
            this.dialogController = dialogController;
            this.isLoading = false;
        }
        AddUserModal.prototype.activate = function () {
        };
        AddUserModal.prototype.ok = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.dialogController.close(true, this.data);
                    return [2];
                });
            });
        };
        AddUserModal = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
        ], AddUserModal);
        return AddUserModal;
    }());
    exports.AddUserModal = AddUserModal;
});



define('text!app/shell.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"app/assets/styles/propeller.css\"></require>\r\n    <require from=\"app/assets/styles/app.css\"></require>\r\n    <require from=\"app/assets/styles/dialog-styles.css\"></require>\r\n    \r\n    <require from=\"./nav-bar/nav-bar\"></require>\r\n\r\n    <nav-bar router.bind=\"router\"></nav-bar>\r\n    <section class=\"content height-inherit\">\r\n        <router-view></router-view>\r\n    </section>\r\n</template>"; });
define('text!app/layout/layout.html', ['module'], function(module) { module.exports = "<template>\r\n        <loader if.bind=\"showLoader\"></loader> \r\n        <require from=\"./layout.css\"></require>\r\n        <require from=\"./ui-elements/ui-elements\"></require>\r\n        <div class=\"layout\" if.bind=\"showLayout\">\r\n                <div class=\"layout-container\">\r\n                    <div class=\"col-xs-4 \">\r\n                            <div class=\"row radio-row\">\r\n                                <div class=\"col-xs-2 check-position\">\r\n                                    <div class=\"radio-container\">\r\n                                        <label class=\"top-checkbox checkbox-inline pmd-radio pmd-radio-ripple-effect\">\r\n                                                <input type=\"radio\"  name=\"layouttype\" model.bind=\"1\" checked.bind=\"layoutSettings.Variant\"  class=\"pm-ini\">\r\n                                            <span class=\"pmd-radio-label\"></span>\r\n                                        </label>\r\n                                    </div>\r\n                                </div>  \r\n                                <div class=\"col-xs-10 img-container\" >\r\n                                    <div class=\"pmd-card-top-layout pmd-card pmd-z-depth-1\"></div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"row radio-row\">\r\n                                <div class=\"col-xs-2 check-position\">\r\n                                    <div class=\"radio-container\">\r\n                                        <label class=\"bot-checkbox checkbox-inline pmd-radio pmd-radio-ripple-effect\">\r\n                                            <input type=\"radio\"  model.bind=\"2\" checked.bind=\"layoutSettings.Variant\" name=\"layouttype\" class=\"pm-ini\">\r\n                                            <span class=\"pmd-radio-label\"></span>\r\n                                        </label>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"col-xs-10 img-container\">                     \r\n                                    <div class=\"pmd-card-bot-layout pmd-card pmd-z-depth-1\"></div>                        \r\n                                </div>\r\n                            </div>\r\n                    </div>\r\n                    <div class=\"col-xs-8 right-container pmd-z-depth-1\">\r\n                            <div class=\"row\">    \r\n                                <div class=\"col-xs-3\">\r\n                                    Название мероприятия\r\n                                </div>\r\n                                <div class=\"col-xs-4 hor-padding\">\r\n                                    <input type=\"text\" value.bind=\"layoutSettings.EventName\"  class=\"form-control\" >\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"row\">    \r\n                                    <div class=\"col-xs-3\">\r\n                                        Логотип\r\n                                    </div>\r\n                                    <div class=\"col-xs-4 hor-padding\">\r\n                                        <select value.bind=\"layoutSettings.Logo.src\"  class=\"form-control\">\r\n                                            <option value=\"\"></option>\r\n                                            <option repeat.for=\"img of imgList\">${img.FileName}</option>\r\n                                        </select>\r\n                                    </div>\r\n                                    <div class=\"col-xs-5\">\r\n                                        <span class=\"crosses-position mdi mdi-arrow-expand-all\"></span>\r\n                                        <select value.bind=\"layoutSettings.Logo.Foreground\" class=\"logo-sett form-control\">\r\n                                            <option model.bind=\"1\">Вверху-слева</option>\r\n                                            <option model.bind=\"2\">Вверху-справа</option>\r\n                                            <option model.bind=\"3\">Ввeрху-центр</option>\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"row\">    \r\n                                    <div class=\"col-xs-3\">\r\n                                        Цвет фона/<br />изображение\r\n                                    </div>\r\n                                    <div class=\"col-xs-4 hor-padding\">\r\n                                        <select value.bind=\"layoutSettings.Background.backgroundImage\" class=\"form-control\">\r\n                                            <option value=\"\"></option>    \r\n                                            <option repeat.for=\"img of imgList\">${img.FileName}</option>\r\n                                        </select>\r\n                                    </div>\r\n                                    <div class=\"col-xs-5\">\r\n                                        <div class=\"btn-group-top\">\r\n                                                <color-selector selected-color.bind=\"layoutSettings.Background.backgroundColor\" color-selector-type = 'backgroundColor'></color-selector>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            \r\n                                <div class=\"bot-line\">\r\n                                    <h3 class=\"line-text pallete-line\"><span class=\"mdi mdi-palette\"></span>Цвет/фон/шрифты для элементов интерфейса</h3>\r\n                                </div>\r\n                                <ui-elements style.bind=\"layoutSettings.Name\"  title = 'Название мероприятия/ события/компании' show-background-selector.bind=\"false\"></ui-elements> \r\n                                <ui-elements style.bind=\"layoutSettings.FirstLevelButtons\"  title = 'Кнопки первого уровня'></ui-elements>\r\n                                <ui-elements style.bind=\"layoutSettings.PrintButtons\"  title = 'Кнопки печати'></ui-elements>\r\n                                <ui-elements style.bind=\"layoutSettings.WindowTitles\"  title = 'Заголовки окон'></ui-elements>\r\n                                <ui-elements style.bind=\"layoutSettings.PrintMessages\"  title = 'Сообщения о печати'></ui-elements>\r\n                                <ui-elements style.bind=\"layoutSettings.Table\"  title = 'Таблица'></ui-elements> \r\n                                 <div class=\"row\">\r\n                                    <div class=\"col-md-3 padding-on-small\">\r\n                                        Сетка таблицы\r\n                                    </div>\r\n                                    <div class=\"col-xs-4 col-md-3\">\r\n                                        <div class=\"col-xs-6\">\r\n                                                <color-selector selected-color.bind=\"layoutSettings.TableGridColor\" color-selector-type = 'backgroundColor'></color-selector>\r\n                                        </div>                      \r\n                                        <div class=\"col-xs-6\">\r\n                                            <input type=\"number\" value.bind=\"layoutSettings.TableGridSize\" class=\"number-selector form-control\" value=\"1\">  \r\n                                        </div>                           \r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"btn-container\">\r\n                                    <button click.delegate=\"onSaveClick()\"  class=\"btn pmd-btn-raised pmd-ripple-effect btn-default\">\r\n                                        <span class=\"mdi mdi-content-save-outline\">Сохранить</span>\r\n                                    </button>        \r\n                                    <button click.delegate=\"onResetClick()\" class=\"pull-right btn pmd-btn-raised pmd-ripple-effect btn-default\">\r\n                                        <span class=\"mdi mdi-delete\">Сбросить</span>\r\n                                    </button>\r\n                                </div>               \r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </template>"; });
define('text!app/layout/layout.css', ['module'], function(module) { module.exports = "section.content {\n  overflow-y: auto; }\n  section.content .layout {\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-start;\n    padding: 20px; }\n    section.content .layout .mdi-palette:before {\n      padding-right: 15px; }\n    section.content .layout .layout-container {\n      width: 100%; }\n    section.content .layout .mdi::before {\n      font-size: 19px;\n      line-height: 19px; }\n    @media (min-width: 991px) {\n      section.content .layout .pmd-radio > span.pmd-radio-label:before {\n        width: 22px;\n        height: 22px;\n        left: 0;\n        top: 2px; }\n      section.content .layout .pmd-radio > span.pmd-radio-label:after {\n        top: 9px;\n        height: 8px;\n        width: 8px;\n        margin-top: 0;\n        left: 7px; } }\n    section.content .layout .right-container {\n      padding: 20px; }\n      section.content .layout .right-container .my-mrg div.hor-padding {\n        padding-left: 30px;\n        padding-right: 30px; }\n      section.content .layout .right-container .row:nth-child(1) {\n        line-height: 15px; }\n      section.content .layout .right-container .row {\n        line-height: 15px;\n        padding-top: 5px;\n        padding-bottom: 5px;\n        max-width: 1024px; }\n        @media (max-width: 991px) {\n          section.content .layout .right-container .row .padding-on-small {\n            padding-top: 10px;\n            padding-bottom: 10px;\n            text-align: center; }\n            section.content .layout .right-container .row .padding-on-small br {\n              display: none; } }\n    section.content .layout .input-group-addon {\n      font-size: 14px;\n      font-weight: 400;\n      line-height: 1;\n      color: #555;\n      text-align: left;\n      background-color: unset;\n      border: unset;\n      border-radius: unset; }\n    section.content .layout .form-control {\n      padding: 0;\n      height: 27px;\n      display: inline-block; }\n    section.content .layout .logo-sett {\n      max-width: 135px;\n      height: 27px; }\n    section.content .layout .dropdown {\n      position: relative;\n      display: inline-block; }\n    section.content .layout .btn-group > .btn:first-child {\n      width: 60px;\n      height: 26px;\n      padding-left: 3px;\n      padding-right: 3px;\n      font-size: 14px;\n      color: #555;\n      background-color: #fff;\n      background-image: none;\n      border: 1px solid #ccc;\n      border-radius: 4px !important;\n      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n      -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;\n      -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\n      transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; }\n    section.content .layout .bot-line {\n      border-bottom: 1px solid rgba(0, 0, 0, 0.14);\n      padding-left: 0;\n      margin-bottom: 15px;\n      padding-bottom: 10px;\n      margin-top: 10px; }\n    section.content .layout .btn-group-top {\n      padding-left: 24px; }\n    section.content .layout .number-selector {\n      width: 60px;\n      height: 26px;\n      text-align: center; }\n    section.content .layout .check-font {\n      width: 25px;\n      text-align: center;\n      font-weight: 600;\n      height: 26px;\n      color: #555;\n      background-color: #fff;\n      background-image: none;\n      border: 1px solid #ccc;\n      border-radius: 0 !important;\n      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n      -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;\n      -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\n      transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; }\n    section.content .layout .check-font:nth-child(1) {\n      border-radius: 4px 0 0 4px !important; }\n    section.content .layout .check-font:nth-child(3) {\n      border-radius: 0 4px 4px 0 !important; }\n    section.content .layout .font-italic {\n      font-style: italic;\n      border-left: 0;\n      border-right: 0; }\n    section.content .layout .font-underline {\n      text-decoration: underline; }\n    section.content .layout .mdi-delete:before {\n      content: \"\\F1C0\";\n      margin-right: 0 !important;\n      color: #424242 !important; }\n    section.content .layout .mdi-content-save-outline:before {\n      content: \"\\F817\";\n      margin-right: 0 !important;\n      color: #5d5d5d !important; }\n    section.content .layout input[type=number]::-webkit-inner-spin-button {\n      opacity: 1;\n      height: 25px;\n      width: 50px; }\n    section.content .layout .btn-container {\n      padding-top: 11.8%; }\n    section.content .layout .pmd-card-top-layout {\n      background: url(\"data:image/png;base64,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\") no-repeat; }\n    section.content .layout .pmd-card-bot-layout {\n      background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAY4AAAEoCAYAAABPQRaPAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAADsIAAA7CARUoSoAAABZBSURBVHhe7Z1bjxTV14ffz2bihXd+Ay/8BnwMbtSEOxNPICCCB+QoCh4IY0CJDCNyiIhCROQoyFGY+ufXb3UyjLure+9a3b1Xr+dJnkzPUF1VU2vYq+pXh/6/BgAAIAMaBwAAZEHjAACALGgcAACQBY0DAACyoHEAAEAWNA4AAMiCxgEAAFnQOAAAIAsaBwAAZEHjAACALGgcAACQBY0DAACyoHEAAEAWNA4AAMiCxgEAAFnQOAAAIAsaBwAAZEHjgKny9ddfD75+/vnnA3nNa17P5/WhQ4eaw4cPD16vrq4OvpZC44Cp8ejRo+ann35qvwOAefP48ePB188++2zwtRQaB5ijvZmlpaX2OwCokTt37rSv8qFxgDnnzp1rrl692n4HADXy4MGD5vbt2+13edA4AAACcv/+/Wbnzp3td3nQOMCc/fv3t68AYBGhcYA5wyupAKBu/vrrr/ZVHjQOAICgbNy4sX2VB40DzOl7qR8A1A2NA8whqgLwAVEVAABkQVQF1UBUBbDY0DjAHKIqAB8QVQEAQBZEVVANRFUAiw2NA8whqgLwAVEVAABkQVQF1UBUBbDYTKVx3L17dxBXfPnll8V+8cUXA1P/Nqm1zGPeqhaqyawgqgLwQVVR1aVLl5IDWMqcgXnUtMwj/e9r5ZP4AGA9VUVVGqRSg1dfcwbKUUadxywbB1EVwGLDEceYn6esfR4pZ9k4iKoAfEBUxTw6JaoCgPVUFVX9+eefzZEjR5ID2HpzBr9RMo/xqpnPCqIqgMVmKo1DcNTx/M9TTnMea5310QZRFYAPuAEQAACy4AZAqAaiKoD/Z3V1tbl8+XLz2muvNS+//PLgq77Xzz1D4wBzFjGqunXrVnPy5Mnmk08+ad5///3mrbfees4tW7YM/u27775rrl27NteB4enTp82VK1eao0ePNrt27Rqs2/r11e8wXN/r16+375w+nrZjHx4+fDiIiV999dXmhRde+I/6uf5d080Toipwy6NHj5qPP/74P4PIUA0i8+DJkyfNjz/+2GzdujW5Xl1qANR6z3Jg0CBw8ODB5u23306uU5f6HVdWVgZNxxpv27GUtUcXL730UrJhrFfTzfMohKgKqiE3qqqtceg/8OnTp5v33nsvuT45vvvuu83x48enMiAPuXPnTrNnz57k8nPdtm1bc/HixXbO/fC2HUsZd3QxqbUchUwCjQPMyY2qamoc9+/fb/bt25dcjz4qfrF+XpgG5hMnTgwG1dQy+6gB7PHjx+2S8vG0HUsoObqY1FkehRBVgVtqaRzac9+5c2dyHSzU3rxyewsU/+gy7NRyrFRNSgZpT9sxF6uji0md9lEIURVUg8eoSgNk1zpYuX379sEJ4j7oSODAgQPJ+VuqvfvcAcvTdpyUaR5dTOq8z4WsZyqNQ388iivUKUvNuQlulBbzWO+xY8cGAx2MxltUpdxcJ5VTy16rTjprut9///25vwG91tMSDh8+PFFspN+1dA9S63ro0KHkfNerE8uqhdZt7fpqHrdv3x5c3aS999R7SwZmT9txEmZ9dDGplkchPKtqhvOY5eM7IqABY56NQwNoarlr1clnRTDj0H/mSQZP/a2VnOhdXl5Ozm+tOhmtk9KT7JlqmgsXLjx3ye7mzZsHe7a5eNqOo6jh6GJSLY5CeKz6hFrMg8bRjaeo6saNG8n7CdaaOzjpP/HS0lJyXkO1R537d6Rcf+0An1LbcZKBeT06mb13797B0cCZM2fan06Op+3YhY6yXnnlleRAXata31nFdkM44hjz85Q0jm48RVV6GGdqmUMVC5Xs0eo94yIlNVid5J6ESeZXck5iLVqGbhwswct2HEe0xkFUNcN50DhsmVfj0H+2rpvS+p6A1SDe9Xtpb1k5/yRouq7cf5Yni9fjaTuOQ+sZqXHwWPUZzUO/l34/GI2XqOr7779PLm+ozif0RecPuu7k1t/UJGi61Pul5v/zzz+3U84eT9sxh3/++afZsGFDcrCet1ovrd+8mErjEIt61MHRxng8RFWKNnbv3p1cnvzggw9MbjQbtxxd1fT333+3U6cZt0ev+VtFNbl42o4laNvr0udNmzZVo9anzxHcWrgBENwyj8Yx7kTzN998007Zn66rjbQX/csvv7RTptEVUqn3Sr1fe+PzwtN2hP/CDYBQDR6iKkU7qWXJd955x/TIsu/g2nWzn9UefSmetmMfRp37WHt+YZbTzBsaB5jjIarSIJNallTsYTkY6/f76KOPksuSarT//vtvO/XzKMdWc0i9T+peh3niZTv2xWrAt5rGCqIqcMusG4cu8dQ9C6llSV3W2ucBfym6bmZTYxh1ovOPP/7ofLqsYqx54Wk79sVqwLeaxgqiKqiG2qOqccubxl68fofUsqRunLt582Y75fOcP38++R6py1BL77uwwNN27IvVgG81zbyhcYA5tUdVik+6rlKyXp7oOsGtI4pRDaDrhPA0B8pJ8LQd+2I14FtNYwVRFbglQuM4d+5cclmya8DTuqTeI/U7WJ5DyMXTduyL1YBvNY0VRFVQDbVHVeMGPO3lW9M14En9e4quxpFz8nnc8kfZ1Zw8bce+WA34VtPMm6k0Dv1BKa5I3UA3qZPcjDfOec9D22DS/9iLhPeoahp3YU+jcWibadtNwjwaR03bsS9WA77VNFbwrKoK5pFSTwqGbqJHVV03r3U1jq5BfT3zaBw1bce+WA34VtNYwWPVJ3TW84jYOLxHVbMe8GZxjiNC4+Acx+zgiGPMz1PmTBuxcdQeVY27qW4adyB3NYCuAe/48ePJ98icq6qm0Tg8bce+WA34VtNYQVRVwTxSElWNZ9aNY9zy9IgPa/RxqKllya7BuWvAz7mPYxqNw9N27IvVgG81jRU8Vr2CeaS0fFaPF2qPqkTXHcg7d+5sHjx40E7ZHz0GQ9sktSypx2hoG6RQY+j6HA6rE9Cj9uTHDcZetmNfrAZ8q2nmzVQah+CoI+7RRu1RleiKPPQgPT1QzwoNvLp0NrUs2bVnro+B1eCdep/UHrgFpY3Dy3bsi9WAbzWNFdwACG6ZR+PQ1Te6Cie1PGn5DKhxy9J5jFHoWU965lPqfdJqr760cXjZjn2xGvCtprGCGwChGjxEVfrQn6691/379xd9RnaKrifITvLo8a73W31samnj8LQd+2A14FtNM29oHGCOh6hKg5kGtdTy5ObNm00+IliDbteVR5McMYz7vPFDhw71HpxLG4en7dgHqwHfahoriKrALfNoHGJlZSW5vKHffvttO2U54z6P++jRo+2Uo3n48GGza9eu5PulLkO9fPlyO3UZpY1DeNmOfbAa8K2msYKoCqrBQ1Qlxu3Fam+5z4Cs/+RdMU7O3vjy8nJyHkN1HkQNppQ+jcPTdsxhdXV1sF1ffPHF/wzi81Tro/XS+s0LGgeY4yGqGjJuT7Z0QNbv1HXpqMyJmO7fvz+IY1LzGdonsurTOISX7ZjDqD3/GrQ6+iCqArfMs3Hcu3ev2bFjR3K5Q3fv3p016D158mQwmKXmNbTkUlXds9F1VZHUfRUln7rXt3F42o6TEqFxEFVBNXiJqoacPXt27ICsKObq1avtO0aj+y60d52ax1pLLh3VXvW4gVQq1rl48WL7rvHo9xoVNU3aOISX7Qj9mUrj0B+a4orUTXGTmnMz3ihrmccsreFOdeuoysKujzHVgKwap963Xu01X7hw4bkreLT+uvJJN6Cl3rNeNVbtTZegAbXrfMJa1UCWlpYG+f/6K450hKAbVD/99NPke4fmNA5P27EL7clrHTZt2lS9Ws8+Rx48qyrgPFIeO3Zs8B/QE/NuHEIRigaz1Hst1XkKDf590ECxffv25PytzWkcwtN2TKEHN27YsCEZD9Wq1lfrXQKPVZ/QRZpHyhoah3VUZeG4xiGmPehZDnY3btwYe07BQl3mmnvi2dN2XE/N5zVGaXW+IweOOMb8PGUt80hZQ+PwFlWtRdHHV199lZxHH/ft2ze4MsoSDdD6vVLL66vuDenzrDVP23Et0RoHUVXAeaQkqko7aeMYopPLXfcOTKoGYD2vaZrX3Fut61D9/eXEU1142o4iWuPgserMY6Cup583XqOq9WivWTfelQx8ukz0xIkTRZfGlqAB9fz58513mHepR5roCMGqYazF03aEyZhK4xAcdTz/85QW81hrLUcbuVGVB7RHd/LkyWbPnj2DT95LDXC6fFSXDl+/fr1913xQhKUPbtLfxIcffji4s3r9+up3GK6v7oOY1V3InrZjBLgBEAAAsuAGQKiG3KgKAHxB4wBzFjGqAlhEiKoAACALoiqoBqIqgMWGxgHmEFUB+ICoCgAAsiCqgmogqgJYbKbSOHisepk1PBLdAqIqAB/wrCpn80jp8TlTAOAXHqs+obXMI+WiNA6iKoDFhiOOMT9PaTGPlIvSOIiqAHxAVOVsHimJqgBglvBY9QWYRw2PRLeAqApgsZlK4xAcdTz/83Eu0tEGURWAD7gBEAAAsuAGQKgGoiqAxYbGAeYQVQH4gKgKAACyIKqCaiCqAlhsaBxgDlEVgA9u3rzZvsqDxgEAEJB79+4127Zta7/Lg8YB5qysrDRXrlxpvwOARYPGAVPh9OnT7SsAqJFTp061r/KhccDUuH37dnP27Nn2OwCYN/qsJHHy5MnB11JoHDBV9CgVcfny5eaNN97gNa95PafXeobgjh07Bq/7QuMAAIAsaBwAAJAFjQMAALKgcQAAQBY0DgAAyILGAQAAWdA4AAAgCxoHAABkQeMAAIAsaBwAAJAFjQMAALKgcQAAQBY0DgAAyILGAQAAWdA4AAAgCxoHAABkQeMAAIAsaBwAAJAFjQMAALKgcQAAQBY0DgAAyILGAQAAWdA4AAAgCxoHAABkQeMAAIAsaBwAAJAFjQMAALKgcQAAQBY0DgAAyILGAQAAWdA4AAAgCxoHAABkQeMAAIAsaBwAAJAFjQMAALKgcQAAQBY0DgAAyILGAQAAWdA4AAAgCxoHAABkQeMAAIAsaBwAAJAFjQMAALKgcQAAQBY0DgAAyILGAQAAWdA4AAAgCxoHAABkQeMAAIAsptI4VldXB1+vXbvWvPnmm82BAweap0+fDr7yer6vDx482Dx79qw5c+bMoEbTgPrX+3ra9af29b62rP1UGsfWrVubJ0+eNI8ePRp8xfr89ddfmx9++KGtmC3Uv36nVX9qX78WtTdvHOpoqZXFOr17925bORuovy8t60/tfdmn9qaN4/Tp04NullpJrFPV7OjRo20F+0H9/WlVf2rvzz61N20cx48fbx48eJBcSazXYS7dF+rvU4v6U3ufltbetHHoJExq5bBudSLTAurvU4v6U3ufltbetHHs3r07uXJYtxs3bmwr2A/q71OL+lN7n5bW3rRxHDlyJLlyWLfaW7SA+vvUov7U3qeltSeqwubq1attBftB/X1qUX9q79PS2hNVIVFVcImq4kpUhcVaRBWC+vvUov7U3qeltSeqQqKq4BJVxZWoCoslqootUVVciaqwWIuoQlB/n1rUn9r7tLT2RFVIVBVcoqq4ElVhsURVsSWqiitRFRZrEVUI6u9Ti/pTe5+W1p6oComqgktUFVeiKiyWqCq2RFVxJarCYi2iCkH9fWpRf2rv09LaE1UhUVVwiariSlSFxRJVxZaoKq5EVVisRVQhqL9PLepP7X1aWnuiKiSqCi5RVVyJqrBYoqrYElXFlagKi7WIKgT196lF/am9T0trT1SFRFXBJaqKK1EVFktUFVuiqrgSVWGxFlGFoP4+tag/tfdpae2JqpCoKrhEVXElqsJiiapiS1QVV6IqLNYiqhDU36cW9af2Pi2tPVEVElUFl6gqrkRVWCxRVWyJquJKVIXFWkQVgvr71KL+1N6npbUnqkKiquASVcWVqAqLJaqKLVFVXImqsFiLqEJQf59a1J/a+7S09kRVSFQVXKKquBJVYbFEVbElqoorURUWaxFVCOrvU4v6U3ufltaeqAqJqoJLVBVXoioslqgqtkRVcSWqwmItogpB/X1qUX9q79PS2hNVIVFVcImq4kpUhcUSVcWWqCquRFVYrEVUIai/Ty3qT+19Wlp7oiokqgouUVVciaqwWKKq2BJVxZWoCou1iCoE9fepRf2pvU9La09UhURVwSWqiitRFRZLVBVboqq4ElVhsRZRhaD+PrWoP7X3aWntiaqQqCq4RFVxJarCYomqYktUFVeiKizWIqoQ1N+nFvWn9j4trT1RFRJVBZeoKq5EVVgsUVVsiariSlSFxVpEFYL6+9Si/tTep6W1J6pCoqrgElXFlagKiyWqii1RVVyJqrBYi6hCUH+fWtSf2vu0tPZEVUhUFVyiqrgSVWGxRFWxJaqKK1EVFmsRVQjq71OL+lN7n5bWnqgKiaqCS1QVV6IqLJaoKrZEVXElqsJiLaIKQf19alF/au/T0toTVSFRVXCJquJKVIXFElXFlqgqrkRVWKxFVCGov08t6k/tfVpae6IqJKoKLlFVXImqsFiiqtgSVcWVqAqLtYgqBPX3qUX9qb1PS2tPVIVEVcElqoorURUWS1QVW6KquBJVYbEWUYWg/j61qD+192lp7YmqkKgquERVcSWqwmKJqmJLVBVXoios1iKqENTfpxb1p/Y+La09URUSVQWXqCquRFVYLFFVbImq4kpUhcVaRBWC+vvUov7U3qeltSeqQqKq4BJVxZWoCoslqootUVVciaqwWIuoQlB/n1rUn9r7tLT2RFVIVBVcoqq4ElVhsURVsSWqiitRFRZrEVUI6u9Ti/pTe5+W1p6oComqgktUFVeiKiyWqCq2RFVxJarCYi2iCkH9fWpRf2rv09LaE1UhUVVwiariSlSFxRJVxZaoKq5EVVisRVQhqL9PLepP7X1aWnuiKiSqCi5RVVyJqrBYoqrYElXFlagKi7WIKgT196lF/am9T0trT1SFRFXBJaqKK1EVFktUFVuiqrgSVWGxFlGFoP4+tag/tfdpae2JqpCoKrhEVXElqsJiiapiS1QVV6IqLNYiqhDU36cW9af2Pi2tPVEVElUFl6gqrkRVWCxRVWyJquJKVIXFWkQVgvr71KL+1N6npbUnqkKiquASVcWVqAqLJaqKLVFVXImqsFiLqEJQf59a1J/a+7S09kRVSFQVXKKquBJVYbFEVbElqoorURUWaxFVCOrvU4v6U3ufltaeqAqJqoJLVBVXoioslqgqtkRVcSWqwmItogpB/X1qUX9q79PS2ps2jmfPniVXDuv18ePHzc2bN9sK9oP6+9Oq/tTen31qb9o4VlZWmkuXLiVXEut0eXm5WVpaaivYD+rvT6v6U3t/9qm9aeMQp06dSq4k1qf2OLSnaAn196N1/am9H/vW3rxxCB3+aA8ktcJYh7du3Wr27t3bVswW6l+/06o/ta9fi9pPpXGIY8eONaurq81vv/3WvP7664OTMDqU5fV8X2/ZsmVQlxs3brSVmg7Uv87Xs6g/ta/ztWXtp9Y4AABgMaFxAABAFjQOAADIgsYBAABZ0DgAACALGgcAAGRB4wAAgCxoHAAAkAWNAwAAsqBxAABAFjQOAADIgsYBAAAT8/Tp0+Z/1LAp1yZpcR0AAAAASUVORK5CYII=\") no-repeat; }\n    section.content .layout .pmd-card-bot-layout,\n    section.content .layout .pmd-card-top-layout {\n      padding-top: 66%;\n      border: 2px solid #9e9e9e;\n      border-radius: 4px;\n      background-size: contain;\n      max-width: 90%; }\n    section.content .layout .check-position {\n      float: none;\n      display: flex;\n      align-items: center;\n      text-align: center; }\n    section.content .layout .radio-container {\n      margin-bottom: 65px; }\n    section.content .layout .img-container {\n      float: none; }\n  section.content .radio-row {\n    display: flex; }\n"; });
define('text!app/login/login.html', ['module'], function(module) { module.exports = "<template>\r\n        <require from=\"./login.css\"></require>\r\n        <div class=\"login\">\r\n           <div class=\"logincard pmd-card card-default pmd-z-depth\">\r\n              <div class=\"login-container pmd-card-body\">\r\n                  <h3>\r\n                      <div class=\"pmd-card-title card-header-border text-center\">Авторизация</div>\r\n                  </h3>          \r\n                  <div class=\"input-container pmd-card-body\">\r\n                      <form>\r\n                          <div class=\"form-group pmd-textfield\">\r\n                              <div class=\"input-group\">\r\n                                  <div class=\"input-group-addon\"><i class=\"mdi mdi-account-outline pmd-sm\"></i></div>\r\n                                  <input placeholder=\"Имя пользователя\" type=\"text\" autocomplete=\"username\" value.bind=\"userLogin & validate\" class=\"form-control\">                                  \r\n                                </div>\r\n                          </div>\r\n                          <div class=\"form-group pmd-textfield pmd-textfield-floating-label\">\r\n                              <div class=\"input-group\">\r\n                                  <div class=\"input-group-addon\"><i class=\"mdi mdi-lock-outline pmd-sm\"></i></div>\r\n                                  <input placeholder=\"Пароль\" type=\"password\" autocomplete=\"current-password\" value.bind=\"password & validate\" class=\"form-control\" >\r\n                              </div>\r\n                          </div>\r\n                      </form>\r\n                      <span class=\"help-block form-valid\" repeat.for=\"error of controller.errors\">\r\n                        ${error.message}\r\n                      </span>\r\n                  </div>\r\n                  <div class=\"pmd-card-footer card-footer-no-border card-footer-p16 text-center\">\r\n                      <a click.delegate=\"onLoginClick()\" type=\"button\" class=\"btn pmd-ripple-effect btn-primary btn-block\">Войти</a>    \r\n                  </div>               \r\n              </div>\r\n          </div>\r\n      </div>\r\n</template>\r\n"; });
define('text!app/login/login.css', ['module'], function(module) { module.exports = "body {\n  height: 100%; }\n\n.login {\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center; }\n  .login .login-container {\n    max-width: 333px; }\n    .login .login-container .sing-in {\n      display: inherit;\n      height: 35px;\n      font-size: 19px;\n      color: #444444;\n      background-color: #e0e0e0;\n      text-align: center;\n      border-width: 0;\n      border: 1px solid #9e9e9e;\n      padding-left: 7px; }\n    .login .login-container .card-header-border {\n      margin-bottom: 25px; }\n    .login .login-container .input-container .form-valid {\n      color: red; }\n    .login .login-container .input-container i.mdi:before {\n      font-size: 24px; }\n    .login .login-container .log-icon {\n      color: #424242;\n      font-size: 16px; }\n    .login .login-container .mdi::before {\n      font-size: 19px;\n      line-height: 14px;\n      top: 2px; }\n    .login .login-container .input-group {\n      width: 100%;\n      padding-left: 5px;\n      padding-top: 5px; }\n"; });
define('text!app/nav-bar/nav-bar.html', ['module'], function(module) { module.exports = "<template>\r\n    <div class=\"menu\">\r\n            <require from=\"./nav-bar.css\"></require>\r\n    <nav class=\"navbar navbar-inverse pmd-navbar pmd-z-depth \">\r\n            <div class=\"container-fluid\">\r\n                <div class=\"navbar-header\">\r\n                    <a class=\"navbar-brand cursor-default\">Информационный киоск</a>\r\n                </div>\r\n    \r\n                <div class=\"collapse navbar-collapse\">\r\n                    <ul class=\"nav navbar-nav\">\r\n                        <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\r\n                            <a href=\"${row.href}\" class=\"waves-effect waves-block\">\r\n                                <i class=\"${row.settings.icon}\"></i>\r\n                                <span>${row.settings.title}</span>\r\n                            </a>\r\n                        </li>\r\n                       \r\n                    </ul>\r\n                    <button class=\"btn pmd-btn-raised pmd-ripple-effect mdi mdi-logout-variant\" click.delegate=\"logout()\"></button> \r\n                </div> \r\n            </div>\r\n        </nav>\r\n    </div>\r\n</template>"; });
define('text!app/nav-bar/nav-bar.css', ['module'], function(module) { module.exports = ".menu .mdi-logout-variant {\n  float: right;\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  width: 70px;\n  border-radius: 0;\n  background-color: black;\n  color: white; }\n\nbody {\n  background-color: #fff;\n  font-family: inherit;\n  height: 100%;\n  display: flex;\n  flex-direction: column; }\n"; });
define('text!app/settings/settings.css', ['module'], function(module) { module.exports = ".height-100-relative {\n  display: flex;\n  flex-direction: column;\n  height: 100%; }\n  .height-100-relative .editor-content {\n    flex: 1;\n    overflow: auto; }\n  .height-100-relative .pmd-card {\n    margin-bottom: 15px; }\n  .height-100-relative .button-list {\n    display: flex;\n    flex-direction: column;\n    height: 100%; }\n  .height-100-relative .breadcrumb {\n    padding: .625rem .75rem; }\n"; });
define('text!app/settings/settings.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./settings.css\"></require>\r\n    <require from=\"./buttons-list/buttons-list\"></require>\r\n    <require from=\"./print-button-editor/print-button-editor\"></require>\r\n    <require from=\"./table-button-editor/table-button-editor\"></require>\r\n    <require from=\"./level-button-editor/level-button-editor\"></require>\r\n   <require from=\"./info-table-button-editor/info-table-button-editor\"></require>\r\n\r\n    <dragula-and-drop drop-fn.call=\"itemDropped(item, target, source, sibling)\"></dragula-and-drop>\r\n    <div class=\"col-xs-4 col-lg-3 height-100-relative\">\r\n        <buttons-list selected-button.bind=\"currentButton\" print-file-list.bind=\"printFileList\" class=\"button-list\" view-model.ref=\"buttonsList\" level.bind=\"level\"></buttons-list>\r\n    </div>\r\n\r\n    <div class=\"col-xs-8 col-lg-9 height-100-relative\">\r\n        <ol class=\"breadcrumb text-left\">\r\n            <li repeat.for=\"i of level\" css=\"${i + 1 == level ? 'color: #03A9F4' : ''}\">${getLevelName(i + 1)}</li>\r\n        </ol>\r\n        <div class=\"editor-content pmd-card pmd-z-depth\">\r\n            <print-button-editor if.bind=\"currentButton && currentButton.Print\" print-button.bind=\"currentButton\" print-file-list.bind=\"printFileList\"></print-button-editor>\r\n            <table-button-editor if.bind=\"currentButton && currentButton.Table && currentButton.Table.Common\" table-button.bind=\"currentButton\" print-file-list.bind=\"printFileList\" view-model.ref=\"tableButtonEditor\"></table-button-editor>\r\n            <level-button-editor if.bind=\"currentButton && currentButton.Level\" level-button.bind=\"currentButton\" on-next-level.call=\"onNextLevel()\"></level-button-editor>\r\n             <info-table-button-editor if.bind=\"currentButton && currentButton.Table && currentButton.Table.Info\" table-button.bind=\"currentButton\" print-file-list.bind=\"printFileList\" view-model.ref=\"infoTableButtonEditor\"></info-table-button-editor>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app/storage/storage.html', ['module'], function(module) { module.exports = "<template>\r\n        <require from=\"./storage.css\"></require>\r\n        <loader if.bind=\"showLoader\"></loader> \r\n    <div class=\"storage\" if.bind=\"showStorage\">\r\n        <button click.delegate=\"addNewFile()\" class=\"btn pmd-btn-raised pmd-ripple-effect btn-default mdi mdi-plus\"></button>\r\n    <table class=\"table table-bordered\">\r\n        <thead class=\"table-title\">\r\n          <tr>\r\n            <th scope=\"col\" class=\"title-font\">Ресурс</th>\r\n            <th scope=\"col\" class=\"title-font\">Тип</th>\r\n          </tr>\r\n        </thead>\r\n        <tbody>\r\n          <tr repeat.for=\"file of downloadedFiles\">\r\n            <td class=\"td-resource\">${file.FileName}</td>\r\n            <td>${file.FileType}</td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n</template>"; });
define('text!app/settings/table-button-editor.css', ['module'], function(module) { module.exports = ".button-editor .form-group {\n  display: flex;\n  align-items: center; }\n  .button-editor .form-group div:first-child {\n    line-height: 1; }\n"; });
define('text!app/layout/modals/reset-modal.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./reset-modal.css\"></require>\r\n\r\n    <div class=\"reset-modal\">\r\n        <ux-dialog class=\"ux-dialog-sm\">\r\n            <ux-dialog-header class=\"modal-header\">\r\n                <div class=\"modal-title\">Сброс настроек</div>\r\n            </ux-dialog-header>\r\n\r\n            <ux-dialog-body class=\"modal-body\">\r\n                <i class=\"mdi mdi-alert\"></i>\r\n                Текущие настройки будут удалены. Продолжить?\r\n            </ux-dialog-body>\r\n\r\n            <ux-dialog-footer>\r\n                <button\r\n                    class=\"btn btn-primary pmd-btn-raised\"\r\n                    click.trigger=\"ok($event)\"\r\n                >\r\n                    <i class=\"mdi mdi-check\"></i>\r\n                    OK\r\n                </button>\r\n\r\n                <button\r\n                    class=\"btn btn-default pmd-btn-raised\"\r\n                    click.trigger=\"dialogController.cancel()\"\r\n                >Отмена</button>\r\n            </ux-dialog-footer>\r\n        </ux-dialog>\r\n    </div>\r\n</template>"; });
define('text!app/storage/storage.css', ['module'], function(module) { module.exports = ".storage {\n  padding: 20px; }\n  .storage .td-resource {\n    width: 70%; }\n  .storage tr {\n    height: 40px; }\n  .storage .mdi-plus {\n    margin-bottom: 10px; }\n"; });
define('text!app/layout/ui-elements/ui-elements.html', ['module'], function(module) { module.exports = "<template>\r\n        <require from=\"./ui-elements.css\"></require>\r\n<div class=\"ui-elements\">\r\n    <div class=\"row\">\r\n        <div class=\"col-md-3 padding-on-small\">\r\n            ${title}\r\n        </div>\r\n        <div class=\"col-xs-4 col-md-3\">\r\n            <div class=\"col-xs-6\">\r\n                    <color-selector selected-color.bind=\"style.color\" color-selector-type = 'textColor'></color-selector> \r\n            </div>\r\n            <div class=\"col-xs-6\">\r\n                    <color-selector if.bind=\"showBackgroundSelector\" selected-color.bind=\"style.backgroundColor\" color-selector-type = 'backgroundColor'></color-selector> \r\n            </div> \r\n        </div>\r\n        <div class=\"col-xs-3 col-md-2 col-lg-3\">\r\n            <select value.bind=\"style.fontFamily\" class=\"form-control\">\r\n                <option>Arial</option>\r\n                <option>Sans Serif</option>\r\n                <option>Times New Roman</option>\r\n                <option>Verdana</option>\r\n            </select>\r\n        </div>\r\n        <div class=\"col-xs-5 col-md-4 col-lg-3\">                          \r\n            <input value.bind=\"style.fontSize\" type=\"number\" class=\"number-selector form-control\">                         \r\n            <div class=\"check-container\">\r\n                <button click.delegate=\"onBoldClick()\" class=\"pull-left check-font ${style.fontWeight == 'bold' ? 'inset':''}\">B</button>\r\n                <button click.delegate=\"onItalicClick()\"  class=\"pull-left font-italic check-font ${style.fontStyle == 'italic' ? 'inset':''}\">I</button>\r\n                <button click.delegate=\"onUnderlineClick()\"   class=\"pull-left font-underline check-font ${style.textDecoration == 'underline' ? 'inset':''}\">U</button>\r\n            </div>                           \r\n        </div>\r\n    </div>\r\n</div>\r\n</template>"; });
define('text!app/assets/styles/app.css', ['module'], function(module) { module.exports = "html {\n  display: block;\n  height: 100vh;\n  overflow: hidden; }\n\nsection.content {\n  flex: 1;\n  padding-top: 0px;\n  margin: 0;\n  overflow: hidden; }\n\n/*MDI icons*/\n.mdi::before {\n  font-size: 24px;\n  line-height: 24px; }\n\n.btn .mdi::before {\n  position: relative; }\n\n.btn-xs .mdi::before {\n  font-size: 18px;\n  top: 3px; }\n\n.btn-sm .mdi::before {\n  font-size: 18px;\n  top: 3px; }\n\n.card-item .header {\n  background: #eee;\n  font-size: 18px;\n  padding: 4px 4px; }\n  .card-item .header.active {\n    background-color: #337ab7;\n    color: #fff; }\n    .card-item .header.active:hover {\n      background: #337ab7; }\n\n.height-100 {\n  height: 100%; }\n\n.width-100 {\n  width: 100%; }\n\n.cursor-pointer {\n  cursor: pointer !important; }\n\n.overflow-hidden {\n  overflow: hidden !important; }\n\n.overflow-scroll-y {\n  overflow-y: scroll !important; }\n\nnotification-host {\n  display: block;\n  transition: opacity .2s linear;\n  position: absolute;\n  left: 10%;\n  right: 10%;\n  top: 0;\n  z-index: 1000; }\n\n.mdi-check:before {\n  font-size: 18px;\n  line-height: 0; }\n"; });
define('text!app/settings/add-custom-button/add-custom-button.html', ['module'], function(module) { module.exports = "<template>\r\n        <require from=\"./add-custom-button.css\"></require>\r\n    <div class=\"add-btn-modal\">\r\n    <ux-dialog class=\"ux-dialog-sm\">\r\n        <ux-dialog-header class=\"modal-header\">\r\n            <div class=\"modal-title\">\r\n                Добавить новою кнопку\r\n            </div>\r\n        </ux-dialog-header>\r\n        <ux-dialog-body>\r\n            <form class=\"bg-white\">\r\n                <div class=\"form-group\">\r\n                    <select value.bind=\"selectedButtonType\" class=\"form-control\">\r\n                            <option repeat.for=\"buttonType of buttonTypes\" model.bind=\"buttonType\">\r\n                             ${buttonType.name}\r\n                            </option>\r\n                    </select>\r\n                </div>\r\n\r\n            </form>\r\n        </ux-dialog-body>\r\n\r\n        <ux-dialog-footer>\r\n            <button class=\"btn btn-primary pmd-btn-raised\" click.trigger=\"ok($event)\">\r\n                <i class=\"mdi mdi-check\"></i> Да\r\n            </button>\r\n\r\n            <button class=\"btn btn-default pmd-btn-raised\" click.trigger=\"dialogController.cancel()\">Отмена</button>\r\n        </ux-dialog-footer>\r\n\r\n        <au-loader if.bind=\"isLoading\"></au-loader>\r\n    </ux-dialog>\r\n</div>\r\n</template>"; });
define('text!app/settings/buttons-list/buttons-list.html', ['module'], function(module) { module.exports = "<template>\r\n    <loader if.bind=\"showLoader\"></loader>\r\n    <require from=\"./buttons-list.css\"></require>\r\n\r\n    <div class=\"height-100-relative-title-line\">\r\n        <button\r\n            click.delegate=\"onBtnSaveClick()\"\r\n            class=\"btn pmd-btn-raised pmd-ripple-effect btn-default mdi mdi-content-save-outline\"\r\n        ></button>\r\n\r\n        <button\r\n            click.delegate=\"add()\"\r\n            class=\"btn pmd-btn-raised pmd-ripple-effect btn-default mdi mdi-plus\"\r\n        ></button>\r\n\r\n        <button\r\n            click.delegate=\"remove()\"\r\n            class=\"btn pmd-btn-raised pmd-ripple-effect btn-default mdi mdi-close\"\r\n        ></button>\r\n\r\n        <button class=\"btn pmd-btn-raised pmd-ripple-effect btn-default mdi mdi-arrow-left-bold pull-right\" disabled.bind=\"isMainLevel\" click.delegate=\"onPrevLevel()\"></button>\r\n    </div>\r\n\r\n    <div class=\"pmd-card pmd-z-depth pmd-card-settings-group overflow-scroll-y\">\r\n        \r\n\r\n        <div data-type=\"ButtonsList\" class=\"drag-source drop-target drop-style pmd-card-body overflow-hidden\">\r\n            <div\r\n                repeat.for=\"button of currentLevelButtons\"\r\n                data-index=\"${$index}\"\r\n                css=\"background:${button == selectedButton ? '#eeeeee' : 'none'}\"\r\n                click.delegate=\"selectButton(button)\"\r\n                class=\"settings-list-item pmd-card pmd-z-depth cursor-pointer\"\r\n            >\r\n                <div\r\n                    if.bind=\"button.Level\"\r\n                    class=\"pull-right mdi mdi-subdirectory-arrow-right\"\r\n                ></div>\r\n\r\n                <div\r\n                    if.bind=\"button.Print\"\r\n                    class=\"pull-right mdi mdi-printer\"\r\n                ></div>\r\n\r\n                <div\r\n                    if.bind=\"button.Table && button.Table.Common\"\r\n                    class=\"pull-right mdi mdi-calendar\"\r\n                ></div>\r\n\r\n                <div\r\n                if.bind=\"button.Table && button.Table.Info\"\r\n                class=\"pull-right mdi mdi-table\"\r\n            ></div>\r\n\r\n                ${button.Text}\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app/assets/styles/dialog-styles.css', ['module'], function(module) { module.exports = "ux-dialog-overlay.active {\n  opacity: 0.5;\n  background: rgba(0, 0, 0, 0.6); }\n\nux-dialog-container {\n  overflow: hidden; }\n  ux-dialog-container ux-dialog {\n    background-color: white;\n    text-align: center;\n    overflow: hidden;\n    border-radius: 0;\n    border: none;\n    padding: 0; }\n    ux-dialog-container ux-dialog .modal-header {\n      background-color: #4285f4 !important;\n      color: #fff; }\n    ux-dialog-container ux-dialog > ux-dialog-header {\n      border-radius: 0; }\n    ux-dialog-container ux-dialog > ux-dialog-body {\n      background-color: #ededed;\n      display: block;\n      padding: 0px; }\n    ux-dialog-container ux-dialog > ux-dialog-footer button {\n      width: 100px; }\n\n.ux-dialog-sm {\n  height: 15vh !important;\n  width: 30vw !important;\n  max-height: 15vh !important;\n  max-width: 30vw !important;\n  min-height: 15vh !important;\n  min-width: 30vw !important; }\n\n.ux-dialog-md {\n  height: 75vh !important;\n  width: 45vw !important;\n  max-height: 75vh !important;\n  max-width: 45vw !important;\n  min-height: 75vh !important;\n  min-width: 45vw !important; }\n  .ux-dialog-md ux-dialog-body {\n    max-height: calc(75vh - 105px);\n    height: calc(75vh - 105px);\n    min-height: calc(75vh - 105px);\n    overflow-y: auto; }\n\n.ux-dialog-lg {\n  height: 90vh !important;\n  width: 90vw !important;\n  max-height: 90vh !important;\n  max-width: 90vw !important;\n  min-height: 90vh !important;\n  min-width: 90vw !important; }\n  .ux-dialog-lg ux-dialog-body {\n    max-height: calc(90vh - 105px);\n    height: calc(90vh - 105px);\n    min-height: calc(90vh - 105px);\n    overflow-y: auto; }\n"; });
define('text!app/assets/styles/propeller.css', ['module'], function(module) { module.exports = ""; });
define('text!app/settings/grid/grid.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./grid.css\"></require>\r\n\r\n              \r\n                <table class=\"table table-bordered grid\">\r\n                <thead class=\"table-title\">\r\n                    <tr class=\"text-wrap\">\r\n                        <th scope=\"col\" class=\"title-font\" if.bind=\"dateTimeColumn\" css=\"width:${tableButton.Table.ColumnWidths[0]}%\">Время</th>\r\n                        <th scope=\"col\" class=\"title-font\" if.bind=\"tableButton.Table.Info && showImgNumber\" css=\"width:${tableButton.Table.ColumnWidths[0]}%\">Номер</th>\r\n                        <th scope=\"col\" class=\"title-font\" repeat.for=\"i of columnsCount\" css=\"width:${tableButton.Table.ColumnWidths[$index + 1]}%\">\r\n                            <span if.bind=\"tableButton.Table.Common\">Колонка ${$index + 1}</span>\r\n                            <span if.bind=\"tableButton.Table.Info && $index==0\">Изображенние</span>\r\n                            <span if.bind=\"tableButton.Table.Info && $index==1\">Описание</span>\r\n                        </th>\r\n                        <th scope=\"col\" class=\"title-font\" if.bind=\"printFileColumn\" css=\"width:${tableButton.Table.ColumnWidths[tableButton.Table.ColumnWidths.length - 1]}%\">Файл для печати</th>\r\n                        <th scope=\"col\" class=\"title-font last-column\"></th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                 \r\n                  <tr class=\"percent\">\r\n                    <td repeat.for=\"width of tableButton.Table.ColumnWidths\" ><input type=\"text\"  class=\"form-control\" value.bind=\"editPercentRow[$index]\"/>%</td>\r\n                    <td class=\"text-center\">\r\n                        <button\r\n                            click.delegate=\"saveClick()\"\r\n                            class=\"btn pmd-btn-raised pmd-ripple-effect btn-default mdi mdi-content-save-outline\"\r\n                        ></button>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td if.bind=\"dateTimeColumn\" > \r\n                        <aurelia-flatpickr if.bind=\"dateTimeColumn == 'DateTime'\" config.bind='{ noCalendar: false, altInput: true, altFormat: \"d.m.Y H:i\", time_24hr: true }' value.bind=\"addDetaTime\"></aurelia-flatpickr>\r\n                        <aurelia-flatpickr if.bind=\"dateTimeColumn == 'Time'\" config.bind='{ noCalendar: true, altInput: true, altFormat: \"H:i\", time_24hr: true }' value.bind=\"addDetaTime\"></aurelia-flatpickr>\r\n                    </td>\r\n                    <td if.bind=\"tableButton.Table.Info  && showImgNumber\" > \r\n                            \r\n                    </td>\r\n                    <td  repeat.for=\"i of columnsCount\" >\r\n                         <select if.bind=\"tableButton.Table.Info  && $index == 0\"\r\n                                value.bind=\"rowToAdd[showImgNumber ? 1 : 0]\"\r\n                                class=\"form-control\"\r\n                            >\r\n                            <option value=\"\"></option>\r\n                            <option repeat.for=\"image of imageList\">${image.FileName}</option>\r\n                        </select>\r\n                        <textarea  rows=\"4\" if.bind=\"tableButton.Table.Info && $index != 0\" class=\"form-control\" value.bind=\"rowToAdd[$index+(showImgNumber ? 1 : 0)]\"></textarea>\r\n                        <textarea  rows=\"4\"  if.bind=\"tableButton.Table.Common\" class=\"form-control\" value.bind=\"rowToAdd[$index + (tableButton.Table.Common.DateTimeColumn ? 1 : 0)]\"></textarea></td>\r\n                        <td if.bind=\"printFileColumn\" >\r\n                        <select\r\n                            value.bind=\"rowToAdd[rowToAdd.length - 1]\"\r\n                            class=\"form-control\"\r\n                        >\r\n                            <option value=\"\"></option>\r\n                            <option repeat.for=\"printFile of printFileList\">${printFile.FileName}</option>\r\n                        </select>\r\n                    </td>\r\n                    <td class=\"text-center\">\r\n                        <button\r\n                            click.delegate=\"addRow()\"\r\n                            class=\"btn pmd-btn-raised pmd-ripple-effect btn-default mdi mdi-plus\"\r\n                        ></button>\r\n                    </td>\r\n                </tr>\r\n                </tbody>\r\n                <tbody data-type=\"TableButtonEditor\" class=\"drag-source drop-target drop-style table-bordered\">\r\n                    <tr class=\"text-wrap\" repeat.for=\"row of tableButton.Table.Table\" data-index=\"${$index}\">\r\n                        <td repeat.for=\"td of row\" css=\"${$index == (showImgNumber || tableButton.Table.Common.DateTimeColumnExists ? 0 : -1) ? 'text-align: center;' : ''}\">\r\n                            <span  if.bind=\"tableButton.Table.Common && selectedRow != row\" innerhtml.bind=\"td\"></span>\r\n                            <aurelia-flatpickr if.bind=\"dateTimeColumn == 'DateTime' && selectedRow == row && $index == 0\" config.bind='{ noCalendar: false, altInput: true, altFormat: \"d.m.Y H:i\", time_24hr: true }' value.bind=\"editableDetaTime\"></aurelia-flatpickr>\r\n                            <aurelia-flatpickr if.bind=\"dateTimeColumn == 'Time' && selectedRow == row && $index == 0\" config.bind='{ noCalendar: true, altInput: true, altFormat: \"H:i\", time_24hr: true }' value.bind=\"editableDetaTime\"></aurelia-flatpickr>\r\n                            <textarea  rows=\"4\" if.bind=\"selectedRow == row && tableButton.Table.Info && $index !=  (row.length - 2) \" type=\"text\" class=\"form-control\" value.bind=\"editableRow[$index]\" ></textarea>\r\n                            <textarea  rows=\"4\" if.bind=\"selectedRow == row && tableButton.Table.Common &&  ($index != (row.length - 1) || !tableButton.Table.Common.PrintFileColumn) && ($index != 0 || !tableButton.Table.Common.DateTimeColumn)\" type=\"text\" class=\"form-control\" value.bind=\"editableRow[$index]\" ></textarea>                       \r\n                            <select if.bind=\"tableButton.Table.Common && selectedRow == row && $index == (row.length - 1) && tableButton.Table.Common.PrintFileColumn\"  value.bind=\"editableRow[$index]\" class=\"form-control\">\r\n                                <option value=\"\"></option>    \r\n                                <option repeat.for=\"printFile of printFileList\" model.bind=\"printFile.FileName\">${printFile.FileName}</option>\r\n                            </select>\r\n\r\n                            <span if.bind=\"tableButton.Table.Info && selectedRow != row && $index != (showImgNumber ? 1 : 0) \"  innerhtml.bind=\"td\"></span>\r\n                            <img src=\"${urlForImg}/?filename=${esc(td)}\" class=\"img-responsive\" if.bind=\"tableButton.Table.Info && selectedRow != row && $index ==  (row.length - 2)\"/>\r\n                             <select\r\n                                if.bind=\"tableButton.Table.Info && selectedRow == row && $index ==(row.length - 2)\"\r\n                                value.bind=\"editableRow[(row.length - 2)]\"\r\n                                class=\"form-control\"\r\n                                >\r\n                                <option repeat.for=\"image of imageList\">${image.FileName}</option>\r\n                            </select>\r\n\r\n                        </td>\r\n                        <td ><button\r\n                                if.bind=\"selectedRow != row\"\r\n                                click.delegate=\"onEditClick($index)\"\r\n                                class=\"btn pmd-btn-raised pmd-ripple-effect btn-default mdi mdi-pencil\"\r\n                            ></button>\r\n                            <button\r\n                                 if.bind=\"selectedRow != row\"\r\n                                 click.delegate=\"onDeleteClick($index)\"\r\n                                class=\"btn pmd-btn-raised pmd-ripple-effect btn-default mdi mdi-delete\"\r\n                            ></button>\r\n                            <button\r\n                                 if.bind=\"selectedRow == row\"\r\n                                 click.delegate=\"onOkClick($index)\"\r\n                                class=\"btn pmd-btn-raised pmd-ripple-effect btn-default mdi mdi-check\"\r\n                            ></button> \r\n                            <button\r\n                                 if.bind=\"selectedRow == row\"\r\n                                 click.delegate=\"onCancel()\"\r\n                                class=\"btn pmd-btn-raised pmd-ripple-effect btn-default mdi mdi-close-circle\"\r\n                            ></button>\r\n                        </td>\r\n                    </tr>\r\n                <tbody>\r\n                </table>\r\n</template>"; });
define('text!app/layout/modals/reset-modal.css', ['module'], function(module) { module.exports = ".reset-modal .mdi-alert:before {\n  color: red;\n  font-size: 32px;\n  margin-left: 15px; }\n\n.reset-modal .modal-body {\n  background: none;\n  display: flex;\n  align-items: center; }\n"; });
define('text!app/settings/info-table-button-editor/info-table-button-editor.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../table-button-editor.css\"></require> \r\n    <require from=\"../grid/grid\"></require>\r\n    \r\n    <div class=\"pmd-card-body col-lg-7 col-md-12 button-editor\">\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Текст кнопки</div>\r\n\r\n            <div class=\"col-md-7 col-sm-12\">\r\n                <input\r\n                    value.bind=\"tableButton.Text\"\r\n                    type=\"text\"\r\n                    class=\"form-control\"\r\n                ></input>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Заголовок страницы</div>\r\n\r\n            <div class=\"col-md-7 col-sm-12\">\r\n                <input\r\n                    value.bind=\"tableButton.Table.Title\"\r\n                    type=\"text\"\r\n                    class=\"form-control\"\r\n                ></input>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">\r\n                Сообщение на экране печати документа\r\n            </div>\r\n\r\n            <div class=\"col-md-7 col-sm-12\">\r\n                <input\r\n                    value.bind=\"tableButton.Table.Message\"\r\n                    type=\"text\"\r\n                    class=\"form-control\"\r\n                ></input>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Колонка номер изображения</div>\r\n\r\n            <div class=\"col-md-2\">\r\n                <label class=\"pmd-checkbox\">\r\n                    <input\r\n                        change.delegate=\"onShowNumberChecked($event.target.checked)\"\r\n                        checked.bind=\"tableButton.Table.Info.ImageNumberColumn\"\r\n                        type=\"checkbox\"\r\n                        class=\"pm-ini\"\r\n                    ></input>\r\n\r\n                    <span class=\"pmd-checkbox-label\"></span>\r\n                </label>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Документ для печати</div>\r\n\r\n            <div class=\"col-md-1\">\r\n                <label class=\"pmd-checkbox\">\r\n                    <input\r\n                        change.delegate=\"onDocumentToPrintChecked(tableButton)\"\r\n                        checked.bind=\"showDocumentForPrint\"\r\n                        type=\"checkbox\"\r\n                        class=\"pm-ini\"\r\n                    ></input>\r\n\r\n                    <span class=\"pmd-checkbox-label\"></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"col-md-6 col-sm-12\">\r\n                <select\r\n                    value.bind=\"tableButton.Table.PrintDocument\"\r\n                    disabled.bind=\"!showDocumentForPrint\"\r\n                    class=\"form-control\"\r\n                >\r\n                <option value=\"\"></option>\r\n                    <option repeat.for=\"printFile of printFileList\">${printFile.FileName}</option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n    </div>\r\n<!-- Дополнительные переменные нужны для того чтоб использовать грид в двух редакторах -->\r\n    <div class=\"pmd-card-body col-md-12 button-editor\">\r\n            <grid view-model.ref=\"grid\"\r\n            edit-percent-row.bind=\"editPercentRow\"\r\n            print-file-list.bind=\"printFileList\"\r\n            table-button.bind=\"tableButton\"\r\n            row-to-add.bind=\"rowToAdd\"\r\n            date-time-column.bind=\"null\"\r\n            columns-count.bind=\"2\"\r\n            print-file-column.bind=\"false\"\r\n            image-list.bind=\"imageList\"\r\n            url-for-img.bind=\"urlForImg\"\r\n            show-img-number.bind=\"tableButton.Table.Info.ImageNumberColumn\"\r\n        ></grid>\r\n    </div>\r\n</template>"; });
define('text!app/settings/level-button-editor/level-button-editor.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./level-button-editor.css\"></require>\r\n\r\n    <div class=\"pmd-card-body col-lg-7 col-md-12 level-button-editor\">\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Текст кнопки</div>\r\n\r\n            <div class=\"col-md-7 col-sm-12\">\r\n                <input\r\n                    value.bind=\"levelButton.Text\"\r\n                    type=\"text\"\r\n                    class=\"form-control\"\r\n                ></input>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">\r\n                Заголовок следующего уровня\r\n            </div>\r\n\r\n            <div class=\"col-md-7 col-sm-12\">\r\n                <input\r\n                    value.bind=\"levelButton.Level.Title\"\r\n                    type=\"text\"\r\n                    class=\"form-control\"\r\n                ></input>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-6 col-sm-12\">\r\n                <button type=\"button\" click.delegate=\"onNextLevel()\" class=\"btn pmd-btn-raised pmd-ripple-effect btn-default col-sm-12\">\r\n                    Редактировать следующий уровень\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app/layout/ui-elements/ui-elements.css', ['module'], function(module) { module.exports = ".ui-elements .check-container {\n  display: inline-block;\n  margin-left: 15px;\n  height: 18px; }\n\n.ui-elements .inset {\n  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4) !important;\n  -webkit-box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4) !important;\n  -moz-box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4) !important; }\n\n.ui-elements .number-selector {\n  width: 50px; }\n"; });
define('text!app/settings/print-button-editor/print-button-editor.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./print-button-editor.css\"></require>\r\n\r\n    <div class=\"pmd-card-body col-lg-7 col-md-12 print-button-editor\">\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Текст кнопки</div>\r\n\r\n            <div class=\"col-md-7 col-sm-12\">\r\n                <input\r\n                    value.bind=\"printButton.Text\"\r\n                    type=\"text\"\r\n                    class=\"form-control\"\r\n                ></input>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">\r\n                Сообщение на экране печати документа\r\n            </div>\r\n\r\n            <div class=\"col-md-7 col-sm-12\">\r\n                <input\r\n                    value.bind=\"printButton.Print.Message\"\r\n                    type=\"text\"\r\n                    class=\"form-control\"\r\n                ></input>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Документ для печати</div>\r\n\r\n            <div class=\"col-md-7 col-sm-12\">\r\n                <select\r\n                    value.bind=\"printButton.Print.Document\"\r\n                    class=\"form-control\"\r\n                >\r\n                    <option repeat.for=\"printFile of printFileList\">${printFile.FileName}</option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app/settings/remove-modal/remove-modal.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./remove-modal.css\"></require>\r\n\r\n    <div class=\"remove-modal\">\r\n        <ux-dialog class=\"ux-dialog-sm\">\r\n            <ux-dialog-header class=\"modal-header\">\r\n                <div class=\"modal-title\">Удаление кнопки</div>\r\n            </ux-dialog-header>\r\n\r\n            <ux-dialog-body class=\"modal-body\">\r\n                <i class=\"mdi mdi-alert\"></i>\r\n                Выделенная кнопка будет удалена. Продолжить?\r\n            </ux-dialog-body>\r\n\r\n            <ux-dialog-footer>\r\n                <button\r\n                    class=\"btn btn-primary pmd-btn-raised\"\r\n                    click.trigger=\"ok($event)\"\r\n                >\r\n                    <i class=\"mdi mdi-check\"></i>\r\n                    OK\r\n                </button>\r\n\r\n                <button\r\n                    class=\"btn btn-default pmd-btn-raised\"\r\n                    click.trigger=\"dialogController.cancel()\"\r\n                >Отмена</button>\r\n            </ux-dialog-footer>\r\n        </ux-dialog>\r\n    </div>\r\n</template>"; });
define('text!app/settings/add-custom-button/add-custom-button.css', ['module'], function(module) { module.exports = ".add-btn-modal .form-group {\n  padding: 0 30px;\n  background-color: white; }\n"; });
define('text!app/settings/table-button-editor/table-button-editor.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../grid/grid\"></require>\r\n    <require from=\"../table-button-editor.css\"></require>\r\n    <div class=\"pmd-card-body col-lg-7 col-md-12 button-editor\">\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Текст кнопки</div>\r\n\r\n            <div class=\"col-md-7 col-sm-12\">\r\n                <input\r\n                    value.bind=\"tableButton.Text\"\r\n                    type=\"text\"\r\n                    class=\"form-control\"\r\n                ></input>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Заголовок страницы</div>\r\n\r\n            <div class=\"col-md-7 col-sm-12\">\r\n                <input\r\n                    value.bind=\"tableButton.Table.Title\"\r\n                    type=\"text\"\r\n                    class=\"form-control\"\r\n                ></input>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">\r\n                Сообщение на экране печати документа\r\n            </div>\r\n\r\n            <div class=\"col-md-7 col-sm-12\">\r\n                <input\r\n                    value.bind=\"tableButton.Table.Message\"\r\n                    type=\"text\"\r\n                    class=\"form-control\"\r\n                ></input>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Колонка дата/время</div>\r\n\r\n            <div class=\"col-md-1\">\r\n                <label class=\"pmd-checkbox\">\r\n                    <input\r\n                        checked.bind=\"tableButton.Table.Common.DateTimeColumnExists\" \r\n                        change.delegate=\"onDateTimeChecked($event.target.checked)\"\r\n                        type=\"checkbox\"\r\n                        class=\"pm-ini\"\r\n                    ></input>\r\n\r\n                    <span class=\"pmd-checkbox-label\"></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"col-md-5 col-sm-12\">\r\n                <select\r\n                     class=\"form-control au-target\"\r\n                    value.bind=\"tableButton.Table.Common.DateTimeColumn\"\r\n                    disabled.bind=\"tableButton.Table.Common.DateTimeColumn == null\"\r\n                    change.delegate=\"onDateTimeColumnChanged()\"\r\n                >\r\n                    <option\r\n                        repeat.for=\"dateTimeOption of dateTimeTypes\"\r\n                        model.bind=\"dateTimeOption.value\"\r\n                        hidden.bind=\"dateTimeOption.value == null\"\r\n                    >${dateTimeOption.name}</option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Колонка файл для печати</div>\r\n\r\n            <div class=\"col-md-2\">\r\n                <label class=\"pmd-checkbox\">\r\n                    <input\r\n                        change.delegate=\"onFileToPrintChecked($event.target.checked)\"\r\n                        checked.bind=\"tableButton.Table.Common.PrintFileColumn\"\r\n                        type=\"checkbox\"\r\n                        class=\"pm-ini\"\r\n                    ></input>\r\n\r\n                    <span class=\"pmd-checkbox-label\"></span>\r\n                </label>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Документ для печати</div>\r\n\r\n            <div class=\"col-md-1\">\r\n                <label class=\"pmd-checkbox\">\r\n                    <input\r\n                        change.delegate=\"onDocumentToPrintChecked(tableButton)\"\r\n                        checked.bind=\"showDocumentForPrint\"\r\n                        type=\"checkbox\"\r\n                        class=\"pm-ini\"\r\n                    ></input>\r\n\r\n                    <span class=\"pmd-checkbox-label\"></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"col-md-6 col-sm-12\">\r\n                <select\r\n                    value.bind=\"tableButton.Table.PrintDocument\"\r\n                    disabled.bind=\"!showDocumentForPrint\"\r\n                    class=\"form-control\"\r\n                >\r\n                    <option value=\"\"></option>\r\n                    <option repeat.for=\"printFile of printFileList\">${printFile.FileName}</option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"row form-group\">\r\n            <div class=\"col-md-5 col-sm-12\">Количество колонок</div>\r\n\r\n            <div class=\"col-xs-2\">\r\n                <input\r\n                    value.bind=\"tableButton.Table.Common.ColumnsCountString\"\r\n                    change.delegate=\"changeColumnsCount()\"\r\n                    type=\"number\"\r\n                    min=\"0\" \r\n                    class=\"form-control\"\r\n                ></input>\r\n            </div>\r\n        </div>\r\n    </div>\r\n<!-- Дополнительные переменные нужны для того чтоб использовать грид в двух редакторах -->\r\n    <div class=\"pmd-card-body col-md-12 button-editor\">\r\n        <grid view-model.ref=\"grid\"\r\n            edit-percent-row.bind=\"editPercentRow\"\r\n            print-file-list.bind=\"printFileList\"\r\n            table-button.bind=\"tableButton\"\r\n            row-to-add.bind=\"rowToAdd\"\r\n            date-time-column.bind=\"tableButton.Table.Common.DateTimeColumn\"\r\n            columns-count.bind=\"tableButton.Table.Common.ColumnsCount\"\r\n            print-file-column.bind=\"tableButton.Table.Common.PrintFileColumn\"\r\n        ></grid>\r\n    </div>\r\n</template>"; });
define('text!app/shells/home/home-router.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./home-router.css\"></require>\r\n\r\n    <section class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2 height-100-relative\">\r\n        <router-view name=\"sidebar\"></router-view>\r\n    </section>\r\n\r\n    <section class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10 height-100-relative\">\r\n        <router-view name=\"shell\"></router-view>\r\n    </section>\r\n</template>"; });
define('text!app/settings/buttons-list/buttons-list.css', ['module'], function(module) { module.exports = ".button-list .height-100-relative-title-line {\n  margin-bottom: 20px; }\n\n.button-list .pmd-card-settings-group {\n  flex: 1; }\n  .button-list .pmd-card-settings-group .settings-list-item {\n    min-height: 60px;\n    padding: 10px;\n    outline: none; }\n\n.button-list .overflow-scroll-y {\n  overflow-y: auto !important;\n  height: 100%; }\n"; });
define('text!app/storage/modals/add-file-modal.html', ['module'], function(module) { module.exports = "<template>\r\n        <loader if.bind=\"showLoader\"></loader> \r\n        <ux-dialog class=\"ux-dialog-sm\">\r\n            <ux-dialog-header class=\"modal-header\">\r\n                <div class=\"modal-title\">\r\n                    Добавить новый файл\r\n                </div>\r\n            </ux-dialog-header>\r\n            <ux-dialog-body>\r\n                <form class=\"bg-white\">\r\n                    <div class=\"form-group\">\r\n                            <input type=\"file\" class=\"form-control\"  files.bind=\"file\">\r\n                    </div>\r\n\r\n                </form>\r\n            </ux-dialog-body>\r\n\r\n            <ux-dialog-footer>\r\n                <button class=\"btn btn-primary pmd-btn-raised\" click.trigger=\"ok($event)\">\r\n                 <i class=\"mdi mdi-check\"></i> Да\r\n                </button>   \r\n                                <button class=\"btn btn-default pmd-btn-raised\" click.trigger=\"dialogController.cancel()\">Отмена</button>\r\n            </ux-dialog-footer>\r\n\r\n            <au-loader if.bind=\"isLoading\"></au-loader>\r\n        </ux-dialog>\r\n</template>"; });
define('text!app/settings/grid/grid.css', ['module'], function(module) { module.exports = ".grid {\n  width: 100%;\n  table-layout: fixed; }\n  .grid tr {\n    min-height: 40px; }\n    .grid tr .last-column {\n      width: 100px; }\n    .grid tr td .btn {\n      padding: 4px; }\n    .grid tr.percent .form-control {\n      width: 90%;\n      display: inline; }\n  .grid .text-wrap {\n    word-wrap: break-word; }\n  .grid .mdi-check:before {\n    font-size: 24px;\n    line-height: 24px; }\n"; });
define('text!app/resources/elements/color-selector/color-selector.html', ['module'], function(module) { module.exports = "<template>\r\n        <require from=\"./color-selector.css\"></require>\r\n    <div class=\"color-selector\">\r\n        <div class=\"btn-group\">\r\n            <button type=\"button\" class=\"btn pmd-ripple-effect btn-default\" focusout.trigger=\"onBlurHideColor($event)\"  click.delegate=\"onClickShowColor()\">\r\n                <div class=\"${colorSelectorType == 'backgroundColor'? 'selected-color' : 'selected-font-color'}\" css=\"background-color: #${selectedColor}\"></div>\r\n                <span if.bind=\"colorSelectorType == 'backgroundColor'\" class=\"mdi mdi-format-color-fill\"></span>\r\n                <span else class=\"color-selector-text\">A</span>\r\n                <span class=\"mdi mdi-menu-down\"></span>\r\n            </button>\r\n            <div if.bind=\"showColor\"  class=\"dropdown-menu colorschemebox\"> \r\n                    <button repeat.for=\"color of colors\" type=\"button\" click.delegate=\"onSelectedColor(color)\" css=\"background-color: #${color}\" class=\"btn btn-default colorscheme\"></button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    </template>"; });
define('text!app/resources/elements/loader/loader.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./loader.css\"></require>\r\n    <div class=\"loader\">\r\n        <div  class=\"sk-fading-circle\">\r\n            <div repeat.for=\"i of numberOfCircles\" class=\"sk-circle${i+1} sk-circle\"></div>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app/settings/level-button-editor/level-button-editor.css', ['module'], function(module) { module.exports = ".level-button-editor .form-group {\n  display: flex;\n  align-items: center; }\n  .level-button-editor .form-group div:first-child {\n    line-height: 1; }\n  .level-button-editor .form-group .btn {\n    white-space: normal; }\n"; });
define('text!app/resources/elements/modals/change-nav-modal.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./change-nav-modal.css\"></require>\r\n\r\n    <div class=\"change-nav-modal\">\r\n        <ux-dialog class=\"ux-dialog-sm\">\r\n            <ux-dialog-header class=\"modal-header\">\r\n                <div class=\"modal-title\">Предупреждение</div>\r\n            </ux-dialog-header>\r\n\r\n            <ux-dialog-body class=\"modal-body\">\r\n                <i class=\"mdi mdi-alert\"></i>\r\n                Текущие настройки не сохранены. Продолжить?\r\n            </ux-dialog-body>\r\n\r\n            <ux-dialog-footer>\r\n                <button\r\n                    class=\"btn btn-primary pmd-btn-raised\"\r\n                    click.trigger=\"ok($event)\"\r\n                >\r\n                    <i class=\"mdi mdi-check\"></i>\r\n                    OK\r\n                </button>\r\n\r\n                <button\r\n                    class=\"btn btn-default pmd-btn-raised\"\r\n                    click.trigger=\"dialogController.cancel()\"\r\n                >Отмена</button>\r\n            </ux-dialog-footer>\r\n        </ux-dialog>\r\n    </div>\r\n</template>"; });
define('text!app/settings/print-button-editor/print-button-editor.css', ['module'], function(module) { module.exports = ".print-button-editor .form-group {\n  display: flex;\n  align-items: center; }\n  .print-button-editor .form-group div:first-child {\n    line-height: 1; }\n"; });
define('text!app/settings/remove-modal/remove-modal.css', ['module'], function(module) { module.exports = ".remove-modal .mdi-alert:before {\n  color: red;\n  font-size: 32px;\n  margin-left: 15px; }\n\n.remove-modal .modal-body {\n  background: none;\n  display: flex;\n  align-items: center; }\n"; });
define('text!app/shells/home/home-router.css', ['module'], function(module) { module.exports = "section.height-100-relative {\n  height: calc(100% - 15px);\n  padding: 5px 10px; }\n"; });
define('text!app/shells/home/sidebar/sidebar-shell.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./item/item\"></require>\r\n    <require from=\"./sidebar-shell.css\"></require>\r\n\r\n    <div class=\"sidebar-shell-wrapper\">\r\n        <div class=\"pmd-card pmd-z-depth-1 height-100-relative\">\r\n            <div class=\"pmd-card-header primary\" ref=\"panelHeading\">\r\n                <h3 class=\"pmd-card-title-text text-muted\">Пользователи</h3>\r\n            </div>\r\n            <div class=\"pmd-card-body height-100 overflow-scroll-y\">\r\n                <div class=\"overflow-hidden\">\r\n                    <user-item repeat.for=\"$user of users\" data.bind=\"$user\" delete.call=\"delete($user, $event)\"></user-item>\r\n                </div>\r\n            </div>\r\n            <div class=\"pmd-card-actions-absolute clearfix\">\r\n                <button disabled.bind=\"false\" class=\"btn width-100 pmd-btn-raised pmd-btn-outline btn-primary\" type=\"button\" click.trigger=\"add()\">\r\n                    <i class=\"mdi mdi-plus pmd-sm\"></i>\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app/shells/home/users/users-shell.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./users-shell.css\"></require>\r\n\r\n    <div class=\"pmd-card pmd-z-depth height-100-relative pmd-z-depth-1\">\r\n      <span class=\"text-muted title\"> User ID: ${userId}</span>\r\n      <hr>\r\n    </div>\r\n</template>"; });
define('text!app/resources/elements/color-selector/color-selector.css', ['module'], function(module) { module.exports = ".color-selector .btn {\n  border: none;\n  border-radius: 0;\n  padding: 0;\n  font-size: .875rem; }\n  .color-selector .btn .color-selector-text {\n    font-size: 23px; }\n\n.color-selector .dropdown-menu {\n  width: 180px;\n  min-width: 18px;\n  border-radius: 0;\n  padding: 0 2px 2px 0;\n  display: inline-block;\n  box-sizing: content-box; }\n  .color-selector .dropdown-menu:after {\n    clear: both;\n    content: \" \";\n    display: table; }\n  .color-selector .dropdown-menu .colorscheme {\n    width: 16px;\n    height: 16px;\n    margin: 2px 0 0 2px;\n    display: block;\n    float: left; }\n    .color-selector .dropdown-menu .colorscheme:nth-child(10), .color-selector .dropdown-menu .colorscheme:nth-child(20) {\n      margin-bottom: 6px; }\n\n.color-selector .selected-color,\n.color-selector .selected-font-color {\n  display: inline-block;\n  width: 8px;\n  height: 17px; }\n\n.color-selector .selected-color {\n  margin-top: 3px; }\n"; });
define('text!app/shells/home/sidebar/item/item.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./item.css\"></require>\r\n\r\n    <div class=\"card-item pmd-card pmd-card-default pmd-z-depth-1 pmd-card-custom-form cursor-pointer\" click.trigger=\"showUserInfo($event)\">\r\n        <div class=\"header clearfix ${router.currentInstruction.params.id == data.Id ? 'active' : ''}\">\r\n            <div class=\"pmd-card-title\">\r\n                <button class=\"btn btn-xs pmd-btn-fab pmd-btn-raised btn-default close-btn\" type=\"button\" click.trigger=\"delete($event)\">\r\n                    <i class=\"mdi mdi-close pmd-sm\"></i>\r\n                </button>\r\n            </div>\r\n        </div>\r\n        <div class=\"pmd-card-body overflow-hidden\">\r\n            ${data.Name}\r\n            <p class=\"small\">${data.Created}</p>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app/shells/home/sidebar/modals/add-user-modal.html', ['module'], function(module) { module.exports = "<template>\r\n    <ux-dialog class=\"ux-dialog-sm\">\r\n        <ux-dialog-header class=\"modal-header\">\r\n            <div class=\"modal-title\">\r\n                Добавить нового пользователя\r\n            </div>\r\n        </ux-dialog-header>\r\n        <ux-dialog-body>\r\n            <form class=\"bg-white\">\r\n                <div class=\"form-group\">\r\n                    <label class=\"control-label\">Имя пользователя:</label>\r\n                    <input type=\"text\" class=\"form-control\" placeholder=\"Введите название...\" value.bind=\"data.Name\">\r\n                </div>\r\n\r\n            </form>\r\n        </ux-dialog-body>\r\n\r\n        <ux-dialog-footer>\r\n            <button class=\"btn btn-primary pmd-btn-raised\" click.trigger=\"ok($event)\">\r\n                <i class=\"mdi mdi-check\"></i> Да\r\n            </button>\r\n\r\n            <button class=\"btn btn-default pmd-btn-raised\" click.trigger=\"dialogController.cancel()\">Отмена</button>\r\n        </ux-dialog-footer>\r\n\r\n        <au-loader if.bind=\"isLoading\"></au-loader>\r\n    </ux-dialog>\r\n</template>"; });
define('text!app/resources/elements/loader/loader.css', ['module'], function(module) { module.exports = ".loader {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  opacity: 0.7;\n  background: rgba(0, 0, 0, 0.6);\n  z-index: 10000; }\n  .loader .sk-fading-circle {\n    width: 140px;\n    height: 140px;\n    position: relative; }\n  .loader .sk-fading-circle .sk-circle {\n    width: 100%;\n    height: 100%;\n    position: absolute; }\n  .loader .sk-fading-circle .sk-circle:before {\n    content: '';\n    display: block;\n    margin: 0 auto;\n    width: 15%;\n    height: 15%;\n    background-color: black;\n    border-radius: 100%;\n    -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;\n    animation: sk-circleFadeDelay 1.2s infinite ease-in-out both; }\n  .loader .sk-fading-circle .sk-circle1 {\n    -webkit-transform: rotate(30deg);\n    -ms-transform: rotate(30deg);\n    transform: rotate(30deg); }\n  .loader .sk-fading-circle .sk-circle1:before {\n    -webkit-animation-delay: -1.1s;\n    animation-delay: -1.1s; }\n  .loader .sk-fading-circle .sk-circle2 {\n    -webkit-transform: rotate(60deg);\n    -ms-transform: rotate(60deg);\n    transform: rotate(60deg); }\n  .loader .sk-fading-circle .sk-circle2:before {\n    -webkit-animation-delay: -1s;\n    animation-delay: -1s; }\n  .loader .sk-fading-circle .sk-circle3 {\n    -webkit-transform: rotate(90deg);\n    -ms-transform: rotate(90deg);\n    transform: rotate(90deg); }\n  .loader .sk-fading-circle .sk-circle3:before {\n    -webkit-animation-delay: -0.9s;\n    animation-delay: -0.9s; }\n  .loader .sk-fading-circle .sk-circle4 {\n    -webkit-transform: rotate(120deg);\n    -ms-transform: rotate(120deg);\n    transform: rotate(120deg); }\n  .loader .sk-fading-circle .sk-circle4:before {\n    -webkit-animation-delay: -0.8s;\n    animation-delay: -0.8s; }\n  .loader .sk-fading-circle .sk-circle5 {\n    -webkit-transform: rotate(150deg);\n    -ms-transform: rotate(150deg);\n    transform: rotate(150deg); }\n  .loader .sk-fading-circle .sk-circle5:before {\n    -webkit-animation-delay: -0.7s;\n    animation-delay: -0.7s; }\n  .loader .sk-fading-circle .sk-circle6 {\n    -webkit-transform: rotate(180deg);\n    -ms-transform: rotate(180deg);\n    transform: rotate(180deg); }\n  .loader .sk-fading-circle .sk-circle6:before {\n    -webkit-animation-delay: -0.6s;\n    animation-delay: -0.6s; }\n  .loader .sk-fading-circle .sk-circle7 {\n    -webkit-transform: rotate(210deg);\n    -ms-transform: rotate(210deg);\n    transform: rotate(210deg); }\n  .loader .sk-fading-circle .sk-circle7:before {\n    -webkit-animation-delay: -0.5s;\n    animation-delay: -0.5s; }\n  .loader .sk-fading-circle .sk-circle8 {\n    -webkit-transform: rotate(240deg);\n    -ms-transform: rotate(240deg);\n    transform: rotate(240deg); }\n  .loader .sk-fading-circle .sk-circle8:before {\n    -webkit-animation-delay: -0.4s;\n    animation-delay: -0.4s; }\n  .loader .sk-fading-circle .sk-circle9 {\n    -webkit-transform: rotate(270deg);\n    -ms-transform: rotate(270deg);\n    transform: rotate(270deg); }\n  .loader .sk-fading-circle .sk-circle9:before {\n    -webkit-animation-delay: -0.3s;\n    animation-delay: -0.3s; }\n  .loader .sk-fading-circle .sk-circle10 {\n    -webkit-transform: rotate(300deg);\n    -ms-transform: rotate(300deg);\n    transform: rotate(300deg); }\n  .loader .sk-fading-circle .sk-circle10:before {\n    -webkit-animation-delay: -0.2s;\n    animation-delay: -0.2s; }\n  .loader .sk-fading-circle .sk-circle11 {\n    -webkit-transform: rotate(330deg);\n    -ms-transform: rotate(330deg);\n    transform: rotate(330deg); }\n  .loader .sk-fading-circle .sk-circle11:before {\n    -webkit-animation-delay: -0.1s;\n    animation-delay: -0.1s; }\n  .loader .sk-fading-circle .sk-circle12 {\n    -webkit-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    transform: rotate(360deg); }\n  .loader .sk-fading-circle .sk-circle12:before {\n    -webkit-animation-delay: 0s;\n    animation-delay: 0s; }\n\n@-webkit-keyframes sk-circleFadeDelay {\n  0%,\n  39%,\n  100% {\n    opacity: 0; }\n  40% {\n    opacity: 1; } }\n\n@keyframes sk-circleFadeDelay {\n  0%,\n  39%,\n  100% {\n    opacity: 0; }\n  40% {\n    opacity: 1; } }\n"; });
define('text!app/resources/elements/modals/change-nav-modal.css', ['module'], function(module) { module.exports = ".change-nav-modal .mdi-alert:before {\n  color: red;\n  font-size: 32px;\n  margin-left: 15px; }\n\n.change-nav-modal .modal-body {\n  background: none;\n  display: flex;\n  align-items: center; }\n"; });
define('text!app/shells/home/sidebar/sidebar-shell.css', ['module'], function(module) { module.exports = ".sidebar-shell-wrapper {\n  height: 100% !important; }\n  .sidebar-shell-wrapper .height-100-relative {\n    height: 100% !important; }\n    .sidebar-shell-wrapper .height-100-relative .pmd-card-title-text {\n      padding: 10px;\n      background: #eee;\n      text-align: center; }\n    .sidebar-shell-wrapper .height-100-relative .pmd-card-body {\n      height: calc(100% - 112px);\n      display: block;\n      position: relative; }\n    .sidebar-shell-wrapper .height-100-relative .btn.width-100 {\n      padding: 12px 5px; }\n"; });
define('text!app/shells/home/users/users-shell.css', ['module'], function(module) { module.exports = ".pmd-card.height-100-relative {\n  height: 100% !important; }\n  .pmd-card.height-100-relative span.title {\n    padding: 10px;\n    font-size: 28px; }\n"; });
define('text!app/shells/home/sidebar/item/item.css', ['module'], function(module) { module.exports = ".card-item {\n  border: 1px solid #ddd; }\n  .card-item .header .close-btn {\n    position: absolute !important;\n    top: 3px;\n    right: 3px; }\n  .card-item .header.active {\n    background: #3F51B5 !important; }\n  .card-item .header .pmd-card-title .tools-container {\n    position: absolute;\n    right: 3px;\n    top: 3px; }\n"; });
//# sourceMappingURL=app-bundle.js.map