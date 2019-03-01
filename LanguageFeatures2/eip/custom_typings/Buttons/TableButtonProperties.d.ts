import { CommonTableProperties } from "./CommonTableProperties";

interface TableButtonProperties {
    ColumnWidths: string[];
    Common: CommonTableProperties;
    Info: InfoTableProperties;
    Message: string;
    PrintDocument: string;
    Table: string[][];
    Title: string;
}