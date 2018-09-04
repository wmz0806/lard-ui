import * as React from 'react';
import ZScroller from 'zscroller';
import cn from 'classnames';
import config from '../../config';
import styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

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

  /**
   * 是否启用脚本控制滚动
   * @default true
   */
  script?: boolean;
  /**
   * 启用X轴滚动
   * @default false
   */
  scrollingX?: boolean;

  /**
   * 启用Y轴滚动
   * @default true
   */
  scrollingY?: boolean;

  /**
   *  支持减速，回弹，缩放，滚动的动画（动画总开关）
   * @default true
   */
  animating?: boolean;

  /**
   * 由 scroll / zoom 触发的动画的持续时间
   * @default 250
   */
  animationDuration?: number;

  /**
   * 回弹的开关
   * @default true
   */
  bouncing?: boolean;

  /**
   *  滚动中锁定滚动方向
   * @default true
   */
  locking?: boolean;

  /**
   *  启用分页模式（对齐整页宽度/高度）
   * @default false
   */
  paging?: boolean;

  /**
   *  允许对已配置的网格进行捕捉
   * @default false
   */
  snapping?: boolean;

  /**
   *  支持页面的放大
   * @default false
   */
  zooming?: boolean;

  /**
   *  最小缩放
   * @default 0.5
   */
  minZoom?: number;

  /**
   *  最大缩放
   * @default 3
   */
  maxZoom?: number;

  /**
   *  增加或减少滚动速度
   * @default 1
   */
  speedMultiplier?: number,

  /**
   *  达到边间的摩擦力
   *  @default 0.03
   */
  penetrationDeceleration?: number;

  /**
   *  达到边间的加速度
   *  @default 0.08
   */
  penetrationAcceleration?: number;

  /**
   * 滚动回调
   *  @default
   */
  onScroll?(): void;

  /**
   * 滚动完成的回调
   *  @default
   */
  scrollingComplete?(): void;
}

class Scroll extends React.Component<Props, object> {

  public static defaultProps: Props = {
    children: null,
    className: "",
    style: {},
    script: true,
    scrollingX: false,
    scrollingY: true,
    animating: true,
    animationDuration: 250,
    bouncing: true,
    locking: true,
    paging: false,
    snapping: false,
    zooming: false,
    minZoom: 0.5,
    maxZoom: 3,
    speedMultiplier: 1,
    penetrationDeceleration: 0.03,
    penetrationAcceleration: 0.08,
    onScroll: () => {
      //empty
    },
    scrollingComplete: () => {
      //empty
    }
  };

  public state = {};

  public view: HTMLElement | null = null;
  public scroll: HTMLElement | null = null;
  public zscroller: any = null;

  constructor(props: Props) {
    super(props);
  }

  public componentDidMount(): void {
    const {
      scrollingX,
      scrollingY,
      animating,
      animationDuration,
      bouncing,
      locking,
      paging,
      snapping,
      zooming,
      minZoom,
      maxZoom,
      speedMultiplier,
      penetrationDeceleration,
      penetrationAcceleration,
      onScroll,
      scrollingComplete,
      script,
    } = this.props;

    if (script) {
      if (this.view) {
        this.view.addEventListener('touchmove', (e) => {
          e.preventDefault();
        }, false);
      }
      //console.log(this.zscroller.scroller.getValues());
      // this.zscroller.reflow() //  更新
      this.zscroller = new ZScroller(this.scroll, {
        scrollingX,
        scrollingY,
        animating,
        animationDuration,
        bouncing,
        locking,
        paging,
        snapping,
        zooming,
        minZoom,
        maxZoom,
        speedMultiplier,
        penetrationDeceleration,
        penetrationAcceleration,
        scrollingComplete,
        onScroll,
      });
    }
  }

  public componentWillUnmount(): void {
    if(this.zscroller){
      this.zscroller.destroy();
    }
  }

  public render(): React.ReactNode {
    const {className, style} = this.props;

    return (
      <div
        ref={el => (this.view = el)}
        className={cx(`${pre}scroll-view`, className)}
        style={style}
      >
        <div
          className={cx(`${pre}scroll-content`)}
          ref={el => (this.scroll = el)}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}


export default Scroll;
