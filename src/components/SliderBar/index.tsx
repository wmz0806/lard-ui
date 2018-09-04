import * as React from 'react';
import cn from 'classnames';

import styles from './style.less';
import config from '../../config';

// css 前缀
const pre = config.pre;
const cx = cn.bind(styles);

/* interface of props && state */

// button array
interface BtnOption {
  content: string | React.ReactNode
  color?: string
  backColor?: string
  // 默认有父元素10%的宽度
  width?: string
  cb?: object
}

interface Props {
  className?: string;
  /**
   * 左侧按钮数据
   * @default []
   */
  leftBtn?: BtnOption[];
  /**
   * 右侧按钮数据
   * @default []
   */
  rightBtn?: BtnOption[];

  ['btnOption.content']: React.ReactNode | string
  /**
   * 默认字体黑色
   */
    ['btnOption.color']?: string
  /**
   * 默认背景色白色
   */
    ['btnOption.backColor']?: string
  /**
   * 按钮宽度 默认父元素 10%
   */
    ['btnOption.width']?: string
  ['btnOption.cb']?: object
  /**
   * 判断用户到底是要上下滑动还是左右滑动的距离, 只有在到达这个距离之后, 组件才会被激活(或者禁用) 单位 px
   */
  activePixel?: number;
  /**
   * 用户往回滑动手指的时候, 多少像素就会让按钮自动reset?
   */
  autoResetPixel?: number;
  /**
   * 用户滑动到某一个位置的时候 (0 - 1 之间), 按钮会自动完成
   */
  autoFinishPercent?: number,
  /**
   * 点击该组件时, 按钮是否自动收回
   */
  isClickRest?: boolean,
  /**
   * 子元素
   */
  children: React.ReactNode | string;
}

interface State {
  transition: boolean
  isLeft: boolean
  leftBtnPop: string | React.ReactNode
  rightBtnPop: string | React.ReactNode

  leftBtnPopActive: boolean
  rightBtnPopActive: boolean
}

/* private interface */
interface Move {
  startX: number
  startY: number
  moveY: number
  moveX: number
}

interface Flag {
  checkFlag: boolean
  isHorizontal: boolean
  isHidden: boolean
}

class SliderBar extends React.Component<Props, State> {
  public static defaultProps = {
    className: '',
    leftBtn: [],
    rightBtn: [],
    activePixel: 10,
    autoResetPixel: 20,
    children: '',
    autoFinishPercent: 0.3,
    isClickRest: true
  };

  public state: State = {
    transition: false,
    isLeft: false,

    // 若有弹层, 左侧和右侧弹层的内容和状态
    leftBtnPop: '',
    rightBtnPop: '',
    rightBtnPopActive: false,
    leftBtnPopActive: false,
  };


  private _flag: Flag;
  private _move: Move;

  // 禁用?
  private _isDisable: boolean = false;
  // 总宽度,
  private _width: null | number = 0;
  private _leftWidth: number;
  private _rightWidth: number;

  // 是否需要自动完成? 在 大于 0.3 而且 < 1的时候需要
  private _needAutoFinish: -1 | 0 | 1 = 0;

  //  是否是需要重置,  (激活状态保存稍后将要保存的transalte) 激活状态的移动距离
  private _needRest: boolean = false;
  private _willRememberTransform: number = 0;
  private _endTransform: number = 0;

  // timeout flag
  private _timer: any = null;

  // elements
  private _container: HTMLElement | null = null;
  private _leftBtn: HTMLElement | null = null;
  private _rightBtn: HTMLElement | null = null;
  private _leftBtnPop: HTMLElement | null = null;
  private _rightBtnPop: HTMLElement | null = null;

  // 弹出层回调
  private _popBtnCb: any = null;

  // popBtnCb
  private _leftMoveDistance: number[];
  private _rightMoveDistance: number[];

  constructor(props: Props) {
    super(props);
    // 标志位们
    this._flag = {
      checkFlag: false,
      isHorizontal: false,

      isHidden: true, // 隐藏按钮, 渲染问题..
    };

    // 移动距离,
    this._move = {
      startX: 0,
      startY: 0,
      moveY: 0,
      moveX: 0,
    };

    // 左侧|右侧极限距离,
    this._leftWidth = props.leftBtn ? reduceWidth(props.leftBtn) : 0;

    this._rightWidth = props.rightBtn ? -reduceWidth(props.rightBtn) : 0;

    // 子按钮, 在不同的宽度下, translate 的距离不一样, 用数组来表示
    this._leftMoveDistance = calcBtnDistance(props.leftBtn || [], 1);

    this._rightMoveDistance = calcBtnDistance(props.rightBtn || [], -1);
  }

  public componentDidMount(): void {
    this._width = this._container && this._container.offsetWidth;
    // 初始需要隐藏按钮, 滑动的时候再出来
    this._setBtnOpacity('0');
  }

  public componentWillUnmount(): void {
    this._timer && clearTimeout(this._timer);
  }

