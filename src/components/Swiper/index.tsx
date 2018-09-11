import * as React from 'react';
import * as ReactDom from 'react-dom';
import cn from 'classnames';

import Item from './Item';
import config from '../../config';
import utils from '../../utils';
import * as styles from './style.less';
import Timeline from '../../timeline.js'

const pre = config.pre;
const cx = cn.bind(styles);
const isMobile = utils.isMobile();

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
   * 初始化显示哪一张图片
   * @default 0
   */
  current?: number;

  /**
   * 自动轮播时间
   * @default 7000
   */
  auto?: number;

  /**
   * 动画时间
   * @default 1000
   */
  animateTime?: number;

  /**
   * 滑动最少多少像素点后响应
   * @default 10
   */
  resThreshold?: number;

  /**
   * 滑动最少多少像素后可触发动画（字符串是百分比）
   * @default “20%”
   */
  threshold?: string | number;

  /**
   * 是否显示分页器
   * @default true
   */
  pagination?: true;

  /**
   * click事件
   * @default undefined
   */
  onClick?(e: Event, swiper: SwiperParam): void | undefined;

  /**
   * onStart 事件
   * @default undefined
   */
  onStart?(e: Event, swiper: SwiperParam): void | undefined;

  /**
   * onMove 事件
   * @default undefined
   */
  onMove?(e: Event, swiper: SwiperParam): void | undefined;

  /**
   * onBeforeEnd 事件（结束动画之前）
   * @default undefined
   */
  onBeforeEnd?(e: Event, swiper: SwiperParam): void | undefined;

  /**
   * onAfterEnd 事件（结束动画之后）
   * @default undefined
   */
  onAfterEnd?(e: Event, swiper: SwiperParam): void | undefined;
}

interface EventMap {
  [key: string]: any
}

interface SwiperParam {
  [key: string]: any
}

class Swiper extends React.Component<Props, object> {

  public static defaultProps: Props = {
    children: null,
    className: "",
    style: {},
    current: 0, // 初始化显示哪一张
    auto: 7000, // 自动轮播时间 为0则不轮播
    animateTime: 1000, // 动画时间
    resThreshold: 10, //至少拖动10像素才进行响应
    threshold: '20%', // 至少拖动 20% 的距离
    pagination: true,
  };

  public static Item: React.ReactNode = Item;

  public state = {
    current: 0
  };

  public domSlides: any[] = [];
  public warp: HTMLElement | undefined = undefined;

  public currentDom: HTMLElement | undefined = undefined;
  public nextDom: HTMLElement | undefined = undefined;

  public startX: number = 0;
  public startY: number = 0;
  public moveX: number = 0;
  public nextX: number = 0;

  public isTouch: boolean = false;
  public isMove: boolean = false;
  public isAnimate: boolean = false;

  public timer: any = null;
  public next: number = 0;

  public count: number = 0;
  public countArray: any[] = [];
  public autoTimer: any = undefined;

  constructor(props: Props) {
    super(props);

    this.state.current = props.current || 0;
    this.count = React.Children.count(props.children);
    for (let i = 0; i < this.count; i++) {
      this.countArray.push(i);
    }
  }

  public componentDidMount(): void {
    this.launchAutoSlid();
  }

  public componentWillUnmount(): void {
    this.autoTimer && clearInterval(this.autoTimer);
    this.timer && this.timer.stop();
  }

  public launchAutoSlid(): void {
    this.stopAutoSlid();
    if (this.props.auto && this.count > 1) {
      this.autoTimer = setInterval(() => {
        this.move(this.state.current + 1, true);
      }, this.props.auto);
    }
  }

  public stopAutoSlid(): void {
    this.autoTimer && clearInterval(this.autoTimer);
    this.autoTimer = undefined;
  }

  // 返回滑动的角度
  public getSlideAngle(dx: number, dy: number): number {
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }

  //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
  public getSlideDirection(startX: number, startY: number, endX: number, endY: number, openPixel: number): number {
    const dy = startY - endY;
    const dx = endX - startX;
    let result = 0;
    //如果滑动距离太短

    if (Math.abs(dx) < openPixel && Math.abs(dy) < openPixel) {
      return result;
    }
    const angle = this.getSlideAngle(dx, dy);


    if (angle >= -45 && angle < 45) {
      result = 4;
    } else if (angle >= 45 && angle < 135) {
      result = 1;
    } else if (angle >= -135 && angle < -45) {
      result = 2;
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
      result = 3;
    }

    return result;
  };

