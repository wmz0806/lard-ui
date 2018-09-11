import * as React from 'react';
import { Component } from 'react';
import { Props, State } from './interface/Interface';
declare class GroupButton extends Component<Props, State> {
    static defaultProps: {
        type: string;
        allSelect: string;
    };
    state: State;
    constructor(props: Props);
    setChoose(config: boolean[] | number): void;
    getChoose(): boolean[];
    selectAll(): void;
    unselectAll(): void;
    getAllSelectStatus(): boolean;
    _allSelect(isChoose: boolean): void;
    _clickAll(e: any): void;
    _itemClick(e: any, index: number, isChoose: boolean, isDisabled: boolean): void;
    _renderContent(): React.ReactNode | void;
    render(): React.ReactNode;
}
export default GroupButton;
