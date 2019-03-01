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
define('app/settingsHelper',["require", "exports", "aurelia-http-client", "aurelia-framework"], function (require, exports, aurelia_http_client_1, aurelia_framework_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var SettingsHelper = (function () {
        function SettingsHelper(httpClient) {
            this.httpClient = httpClient;
            this.nameStyle = "";
            this.firstLevelButtonStyle = "";
            this.printButtonStyle = "";
            this.tableStyle = "";
            this.gridStyle = "";
            this.backgroundStyle = "";
            this.backgroundImg = "";
            this.windowTitlesStyle = "";
            this.windowTitlesFont = "";
            this.printMessagesStyle = "";
            this.imgUrl = localStorage.getItem("serverUrl") + "/api/storage/get-picture";
        }
        SettingsHelper_1 = SettingsHelper;
        SettingsHelper.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2, new Promise(function (resolve, reject) {
                            _this.httpClient
                                .createRequest("/api/settings-kiosk/get-settings")
                                .asPost()
                                .send()
                                .then(function (data) {
                                _this.settings = data.content;
                                SettingsHelper_1.assignIds('', _this.settings.Buttons);
                                _this.initStyle();
                                resolve();
                            }).catch(function () { reject(new Error("Ошибка при загрузке данных")); });
                        })];
                });
            });
        };
        SettingsHelper.assignIds = function (parentId, buttons) {
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].Id = parentId + i;
                if (buttons[i].Level)
                    SettingsHelper_1.assignIds(buttons[i].Id + '_', buttons[i].Level.Buttons);
            }
        };
        SettingsHelper.prototype.getButton = function (id) {
            return SettingsHelper_1.getButtonFromArray(id, this.settings.Buttons);
        };
        SettingsHelper.getButtonFromArray = function (id, buttons) {
            return /_/.test(id)
                ? SettingsHelper_1.getButtonFromArray(id.replace(/[^_]+_/, ''), buttons[Number(id.replace(/_.+/, ''))].Level.Buttons)
                : buttons[Number(id)];
        };
        SettingsHelper.prototype.initStyle = function () {
            this.nameStyle = SettingsHelper_1.getUIElementStyle(this.settings.Layout.Name, false);
            this.firstLevelButtonStyle = this.getFirstLevelButtonStyle();
            this.printButtonStyle = SettingsHelper_1.getUIElementStyle(this.settings.Layout.PrintButtons);
            this.tableStyle = SettingsHelper_1.getUIElementStyle(this.settings.Layout.Table);
            this.gridStyle = "border: " + this.settings.Layout.TableGridSize + "px solid #" + this.settings.Layout.TableGridColor + ";";
            this.backgroundStyle = this.getBackgroundStyle();
            this.windowTitlesFont = "font-family: '" + this.settings.Layout.WindowTitles.fontFamily + "'; font-size: " + this.settings.Layout.WindowTitles.fontSize + "pt; font-weight:" + this.settings.Layout.WindowTitles.fontWeight + ";";
            this.windowTitlesStyle = SettingsHelper_1.getUIElementStyle(this.settings.Layout.WindowTitles);
            this.backgroundImg = this.getBackgroundImg();
            this.printMessagesStyle = SettingsHelper_1.getUIElementStyle(this.settings.Layout.PrintMessages);
        };
        SettingsHelper.prototype.getFirstLevelButtonStyle = function () {
            return SettingsHelper_1.getUIElementStyle(this.settings.Layout.FirstLevelButtons);
        };
        SettingsHelper.prototype.getBackgroundStyle = function () {
            return "background-color: #" + this.settings.Layout.Background.backgroundColor;
        };
        SettingsHelper.prototype.getBackgroundImg = function () {
            var imageName = encodeURIComponent(this.settings.Layout.Background.backgroundImage);
            return imageName ? this.imgUrl + "/?filename=" + imageName : "";
        };
        SettingsHelper.getUIElementStyle = function (style, useBGColor) {
            if (useBGColor === void 0) { useBGColor = true; }
            return "color: #" + style.color + ";" +
                ("font-family: '" + style.fontFamily + "';") +
                ("font-size: " + style.fontSize + "pt;") +
                ("font-weight:" + style.fontWeight + ";") +
                ("font-style: " + style.fontStyle + ";") +
                ("text-decoration: " + style.textDecoration + ";") +
                (useBGColor ? "background-color: #" + style.backgroundColor + ";" : "");
        };
        SettingsHelper.prototype.splitButtons = function (haveLogo, buttons) {
            if (!buttons)
                return [];
            var list = buttons.slice(0, haveLogo ? SettingsHelper_1.MAX_BUTTONS_LOGO : SettingsHelper_1.MAX_BUTTONS);
            if (buttons.length < 3 || haveLogo) {
                return [list];
            }
            else {
                var firstRow = list.splice(0, Math.floor(list.length / 2));
                var secondRow = list.slice();
                return [firstRow, secondRow];
            }
        };
        SettingsHelper.MAX_BUTTONS = 6;
        SettingsHelper.MAX_BUTTONS_LOGO = 4;
        SettingsHelper = SettingsHelper_1 = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient])
        ], SettingsHelper);
        return SettingsHelper;
        var SettingsHelper_1;
    }());
    exports.SettingsHelper = SettingsHelper;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('app/shell',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShellRouter = (function () {
        function ShellRouter() {
        }
        ShellRouter.prototype.configureRouter = function (config, router) {
            this.router = router;
            var serverUrl = localStorage.getItem("serverUrl");
            config.map([
                {
                    route: "main",
                    name: "main",
                    moduleId: "./main/main",
                    nav: true,
                    settings: {}
                },
                {
                    route: "level-button/:id",
                    name: "level-button",
                    moduleId: "./level-button/level-button",
                    nav: false,
                    settings: {}
                },
                {
                    route: "info-table/:id",
                    name: "info-table",
                    moduleId: "./info-table/info-table",
                    nav: false,
                    settings: {}
                },
                {
                    route: "button-table/:id",
                    name: "button-table",
                    moduleId: "./button-table/button-table",
                    nav: false,
                    settings: {}
                },
                {
                    route: "document-print/:id?",
                    name: "document-print",
                    moduleId: "./document-print/document-print",
                    nav: false,
                    settings: {}
                },
                {
                    route: "start-settings",
                    name: "start-settings",
                    moduleId: "./start-settings/start-settings",
                    nav: false,
                    settings: {}
                }
            ]);
            if (!serverUrl)
                config.mapUnknownRoutes({ route: "", redirect: "start-settings" });
            else
                config.mapUnknownRoutes({ route: "", redirect: "main" });
        };
        ShellRouter = __decorate([
            aurelia_framework_1.autoinject
        ], ShellRouter);
        return ShellRouter;
    }());
    exports.ShellRouter = ShellRouter;
});