  public getSwiperParam(): SwiperParam {
    return {
      current: this.state.current,
      currentDom: this.currentDom,
      next: this.next,
      nextDom: this.nextDom,
      count: this.count,
      domSlides: this.domSlides
    }
  }

  public setTransform(o: HTMLElement | undefined, x: number, y: number, xunit = 'px', yunit = 'px'): void {
    if (!o) return;
    const transform = `translate3d(${x}${xunit}, ${y}${yunit}, 0)`;
    o.style.transform = transform;
    o.style.webkitTransform = transform;
  }

  public getThreshold(): any {
    if (typeof (this.props.threshold) === 'number') {
      return this.props.threshold;
    } else if (this.warp) {
      return this.warp.clientWidth * (parseFloat(this.props.threshold || '') / 100);
    }
  }

  public getAveAnimateTime(dis: number): number {
    if (this.warp) {
      const a: number = (this.props.animateTime || 1000) / this.warp.clientWidth;
      const b = this.warp.clientWidth - Math.abs(dis);
      return Math.abs(parseInt(`${a * b}`, 10));
    }
    return 0;
  }

  public onStart(e: any): void {
    if (this.isAnimate) return;
    this.stopAutoSlid();
    const event = e.nativeEvent.targetTouches ? e.nativeEvent.targetTouches[0] : e.nativeEvent;
    this.startX = event.pageX;
    this.startY = event.pageY;
    this.isTouch = true;
    this.currentDom = this.domSlides[this.state.current];
    this.props.onStart && this.props.onStart(e, this.getSwiperParam());
  }

  public onMove(e: any): void {
    if (this.isAnimate) return;
    if (!this.isTouch) return;
    this.stopAutoSlid();
    const event = e.nativeEvent.targetTouches ? e.nativeEvent.targetTouches[0] : e.nativeEvent;
    const x = event.pageX;
    const y = event.pageY;
    this.isMove = true;
    const direction = this.getSlideDirection(this.startX, this.startY, x, y, this.props.resThreshold || 0);
    if (direction) {

      this.domSlides.forEach((s) => {
        this.setTransform(s, 0, 110, undefined, '%');
      });

      // 3：向左，4：向右
      let next = null;
      if (direction === 3) {
        e.stopPropagation();
        e.preventDefault();
        const nx = x - this.startX;
        this.setTransform(this.currentDom, nx, 0);
        this.moveX = nx;
        next = this.state.current + 1;
        next >= this.domSlides.length && (next = 0);
        this.next = next;
        this.nextDom = this.domSlides[next];

      } else if (direction === 4) {
        e.stopPropagation();
        e.preventDefault();
        const nx = x - this.startX;
        this.setTransform(this.currentDom, nx, 0);
        this.moveX = nx;
        next = this.state.current - 1;
        next < 0 && (next = this.domSlides.length - 1);
        this.next = next;
        this.nextDom = this.domSlides[next];
      }
      if (!this.nextDom || !this.warp) return;

      this.nextX = this.moveX > 0 ? this.warp.clientWidth * -1 : this.warp.clientWidth;

      this.setTransform(this.nextDom, this.nextX + this.moveX, 0);

      this.props.onMove && this.props.onMove(e, this.getSwiperParam());
    }
  }

  public onEnd(e: any): void {
    if (this.isAnimate) {
      this.launchAutoSlid();
      return;
    }
    if (!this.isMove) {
      this.launchAutoSlid();
      return;
    }
    this.isTouch = false;
    this.isMove = false;
    this.props.onBeforeEnd && this.props.onBeforeEnd(e, this.getSwiperParam());
    const threshold = this.getThreshold();
    const temp = Math.abs(this.moveX);

    if (temp >= threshold) {
      // 切换
      this.isAnimate = true;
      this.timer = new Timeline({
        value: [[this.moveX, this.nextX * -1], [this.nextX + this.moveX, 0]],
        timingFunction: 'easeOut',
        duration: this.getAveAnimateTime(this.moveX),
        render: ([value1, value2]: number[]) => {
          this.setTransform(this.currentDom, value1, 0);
          this.setTransform(this.nextDom, value2, 0);
        },
        onEnd: () => {
          this.setState({current: this.next});
          this.release();
          this.launchAutoSlid();
          this.props.onAfterEnd && this.props.onAfterEnd(e, this.getSwiperParam());
        },
      });
      this.timer.play();
    } else if (temp !== 0) {
      // 还原
      this.isAnimate = true;
      this.timer = new Timeline({
        value: [[this.moveX, 0], [this.nextX + this.moveX, this.nextX]],
        timingFunction: 'easeOut',
        duration: this.getAveAnimateTime(this.moveX),
        render: ([value1, value2]: number[]) => {
          this.setTransform(this.currentDom, value1, 0);
          this.setTransform(this.nextDom, value2, 0);
        },
        onEnd: () => {
          this.release();
          this.launchAutoSlid();
          this.props.onAfterEnd && this.props.onAfterEnd(e, this.getSwiperParam());
        },
      });
      this.timer.play();
    } else {
      this.launchAutoSlid();
      this.props.onAfterEnd && this.props.onAfterEnd(e, this.getSwiperParam());
    }
  }

