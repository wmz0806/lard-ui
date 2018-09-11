import * as React from 'react';
interface StateObj {
    toast: ToastObj;
    loading: ToastObj;
}
interface ToastObj {
    key?: string;
    type?: string;
    content?: string;
    time?: number;
    shade?: boolean;
    shadeType?: string;
    css?: string;
    tapToClose?: boolean;
    onClose?(): void;
}
export interface ContainerObj {
    toast(toastProps: ToastObj): void;
    hide(): void;
    hideLoading(): void;
    destroy(): void;
}
declare type timerType = number | undefined | any;
declare class Container extends React.Component<object, StateObj> {
    static independentLoading: boolean;
    static create: (properties?: object) => ContainerObj;
    state: StateObj;
    child: any | null;
    loadingChild: any | null;
    hideLoadingTimer: timerType;
    hideTimer: timerType;
    releaseQueue(): void;
    add(toast: ToastObj): void;
    closePack(toast: ToastObj): void;
    destroy(): void;
    hideLoading(): void;
    hide(): void;
    closeLoadingPack(loading: any): void;
    getToastDom(): JSX.Element | any;
    getShadeDom(): JSX.Element | any;
    getLoadingDom(): JSX.Element | any;
    render(): React.ReactNode;
}
export default Container;
