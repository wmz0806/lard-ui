import * as React from 'react';
import { Component } from 'react';
import { Props, State, Config } from './interface/Interface';
declare class TabBar extends Component<Props, State> {
    static defaultProps: {
        defaultColor: string;
        activeColor: string;
    };
    state: State;
    private _width;
    constructor(props: Props);
    componentWillReceiveProps(props: Props): void;
    setActiveItem(index: number): void;
    _clickItem(e: any, index: number, item: Config): void;
    _renderAbove(active?: boolean, icon?: string, defaultImg?: string, activeImg?: string): React.ReactNode;
    _renderNormal(item: Config): React.ReactNode;
    _renderBig(item: Config): React.ReactNode;
    render(): React.ReactNode;
}
export default TabBar;
