import * as React from 'react';
import { IRadio, Props } from '../interface/Interface.Single';
declare const RadioItem: (config: any) => {
    Radio: (props: Props) => JSX.Element;
    RadioWrapper: (props: any) => React.ReactNode;
    getChoose: () => boolean[];
    getRef: () => (IRadio | null)[];
};
declare const CheckboxItem: (config: any) => {
    Checkbox: (props: Props) => JSX.Element;
    CheckboxWrapper: (props: any) => React.ReactNode;
    getChoose: () => boolean[];
    getRef: () => any;
    getAllSelectStatus: () => 0 | 1 | 2;
    selectAll: (isChoose: boolean) => void;
};
export { RadioItem, CheckboxItem, };
