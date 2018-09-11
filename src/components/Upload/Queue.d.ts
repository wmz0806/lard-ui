export interface Props {
    /**
     * 额外的 class 类名 （指定的是 target 的类名）
     * @default ""
     */
    className?: string;
    /**
     * 最多上传多少张图，0表示不限制
     * @default 0
     */
    max: number;
    /**
     * 当前图片数组
     * @default []
     */
    images: any[];
    /**
     * 在图片数组中去图片src的键， 如果为""则去当前本身
     * @default ""
     */
    srcKey: string;
    /**
     * 删除图片时的触发回调
     * @default void
     */
    delCallback(index: number, item: any): void;
    /**
     * Upload 组件的单独配置
     * @default {}
     */
    uploadProps: any;
}
declare const Queue: (props: Props) => JSX.Element;
export default Queue;
