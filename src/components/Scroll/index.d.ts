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
     * 是否启用脚本控制滚动
     * @default true
     */
    script?: boolean;
    /**
     * 启用X轴滚动
     * @default false
     */
    scrollingX?: boolean;
    /**
     * 启用Y轴滚动
     * @default true
     */
    scrollingY?: boolean;
    /**
     *  支持减速，回弹，缩放，滚动的动画（动画总开关）
     * @default true
     */
    animating?: boolean;
    /**
     * 由 scroll / zoom 触发的动画的持续时间
     * @default 250
     */
    animationDuration?: number;
    /**
     * 回弹的开关
     * @default true
     */
    bouncing?: boolean;
    /**
     *  滚动中锁定滚动方向
     * @default true
     */
    locking?: boolean;
    /**
     *  启用分页模式（对齐整页宽度/高度）
     * @default false
     */
    paging?: boolean;
    /**
     *  允许对已配置的网格进行捕捉
     * @default false
     */
    snapping?: boolean;
    /**
     *  支持页面的放大
     * @default false
     */
    zooming?: boolean;
    /**
     *  最小缩放
     * @default 0.5
     */
    minZoom?: number;
    /**
     *  最大缩放
     * @default 3
     */
    maxZoom?: number;
    /**
     *  增加或减少滚动速度
     * @default 1
     */
    speedMultiplier?: number;
    /**
     *  达到边间的摩擦力
     *  @default 0.03
     */
    penetrationDeceleration?: number;
    /**
     *  达到边间的加速度
     *  @default 0.08
     */
    penetrationAcceleration?: number;
    /**
     * 滚动回调
     *  @default
     */
    onScroll?(): void;
    /**
     * 滚动完成的回调
     *  @default
     */
    scrollingComplete?(): void;
}
declare class Scroll extends React.Component<Props, object> {
    static defaultProps: Props;
    state: {};
    view: HTMLElement | null;
    scroll: HTMLElement | null;
    zscroller: any;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
}
export default Scroll;
