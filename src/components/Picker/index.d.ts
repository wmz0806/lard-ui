import * as React from 'react';
export interface Props {
    /**
     * 子元素
     * @default null
     */
    children?: null | React.ReactNode;
    /**
     * 额外的 class 类名 （指定的是 target 的类名）
     * @default ""
     */
    className?: string;
    /**
     * 额外的 style （指定的是 target 的style）
     * @default {}
     */
    style?: object;
    /**
     *  默认选中的值
     * @default undefined
     */
    value?: string[];
    /**
     *  数据有多少列
     * @default undefined
     */
    col?: number;
    /**
     *  数据，如果type = 'date' 则数据自动生成
     * @default undefined
     */
    data?: any;
    /**
     * Picker类型， basic（基本）, cascade（级联）, date（时间）
     * @default basic
     */
    type?: 'basic' | 'cascade' | 'date';
    /**
     * date 类型最小支持年月日（Date 对象）
     * @default undefined
     */
    min?: any;
    /**
     * date 类型最大支持年月日（Date 对象）
     * @default undefined
     */
    max?: any;
    /**
     *  标题
     * @default ""
     */
    title?: string;
    /**
     *  取消按钮文本
     * @default "取消"
     */
    cancelText?: string;
    /**
     *  确定按钮文本
     * @default "确定"
     */
    confirmText?: string;
    /**
     *  点击确定按钮的回调
     * @default void
     */
    onChange?(v: string[]): void;
    /**
     *  点击取消按钮的回调
     * @default void
     */
    onCancel?(): void;
    /**
     *  滑动Picker停止后的回调
     * @default void
     */
    onPickerChange?(v: string[]): void;
}
interface State {
    defaultValue: string[];
    selectedValue: string[];
    animation: string;
    show: boolean;
    title: string;
    col: number;
    data: any[];
}
interface Options {
    [key: string]: any;
}
declare class Picker extends React.Component<Props, State> {
    static defaultProps: Props;
    state: State;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    getInitialize(options: Options): void;
    getDateData(nCol: number, selectedValue: any[]): any[];
    resize: (e: Event) => void;
    handleClickOpen(e?: any): void;
    show(): void;
    handleClickClose(e?: Event): void;
    handlePickerViewChange(newValue: string[]): void;
    handleCancel(): void;
    handleConfirm(): void;
    getPopupDOM(): React.ReactNode | null;
    getPickerView(): React.ReactNode | null;
    render(): React.ReactNode;
}
export default Picker;