define('app/tableHelper',["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var TableHelper = (function () {
        function TableHelper() {
        }
        TableHelper.prototype.getButtonLevel = function (parentId, childId, settingsHelper) {
            return childId
                ? settingsHelper.settings.Buttons[parentId].Level.Buttons[childId]
                : settingsHelper.settings.Buttons[parentId];
        };
        return TableHelper;
    }());
    exports.TableHelper = TableHelper;
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
define('app/back-panel/back-panel',["require", "exports", "aurelia-framework", "aurelia-templating", "../settingsHelper"], function (require, exports, aurelia_framework_1, aurelia_templating_1, settingsHelper_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var BackPanel = (function () {
        function BackPanel() {
        }
        BackPanel.prototype.IdChanged = function () {
            this.isChild = /_/.test(this.Id);
            this.routeName = this.isChild ? 'level-button' : 'main';
            this.parentId = this.Id.replace(/_[^_]+$/, '');
        };
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", settingsHelper_1.SettingsHelper)
        ], BackPanel.prototype, "settingsHelper", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", String)
        ], BackPanel.prototype, "text", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", String)
        ], BackPanel.prototype, "Id", void 0);
        BackPanel = __decorate([
            aurelia_framework_1.customElement("back-panel")
        ], BackPanel);
        return BackPanel;
    }());
    exports.BackPanel = BackPanel;
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
define('app/button-table/button-table',["require", "exports", "aurelia-framework", "../settingsHelper"], function (require, exports, aurelia_framework_1, settingsHelper_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ButtonTable = (function () {
        function ButtonTable(settingsHelper) {
            this.settingsHelper = settingsHelper;
            this.showPrintDoc = false;
        }
        ButtonTable.prototype.activate = function (params, routeConfig, navigationInstruction) {
            this.button = this.settingsHelper.getButton(params.id);
        };
        ButtonTable.prototype.print = function () {
            this.showPrintDoc = true;
        };
        ButtonTable.prototype.printDoc = function (docName) {
            this.showPrintDoc = true;
            this.tableDocName = docName;
        };
        ButtonTable = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [settingsHelper_1.SettingsHelper])
        ], ButtonTable);
        return ButtonTable;
    }());
    exports.ButtonTable = ButtonTable;
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
define('app/buttons-list/buttons-list',["require", "exports", "aurelia-framework", "aurelia-templating", "../settingsHelper", "../enums/LayoutVariant", "aurelia-dependency-injection"], function (require, exports, aurelia_framework_1, aurelia_templating_1, settingsHelper_1, LayoutVariant_1, aurelia_dependency_injection_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ButtonsList = (function () {
        function ButtonsList() {
            this.layoutVariant = new LayoutVariant_1.LayoutVariant();
        }
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", settingsHelper_1.SettingsHelper)
        ], ButtonsList.prototype, "settingsHelper", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Object)
        ], ButtonsList.prototype, "button", void 0);
        ButtonsList = __decorate([
            aurelia_dependency_injection_1.autoinject,
            aurelia_framework_1.customElement("buttons-list")
        ], ButtonsList);
        return ButtonsList;
    }());
    exports.ButtonsList = ButtonsList;
});



