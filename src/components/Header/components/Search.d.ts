import * as React from 'react';
import { Component } from 'react';
import { SearchProps as Props, SearchState as State } from '../interface/Interface';
declare class Header extends Component<Props, State> {
    static defaultProps: {};
    state: State;
    private _delayTimer;
    private _blurTimer;
    private _isNotBlur;
    private _isClickClear;
    _inputRef: any;
    constructor(props: any);
    componentWillUnmount(): void;
    setActive(isActive: boolean): void;
    setValue(val: any): void;
    getInputRef(): any;
    _searchClick(e: any): void;
    _searchFocus(e: any): void;
    _searchBlur(e: any): boolean | void;
    _searchChange(e: any): void;
    _searchKeyDown(e: any): void;
    _setSearchValue(val: string): void;
    _delaychange(e: any, value: string): void;
    _renderRight(): React.ReactNode;
    render(): React.ReactNode;
}
export default Header;
