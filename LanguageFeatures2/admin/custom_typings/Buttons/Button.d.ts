import { TableButtonProperties } from "./TableButtonProperties";
import { LevelButtonProperties } from "./LevelButtonProperties";

interface Button {
    Level: LevelButtonProperties;
    Print: PrintButtonProperties;
    Table: TableButtonProperties;
    Text: string;
}