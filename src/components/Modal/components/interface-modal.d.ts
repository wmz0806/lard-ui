import * as React from "react";
export interface IButton {
    content?: React.ReactNode | string;
    className?: string;
    color?: string;
    backColor?: string;
    cb?: () => void;
    onClick?: any;
    autoClose?: boolean;
}
export interface IModal {
    className?: string;
    title?: React.ReactNode | string;
    titleCN?: string;
    content?: React.ReactNode | string;
    contentCN?: string;
    animateTime?: number;
    animateName?: string;
    buttons: IButton[];
}
interface _modal {
    title?: React.ReactNode | string;
    content?: React.ReactNode | string;
    options: any;
}
export interface IDialog extends _modal {
    buttons: IButton[];
}
export interface IConfirm extends _modal {
    cancelBtn: IButton;
    sureBtn: IButton;
}
export interface IAlert extends _modal {
    sureBtn: IButton;
}
export {};
