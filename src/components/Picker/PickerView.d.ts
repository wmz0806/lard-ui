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
    col: number;
    data: any;
    cascade: boolean;
    controlled?: boolean;
    value: string[];
    onChange(v: string[]): void;
}
interface State {
    defaultSelectedValue: string[];
}
declare class PickerView extends React.Component<Props, State> {
    static defaultProps: Props;
    state: State;
    constructor(props: Props);
    componentDidMount(): void;
    handleValueChange(newValue: any, index: number): void;
    getColumns(): any;
    getNewValue(tree: any, oldValue: string[], newValue: string[], deep: number): string[];
    getColumnsData(tree: any, value: string[], hasFind: any[], deep: number): any[];
    render(): React.ReactNode;
}
export default PickerView;
