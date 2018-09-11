import * as React from "react";
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
}
declare class Item extends React.Component<Props, object> {
    static defaultProps: Props;
    render(): React.ReactNode;
}
export default Item;
