export interface Props {
    /**
     * 额外的 class 类名 （指定的是 target 的类名）
     * @default ""
     */
    className?: string;
    /**
     * 大小
     * @default 1.14
     */
    size: number;
    /**
     * 单位
     * @default "rem"
     */
    unit?: string;
    /**
     * 是否显示动画
     * @default true
     */
    animate?: boolean;
    /**
     * FontLoading专属 图标颜色
     * @default #3B4EA0
     */
    color?: string;
    /**
     * FontLoading专属 边框颜色
     * @default #3B4EA0
     */
    borderColor?: string;
}
export declare const FontLoading: (props: Props) => JSX.Element;
declare const Loading: (props: Props) => JSX.Element;
export default Loading;
