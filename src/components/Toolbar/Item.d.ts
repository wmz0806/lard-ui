import * as React from 'react';
export interface Props {
    /**
     * 子元素
     * @default null
     */
    children: null | React.ReactNode;
    /**
     * 额外的 class 类名
     * @default ""
     */
    className?: string;
    /**
     * 额外的 style
     * @default {}
     */
    style?: object;
    /**
     * 点击事件
     * @default void
     */
    onClick?(): void;
}
declare const Item: ({ className, children, style, onClick }: Props) => JSX.Element;
export default Item;
