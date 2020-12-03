import { Position, Toaster, Intent } from "@blueprintjs/core";

export default class AppToaster {

    static toaster = Toaster.create({
        position: Position.TOP,
    });

    static success = (msg: string, timeout?: number) => {
        AppToaster.toaster.show({
            icon: "tick",
            intent: Intent.SUCCESS,
            message: msg,
            timeout: timeout || 3000
        });
    };

    static failure = (msg: string, timeout?: number) => {
        AppToaster.toaster.show({
            icon: "error",
            intent: Intent.DANGER,
            message: msg,
            timeout: timeout || 3000
        });
    };
}