import * as React from 'react';
import { Component } from 'react';
import { Props, State } from '../interface/Interface';
export default class extends Component<Props, State> {
    static defaultProps: {
        placeholder: string;
        initValue: string;
        type: string;
        isDisabled: boolean;
        needClearIcon: boolean;
        needEncrypt: boolean;
        isBlurValidate: boolean;
        validateType: string;
        validateMsg: string;
        validateColor: string;
        overLengthMsg: string;
        needTextAreaFooter: boolean;
        xmlTag: string;
    };
    state: State;
    private _textRef;
    private _isNotBlur;
    private _shakeTimer;
    private _scrollTimer;
    private _changeTimer;
    private _isAndroid;
    constructor(props: Props);
    componentWillUnmount(): void;
    getRef(): any;
    validate(isShowErr?: boolean): boolean;
    getValue(): string;
    setValue(value: string): void;
    setDisabled(isDisabled: boolean): void;
    _showErr(): void;
    _validateValue(): boolean;
    _onBlur(e: any): boolean;
    _onFocus(e: any): void;
    _onChange(e: any): void;
    _onClick(e: any): void;
    _renderInput(): React.ReactNode;
    _renderTextArea(): React.ReactNode;
    render(): React.ReactNode;
}
