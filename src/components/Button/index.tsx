import * as React from 'react';
import cn from 'classnames';
import Icon from '../Icon';
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
   * button 类型
   * @default "button"
   */
  target?: 'button' | 'a' | 'div';
  /**
   * 是否禁用（灰色按钮）
   * @default false
   */
  disabled?: boolean;

  /**
   * 是否禁用（变淡按钮）
   * @default false
   */
  disabledOpacity?: boolean;

  /**
   * 点击loading的文字，如果设置则点击变成 loading 状态
   * @default ""
   */
  loading?: string;

  /**
   * 判断有点击事件时自动触发禁用事件（前提是click事件返回一个 Promise 对象）
   * @default true
   */
  autoDisabled?: boolean;

  /**
   * target 的原生属性 比如 target = 'a' 时 可以指定 href 属性
   * @default false
   */
  attribute?: object;

  /**
   * click事件
   * @default undefined
   */
  onClick?(e: Event): void | undefined;
}

interface paramObj {
  [key: string]: any
}

class Button extends React.Component<Props, object> {

  public static defaultProps: Props = {
    children: null,
    className: "",
    style: {},
    target: 'button',
    disabled: false,
    disabledOpacity: false,
    loading: "",
    autoDisabled: true,
    attribute: {},
    onClick: undefined,
  };

  public state = {
    disabled: this.props.disabled,
    disabledOpacity: this.props.disabledOpacity,
    loadingChildren: null
  };

  constructor(props: Props) {
    super(props);
  }

  public componentDidMount(): void {
    // empty
  }

  public componentWillReceiveProps(nextProps: Props): void {
    const opt: any = {};
    if (nextProps.disabled !== this.state.disabled) {
      opt.disabled = nextProps.disabled;
    }

    if (nextProps.disabledOpacity !== this.state.disabledOpacity) {
      opt.disabledOpacity = nextProps.disabledOpacity;
    }
    if (Object.keys(opt).length) this.setState(opt);
  }

  public renderButton(): any {
    const {target, className, attribute, style, onClick} = this.props;

    const params: paramObj = {
      ...attribute,
      className: cx(`${pre}button`, className, {
        disabled: this.state.disabled,
        disabledOpacity: this.state.disabledOpacity
      }),
      style,
      onClick: (e: Event): void => {
        if (this.state.disabled || this.state.disabledOpacity) return;
        if (this.props.autoDisabled && onClick) {
          const p: any = onClick(e);

          if (p && typeof(p) === 'object' && p.then) {
            //包含then方法
            if (!this.props.loading) this.setState({disabled: true});
            p.then(() => {
              this.enabled();
            }).catch(() => {
              this.enabled();
            });
          }
        } else onClick && onClick(e);

        if (this.props.loading) {
          this.setState({
            disabledOpacity: true,
            loadingChildren: <div className={cx(`${pre}loading-view`)}>
              <Icon name={'jiazai'} className={'rotateLoop'} size={0} color={''}/><span>{this.props.loading}</span>
            </div>
          })
        }
      },
    };

    const children = this.getButtonChildren();

    if (target === 'button') {
      return (<div {...params} >{children}</div>)
    } else if (target === 'a') {
      return (<a href={'javascript:;'} {...params} >{children}</a>)
    } else {
      return <button {...params} >{children}</button>
    }
  }

  public getButtonChildren(): React.ReactNode {
    if (this.state.loadingChildren) return this.state.loadingChildren;
    const {children} = this.props;
    return children;
  }

  public enabled(): void {
    this.setState({
      disabled: false,
      disabledOpacity: false,
      loadingChildren: null
    })
  }

  public render(): React.ReactNode {
    return this.renderButton();
  }

}

export default Button;
