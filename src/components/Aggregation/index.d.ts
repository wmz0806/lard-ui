import * as React from 'react';
export interface Props {
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
     * 聚合的按钮集合 [ { children: 元素, onClick: 点击元素触发的方法 } ]
     * @default {}
     */
    menus: any[];
}
interface State {
    [key: string]: any;
}
export default class Aggregation extends React.Component<Props, State> {
    static defaultProps: Props;
    state: State;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    toggleActive(active?: boolean): void;
    render(): React.ReactNode;
}
export {};
