import * as React from 'react';
import {findDOMNode} from 'react-dom';
import cn from 'classnames';
import RMCLV from 'rmc-list-view';
import Zscroller from 'rmc-list-view/lib/Zscroller';
import Loading from '../Loading';
import Icon from '../Icon';
import utils from '../../utils';


import config from '../../config';
import styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

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
  sectionBodyClassName?: string,

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

export const PullLoading = ({text, animate}: any) => (
  <div className={cx(`${pre}lv-pull-loading`)}>
    <div className={cx(`${pre}lv-pull-loading-b1`)}>
      <Loading size={config.PullLoadingSize / config.baseFontSize} animate={animate}/>
    </div>
    <div className={cx(`${pre}lv-pull-loading-b2`)}>{text}</div>
  </div>
);

export const FooterLoading = ({text}: any) => (
  <div className={cx(`${pre}lv-footer-loading`)}>
    <Icon className={'rotateLoop'} name={'jiazaizhong'}/>
    <span>{text}</span>
  </div>
);

export const FooterNoneData = () => (
  <div className={cx(`${pre}lv-footer-none-date`)}>
    <i className={cx('line1')}/>
    <i className={cx('line2')}/>
    <Loading size={0.66} animate={false}/>
  </div>
);

const ds = new RMCLV.DataSource({
  rowHasChanged: (row1: any, row2: any) => row1 !== row2,
});

class ListView extends React.Component<Props, State> {
  public static defaultProps: Props = {
    className: "",
    style: {},
    listViewPrefixCls: pre.substring(0, pre.length - 1),
    initialListSize: 20,
    pageSize: 20,
    sectionBodyClassName: `${pre}list-view-section-body`,
    renderBodyComponent: () => <div className={cx(`${pre}list-view-body`)}/>,
    renderScrollComponent: props => <Zscroller {...props} />,
    scrollerOptions: {bouncing: true, scrollbars: false},
    onEndReachedThreshold: 100,
    autoRenderLocal: true,
    autoRenderRemote: true,
    onRefresh: undefined,
    icon0: <PullLoading text={'下拉即可刷新···'} animate={false}/>,
    icon1: <PullLoading text={'松开即可刷新···'} animate={false}/>,
    icon2: <PullLoading text={'刷新中···'} animate={true}/>,
    icon3: <PullLoading text={'刷新完毕'} animate={false}/>,
  };

  public static DataSource:any  = RMCLV.DataSource;

  public state: State = {
    // refreshState: 0, //下拉刷新状态， 0默认状态， 1 松开即可刷新， 2刷新中， 3 刷新完成
    showFinishTxt: false,
    autoScrollKey: this.props.autoScrollKey,
    dataSource: this.props.dataSource || ds.cloneWithRows([]),
  };

  public lv: any;

  public lvDom: any;

  public innerDom: any;

  public autoLocalEnd: boolean = true;

  public domScroller: any = undefined;

  public scroller: any = undefined;

  public _setDistanceToRefreshTimer: any = undefined;

  constructor(props: Props) {
    super(props);
  }

  public componentDidMount(): void {
    let {autoRenderLocal} = this.props;
    const {autoRenderRemote} = this.props;
    const {autoScrollKey} = this.state;

    if (!this.lv) return;
    if (this.lv.ListViewRef && this.lv.ListViewRef.domScroller) {
      this.domScroller = this.lv.ListViewRef.domScroller;
      if (this.domScroller.scroller) {
        this.scroller = this.domScroller.scroller;
      }
    }


    if (autoScrollKey && window.sessionStorage) {
      let offset = {left: 0, top: 0, zoom: 1};
      try {
        offset = JSON.parse(window.sessionStorage[`_${autoScrollKey}_`] || '{left: 0, top: 0, zoom: 1}');
        window.sessionStorage.removeItem(`_${autoScrollKey}_`); //删除key
      } catch (e) {
        //console.log(e);
      }
      this.lv.scrollTo(offset.left, offset.top);
    }

    this.lvDom = findDOMNode(this.lv);
    this.innerDom = this.lv.getInnerViewNode();

    if (autoRenderRemote) autoRenderLocal = true;

    if (autoRenderLocal) {
      this.autoLocalEnd = false;
      this.renderLocal();
    } else if (autoRenderRemote) {
      this.renderRemote();
    }

    if (this.props.refreshControl) {
      //开启下拉刷新
      //计算下拉刷新图标的大小
      this._setDistanceToRefresh();
      window.addEventListener('resize', this._setDistanceToRefresh, false);
      //计算下拉刷新的距离
      if (this.scroller && this.scroller.__refreshActivate) {
        const oldDeactivate = this.scroller.__refreshDeactivate;
        const oldActivate = this.scroller.__refreshActivate;
        const lvScroller = this.scroller;
        lvScroller.__refreshDeactivate = () => {
          lvScroller.__refreshHeight = parseInt(`${utils.getZoomRate() * config.PullSize}`, 10);
          oldDeactivate();
          setTimeout(() => {
            this.setState({showFinishTxt: false}); // 回到下拉刷新初始状态
          }, this.props.scrollerOptions.animationDuration || 250); // 250 默认动画时间
        };

        lvScroller.__refreshActivate = () => {
          lvScroller.__refreshHeight = parseInt(`${utils.getZoomRate() * config.PullActiveSize}`, 10);
          oldActivate();
        };
      }
    }

  }

