import * as React from 'react';
import { Component } from 'react';
import { HeaderProps as Props, HeaderState as State } from '../interface/Interface';
declare class TreeMenuHeader extends Component<Props, State> {
    static defaultProps: {};
    state: State;
    private _headerEl;
    constructor(props: Props);
    getRef(): HTMLUListElement | null;
    setActive(index: number, isActive: boolean): void;
    setValue(index: number, value: string | React.ReactNode): void;
    _clickItem(e: any, index: number): void;
    render(): React.ReactNode;
}
export default TreeMenuHeader;
