import * as React from 'react';
import { Component } from 'react';
import { IModal } from './interface-modal';
interface Props {
    [key: string]: any;
}
interface State {
    modalQueue: IModal[];
    animateTime: number;
    transitionTime: number;
    animateName: string;
}
export default class Collection extends Component<Props, State> {
    static defaultProps: {};
    static create: (props?: any) => void;
    state: State;
    private _modal;
    private _timer;
    constructor(props: Props);
    componentWillUnmount(): void;
    _removeModal(index: number): void;
    close(): void;
    show(options: IModal): void;
    clear(): void;
    _renderModal(): React.ReactNode;
    render(): React.ReactNode;
}
export {};