define('app/config/environment',["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});



define('app/config/main',["require", "exports", "./environment", "../resources/xrx-services/configuration", "aurelia-http-client"], function (require, exports, environment_1, configuration_1, aurelia_http_client_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature("app/resources")
            .plugin("aurelia-configuration", function (config) {
            config.setDirectory("");
            config.setConfig("application.json");
        })
            .plugin("aurelia-dialog", function (config) {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.startingZIndex = 1000;
        })
            .plugin('aurelia-notify');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        aurelia.start()
            .then(function () {
            var config = aurelia.container.get(configuration_1.ServicesConfiguration);
            config.host = "http://127.0.0.1";
            configureInternal(aurelia);
            aurelia.setRoot("app/shell");
        });
    }
    exports.configure = configure;
    function configureInternal(aurelia) {
        var container = aurelia.container;
        var httpClient = container.get(aurelia_http_client_1.HttpClient);
        httpClient.configure(function (x) {
            x.withBaseUrl(localStorage.getItem("serverUrl"));
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
define('app/document-print/document-print',["require", "exports", "aurelia-framework", "aurelia-templating", "../settingsHelper", "aurelia-router", "aurelia-http-client", "aurelia-notify"], function (require, exports, aurelia_framework_1, aurelia_templating_1, settingsHelper_1, aurelia_router_1, aurelia_http_client_1, aurelia_notify_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var DocumentPrint = (function () {
        function DocumentPrint(http, notificationService, settingsHelper, router) {
            this.http = http;
            this.notificationService = notificationService;
            this.router = router;
            this.showPrintDoc = false;
            this.message = "";
            this.settingsHelper = settingsHelper;
        }
        DocumentPrint.prototype.activate = function (params, routeConfig, navigationInstruction) {
            this.button = this.settingsHelper.getButton(params.id);
        };
        DocumentPrint.prototype.attached = function () {
            this.printDoc();
        };
        DocumentPrint.prototype.printDoc = function () {
            var _this = this;
            var buttonMessage = "";
            var buttonDoc = "";
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
                .createRequest("/api/print-kiosk/print-document")
                .asPost()
                .withContent({ documentPath: this.settingsHelper.imgUrl + "/?filename=" + encodeURIComponent(buttonDoc) })
                .send()
                .then(function () { _this.redirect(); })
                .catch(function () { _this.notificationService.warning("Ошибка при печати", { timeout: 3000 }); _this.redirect(); });
        };
        DocumentPrint.prototype.redirect = function () {
            this.showPrintControl = false;
            if (this.button.Print) {
                if (/_/.test(this.button.Id)) {
                    this.router.navigateToRoute("level-button", { id: this.button.Id.replace(/_[^_]+$/, '') });
                }
                else {
                    this.router.navigateToRoute("main");
                }
            }
        };
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", String)
        ], DocumentPrint.prototype, "documentFromTable", void 0);
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Object)
        ], DocumentPrint.prototype, "button", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], DocumentPrint.prototype, "showPrintControl", void 0);
        DocumentPrint = __decorate([
            aurelia_framework_1.autoinject,
            aurelia_framework_1.customElement("document-print"),
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient, aurelia_notify_1.NotificationService, settingsHelper_1.SettingsHelper, aurelia_router_1.Router])
        ], DocumentPrint);
        return DocumentPrint;
    }());
    exports.DocumentPrint = DocumentPrint;
});



define('app/enums/LayoutVariant',["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var LayoutVariant = (function () {
        function LayoutVariant() {
            this.FourSections = 1;
            this.ThreeSectionsWithLogo = 2;
        }
        return LayoutVariant;
    }());
    exports.LayoutVariant = LayoutVariant;
});



define('app/enums/LogoPosition',["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var LogoPosition = (function () {
        function LogoPosition() {
            this.topLeft = 1;
            this.topRight = 2;
            this.topCenter = 3;
        }
        return LogoPosition;
    }());
    exports.LogoPosition = LogoPosition;
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
define('app/info-table/info-table',["require", "exports", "aurelia-framework", "../settingsHelper"], function (require, exports, aurelia_framework_1, settingsHelper_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var InfoTable = (function () {
        function InfoTable(settingsHelper) {
            this.settingsHelper = settingsHelper;
            this.showPrintDoc = false;
        }
        InfoTable.prototype.activate = function (params, routeConfig, navigationInstruction) {
            this.button = this.settingsHelper.getButton(params.id);
        };
        InfoTable.prototype.print = function () {
            this.showPrintDoc = true;
        };
        InfoTable = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [settingsHelper_1.SettingsHelper])
        ], InfoTable);
        return InfoTable;
    }());
    exports.InfoTable = InfoTable;
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
define('app/level-button/level-button',["require", "exports", "aurelia-framework", "../settingsHelper"], function (require, exports, aurelia_framework_1, settingsHelper_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var LevelButton = (function () {
        function LevelButton(settingsHelper) {
            this.settingsHelper = settingsHelper;
        }
        LevelButton.prototype.activate = function (params, routeConfig, navigationInstruction) {
            this.button = this.settingsHelper.getButton(params.id);
        };
        LevelButton = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [settingsHelper_1.SettingsHelper])
        ], LevelButton);
        return LevelButton;
    }());
    exports.LevelButton = LevelButton;
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
define('app/main/main',["require", "exports", "aurelia-framework", "../settingsHelper", "aurelia-notify", "../enums/LayoutVariant", "../enums/LogoPosition"], function (require, exports, aurelia_framework_1, settingsHelper_1, aurelia_notify_1, LayoutVariant_1, LogoPosition_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = (function () {
        function Main(settingsHelper, notificationService) {
            this.settingsHelper = settingsHelper;
            this.notificationService = notificationService;
            this.showLoader = false;
            this.layoutVariant = new LayoutVariant_1.LayoutVariant();
            this.logoPosition = new LogoPosition_1.LogoPosition();
        }
        Main.prototype.attached = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.showLoader = true;
                    this.settingsHelper.init().then(function () {
                        _this.showLoader = false;
                    }).catch(function (err) {
                        _this.showLoader = false;
                        _this.notificationService.warning(err.message, { timeout: 3000 });
                    });
                    return [2];
                });
            });
        };
        Main = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [settingsHelper_1.SettingsHelper, aurelia_notify_1.NotificationService])
        ], Main);
        return Main;
    }());
    exports.Main = Main;
});



