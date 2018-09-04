import * as React from 'react';
import Icon from '../Icon';
import cn from 'classnames';

import config from '../../config';
import styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);
const empty = () => {
  // empty
};

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
   * 自动关闭时间 （ 单位毫秒）
   * @default ""
   */
  time?: number;
  /**
   * toast 类型
   * @default "text"
   */
  type?: string,
  /**
   * 是否点击即关闭
   * @default false
   */
  tapToClose?: boolean,
  /**
   * 显示的内容
   * @default ""
   */
  content?: string,
  /**
   * 关闭后的回调（这个是调用层的回调）
   * @default function
   */
  onClose?: () => void;

  /**
   * 关闭的回调（这个是自身的关闭回调）
   * @default function
   */
  onRealClose: () => void;
}

interface Name {
  [key: string]: string;
}

class Toast extends React.Component<Props, object> {

  public static defaultProps: Props = {
    className: "",
    style: {},
    type: 'text',
    time: 0,
    tapToClose: false,
    content: "",
    onClose: empty,
    onRealClose: empty,
  };

  public state = {
    show: true,
    hide: false,
  };

  public closeTimer: any = null;

  constructor(props: Props) {
    super(props);
  }

  public componentDidMount(): void {
    if (this.props.time && this.props.time > 0) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, this.props.time - 233);
    }
  }

  public componentWillUnmount(): void {
    this.clearCloseTimer();
    if (!this.state.hide && this.props.onClose) this.props.onClose(); // 非正常关闭
  }

  public clearCloseTimer(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  public close(): void {
    if (this.state.hide) return; // 已经是关闭状态
    this.clearCloseTimer();
    this.setState({show: false, hide: true});
    this.closeTimer = setTimeout(() => {
      if (this.props.onRealClose) this.props.onRealClose();
      clearTimeout(this.closeTimer);
    }, 233);
  }

  public getIconName(type: string): string {
    const names:Name = {
      success: 'success',
      warning: 'warning',
      error: 'close',
      busy: 'fanmang',
      wifi: 'wuwangluo',
      loading: 'jiazaizhong',
    };
    return names[type] || type;
  }

  public render():React.ReactNode {
    const {type, tapToClose, content, className} = this.props;
    const {show, hide} = this.state;

    return (
      <div
        className={cx(`${pre}toast-content ${className}${type === 'text' ? ` ${pre}toast-text` : ''}${show ? ' a-enter-done' : hide ? ' a-exit-active' : ''}`)}
        onClick={() => {
          tapToClose && this.close();
        }}
      >
        {type !== 'text' &&
          <div className={cx(`${pre}toast-icon`)}>
            <Icon
              name={this.getIconName(type || '')}
              color={'#fff'}
              size={0.66}
              className={cx(type === 'loading' ? `${pre}rotate` : '')}
            />
          </div>
        }
        <div className={cx(`${pre}toast-name`, 'f-wlc2')}>{content}</div>
      </div>
    );
  }
}

export default Toast;
