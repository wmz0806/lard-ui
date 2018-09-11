import * as React from 'react';
export interface Props {
    /**
     * 额外的 class 类名
     * @default ""
     */
    className?: string;
    /**
     * 额外的 style
     * @default {}
     */
    style?: object;
    /**
     * 禁用组件
     * @default false
     */
    disabled?: boolean;
    /**
     * 最小的数字
     * @default 0
     */
    min?: number;
    /**
     * 最打的数字
     * @default 无穷大
     */
    max?: number;
    /**
     * 初始数字
     * @default 0
     */
    value?: number;
    /**
     * 每次加多少
     * @default 0
     */
    step?: number;
    /**
     * 数字发生改变时触发的事件
     * @default undefined
     */
    onChange?(v: any): void;
}
interface State {
    [key: string]: any;
}
export default class Digital extends React.Component<Props, State> {
    static defaultProps: Props;
    state: State;
    _timer: any;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    _getStateData(p: Props): any;
    _sub(): void;
    _add(): void;
    _change(e: any): void;
    _blur(e: any): void;
    antiShake(): void;
    render(): React.ReactNode;
}
export {};
