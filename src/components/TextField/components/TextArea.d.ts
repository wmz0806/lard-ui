import { Component } from "react";
import * as React from 'react';
import { Props, State } from "../interface/Interface";
declare class TextArea extends Component<Props, State> {
    private _ref;
    getRef(): any;
    validate(isShowErr?: boolean): boolean;
    getValue(): string;
    setValue(val: string): void;
    setDisabled(isDisabled: boolean): void;
    render(): React.ReactNode;
}
export default TextArea;
