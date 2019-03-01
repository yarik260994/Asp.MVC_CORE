import { Button } from "../../custom_typings/Buttons/Button";
import { SettingsHelper } from "./settingsHelper";

export class TableHelper{ 

    public getButtonLevel(parentId:number, childId:number,settingsHelper: SettingsHelper):Button {
        return childId
        ? settingsHelper.settings.Buttons[parentId].Level.Buttons[childId]
        : settingsHelper.settings.Buttons[parentId];
    }
}