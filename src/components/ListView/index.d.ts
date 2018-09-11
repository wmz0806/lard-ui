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
     * 数据源 是ListView.DataSource 类型
     * @default object
     */
    dataSource?: any;
    /**
     * 初始化渲染多少条数据
     * @default 20
     */
    initialListSize?: number;
    /**
     * 用于调用 onEndReached 的像素阈值（虚拟，非物理）
     *  @default 100
     */
    onEndReachedThreshold?: number;
    /**
     * 滚动到基于 onEndReachedThreshold 底部后触发
     * @default undefined
     */
    onEndReached?(e?: Event): void;
    /**
     * 每次渲染多少行
     * @default 20
     */
    pageSize?: number;
    /**
     * header 头
     * @default undefined
     */
    renderHeader?(): React.ReactNode;
    /**
     * header 尾巴
     * @default undefined
     */
    renderFooter?(): React.ReactNode;
    /**
     *  根据数据源循环渲染每行数据的回调
     * @default () => { }
     */
    renderRow?(rowData: any, sectionID: number, rowID: number): React.ReactNode;
    /**
     * 返回列表可滚动的组件。默认返回一个 ScrollView
     * @default () => { }
     */
    renderScrollComponent?(props: any): React.ReactNode;
    /**
     * 分组标题
     * @default undefined
     */
    renderSectionHeader?(sectionData: any, sectionID: number): React.ReactNode;
    /**
     * 如果提供了会呈现每一行下面的分隔符
     * @default undefined
     */
    renderSeparator?(sectionData: any, sectionID: number, adjacentRowHighlighted: any): React.ReactNode;
    /**
     * 在屏幕上显示行之前，以像素为单位。
     * @default 1000
     */
    scrollRenderAheadDistance?: number;
    /**
     *  滚动视图的style
     * @default {}
     */
    contentContainerStyle?: object;
    /**
     *  是否是水平排列
     * @default false
     */
    horizontal?: boolean;
    /**
     *  传入一个唯一的ID，传入即表示自动记录当前滚动的位置（推荐使用 location.pathname 或者 location.key）
     * @default undefined
     */
    autoScrollKey?: string;
    /**
     *  当滚动视图的内容视图发生变化时调用
     * @default undefined
     */
    onContentSizeChange?(contentWidth: number, contentHeight: number): void;
    /**
     *  滚动时调用
     * @default undefined
     */
    onScroll?(e: Event): void;
    /**
     *  当 ListView 挂载后调用
     * @default undefined
     */
    onLayout?(e: Event): void;
    /**
     *  渲染 ListView 的 body 组件
     * @default undefined
     */
    renderBodyComponent?(): React.ReactNode;
    /**
     *  渲染 Section 的 wrap 组件
     * @default undefined
     */
    renderSectionWrapper?(sectionID: number): React.ReactNode;
    /**
     *  渲染 Section 的 body 组件
     * @default undefined
     */
    renderSectionBodyWrapper?(sectionID: number): React.ReactNode;
    /**
     *  使用html的body scroll
     * @default false
     */
    useBodyScroll?: boolean;
    /**
     *  渲染 Section 的 body className
     *  @default "lui-list-view-section-body"
     */
    sectionBodyClassName?: string;
    /**
     *  样式前缀
     *  @default "lui"
     */
    listViewPrefixCls?: string;
    /**
     * scroll 的参数
     * @default {bouncing: true, scrollbars: false}
     */
    scrollerOptions?: any;
    /**
     * 自动渲染本地数据到 onEndReachedThreshold
     * @default true
     */
    autoRenderLocal?: boolean;
    /**
     * 自定渲染远程数据到 onEndReachedThreshold
     * @default true
     */
    autoRenderRemote?: boolean;
    /**
     * 开启下拉刷新
     * @default undefined
     */
    refreshControl?: boolean | undefined;
    /**
     * 下拉刷新状态
     * @default false
     */
    refreshing?: boolean;
    /**
     * 下拉刷新回调
     * @default undefined
     */
    onRefresh?(): void;
    /**
     *  下拉刷新 默认状态
     *  @default default
     */
    icon0?: React.ReactNode;
    /**
     *  下拉刷新 释放后刷新
     *  @default default
     */
    icon1?: React.ReactNode;
    /**
     *  下拉刷新 刷新中
     *  @default default
     */
    icon2?: React.ReactNode;
    /**
     *  下拉刷新 刷新完毕
     *  @default default
     */
    icon3?: React.ReactNode;
}
interface State {
    [key: string]: any;
}
export declare const PullLoading: ({ text, animate }: any) => JSX.Element;
declare class ListView extends React.Component<Props, State> {
    static defaultProps: Props;
    static DataSource: any;
    static FooterLoading: any;
    static FooterNoneData: any;
    state: State;
    lv: any;
    lvDom: any;
    innerDom: any;
    autoLocalEnd: boolean;
    domScroller: any;
    scroller: any;
    _setDistanceToRefreshTimer: any;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: any): void;
    componentWillUnmount(): void;
    _setDistanceToRefresh: () => void;
    renderLocal(): void;
    renderRemote(): void;
    checkRenderTheBottom(): boolean;
    _renderCustomIcon(): any[];
    onRefresh(e: any): void;
    scrollTo(x: number, y: number): void;
    render(): React.ReactNode;
}
export default ListView;
