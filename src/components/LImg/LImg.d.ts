import * as React from 'react';
export interface Props {
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
     * 默认图
     * @default ""
     */
    def?: string;
    /**
     * lazy 时的 loading
     * @default null
     */
    defLoading?: React.ReactElement<any> | null;
    /**
     * 显示的图
     * @default ""
     */
    src: string;
    /**
     * 是否开启懒加载
     * @default false
     */
    lazy?: boolean;
    /**
     * 是否开启显示才加载
     * @default false
     */
    displayToLazy?: boolean;
    /**
     * 图片显示方式
     * @default cover
     */
    bgSize?: '' | 'cover' | 'contain';
    /**
     * 宽度
     * @default 0
     */
    width: number;
    /**
     * 高度（不传默认为宽度）
     * @default 0
     */
    height?: number;
    /**
     *  单位
     * @default "rem"
     */
    unit?: string;
    /**
     *  图片遮罩
     * @default false
     */
    imgShade?: boolean;
    /**
     *  单击重载图片
     * @default false
     */
    clickReload?: boolean;
}
interface State {
    src: string;
    done: boolean;
    error: boolean;
    width: number;
    height: number | undefined;
    def: string;
    defLoading: React.ReactElement<any> | null;
    launch: boolean;
}
declare class LImg extends React.Component<Props, State> {
    static defaultProps: Props;
    state: State;
    img: JSX.Element | null;
    div: HTMLElement | null;
    constructor(props: Props);
    componentDidMount(): void;
    getSrc(src: string): string;
    createImage(): JSX.Element | null;
    setLaunch(v: boolean): void;
    render(): React.ReactNode;
}
export default LImg;
