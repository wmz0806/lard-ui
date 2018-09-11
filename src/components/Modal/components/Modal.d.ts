import * as React from 'react';
import { Component } from 'react';
import { IModal, IButton } from './interface-modal';
interface Props extends IModal {
    close: () => void;
    index: number;
}
interface State {
    show: boolean;
}
declare class Modal extends Component<Props, State> {
    static defaultProps: {
        className: string;
        title: string;
        titleCN: string;
        content: string;
        contentCN: string;
        buttons: never[];
    };
    state: {
        show: boolean;
    };
    private _timer;
    componentWillUnmount(): void;
    setEnterAnimate(): void;
    setOutAnimate(): void;
    clickBtn(btn: IButton): void;
    render(): React.ReactNode;
}
export default Modal;