  public _onTouchStart(e: any): void {
    const touch = e.nativeEvent.changedTouches[0];
    this._move.startX = touch.clientX;
    this._move.startY = touch.clientY;
  }

  public _onTouchMove(e: any): void {
    const activePixel = this.props.activePixel || 10;
    const touch = e.nativeEvent.changedTouches[0];
    this._move.moveX = touch.clientX;
    this._move.moveY = touch.clientY;

    if (this._flag.isHidden) {
      this._flag.isHidden = false;
      this._setBtnOpacity('1');
    }

    if (!this._flag.checkFlag) {
      if (Math.abs(this._move.moveX - this._move.startX) > activePixel) {
        this._flag.checkFlag = true;
        this._flag.isHorizontal = true;
      }
      if (Math.abs(this._move.moveY - this._move.startY) > activePixel) {
        this._flag.checkFlag = true;
        this._flag.isHorizontal = false;
      }
      return;
    }

    if (!this._flag.isHorizontal) {
      return;
    }

    const x = this._move.moveX - this._move.startX;

    let percent = (100 * x) / (this._width || 10);
    if (this._endTransform) {
      percent += this._endTransform;
    }

    // 移动方向的极限距离? 需要设置的btns?
    const changeWidth = percent > 0 ? '_leftWidth' : '_rightWidth';
    const changeBtn = percent > 0 ? 'leftBtn' : 'rightBtn';
    const changeBtnDistance = percent > 0 ? '_leftMoveDistance' : '_rightMoveDistance';

    // 左侧还是右侧? 设置btn的 zIndex
    if (this.state.isLeft !== (percent > 0)) {
      this.setState({isLeft: percent > 0});
    }

    if (Math.abs(percent) > Math.abs(this[changeWidth])) {
      percent = this[changeWidth];
      this._needAutoFinish = 0;
    } else {
      this._needAutoFinish = percent > 0 ? 1 : -1;
    }

    // 如果 大于 总宽度的30% (或者放松为Props) 那么让他处于激活状态, 并自动完成
    if (Math.abs(percent) > (this.props.autoFinishPercent || 0.3) * Math.abs(this[changeWidth])) {
      this._needRest = false;
      this._willRememberTransform = this[changeWidth];
    } else {
      this._needAutoFinish = 0;
      this._needRest = true;
    }

    const distance = this[changeBtnDistance].map(
      item => item * 100 * (percent / Math.abs(this[changeWidth]))
    );

    this._setContainer(percent);
    this._setBtn(changeBtn, distance);
  }

  public _onTouchEnd(e: any): void {
    this._flag.checkFlag = false;
    this._flag.isHorizontal = false;

    // 如果运动距离过小, 判断他是click, 也不触发 autoFinish
    const x = e.nativeEvent.changedTouches[0].clientX;
    const move = this._move.startX - x;
    if (Math.abs(move) < 20) this._needAutoFinish = 0;

    // 如果有运动距离, 而且有_endTransform, 而且判断用户是想要往回收缩按钮, 就收回
    const autoResetPixel = this.props.autoFinishPercent || 20;
    if (Math.abs(move) > autoResetPixel && this._endTransform) {
      if ((move > 0 && this._endTransform > 0) || (move < 0 && this._endTransform < 0)) {
        return this.reset();
      }
    }

    // 在结束的时候如果不是激活状态, 清空. 如果是, 记录移动的距离
    if (!this._needRest) {
      this.autoFinish(this._needAutoFinish);
      this._endTransform = this._willRememberTransform;
    } else {
      this.reset();
    }
  }

  public reset(): void {
    this._needRest = false;
    this._needAutoFinish = 0;
    this._willRememberTransform = 0;
    this._endTransform = 0;

    this.state.rightBtnPopActive = false;
    this.state.leftBtnPopActive = false;

    // 归位, 设置transition
    this._setContainer(0);
    this._setBtn('all', []);
    this.setState({transition: true});

    this._isDisable = true;

    this._timer = setTimeout(() => {
      this.setState({transition: false});
      this._flag.isHidden = true;
      this._setBtnOpacity('0');
      this._isDisable = false;
    }, 150);
  }

  public autoFinish(slide: 0 | 1 | -1): void {
    // 用户已经滑动超出边界 不需要自动完成了
    if (!slide) return;
    // 在用户滑动到大于某一个百分比的时候, 按钮自动完成
    // 自动完成过程中, 整个cell处于disable状态
    this._isDisable = true;

    const btnDistance = slide === 1 ? '_leftMoveDistance' : '_rightMoveDistance'
    this._setContainer(
      slide === 1 ? this._leftWidth : this._rightWidth
    );
    this._setBtn(
      slide === 1 ? 'leftBtn' : 'rightBtn',
      this[btnDistance].map(item => slide * item * 100)
    );
    this.setState({transition: true});

    this._timer = setTimeout(() => {
      this._isDisable = false;
      this.setState({transition: false});
    }, 150);
  }

