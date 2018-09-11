import * as React from 'react';
interface BtnOption {
    content: string | React.ReactNode;
    color?: string;
    backColor?: string;
    width?: string;
    cb?: object;
}
interface Props {
    className?: string;
    /**
     * 左侧按钮数据
     * @default []
     */
    leftBtn?: BtnOption[];
    /**
     * 右侧按钮数据
     * @default []
     */
    rightBtn?: BtnOption[];
    ['btnOption.content']: React.ReactNode | string;
    /**
     * 默认字体黑色
     */
    ['btnOption.color']?: string;
    /**
     * 默认背景色白色
     */
    ['btnOption.backColor']?: string;
    /**
     * 按钮宽度 默认父元素 10%
     */
    ['btnOption.width']?: string;
    ['btnOption.cb']?: object;
    /**
     * 判断用户到底是要上下滑动还是左右滑动的距离, 只有在到达这个距离之后, 组件才会被激活(或者禁用) 单位 px
     */
    activePixel?: number;
    /**
     * 用户往回滑动手指的时候, 多少像素就会让按钮自动reset?
     */
    autoResetPixel?: number;
    /**
     * 用户滑动到某一个位置的时候 (0 - 1 之间), 按钮会自动完成
     */
    autoFinishPercent?: number;
    /**
     * 点击该组件时, 按钮是否自动收回
     */
    isClickRest?: boolean;
    /**
     * 子元素
     */
    children: React.ReactNode | string;
}
interface State {
    transition: boolean;
    isLeft: boolean;
    leftBtnPop: string | React.ReactNode;
    rightBtnPop: string | React.ReactNode;
    leftBtnPopActive: boolean;
    rightBtnPopActive: boolean;
}
declare class SliderBar extends React.Component<Props, State> {
    static defaultProps: {
        className: string;
        leftBtn: never[];
        rightBtn: never[];
        activePixel: number;
        autoResetPixel: number;
        children: string;
        autoFinishPercent: number;
        isClickRest: boolean;
    };
    state: State;
    private _flag;
    private _move;
    private _isDisable;
    private _width;
    private _leftWidth;
    private _rightWidth;
    private _needAutoFinish;
    private _needRest;
    private _willRememberTransform;
    private _endTransform;
    private _timer;
    private _container;
    private _leftBtn;
    private _rightBtn;
    private _leftBtnPop;
    private _rightBtnPop;
    private _popBtnCb;
    private _leftMoveDistance;
    private _rightMoveDistance;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    _onTouchStart(e: any): void;
    _onTouchMove(e: any): void;
    _onTouchEnd(e: any): void;
    reset(): void;
    autoFinish(slide: 0 | 1 | -1): void;
    popButton({ content, cb }?: {
        content?: string;
        cb?: null;
    }): void;
    _setContainer(percent: number): void;
    _setBtn(type: string, arr: number[]): void;
    _setBtnOpacity(opacity: string): void;
    _renderBtn(buttons: any[], className: string, ref: '_leftBtn' | '_rightBtn'): React.ReactNode;
    render(): React.ReactNode;
}
export default SliderBar;
