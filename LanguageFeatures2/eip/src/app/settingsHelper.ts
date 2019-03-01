import { HttpClient } from "aurelia-http-client";
import { Settings } from "../../custom_typings/Settings";
import { autoinject } from "aurelia-framework";
import { Button } from "../../custom_typings/Buttons/Button";

@autoinject
export class SettingsHelper {
    static readonly MAX_BUTTONS = 6;
    static readonly MAX_BUTTONS_LOGO = 4;
    public settings: Settings;
    public readonly imgUrl: string;
    public nameStyle: string = "";
    public firstLevelButtonStyle: string = "";
    public printButtonStyle: string = "";
    public tableStyle: string = "";
    public gridStyle: string = "";
    public backgroundStyle: string = "";
    public backgroundImg: string = "";
    public windowTitlesStyle: string = "";
    public windowTitlesFont: string = "";
    public printMessagesStyle: string = "";

    
    constructor(private httpClient: HttpClient) {
        this.imgUrl = `${localStorage.getItem("serverUrl")}/api/storage/get-picture`;
    }

    public async init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.httpClient
                .createRequest(`/api/settings-kiosk/get-settings`)
                .asPost()
                .send()
                .then(data => {
                    this.settings = data.content;
                    SettingsHelper.assignIds('', this.settings.Buttons);
                    this.initStyle();
                    resolve();
                }).catch(() => { reject(new Error("Ошибка при загрузке данных")); })
        });
    }

    private static assignIds(parentId: string, buttons: Button[]): void {
        for (let i: number = 0; i < buttons.length; i++) {
            buttons[i].Id = parentId + i;
            if (buttons[i].Level)
                SettingsHelper.assignIds(buttons[i].Id + '_', buttons[i].Level.Buttons);
        }
    }

    public getButton(id: string): Button {
        return SettingsHelper.getButtonFromArray(id, this.settings.Buttons);
    }

    private static getButtonFromArray(id: string, buttons: Button[]): Button {
        return /_/.test(id)
            ? SettingsHelper.getButtonFromArray(id.replace(/[^_]+_/, ''), buttons[Number(id.replace(/_.+/, ''))].Level.Buttons)
            : buttons[Number(id)]; 
    }

    private initStyle(): void {
        this.nameStyle = SettingsHelper.getUIElementStyle(this.settings.Layout.Name, false);
        this.firstLevelButtonStyle = this.getFirstLevelButtonStyle();
        this.printButtonStyle = SettingsHelper.getUIElementStyle(this.settings.Layout.PrintButtons);
        this.tableStyle = SettingsHelper.getUIElementStyle(this.settings.Layout.Table);
        this.gridStyle = "border: " + this.settings.Layout.TableGridSize + "px solid #" + this.settings.Layout.TableGridColor + ";";
        this.backgroundStyle = this.getBackgroundStyle();
        this.windowTitlesFont = `font-family: '${this.settings.Layout.WindowTitles.fontFamily}'; font-size: ${this.settings.Layout.WindowTitles.fontSize}pt; font-weight:${this.settings.Layout.WindowTitles.fontWeight};`;
        this.windowTitlesStyle = SettingsHelper.getUIElementStyle(this.settings.Layout.WindowTitles);
        this.backgroundImg=this.getBackgroundImg();
        this.printMessagesStyle = SettingsHelper.getUIElementStyle(this.settings.Layout.PrintMessages);
    }

    private getFirstLevelButtonStyle(): string {
        return SettingsHelper.getUIElementStyle(this.settings.Layout.FirstLevelButtons);
    }
  
    private getBackgroundStyle(): string {
        return `background-color: #${this.settings.Layout.Background.backgroundColor}`;
    }

    private getBackgroundImg(): string {

        let imageName = encodeURIComponent(this.settings.Layout.Background.backgroundImage);
        return imageName? `${this.imgUrl}/?filename=${imageName}` : "";

    }

    private static getUIElementStyle(style: StyleSettings, useBGColor: boolean = true): string {
        return `color: #${style.color};` +
            `font-family: '${style.fontFamily}';` +
            `font-size: ${style.fontSize}pt;` +
            `font-weight:${style.fontWeight};` +
            `font-style: ${style.fontStyle};` +
            `text-decoration: ${style.textDecoration};` +
            (useBGColor ? `background-color: #${style.backgroundColor};` : "");
    }

    public splitButtons(haveLogo: boolean, buttons: Button[]): Button[][] {
        if (!buttons) return [];
        let list: Button[] = buttons.slice(0, haveLogo ? SettingsHelper.MAX_BUTTONS_LOGO : SettingsHelper.MAX_BUTTONS);

        if (buttons.length < 3 || haveLogo) {
            return [list];
        }
        else {
            let firstRow: Button[] = list.splice(0, Math.floor(list.length / 2));
            let secondRow: Button[] = list.slice();

            return [firstRow, secondRow];
        }
    }
}