  public componentWillReceiveProps(nextProps: any): void {
    if (nextProps.dataSource !== this.props.dataSource) {
      this.setState({
        dataSource: nextProps.dataSource,
      });
    }
  }

  public componentWillUnmount(): void {
    this.setState({dataSource: ds.cloneWithRows([])}); //清空数据
    const {autoScrollKey} = this.state;

    if (autoScrollKey && window.sessionStorage) {
      if (this.scroller) {
        const offset = this.scroller.getValues();
        window.sessionStorage[`_${autoScrollKey}_`] = JSON.stringify(offset);
      }
    }

    clearTimeout(this._setDistanceToRefreshTimer);
    window.removeEventListener('resize', this._setDistanceToRefresh, false);
  }

  public _setDistanceToRefresh = (): void => {
    clearTimeout(this._setDistanceToRefreshTimer);
    this._setDistanceToRefreshTimer = setTimeout(() => {
      const distanceToRefresh = parseInt(`${utils.getZoomRate() * config.PullSize}`, 10);
      if (this.lv) {
        this.lv.ListViewRef.domScroller.scroller.__refreshHeight = distanceToRefresh;
      }
    }, 16);
  };

  public renderLocal(): void {
    if (!this.checkRenderTheBottom()) {
      const metrics = this.lv.getMetrics();
      if (metrics.renderedRows < metrics.totalRows) {
        this.lv.ListViewRef.handleScroll();
      } else {
        // 全部渲染完毕
        this.autoLocalEnd = true;
        this.renderRemote();
      }
    } else {
      // 达到临界点
      this.autoLocalEnd = true;
      this.renderRemote();
    }
  }

  public renderRemote(): void {
    if (this.props.autoRenderRemote && !this.checkRenderTheBottom()) {
      this.lv.ListViewRef.handleScroll();
    }
  }

  public checkRenderTheBottom(): boolean {
    const {onEndReachedThreshold = 100} = this.props;
    return this.innerDom.offsetHeight - this.lvDom.offsetHeight >= onEndReachedThreshold;
  }

  public _renderCustomIcon(): any[] {
    return [
      <div key="i0" className={cx('zscroller-refresh-control-pull')}>
        {this.state.showFinishTxt ? this.props.icon3 : this.props.icon0}
      </div>,
      <div key="i1" className={cx('zscroller-refresh-control-release')}>
        {this.props.icon1}
      </div>,
    ];
  }

  public onRefresh(e: any): void {
    this.setState({
      showFinishTxt: true,
    });
    this.props.onRefresh && this.props.onRefresh();
  }

  public scrollTo(x: number, y: number): void {
    this.lv.scrollTo(x, y);
  }

  public render(): React.ReactNode {
    const {className} = this.props;

    return (<RMCLV
      ref={(el: any) => (this.lv = el)}
      {...this.props}
      className={cx(`${pre}list-view`, className)}
      onScroll={(e: any) => {
        if (!this.autoLocalEnd) this.renderLocal();
        this.props.onScroll && this.props.onScroll(e);
      }}
      icon={this._renderCustomIcon()}
      loading={this.props.icon2}
      distanceToRefresh={0}
      onRefresh={(e: any) => this.onRefresh(e)}
    />);
  }

}


export default ListView;
