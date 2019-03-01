import { customAttribute, autoinject, Disposable, TaskQueue } from "aurelia-framework";

@customAttribute("height-100-relative")
@autoinject
export class Height100RelativeEip {
    boundElements: any;
    totalHeight: number = 0;

    subscriptions: Array<Disposable> = new Array<Disposable>();

    element: HTMLElement;

    constructor(
        element: Element,
        private taskQueue: TaskQueue) {

        this.element = element as HTMLElement;
    }

    attached() {
        if (Array.isArray(this.boundElements)) {
            const elements = this.boundElements as Array<any>;
            elements.forEach(element => {
                this.totalHeight += element.offsetHeight;
            });

            this.setMultipleHeight();
        }
        else {
            this.totalHeight = this.boundElements.offsetHeight;
            this.setSingleHeight();
        }
    }

    detached() {
        this.totalHeight = 0;
        this.subscriptions.forEach(x => x.dispose());
    }

    setSingleHeight() {
        this.taskQueue.queueMicroTask(() => {
            this.element.style.height = `${this.element.parentElement.offsetHeight - this.totalHeight}px`;
        });
    }

    setMultipleHeight() {
        this.taskQueue.queueMicroTask(() => {
            this.element.style.height = `${this.element.parentElement.offsetHeight - this.totalHeight}px`;
        });
    }

    valueChanged(newValue: any) {
        this.boundElements = newValue;
    }
}