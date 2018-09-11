import * as React from 'react';
import { Component } from 'react';
export interface List {
    /**
     * item 标题
     */
    title?: string | React.ReactNode;
    /**
     * item 内容
     */
    content?: string | React.ReactNode;
    /**
     * 该item是否是激活状态? (组件只会默认设置第一个为true的item)
     * @default false
     */
    active?: boolean;
    /**
     * 单个列表的点击回调函数
     */
    onClick?: (e: any, active: boolean) => void;
    className?: string;
    style?: object;
}
interface Props {
    /**
     * 组件需要的参数集合, 参见 List interface
     */
    list: List[];
    /**
     * 是否需要开启默认第一个active? (如果有一个item设置了active: true, 该属性会被忽略)
     * @default false
     */
    noNeedAutoActive?: boolean;
    /**
     * 总的click 回调函数
     */
    onClick?: (e: any, index: number, item: List) => void;
    className?: string;
    style?: object;
}
interface State {
    list: List[];
    opacity: number;
}
declare class Index extends Component<Props, State> {
    static defaultProps: {};
    state: State;
    private _activeIndex;
    private _itemRef;
    private _itemHeight;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillReceiveProps(props: Props): void;
    _clickItem(e: any, index: number, active: boolean): void;
    setActiveItem(index: number): void;
    render(): React.ReactNode;
}
export default Index;
