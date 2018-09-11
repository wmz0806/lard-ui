import * as React from 'react';
export interface Props {
    /**
     * 子元素
     * @default null
     */
    children: null | React.ReactNode;
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
     * button 类型
     * @default "button"
     */
    target?: 'button' | 'a' | 'div';
    /**
     * 是否禁用（灰色按钮）
     * @default false
     */
    disabled?: boolean;
    /**
     * 是否禁用（变淡按钮）
     * @default false
     */
    disabledOpacity?: boolean;
    /**
     * 点击loading的文字，如果设置则点击变成 loading 状态
     * @default ""
     */
    loading?: string;
    /**
     * 判断有点击事件时自动触发禁用事件（前提是click事件返回一个 Promise 对象）
     * @default true
     */
    autoDisabled?: boolean;
    /**
     * target 的原生属性 比如 target = 'a' 时 可以指定 href 属性
     * @default false
     */
    attribute?: object;
    /**
     * click事件
     * @default undefined
     */
    onClick?(e: Event): void | undefined;
}
declare class Button extends React.Component<Props, object> {
    static defaultProps: Props;
    state: {
        disabled: boolean | undefined;
        disabledOpacity: boolean | undefined;
        loadingChildren: null;
    };
    constructor(props: Props);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    renderButton(): any;
    getButtonChildren(): React.ReactNode;
    enabled(): void;
    render(): React.ReactNode;
}
export default Button;