  public onCancel(e: any): void {
    this.onEnd(e);
  }

  public release(): void {
    this.next = 0;
    this.timer = null;
    this.nextX = 0;
    this.isAnimate = false;
    this.currentDom = undefined;
    this.nextDom = undefined;
    this.startX = 0;
    this.startY = 0;
    this.moveX = 0;
  }

  public move(index: number, onlyTheBrave: boolean = false): void {
    if (index < 0) index = this.count - 1;
    if (index > this.count - 1) index = 0;

    const {current} = this.state;
    if (index === current) return;
    if (this.isAnimate) return;


    this.isAnimate = true;
    this.currentDom = this.domSlides[this.state.current];
    this.nextDom = this.domSlides[index];

    const warpW = this.warp ? this.warp.clientWidth : 0;
    const ix: number = onlyTheBrave ? warpW : index > current ? warpW : warpW * -1;

    this.setTransform(this.currentDom, 0, 0);
    this.setTransform(this.nextDom, ix, 0);

    this.timer = new Timeline({
      value: [[0, ix * -1], [ix, 0]],
      timingFunction: 'easeOut',
      duration: this.getAveAnimateTime(ix),
      render: ([value1, value2]: number[]) => {
        this.setTransform(this.currentDom, value1, 0);
        this.setTransform(this.nextDom, value2, 0);
      },
      onEnd: () => {
        this.setState({current: index});
        this.release();
      },
    });
    this.timer.play();
  }

  public render(): React.ReactNode {

    const {style, className, children} = this.props;
    const {current} = this.state;

    const clineChildren: React.ReactNode = React.Children.map(children, (child: any, i: number) => {
      const transform = `translate3d(0, ${i === current ? 0 : '110%'}, 0)`;
      const pre = {
        transform,
        WebkitTransform: transform,
      };
      return React.cloneElement(child, {
        style: {
          ...child.props.style,
          ...pre
        },
        index: i,
        ref: (el: React.Component<any>) => {
          if (el) {
            const index: number = parseInt(el.props.index, 10);
            this.domSlides[index] = ReactDom.findDOMNode(el);
          }
        }
      });
    });

    const eventMap: EventMap = {};

    // 小于1组的图片不处理
    if (this.count > 1) {
      if (isMobile) {
        eventMap.onTouchStart = (e: any) => {
          this.onStart(e);
        };
        eventMap.onTouchMove = (e: any) => {
          this.onMove(e);
        };
        eventMap.onTouchEnd = (e: any) => {
          this.onEnd(e);
        };
        eventMap.onTouchEnd = (e: any) => {
          this.onCancel(e);
        };
      } else {
        eventMap.onMouseDown = (e: any) => {
          this.onStart(e);
        };
        eventMap.onMouseMove = (e: any) => {
          this.onMove(e);
        };
        eventMap.onMouseUp = (e: any) => {
          this.onEnd(e);
        };
        eventMap.onMouseLeave = (e: any) => {
          this.onCancel(e);
        };
      }
    }

    return (
      <div className={cx(`${pre}banner-container`, className)} style={style}>
        <div
          ref={(el: any) => (this.warp = el)}
          className={cx(`${pre}banner-warp`)}
          {...eventMap}
        >
          {clineChildren}
        </div>
        {
          this.props.pagination ? <div className={cx(`${pre}swiper-pagination`)}>
            {
              this.countArray.map((_, index) => {
                if (index === this.state.current) return <span key={index} className={'active'} />;
                return <span key={index} />
              })
            }
          </div> : null
        }
      </div>
    );
  }

}

export default Swiper;
