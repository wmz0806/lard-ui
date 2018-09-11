import *  as  React from 'react';
import ZScroller from 'zscroller';
import cn from 'classnames';
import config from '../../config';
import * as styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

export interface Props {
  /**
   * 子元素
   * @default null
   */
  children?: null | React.ReactNode;
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
  value: string;
  data: any;
  index: number;
  onValueChange(selectedValue: any, index: number): void;
}

// picker-view 中的列
class PickerColumn extends React.Component<Props, object> {

  public static defaultProps: Props = {
    children: null,
    className: "",
    style: {},
    value: "",
    data: [],
    index: 0,
    onValueChange: () => {
      //empty
    },
  };

  public state = {};

  public indicator: HTMLDivElement | null = null;
  public content: HTMLDivElement | null = null;
  public itemHeight: number = 0;
  public zscroller: any;

  constructor(props: Props) {
    super(props);
  }

  public componentDidMount(): void {
    // getBoundingClientRect js原生方法
    // 根据变量判断dom是否渲染完毕
    if (this.indicator) {
      this.itemHeight = this.indicator.getBoundingClientRect().height;
      if (this.itemHeight !== 0) {
        // 绑定事件
        this.bindScrollEvent();
        // 列表滚到对应位置
        this.scrollToPosition();
        return;
      }
    }

    setTimeout(() => {
      // 绑定事件
      this.bindScrollEvent();
      // 列表滚到对应位置
      this.scrollToPosition();
    }, 16);
  }

  public componentDidUpdate(): void {
    if (!this.zscroller) return;
    this.zscroller.reflow();
    this.scrollToPosition();
  }

  public componentWillUnmount(): void {
    if (!this.zscroller) return;
    this.zscroller.destroy();
  }

  public bindScrollEvent(): void {
    if (!this.indicator) return;
    // 绑定滚动的事件
    const content = this.content;
    // getBoundingClientRect js原生方法
    this.itemHeight = this.indicator.getBoundingClientRect().height;

    // zscroll插件
    // http://yiminghe.me/zscroller/examples/demo.html

    this.zscroller = new ZScroller(content, {
      scrollbars: false,
      scrollingX: false,
      snapping: true, // 滚动结束之后 滑动对应的位置
      animationDuration: 133,
      penetrationDeceleration: 0.1,
      minVelocityToKeepDecelerating: 0.5,
      scrollingComplete: () => {
        // 滚动结束 回调
        this.scrollingComplete();
      },
    });
    // 设置每个格子的高度 这样滚动结束 自动滚到对应格子上
    // 单位必须是px 所以要动态取一下
    this.zscroller.scroller.setSnapSize(0, this.itemHeight);
  }

  public scrollingComplete(): void {

    // 滚动结束 判断当前选中值
    const {top} = this.zscroller.scroller.getValues();
    const {data, value, index, onValueChange} = this.props;

    let currentIndex: number = top / this.itemHeight;

    const floor = Math.floor(currentIndex);

    currentIndex = currentIndex - floor > 0.5 ? floor + 1 : floor;

    let selectedValue;

    if (data[currentIndex]) {
      selectedValue = data[currentIndex].value;
    }

    if (selectedValue && selectedValue !== value) {
      // 值发生变化 通知父组件
      onValueChange(selectedValue, index);
    }
  }

  public scrollToPosition(): void {
    // 滚动到选中的位置
    const {data, value} = this.props;

    for (let i = 0; i < data.length; i++) {
      if (data[i].value === value) {
        this.selectByIndex(i);
        return;
      }
    }

    this.selectByIndex(0);
  }

  public selectByIndex(index: number): void {
    // 滚动到index对应的位置
    const top = this.itemHeight * index;
    this.zscroller.scroller.scrollTo(0, top);
  }

  public getCols(): React.ReactNode {
    // 根据value 和 address 获取到对应的data
    const {data, value, index} = this.props;
    return data.map((item: any, i: number) => (<div
      key={`${index}-${i}`}
      className={cx([`${pre}col`, {selected: data[i].value === value}])}
    >{data[i].label}</div>));
  }

  public render(): React.ReactNode {
    const cols = this.getCols();
    return (
      <div className={cx(`${pre}col-content`)}>
        <div className={cx(`${pre}list`)}>
          <div className={cx(`${pre}window`)}/>
          <div className={cx(`${pre}indicator`)} ref={(e: HTMLDivElement) => (this.indicator = e)}/>
          <div className={cx(`${pre}content`)} ref={(e: HTMLDivElement) => (this.content = e)}>
            {cols}
          </div>
        </div>
      </div>
    );
  }
}


export default PickerColumn;
