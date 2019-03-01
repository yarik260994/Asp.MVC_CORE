export class DebugValueConverter {
    toView(value: any): any {
        console.info(`[DEBUG-toView] ${value}`);
        return value;
    }

    fromView(value: any): any {
        console.info(`[DEBUG-fromView] ${value}`);
        return value;
    }
}