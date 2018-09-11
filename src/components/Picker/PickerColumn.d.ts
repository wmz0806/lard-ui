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
    value: string;
    data: any;
    index: number;
    onValueChange(selectedValue: any, index: number): void;
}
declare class PickerColumn extends React.Component<Props, object> {
    static defaultProps: Props;
    state: {};
    indicator: HTMLDivElement | null;
    content: HTMLDivElement | null;
    itemHeight: number;
    zscroller: any;
    constructor(props: Props);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    bindScrollEvent(): void;
    scrollingComplete(): void;
    scrollToPosition(): void;
    selectByIndex(index: number): void;
    getCols(): React.ReactNode;
    render(): React.ReactNode;
}
export default PickerColumn;