define('app/resources/index',["require", "exports", "XRXWebservices"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            "./custom-attributes/height-100-relative.eip",
            "./elements/loader/loader",
            "./value-converters/debug",
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
define('app/start-settings/start-settings',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-http-client", "aurelia-notify"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_http_client_1, aurelia_notify_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var StartSettings = (function () {
        function StartSettings(router, notificationService, httpClient) {
            this.router = router;
            this.notificationService = notificationService;
            this.httpClient = httpClient;
        }
        StartSettings.prototype.saveUrl = function () {
            var _this = this;
            this.httpClient
                .createRequest(this.serverUrl + "/api/storage/getfilelist")
                .asPost()
                .send()
                .then(function (data) {
                localStorage.setItem("serverUrl", _this.serverUrl);
                _this.router.navigateToRoute("main");
                _this.httpClient.configure(function (x) {
                    x.withBaseUrl(_this.serverUrl);
                });
            }).catch(function () { _this.notificationService.danger("Введен неправильный URL", { timeout: 4000 }); });
        };
        StartSettings = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router, aurelia_notify_1.NotificationService, aurelia_http_client_1.HttpClient])
        ], StartSettings);
        return StartSettings;
    }());
    exports.StartSettings = StartSettings;
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
define('app/resources/custom-attributes/height-100-relative.eip',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Height100RelativeEip = (function () {
        function Height100RelativeEip(element, taskQueue) {
            this.taskQueue = taskQueue;
            this.totalHeight = 0;
            this.subscriptions = new Array();
            this.element = element;
        }
        Height100RelativeEip.prototype.attached = function () {
            var _this = this;
            if (Array.isArray(this.boundElements)) {
                var elements = this.boundElements;
                elements.forEach(function (element) {
                    _this.totalHeight += element.offsetHeight;
                });
                this.setMultipleHeight();
            }
            else {
                this.totalHeight = this.boundElements.offsetHeight;
                this.setSingleHeight();
            }
        };
        Height100RelativeEip.prototype.detached = function () {
            this.totalHeight = 0;
            this.subscriptions.forEach(function (x) { return x.dispose(); });
        };
        Height100RelativeEip.prototype.setSingleHeight = function () {
            var _this = this;
            this.taskQueue.queueMicroTask(function () {
                _this.element.style.height = _this.element.parentElement.offsetHeight - _this.totalHeight + "px";
            });
        };
        Height100RelativeEip.prototype.setMultipleHeight = function () {
            var _this = this;
            this.taskQueue.queueMicroTask(function () {
                _this.element.style.height = _this.element.parentElement.offsetHeight - _this.totalHeight + "px";
            });
        };
        Height100RelativeEip.prototype.valueChanged = function (newValue) {
            this.boundElements = newValue;
        };
        Height100RelativeEip = __decorate([
            aurelia_framework_1.customAttribute("height-100-relative"),
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [Element,
                aurelia_framework_1.TaskQueue])
        ], Height100RelativeEip);
        return Height100RelativeEip;
    }());
    exports.Height100RelativeEip = Height100RelativeEip;
});



define('app/resources/value-converters/debug',["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var DebugValueConverter = (function () {
        function DebugValueConverter() {
        }
        DebugValueConverter.prototype.toView = function (value) {
            console.info("[DEBUG-toView] " + value);
            return value;
        };
        DebugValueConverter.prototype.fromView = function (value) {
            console.info("[DEBUG-fromView] " + value);
            return value;
        };
        return DebugValueConverter;
    }());
    exports.DebugValueConverter = DebugValueConverter;
});



define('app/resources/xrx-services/configuration',["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ServicesConfiguration = (function () {
        function ServicesConfiguration() {
            this.host = "http://127.0.0.1";
        }
        return ServicesConfiguration;
    }());
    exports.ServicesConfiguration = ServicesConfiguration;
});



define('app/resources/xrx-services/xml',["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ServicesXml = (function () {
        function ServicesXml() {
        }
        ServicesXml.prototype.getElement = function (info, name) {
            return xrxGetTheElement(info, name);
        };
        ServicesXml.prototype.getElementValue = function (info, name) {
            return xrxGetElementValue(info, name);
        };
        ServicesXml.prototype.stringToDom = function (str) {
            return xrxStringToDom(str);
        };
        return ServicesXml;
    }());
    exports.ServicesXml = ServicesXml;
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