  // 弹出确认蒙层
  public popButton({content = '', cb = null} = {}): void {
    if (this._endTransform > 0) {
      // left
      this.setState({
        leftBtnPop: content,
        leftBtnPopActive: true,
      })
    } else if (this._endTransform < 0) {
      // right
      this.setState({
        rightBtnPop: content,
        rightBtnPopActive: true,
      })
    }
    this._popBtnCb = cb;
  }

  public _setContainer(percent: number): void {
    if (!this._container) return
    setTransform(this._container, percent);
  }

  public _setBtn(type: string, arr: number[]): void {
    if (!this._leftBtn || !this._rightBtn) return;
    let renderDom: HTMLLIElement[];
    const leftLi = Array.from(this._leftBtn.getElementsByTagName('li'));
    const rightLi = Array.from(this._rightBtn.getElementsByTagName('li'));
    switch (type) {
      case 'leftBtn':
        renderDom = leftLi;
        break;
      case 'rightBtn':
        renderDom = rightLi;
        break;
      default:
        renderDom = [...leftLi, ...rightLi];
    }

    renderDom.forEach((dom, index) => {
      setTransform(dom, arr[index] || 0);
    });
  }

  public _setBtnOpacity(opacity: string): void {
    if (!this._leftBtn || !this._rightBtn || !this._leftBtnPop || !this._rightBtnPop) return;
    this._leftBtn.style.opacity = opacity;
    this._rightBtn.style.opacity = opacity;
    this._leftBtnPop.style.opacity = opacity;
    this._rightBtnPop.style.opacity = opacity;
  }

  public _renderBtn(buttons: any[], className: string, ref: '_leftBtn' | '_rightBtn'): React.ReactNode {

    const zIndex = (ref === '_leftBtn' && this.state.isLeft) || (ref !== '_leftBtn' && !this.state.isLeft) ? 1 : 0;

    return (
      <ul className={cx(pre + className)} ref={r => (this[ref] = r)} style={{zIndex}}>
        {buttons.map((btn, index) => (
          <li
            style={{
              width: btn.width || '10%',
              color: btn.color,
              backgroundColor: btn.backColor,
              transition: this.state.transition ? 'all linear .15s' : '',
              WebkitTransition: this.state.transition ? 'all linear .15s' : '',
            }}
            key={index}
            onClick={() => btn.cb && btn.cb()}
          >
            {btn.content}
          </li>
        ))}
      </ul>
    );
  }

  public render(): React.ReactNode {
    return (
      <div
        onTouchStart={e => !this._isDisable && this._onTouchStart(e)}
        onTouchMove={e => !this._isDisable && this._onTouchMove(e)}
        onTouchEnd={(e) => !this._isDisable && this._onTouchEnd(e)}
        onTouchCancel={(e) => !this._isDisable && this._onTouchEnd(e)}
        className={cx(pre + 'slider-bar-main', this.props.className)}
      >
        <div
          className={cx(pre + 'slider-bar-left-pop')}
          style={{
            width: this._leftWidth + '%',
            left: this.state.leftBtnPopActive ? '0' : '-100%'
          }}
          ref={r => (this._leftBtnPop = r)}
          onClick={() => this._popBtnCb && this._popBtnCb()}
        >
          {this.state.leftBtnPop}
        </div>
        {this._renderBtn(this.props.leftBtn || [], 'slider-bar-left', '_leftBtn')}
        <div
          className={cx(pre + "slider-bar-container")}
          style={{transition: this.state.transition ? 'all linear .2s' : ''}}
          ref={r => (this._container = r)}
          onClick={() => this.props.isClickRest && this.reset()}
        >
          {this.props.children}
        </div>
        {this._renderBtn(this.props.rightBtn || [], 'slider-bar-right', '_rightBtn')}
        <div
          className={cx(pre + 'slider-bar-right-pop')}
          style={{
            width: (-this._rightWidth) + '%',
            right: this.state.rightBtnPopActive ? '0' : '-100%'
          }}
          ref={r => (this._rightBtnPop = r)}
          onClick={() => this._popBtnCb && this._popBtnCb()}
        >
          {this.state.rightBtnPop}
        </div>
      </div>
    );
  }
}

export default SliderBar

// helper
const calcBtnDistance = (buttons: BtnOption[], direction: 1 | -1): number[] => {
  /*
   * 第一个 0,
   * 第二个: 100% * first / second
   * 第三个: 100% * (first + second) / third
   * */
  const result: number[] = [];
  let prevTotal: number = 0;
  buttons.forEach((item, index) => {
    const width: number = parseFloat(item.width || '10');
    result[index] = prevTotal / width;
    prevTotal += width;
  });
  return result
};

const reduceWidth = (arr: any[]): number => {
  return arr.reduce((total, btn) => total + (btn.width ? parseInt(btn.width, 10) : 10), 0);
};

const setTransform = (dom: HTMLElement, percent: number): void => {
  dom.style.transform = `translate(${percent}%)`;
  dom.style.webkitTransform = `translate(${percent}%)`;
};
