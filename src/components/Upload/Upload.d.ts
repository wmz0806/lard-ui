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
     * 初始化图片的地址
     * @default ""
     */
    src?: string;
    /**
     * 是否自动显示选择图片预览图
     * @default true
     */
    autoShow: boolean;
    /**
     * 是否在预览图生成好自动关闭loading
     * @default true
     */
    autoCloseLoading: boolean;
    /**
     * 支持的文件类型
     * @default ['jpg', 'png', 'jpeg']
     */
    types: string[];
    /**
     * （KB） 支持上传图片的大小
     * @default 1024
     */
    size: number;
    /**
     * 是否压缩图片
     * @default true
     */
    compress: boolean;
    /**
     * 压缩图片最大的宽
     * @default 750
     */
    width: number;
    /**
     * 压缩后输出图片的质量
     * @default 0.8
     */
    quality: number;
    /**
     * 校正图片的exif信息
     * @default true
     */
    isGetEXIF: boolean;
    /**
     * 图片加载完毕后的回调（onComplete 会注入两个参数第一个是最后的结果base64， 第二个是关闭loading）
     * @default undefined
     */
    onComplete(...args: any[]): void;
    /**
     * 图片加载错误的回调
     * @default undefined
     */
    onError?(...args: any[]): void;
}
interface State {
    [key: string]: any;
}
export default class Upload extends React.Component<Props, State> {
    static defaultProps: {
        className: string;
        style: {};
        src: string;
        autoShow: boolean;
        autoCloseLoading: boolean;
        types: string[];
        size: number;
        compress: boolean;
        width: number;
        quality: number;
        isGetEXIF: boolean;
        onComplete: () => void;
        onError: () => void;
    };
    state: State;
    _input: any;
    constructor(props: Props);
    _onChange(e: any): void;
    _closeLoading(): void;
    _filter(files: any[]): void;
    _getPostfix(name: string): string;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
}
export {};
