import * as React from 'react';
import { Component } from 'react';
interface Props {
    /**
     * 是否该窗口是默认关闭的?
     */
    isHidden?: boolean;
    /**
     * 窗口的弹出方向? : 'left' | 'right' | 'bottom' | 'top'
     * @default left
     */
    type?: 'left' | 'right' | 'bottom' | 'top' | string;
    children?: React.ReactNode | string;
    /**
     * 窗体内容
     * (children 属性也是一样)
     */
    content?: React.ReactNode | string;
    /**
     * 动画执行时间 (可以和animateClass配合使用)
     * @default 150
     */
    animateTime?: number;
    /**
     * 自定义动画效果
     */
    animateClass?: string;
    /**
     * 需要背景色么?
     */
    backColor?: string;
    /**
     * 窗口隐藏时回调
     */
    onHide?: () => void;
    /**
     * 点击窗口回调
     */
    onClick?: () => void;
}
interface State extends Props {
    show: boolean;
    isRemoveAnimate: boolean;
}
declare class PopWindow extends Component<Props, State> {
    static defaultProps: {
        isHidden: boolean;
        type: string;
        children: string;
        content: string;
        animateTime: number;
        animateClass: string;
        backColor: string;
        onHide: () => undefined;
    };
    static show: (params: any, wrapperCSS?: string) => void;
    static hide: () => void;
    state: State;
    private div;
    private _timer;
    componentDidMount(): void;
    componentWillUnmount(): void;
    show(): void;
    hide(): void;
    destroy(): void;
    _show(params: Props, div: Element): void;
    _hide(): void;
    _animateIn(): void;
    render(): React.ReactNode;
}
export default PopWindow;
