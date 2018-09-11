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
     * 初始化显示哪一张图片
     * @default 0
     */
    current?: number;
    /**
     * 自动轮播时间
     * @default 7000
     */
    auto?: number;
    /**
     * 动画时间
     * @default 1000
     */
    animateTime?: number;
    /**
     * 滑动最少多少像素点后响应
     * @default 10
     */
    resThreshold?: number;
    /**
     * 滑动最少多少像素后可触发动画（字符串是百分比）
     * @default “20%”
     */
    threshold?: string | number;
    /**
     * 是否显示分页器
     * @default true
     */
    pagination?: true;
    /**
     * click事件
     * @default undefined
     */
    onClick?(e: Event, swiper: SwiperParam): void | undefined;
    /**
     * onStart 事件
     * @default undefined
     */
    onStart?(e: Event, swiper: SwiperParam): void | undefined;
    /**
     * onMove 事件
     * @default undefined
     */
    onMove?(e: Event, swiper: SwiperParam): void | undefined;
    /**
     * onBeforeEnd 事件（结束动画之前）
     * @default undefined
     */
    onBeforeEnd?(e: Event, swiper: SwiperParam): void | undefined;
    /**
     * onAfterEnd 事件（结束动画之后）
     * @default undefined
     */
    onAfterEnd?(e: Event, swiper: SwiperParam): void | undefined;
}
interface SwiperParam {
    [key: string]: any;
}
declare class Swiper extends React.Component<Props, object> {
    static defaultProps: Props;
    static Item: React.ReactNode;
    state: {
        current: number;
    };
    domSlides: any[];
    warp: HTMLElement | undefined;
    currentDom: HTMLElement | undefined;
    nextDom: HTMLElement | undefined;
    startX: number;
    startY: number;
    moveX: number;
    nextX: number;
    isTouch: boolean;
    isMove: boolean;
    isAnimate: boolean;
    timer: any;
    next: number;
    count: number;
    countArray: any[];
    autoTimer: any;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    launchAutoSlid(): void;
    stopAutoSlid(): void;
    getSlideAngle(dx: number, dy: number): number;
    getSlideDirection(startX: number, startY: number, endX: number, endY: number, openPixel: number): number;
    getSwiperParam(): SwiperParam;
    setTransform(o: HTMLElement | undefined, x: number, y: number, xunit?: string, yunit?: string): void;
    getThreshold(): any;
    getAveAnimateTime(dis: number): number;
    onStart(e: any): void;
    onMove(e: any): void;
    onEnd(e: any): void;
    onCancel(e: any): void;
    release(): void;
    move(index: number, onlyTheBrave?: boolean): void;
    render(): React.ReactNode;
}
export default Swiper;