define('text!app/shell.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"app/assets/styles/utilities.css\"></require>\r\n        <section class=\"height-100\">\r\n            <router-view></router-view>\r\n        </section>\r\n</template>"; });
define('text!app/back-panel/back-panel.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./back-panel.css\"></require>\r\n\r\n    <div class=\"back-panel col-xs-12\" css.bind=\"settingsHelper.backgroundStyle\">\r\n        <div class=\"pull-left\">\r\n            <a css.bind=\"settingsHelper.windowTitlesFont\"\r\n               route-href=\"route.bind: routeName; params.bind: isChild ? {id: parentId} : {}\"\r\n               class=\"alert mdi mdi-chevron-left btn-back\"></a>\r\n        </div>\r\n\r\n        <div class=\"title-container\">\r\n            <div css.bind=\"settingsHelper.windowTitlesStyle\" class=\"alert\">${text}</div>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app/buttons-list/buttons-list.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./buttons-list.css\"></require>\r\n\r\n        <table class=\"buttons-list table-style height-100 width-100\">\r\n            <tr repeat.for=\"row of settingsHelper.splitButtons( \r\n                !button && settingsHelper.settings.Layout.Variant == layoutVariant.ThreeSectionsWithLogo,\r\n                button ? button.Level.Buttons : settingsHelper.settings.Buttons)\">\r\n                <td repeat.for=\"button of row\" colspan=\"${12 / row.length}\" >\r\n                    <div class=\"height-100 width-100\">\r\n                    <a \r\n                         class=\"center-block text-center pmd-card kiosk-button\"\r\n                         css.bind=\"settingsHelper.firstLevelButtonStyle\"\r\n                        route-href=\"route.bind: button.Level ? 'level-button' \r\n                            : (button.Table && button.Table.Info ? 'info-table' \r\n                                : (button.Table && button.Table.Common ? 'button-table' \r\n                                    :'document-print')); \r\n                        params.bind: {id: button.Id}\"\r\n                    >${button.Text}</a>\r\n                </div>\r\n                </td>\r\n            </tr>\r\n        </table>\r\n    \r\n</template>"; });
define('text!app/table.css', ['module'], function(module) { module.exports = ".button-table,\n.info-table {\n  padding-top: 51px; }\n  .button-table table.pmd-table tbody tr td,\n  .info-table table.pmd-table tbody tr td {\n    vertical-align: top; }\n    .button-table table.pmd-table tbody tr td .mdi-printer,\n    .info-table table.pmd-table tbody tr td .mdi-printer {\n      font-size: 100%; }\n  .button-table .mb,\n  .info-table .mb {\n    margin-bottom: 20px; }\n  .button-table .back-panel,\n  .info-table .back-panel {\n    /* padding-top: 20px; */\n    position: fixed;\n    width: 100%;\n    z-index: 1000;\n    top: 0;\n    padding: 15px;\n    background-color: #f8f9fa; }\n  .button-table .alert,\n  .info-table .alert {\n    margin-bottom: 0; }\n  .button-table.background,\n  .info-table.background {\n    position: absolute;\n    z-index: -1; }\n  .button-table.table-container,\n  .info-table.table-container {\n    min-height: calc(100% - 51px); }\n"; });
define('text!app/back-panel/back-panel.css', ['module'], function(module) { module.exports = ".back-panel {\n  padding-top: 20px; }\n  .back-panel .btn-back {\n    display: inline-block;\n    color: black;\n    background-color: white;\n    padding-bottom: 14px;\n    padding-top: 14px;\n    margin-right: 10px; }\n  .back-panel .title-container {\n    overflow: hidden; }\n  .back-panel .alert {\n    border-color: grey; }\n"; });
define('text!app/button-table/button-table.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../table.css\"></require>\r\n    <require from=\"../back-panel/back-panel\"></require>\r\n    <require from=\"../document-print/document-print\"></require>\r\n    <div class=\"button-table\">\r\n        <back-panel text.bind=\"button.Table.Title\" settings-helper.bind=\"settingsHelper\" id.bind=\"button.Id\"></back-panel>\r\n    </div>\r\n    <document-print\r\n        button.bind=\"button\"\r\n        document-from-table.bind=\"tableDocName\"\r\n        if.bind=\"showPrintDoc\"\r\n        show-print-control.bind=\"showPrintDoc\" \r\n    ></document-print>\r\n\r\n    <div if.bind=\"!showPrintDoc\" class=\"container-fluid button-table table-container\"  css.bind=\"settingsHelper.backgroundStyle\">\r\n        <div >\r\n        <table css.bind=\"settingsHelper.tableStyle\" class=\"table table-bordered pmd-table pmd-z-depth mb\">\r\n            <tr repeat.for=\"row of button.Table.Table\">\r\n                <td\r\n                    css=\"width:${button.Table.ColumnWidths[$index]}%;${settingsHelper.gridStyle} ;\r\n                    ${(row.length - 1) == $index && button.Table.Common.PrintFileColumn || $index == 0 && button.Table.Common.DateTimeColumn != 'None' ? 'text-align: center;' : ''} \r\n                    ${(row.length - 1) == $index && button.Table.Common.PrintFileColumn ? 'vertical-align: middle;' : ''}\"\r\n                    repeat.for=\"td of row\"\r\n                >\r\n                    <span if.bind=\"!button.Table.Common.PrintFileColumn || $index != row.length - 1\" innerhtml.bind=\"td\"></span>\r\n\r\n                    <button class=\"mdi mdi-printer btn pmd-btn-raised pmd-ripple-effect btn-default pmd-z-depth\"\r\n                        click.delegate=\"printDoc(td)\"\r\n                        if.bind=\"$index == row.length - 1 && td && button.Table.Common.PrintFileColumn\"\r\n                    ></button>\r\n                </td>\r\n            </tr>\r\n        </table>\r\n    </div>\r\n        <button\r\n            if.bind=\"button.Table.PrintDocument\"\r\n            css.bind=\"settingsHelper.printButtonStyle\"\r\n            click.delegate=\"print()\"\r\n            type=\"button\"\r\n            class=\"btn pmd-btn-raised pmd-ripple-effect btn-default col-xs-12 pmd-z-depth mb\"\r\n        >\r\n            Печать документа\r\n        </button>\r\n    </div>\r\n</template>"; });
define('text!app/buttons-list/buttons-list.css', ['module'], function(module) { module.exports = ".buttons-list {\n  table-layout: fixed;\n  border-spacing: 7px;\n  border-collapse: separate; }\n  .buttons-list div {\n    display: table; }\n  .buttons-list a {\n    display: table-cell;\n    vertical-align: middle; }\n"; });
define('text!app/document-print/document-print.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./document-print.css\"></require>\r\n    <div if.bind=\"showPrintDoc\" class=\"document-print container-fluid\" css.bind=\"settingsHelper.backgroundStyle\">      \r\n        <div class=\"document-print-body\">\r\n            <div class=\"pmd-card text-center\" css.bind=\"settingsHelper.printMessagesStyle\">\r\n                <div class=\"pmd-card-body\">\r\n                    <div class=\"pmd-card-title\">\r\n                        <div class=\"pmd-card-title-text\">\r\n                            <span innerhtml.bind=\"message\"></span>\r\n                        </div>\r\n                    </div>\r\n                </div>                \r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app/document-print/document-print.css', ['module'], function(module) { module.exports = ".document-print {\n  position: fixed;\n  top: 0;\n  width: 100%;\n  height: 100vh;\n  background: #fafafa;\n  z-index: 100;\n  display: table; }\n  .document-print .document-print-body {\n    display: table-cell;\n    vertical-align: middle; }\n    .document-print .document-print-body .pmd-card {\n      margin-bottom: 0; }\n      .document-print .document-print-body .pmd-card .pmd-card-body {\n        color: inherit; }\n        .document-print .document-print-body .pmd-card .pmd-card-body .pmd-card-subtitle-text {\n          color: inherit;\n          font-size: 72%;\n          line-height: 3; }\n"; });
define('text!app/level-button/level-button.css', ['module'], function(module) { module.exports = ""; });
define('text!app/info-table/info-table.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../table.css\"></require>\r\n    <require from=\"../back-panel/back-panel\"></require>\r\n    <require from=\"../document-print/document-print\"></require>\r\n\r\n    <div class=\"info-table\">\r\n        <back-panel text.bind=\"button.Table.Title\" settings-helper.bind=\"settingsHelper\" id.bind=\"button.Id\"></back-panel>\r\n    </div>\r\n\r\n    <document-print\r\n        button.bind=\"button\"\r\n        if.bind=\"showPrintDoc\"\r\n        show-print-control.bind=\"showPrintDoc\" \r\n    ></document-print>\r\n\r\n    <div if.bind=\"!showPrintDoc\" class=\"container-fluid info-table table-container\"  css.bind=\"settingsHelper.backgroundStyle\">\r\n        <table\r\n            css.bind=\"settingsHelper.tableStyle\"\r\n            class=\"table table-bordered pmd-table pmd-z-depth mb\"\r\n        >\r\n            <tr repeat.for=\"row of button.Table.Table\">\r\n                <td\r\n                    repeat.for=\"td of row\"\r\n                    css=\"width:${button.Table.ColumnWidths[$index]}%;${settingsHelper.gridStyle}; ${row.length == 3 && $index == 0? 'text-align: center;' : ''}\"\r\n                >\r\n                    <span if.bind=\"$index != row.length-2\" innerhtml.bind=\"td\"></span>\r\n\r\n                    <img\r\n                        src=\"${settingsHelper.imgUrl}/?filename=${td}\"\r\n                        class=\"img-responsive\"\r\n                        if.bind=\"$index == row.length-2\"\r\n                    >\r\n                </td>\r\n            </tr>\r\n        </table>\r\n\r\n        <button\r\n            if.bind=\"button.Table.PrintDocument\"\r\n            css.bind=\"settingsHelper.printButtonStyle\"\r\n            click.delegate=\"print()\"\r\n            type=\"button\"\r\n            class=\"btn pmd-btn-raised pmd-ripple-effect btn-default col-xs-12 pmd-z-depth mb\"\r\n        >\r\n            Печать документа\r\n        </button>\r\n    </div>\r\n</template>"; });
define('text!app/main/main.css', ['module'], function(module) { module.exports = ".main .logo-content {\n  padding: 15px; }\n\n.main .logo-container {\n  display: table; }\n\n.main .logo-text {\n  display: table-cell;\n  vertical-align: middle; }\n\n.main.background {\n  position: absolute;\n  z-index: -1; }\n  .main.background .background-img-size {\n    max-width: 100vw;\n    max-height: 100vh; }\n"; });
define('text!app/level-button/level-button.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../buttons-list/buttons-list\"></require>\r\n    <require from=\"../back-panel/back-panel\"></require>\r\n\r\n    <table\r\n        class=\"main height-100\"\r\n        css.bind=\"settingsHelper.backgroundStyle\"\r\n    >\r\n        <tr>\r\n            <td>\r\n                <table>\r\n                    <tr>\r\n                        <div class=\"container-fluid\">\r\n                        <div class=\"row\">\r\n                            <back-panel\r\n                                text.bind=\"button.Level.Title\"\r\n                                settings-helper.bind=\"settingsHelper\"\r\n                                id.bind=\"button.Id\"\r\n                            ></back-panel>\r\n                    </div>\r\n                </div>\r\n                    </tr>\r\n                </table>\r\n            </td>\r\n        </tr>\r\n\r\n        <tr class=\"height-100\">\r\n            <td\r\n                as-element=\"buttons-list\"\r\n                settings-helper.bind=\"settingsHelper\"\r\n                button.bind=\"button\"\r\n            ></td>\r\n        </tr>\r\n    </table>\r\n</template>"; });
define('text!app/start-settings/start-settings.css', ['module'], function(module) { module.exports = ".start-settings .form-control {\n  height: 38px; }\n"; });
define('text!app/main/main.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./main.css\"></require>\r\n    <require from=\"../buttons-list/buttons-list\"></require>\r\n    <loader if.bind=\"showLoader\"></loader>\r\n    <table\r\n        class=\"main background text-center height-100 width-100\"\r\n        css.bind=\"settingsHelper.backgroundStyle\"\r\n    >\r\n        <tr>\r\n            <td>\r\n                <img if.bind=\"settingsHelper.backgroundImg\"\r\n                    src=\"${settingsHelper.backgroundImg}\"\r\n                    class=\"background-img-size\"\r\n                    alt=\"\"\r\n                >\r\n            </td>\r\n        </tr>\r\n    </table>\r\n\r\n    <table class=\"main height-100 width-100\">\r\n        <tr>\r\n            <td\r\n                if.bind=\"settingsHelper.settings.Layout.Variant == layoutVariant.ThreeSectionsWithLogo\"\r\n                class=\"logo-content\"\r\n            >\r\n                <table>\r\n                    <tr>\r\n                        <div class=\"${settingsHelper.settings.Layout.Logo.Foreground == logoPosition.topCenter ? 'text-center' :'logo-container width-100'} clearfix\">\r\n                            <template repeat.for=\"i of 2\">\r\n                                <div\r\n                                    if.bind=\"i == (settingsHelper.settings.Layout.Logo.Foreground == logoPosition.topRight ? 1 : 0)\"\r\n                                    class=\"${settingsHelper.settings.Layout.Logo.Foreground == logoPosition.topRight ? 'pull-right' : (settingsHelper.settings.Layout.Logo.Foreground == logoPosition.topLeft ? 'pull-left' : '')}\"\r\n                                >\r\n                                    <img\r\n                                        if.bind=\"settingsHelper.settings.Layout.Logo.src\"\r\n                                        src=\"${settingsHelper.imgUrl}/?filename=${settingsHelper.settings.Layout.Logo.src}\"\r\n                                    >\r\n                                </div>\r\n\r\n                                <div\r\n                                    if.bind=\"i == (settingsHelper.settings.Layout.Logo.Foreground == logoPosition.topRight ? 0 : 1)\"\r\n                                    css=\"${settingsHelper.nameStyle} ${settingsHelper.settings.Layout.Logo.Foreground == logoPosition.topLeft ? 'padding-left: 5px;' : 'padding-right: 5px;'}\"\r\n                                    class=\"${settingsHelper.settings.Layout.Logo.Foreground != logoPosition.topCenter ? 'logo-text width-100' :''}\"\r\n                                >\r\n                                    ${settingsHelper.settings.Layout.EventName}\r\n                                </div>\r\n                            </template>\r\n</div>\r\n</tr>\r\n</table>\r\n</td>\r\n</tr>\r\n\r\n<tr class=\"height-100\">\r\n    <td as-element=\"buttons-list\" settings-helper.bind=\"settingsHelper\"></td>\r\n</tr>\r\n</table>\r\n</template>"; });
define('text!app/assets/styles/utilities.css', ['module'], function(module) { module.exports = "html,\nbody {\n  height: 100%;\n  margin: 0; }\n\n.height-100 {\n  height: 100%; }\n\n.width-100 {\n  width: 100%; }\n\nnotification-host {\n  display: block;\n  -webkit-transition: opacity .2s linear;\n  transition: opacity .2s linear;\n  position: absolute;\n  left: 10%;\n  right: 10%;\n  top: 0;\n  z-index: 1000; }\n"; });
define('text!app/start-settings/start-settings.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./start-settings.css\"></require>\r\n\r\n    <div class=\"container text-center\">\r\n            <h2>Server URL</h2>\r\n    </div>\r\n\r\n    <div class=\"start-settings pmd-card pmd-z-depth pmd-card-custom-form\">\r\n        <div class=\"pmd-card-body\">\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-10\">\r\n                    <input\r\n                        type=\"text\"\r\n                        value.bind=\"serverUrl\"\r\n                        class=\"form-control\"\r\n                    ></input>\r\n                </div>\r\n\r\n                <div class=\"col-xs-2\">\r\n                    <button\r\n                        click.delegate=\"saveUrl()\"\r\n                        class=\"btn btn-default pmd-btn-raised width-100\"\r\n                    >\r\n                        <i class=\"mdi mdi-check\"></i>\r\n                        OK\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app/resources/elements/loader/loader.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./loader.css\"></require>\r\n    <div class=\"loader\">\r\n        <div  class=\"sk-fading-circle\">\r\n            <div repeat.for=\"i of numberOfCircles\" class=\"sk-circle${i+1} sk-circle\"></div>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app/resources/elements/loader/loader.css', ['module'], function(module) { module.exports = ".loader {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -webkit-box-align: center;\n  -ms-flex-align: center;\n  align-items: center;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  opacity: 0.7;\n  background: rgba(0, 0, 0, 0.6);\n  z-index: 10000; }\n  .loader .sk-fading-circle {\n    width: 140px;\n    height: 140px;\n    position: relative; }\n  .loader .sk-fading-circle .sk-circle {\n    width: 100%;\n    height: 100%;\n    position: absolute; }\n  .loader .sk-fading-circle .sk-circle:before {\n    content: '';\n    display: block;\n    margin: 0 auto;\n    width: 15%;\n    height: 15%;\n    background-color: black;\n    -webkit-border-radius: 100%;\n    border-radius: 100%;\n    -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;\n    animation: sk-circleFadeDelay 1.2s infinite ease-in-out both; }\n  .loader .sk-fading-circle .sk-circle1 {\n    -webkit-transform: rotate(30deg);\n    transform: rotate(30deg); }\n  .loader .sk-fading-circle .sk-circle1:before {\n    -webkit-animation-delay: -1.1s;\n    animation-delay: -1.1s; }\n  .loader .sk-fading-circle .sk-circle2 {\n    -webkit-transform: rotate(60deg);\n    transform: rotate(60deg); }\n  .loader .sk-fading-circle .sk-circle2:before {\n    -webkit-animation-delay: -1s;\n    animation-delay: -1s; }\n  .loader .sk-fading-circle .sk-circle3 {\n    -webkit-transform: rotate(90deg);\n    transform: rotate(90deg); }\n  .loader .sk-fading-circle .sk-circle3:before {\n    -webkit-animation-delay: -0.9s;\n    animation-delay: -0.9s; }\n  .loader .sk-fading-circle .sk-circle4 {\n    -webkit-transform: rotate(120deg);\n    transform: rotate(120deg); }\n  .loader .sk-fading-circle .sk-circle4:before {\n    -webkit-animation-delay: -0.8s;\n    animation-delay: -0.8s; }\n  .loader .sk-fading-circle .sk-circle5 {\n    -webkit-transform: rotate(150deg);\n    transform: rotate(150deg); }\n  .loader .sk-fading-circle .sk-circle5:before {\n    -webkit-animation-delay: -0.7s;\n    animation-delay: -0.7s; }\n  .loader .sk-fading-circle .sk-circle6 {\n    -webkit-transform: rotate(180deg);\n    transform: rotate(180deg); }\n  .loader .sk-fading-circle .sk-circle6:before {\n    -webkit-animation-delay: -0.6s;\n    animation-delay: -0.6s; }\n  .loader .sk-fading-circle .sk-circle7 {\n    -webkit-transform: rotate(210deg);\n    transform: rotate(210deg); }\n  .loader .sk-fading-circle .sk-circle7:before {\n    -webkit-animation-delay: -0.5s;\n    animation-delay: -0.5s; }\n  .loader .sk-fading-circle .sk-circle8 {\n    -webkit-transform: rotate(240deg);\n    transform: rotate(240deg); }\n  .loader .sk-fading-circle .sk-circle8:before {\n    -webkit-animation-delay: -0.4s;\n    animation-delay: -0.4s; }\n  .loader .sk-fading-circle .sk-circle9 {\n    -webkit-transform: rotate(270deg);\n    transform: rotate(270deg); }\n  .loader .sk-fading-circle .sk-circle9:before {\n    -webkit-animation-delay: -0.3s;\n    animation-delay: -0.3s; }\n  .loader .sk-fading-circle .sk-circle10 {\n    -webkit-transform: rotate(300deg);\n    transform: rotate(300deg); }\n  .loader .sk-fading-circle .sk-circle10:before {\n    -webkit-animation-delay: -0.2s;\n    animation-delay: -0.2s; }\n  .loader .sk-fading-circle .sk-circle11 {\n    -webkit-transform: rotate(330deg);\n    transform: rotate(330deg); }\n  .loader .sk-fading-circle .sk-circle11:before {\n    -webkit-animation-delay: -0.1s;\n    animation-delay: -0.1s; }\n  .loader .sk-fading-circle .sk-circle12 {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg); }\n  .loader .sk-fading-circle .sk-circle12:before {\n    -webkit-animation-delay: 0s;\n    animation-delay: 0s; }\n\n@-webkit-keyframes sk-circleFadeDelay {\n  0%,\n  39%,\n  100% {\n    opacity: 0; }\n  40% {\n    opacity: 1; } }\n\n@keyframes sk-circleFadeDelay {\n  0%,\n  39%,\n  100% {\n    opacity: 0; }\n  40% {\n    opacity: 1; } }\n"; });
//# sourceMappingURL=app-bundle.js.map