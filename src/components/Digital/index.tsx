import * as React from 'react';
import cn from 'classnames';
import Icon from '../Icon';
import config from '../../config';
import styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

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
   * 禁用组件
   * @default false
   */
  disabled?: boolean;
  /**
   * 最小的数字
   * @default 0
   */
  min?: number;

  /**
   * 最打的数字
   * @default 无穷大
   */
  max?: number;

  /**
   * 初始数字
   * @default 0
   */
  value?: number;

  /**
   * 数字发生改变时触发的事件
   * @default undefined
   */
  onChange?(v: any): void;
}

interface State {
  [key: string]: any
}

export default class Digital extends React.Component<Props, State> {

  public static defaultProps: Props = {
    className: "",
    style: {},
    disabled: false,
    min: 0,
    max: Number.MAX_VALUE,
    value: 0,
  };

  public state: State = {
    disabled: false,
    disabledLeft: false,
    disabledRight: false,
    value: 0,
  };

  public _timer: any;

  constructor(props: Props) {
    super(props);

    const {min = 0, max = Number.MAX_VALUE} = props;
    let {value, disabledLeft, disabledRight} = this.state;

    if (value <= min) {
      value = min;
      disabledLeft = true;
    } else if (value >= max) {
      value = max;
      disabledRight = true;
    }

    this.state = {
      min,
      max,
      disabled: props.disabled,
      value,
      disabledLeft,
      disabledRight,
    }
  }


  public componentDidMount(): void {
    // empty
  }

  public _sub(): void {
    if (this.state.disabled || this.state.disabledLeft) return;
    let {value} = this.state;
    const {min = 0, max = Number.MAX_VALUE} = this.props;
    value -= 1;
    this.setState({value, disabledLeft: value <= min, disabledRight: value >= max});
    this.antiShake();
  }

  public _add(): void {
    if (this.state.disabled || this.state.disabledRight) return;
    let {value} = this.state;
    const {min, max} = this.state;
    value += 1;
    this.setState({value, disabledLeft: value <= min, disabledRight: value >= max});
    this.antiShake();
  }

  public _change(e: any): void {
    if (this.state.disabled) return;
    const v = e.target.value;
    let value: any = '';
    let bv: any = 0;
    if (v === '-') {
      value = '-';
      bv = 0;
    } else {
      value = parseInt(v, 10) || '';
      bv = value;
    }
    const {min, max} = this.state;
    this.setState({value, disabledLeft: bv <= min, disabledRight: bv >= max});
    this.antiShake();
  }

  public _blur(e: any): void {
    if (this.state.disabled) return;
    let value = parseInt(e.target.value, 10) || 0;
    let {disabledLeft, disabledRight} = this.state;
    const {min, max} = this.state;
    if (value <= min) {
      value = min;
      disabledLeft = true;
    } else if (value >= max) {
      value = max;
      disabledRight = true;
    }
    this.setState({value, disabledLeft, disabledRight});
    this.antiShake();
  }

  public antiShake(): void {
    const {onChange} = this.props;
    if (onChange) {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        onChange(this.state.value || 0);
      }, 333);
    }
  }

  public render(): React.ReactNode {

    const {className, style} = this.props;
    const {disabled, disabledLeft, disabledRight, value} = this.state;

    return (
      <div className={cx(`${pre}digital-box`, 'f-cb', className)}
           style={style}
      >
        <button className={cx(`${pre}digital-left`, 'f-fl', {disabled: disabled || disabledLeft})}
                onClick={() => this._sub()}>
          <Icon name={'jian'} size={0} color={''}/>
        </button>
        <input type="tel" className={cx(`${pre}digital-input`, 'f-fl')} disabled={disabled} value={value}
               onChange={(e) => this._change(e)} onBlur={(e) => this._blur(e)}/>
        <button className={cx(`${pre}digital-right`, 'f-fl', {disabled: disabled || disabledRight})}
                onClick={() => this._add()}>
          <Icon name={'jia'} size={0} color={''}/>
        </button>
      </div>
    );
  }

}
