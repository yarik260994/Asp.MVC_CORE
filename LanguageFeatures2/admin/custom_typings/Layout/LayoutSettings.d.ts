interface LayoutSettings {
    Background: BackgroundSettings;
    EventName: string;
    FirstLevelButtons: StyleSettings;
    Logo: LogoSettings;
    Name: StyleSettings;
    PrintButtons: StyleSettings;
    Variant: number;//Отказались от Enum, потому что не смогли прибиндить
    PrintMessages: StyleSettings;
    Table: StyleSettings;
    TableGridColor: string;
    TableGridSize: number;//Предполагается в пунктах
    WindowTitles: StyleSettings;
}