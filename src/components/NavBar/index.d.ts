import * as React from 'react';
import { Component } from 'react';
import { Props, State } from './interface/Interface';
declare class NavBar extends Component<Props, State> {
    static defaultProps: {};
    state: State;
    private _activeRef;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillReceiveProps(props: Props): void;
    _clickItem(e: any, index: number): void;
    setActive(index: number, isAutoScroll: boolean): boolean;
    render(): React.ReactNode;
}
export default NavBar;
