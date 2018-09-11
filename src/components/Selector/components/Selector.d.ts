import * as React from 'react';
import { Component } from 'react';
import { State, Props, Config } from '../interface/Interface';
declare class Selector extends Component<Props, State> {
    static defaultProps: {
        type: string;
        direction: string;
        hasAllSelect: boolean;
        data: never[];
    };
    state: State;
    constructor(props: Props);
    getChoose(): boolean[];
    setChoose(config: boolean[] | number): void;
    selectAll(): void;
    unselectAll(): void;
    _allSelect(isChoose: boolean): void;
    getAllSelectStatus(): 0 | 1 | 2;
    _validateAllSelect(): void;
    _checkboxClick(e: any, index: number, item: Config): void;
    _clickAll(e: any): void;
    _radioItemClick(e: any, index: number, item: Config): void;
    _renderIcon(isRadio: boolean, isChoose: boolean, isDisabled: boolean, isErr: boolean): React.ReactNode;
    _renderContent(): React.ReactNode;
    render(): React.ReactNode;
}
export default Selector;
