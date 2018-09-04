import * as React from 'react';
import {Component} from 'react';
import * as ReactDOM from 'react-dom';
import {CSSTransition} from 'react-transition-group';
import cn from 'classnames';

import styles from './style.less';
import config from '../../config';

const cx = cn.bind(styles);
const pre = config.pre;

// props interface
// 该props 可以是通过 show 方法, 传递进来的, 最后体现到state上

interface Props {
  /**
   * 是否该窗口是默认关闭的?
   */
  isHidden?: boolean
  /**
   * 窗口的弹出方向? : 'left' | 'right' | 'bottom' | 'top'
   * @default left
   */
  type?: 'left' | 'right' | 'bottom' | 'top' | string

  children?: React.ReactNode | string
  /**
   * 窗体内容
   * (children 属性也是一样)
   */
  content?: React.ReactNode | string
  /**
   * 动画执行时间 (可以和animateClass配合使用)
   * @default 150
   */
  animateTime?: number
  /**
   * 自定义动画效果
   */
  animateClass?: string
  /**
   * 需要背景色么?
   */
  backColor?: string
  /**
   * 窗口隐藏时回调
   */
  onHide?: () => void
  /**
   * 点击窗口回调
   */
  onClick?: () => void
}

// state interface
interface State extends Props {
  show: boolean
  isRemoveAnimate: boolean
}

const queue: Props[] = [];

const defaultOptions = {
  isHidden: false,
  type: 'left',
  children: '',
  content: '',
  animateTime: 150,
  animateClass: '',
  backColor: 'white',
  onHide: () => void 0,
};

class PopWindow extends Component<Props, State> {
  public static defaultProps = {...defaultOptions};

  public static show: (params: any, wrapperCSS?: string) => void;
  public static hide: () => void;


  public state: State = {
    show: false,
    isRemoveAnimate: true,
    ...defaultOptions
  };

  private div: Element | null = null;

  private _timer: any = null;

  public componentDidMount(): void {
    const props = this.props;
    if (!Object.keys(props)) return;

    this.setState({...props});

    !props.isHidden && this.show();

    /* 如果有队列 */
    if (queue.length) {
      queue.forEach(props => PopWindow.show(props))
    }
  }

  public componentWillUnmount(): void {
    this._timer && clearTimeout(this._timer);
  }

  // 为了 内嵌popWindow 准备
  public show(): void {
    this.setState(() => ({isHidden: false}));
    this._animateIn()
  }

  public hide(): void {
    this._hide()
  }

  public destroy(): void {
    if (!this.div) return;

    ReactDOM.unmountComponentAtNode(this.div);
    document.body.removeChild(this.div);
  }

  // 为了调用方法准备
  public _show(params: Props, div: Element): void {
    this.div = div;
    this.setState(() => ({isRemoveAnimate: true, ...defaultOptions, ...params}));
    this._animateIn()
  }

  public _hide(): void {
    this.state.onHide && this.state.onHide();
    this.setState({show: false, isHidden: true})
  }

  public _animateIn(): void {
    this._timer = setTimeout(() => {
      this.setState({show: true, isRemoveAnimate: false})
    }, 20)
  }

  public render(): React.ReactNode {
    /*
     * 刚开始 show 的时候, 不要使用动画
     * */
    const {type, isRemoveAnimate, animateClass, isHidden, backColor, onClick} = this.state;

    let {animateTime = 150} = this.state;
    if (isRemoveAnimate) animateTime = 0;

    const acPre = pre + 'pw-animate-';
    const enterClass = acPre + 'enter';
    const enterActiveClass = acPre + 'enter-active';
    const enterDoneClass = enterActiveClass + '-done';
    const exitClass = acPre + 'exit';
    const exitActiveClass = acPre + 'exit-active';

    const isBottom = type === 'bottom';

    return (
      <CSSTransition
        in={this.state.show}
        classNames={
          animateClass
            ? animateClass
            : {
              enter: cx(`${enterClass}-${type}`),
              enterActive: cx(enterActiveClass),
              enterDone: cx(enterDoneClass),
              exit: cx(exitClass, `${exitClass}-${type}`),
              exitActive: cx(exitActiveClass, `${exitActiveClass}-${type}`),
              exitDone: cx(pre + 'pw-animate-none'),
            }
        }
        timeout={animateTime}
      >
        <div
          onClick={() => {
            isBottom && this._hide();
            onClick && onClick();
          }}
          style={{
            opacity: this.state.show ? 1 : 0,
            visibility: isHidden ? 'hidden' : 'visible',
            transition: `all ${animateTime}ms ease-in`,
          }}
          className={cx(
            pre + 'pop-window-container',
            pre + `pop-window-container-${type}`,
          )}
        >
          <CSSTransition
            in={isBottom && this.state.show}
            classNames={isBottom ? cx(pre + 'pw-animate-bottom') : ''}
            timeout={animateTime}
          >
            <div
              onClick={(e) => isBottom && e.stopPropagation()}
              className={cx(isBottom && pre + 'pop-window-bottom-inner', pre + 'pop-window-inner')}
              style={{
                backgroundColor: backColor ? backColor : '',
                transitionDuration: `${animateTime}ms`,
              }}
            >
              {this.state.children}
              {this.state.content}
            </div>
          </CSSTransition>

        </div>

      </CSSTransition>
    )
  }
}

// 将window, 挂载到最外层, 防止ios z-index bug 等问题
interface IContainer {
  _show: (props: any, div: Element) => void
  _hide: () => void
}

const getContainer = (props?: Props, wrapperCSS?: string) => {
  let Container: IContainer | null = null;
  const div = document.createElement('div');

  div.classList.add(cx(pre + 'pop-window-main'));
  wrapperCSS && div.classList.add(wrapperCSS);

  document.body.appendChild(div);

  ReactDOM.render(
    <PopWindow {...props} />,
    div,
    function(this: IContainer): void {
      Container = this
    }
  );

  return {
    show: (props: Props): IContainer | null => {
      Container
        ? Container._show(props, div)
        : queue.push(props);
      return Container
    },
    hide: () => {
      Container && Container._hide()
    }
  };
};

PopWindow.show = (props: Props, wrapperCSS?: string) => {
  return getContainer({}, wrapperCSS).show(props)
};

export default PopWindow;
