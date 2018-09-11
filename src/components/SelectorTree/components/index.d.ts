import * as React from 'react';
import { Component } from 'react';
import { Props, State, Config } from '../interface/Interface';
declare class SelectorTree extends Component<Props, State> {
    static defaultProps: {};
    state: State;
    constructor(props: Props);
    show(): void;
    hide(): void;
    reset(): void;
    _onSure(): void;
    _addItem(item: Config, data: Config[]): void;
    _clickItem(item: Config): void;
    _deleteChose(indexArr: number[]): void;
    _changeActive(indexArr: number[], isActive: boolean): void;
    _changeChoose(item: Config): void;
    _renderChose(): React.ReactNode;
    _renderTree3(data: Config[], item: Config): React.ReactNode;
    _renderTree2(data: Config): React.ReactNode | void;
    _renderTree1(): React.ReactNode;
    _renderFooter(): React.ReactNode;
    render(): React.ReactNode;
}
export default SelectorTree;
