import { Grid } from "./grid/grid";
import { Button } from "../../../custom_typings/Buttons/Button";

export class TableEditor {
    public showDocumentForPrint: boolean = false;

    protected  initDocumentToPrint(tableButton: Button):boolean {
        if (tableButton.Table.PrintDocument) {
            return true;
        }
        else {
            return false;
        }
    }

    protected checkPercent(neededColumnsCount: number, tableButton: Button): string[] {
        if (!Grid.checkPercent(tableButton.Table.ColumnWidths) || tableButton.Table.ColumnWidths.length != neededColumnsCount) {
            tableButton.Table.ColumnWidths = [];
            let columnWidth = 100 / neededColumnsCount;
            for (let i = 0; i < neededColumnsCount; i++) {
                tableButton.Table.ColumnWidths.push(columnWidth.toString());
            }
        }
        return tableButton.Table.ColumnWidths.slice();
    }

   public onDocumentToPrintChecked(tableButton:Button) {
        if (!this.showDocumentForPrint) {
          tableButton.Table.PrintDocument = "";
        }
      }

    protected static adjustByDateTime(row: string[], value: boolean) {
        if (value) {
            row.unshift("");
        } else {
            row.shift();
        }
    }

    protected static adjustByFileToPrint(row: string[], value: boolean) {
        if (value) {
            row.push("");
        } else {
            row.pop();
        }
    }

    protected static adjustRow(row: string[], showPrintFile: boolean, neededColumnsCount: number): void {
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
    }
}