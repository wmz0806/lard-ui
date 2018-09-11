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
     * 显示方向
     * @default top
     */
    direction: 'top' | 'bottom';
    /**
     * X轴的偏移
     * @default 0
     */
    offsetX: number;
    /**
     * Y轴的偏移
     * @default 0
     */
    offsetY: number;
}
interface State {
    [key: string]: any;
}
export default class Toolbar extends React.Component<Props, State> {
    static defaultProps: Props;
    static Item: ({ className, children, style, onClick }: import("../../../../../GOG_APP/L-UI/src/components/Toolbar/Item").Props) => JSX.Element;
    state: State;
    triangle: any;
    box: any;
    constructor(props: Props);
    componentDidMount(): void;
    show(target: any, direction?: string, ox?: number, oy?: number): void;
    hide(): void;
    render(): React.ReactNode;
}
export {};
