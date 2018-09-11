import * as React from 'react';
import { Component } from 'react';
import { MainProps as Props } from '../interface/Interface';
declare class TreeMenu extends Component<Props, object> {
    static defaultProps: {
        bodyData: never[];
    };
    private _headerRef;
    private _bodyTop;
    private _bodyActive;
    private _timer;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    hide(): void;
    show(index: number): void;
    setHeaderValue(index: number, value: string | React.ReactNode): void;
    _hide(): void;
    _showBody(index: number, isActive: boolean): void;
    _headerClick(e: any, index: number, isActive: boolean): void;
    render(): React.ReactNode;
}
export default TreeMenu;
