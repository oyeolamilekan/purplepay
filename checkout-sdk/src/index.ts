
import utils from "./utils";

function isRequired(key: string) {
    throw new Error(`${key} is required`);
}

function Pay({ onSuccess, onError, onClose, ...rest }: { onSuccess: Function, onError: Function, onClose: Function }): void {
    if (!(this instanceof Pay))
        return Pay({
            onSuccess,
            onError,
            onClose,
            ...rest,
        });
    Pay.prototype.config = rest;
    Pay.prototype.onClose = onClose || isRequired("onClose callback");
    Pay.prototype.onError = onError || isRequired("onError callback");
    Pay.prototype.onSuccess = onSuccess || isRequired("onSuccess callback");
    Pay.prototype.utils = utils({ title: "payment", config: "new" });
}

Pay.prototype.setup = function () {
    Pay.prototype.utils.init({
        title: "Pay SDK",
        config: this.config,
    });
};

Pay.prototype.open = function () {
    Pay.prototype.utils.openWidget({ config: this.config, sdkType: "send" });
    const handleEvents = (event: MessageEvent) => {
        switch (event.data.type) {
            case "pay.success":
                Pay.prototype.success(event.data);
                break;
            case "pay.close":
                Pay.prototype.close(event.data);
                break;
            case "pay.server_error":
                Pay.prototype.error(event.data);
                break;
        }
    };

    Pay.prototype.eventHandler = handleEvents.bind(this);
    window.addEventListener("message", this.eventHandler, false);
};

Pay.prototype.close = function (data: object) {
    window.removeEventListener("message", this.eventHandler, false);
    Pay.prototype.utils.closeWidget();
    this.onClose(data);
};

Pay.prototype.success = function (data: object) {
    window.removeEventListener("message", this.eventHandler, false);
    Pay.prototype.utils.closeWidget();
    this.onSuccess(data);
};

Pay.prototype.error = function (event: MessageEvent) {
    this.onError(event);
};

// This makes the module safe to import into an isomorphic code.
if (typeof window !== "undefined") {
    window.Pay = Pay; // make Pay available in the window object
}

export default Pay;