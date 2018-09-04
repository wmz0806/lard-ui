import {Component} from "react";
import * as React from 'react';
import {Props, State} from "../interface/Interface";
import Main from './Main';

class TextArea extends Component<Props, State> {
  private _ref: any = null;

  public getRef(): any {
    return this._ref.getRef()
  }

  public validate(isShowErr: boolean = true): boolean {
    return this._ref.validate();
  }

  public getValue(): string {
    return this._ref.getValue();
  }

  public setValue(val: string): void {
    this._ref.setValue(val)
  }

  public setDisabled(isDisabled: boolean): void {
    this._ref.setDisabled(isDisabled);
  }

  public render(): React.ReactNode {
    return (
      <Main
        ref={r => this._ref = r}
        xmlTag={'textArea'}
        {...this.props}
      />
    );
  }
}

export default TextArea;
