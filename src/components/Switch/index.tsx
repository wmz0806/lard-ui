import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import * as styles from './style.less';
import config from '../../config';

const cx = cn.bind(styles);
const pre = config.pre;

interface Props {
  /**
   * true: 开, false: 关, 'loading': 加载中(组件禁用中).
   * @default false
   */
  status?: boolean | 'loading'
  /**
   * 点击事件回调, 如果显示的返回了false, 那么会阻止组件更改他的状态;
   * 如果返回Promise, 那么会首先设置为loading, 然后再resolve 后, 将他置为相反状态, reject后, 置为开始状态
   */
  onClick: (e: any, status: boolean | 'loading') => false | Promise<null>

  className?: string
  style?: object
}

interface State {
  status: boolean | 'loading'
}

class Switch extends Component<Props, State> {
  public static defaultProps = {};

  public state: State = {
    status: this.props.status || false
  };

  constructor(props: Props) {
    super(props)
  }

  public _click(e: any, status: boolean | 'loading'): void {
    if (this.state.status === 'loading') return;
    /* 如果显示的返回了 false , 那么阻止组件自动更改状态 */
    /* 如果返回了Promise, 那么会直接进入等待状态 */
    const {onClick} = this.props;

    const res = onClick(e, status);

    if (res === false) return;

    if (/[Pp]romise/.test(Object.prototype.toString.call(res)) && res.then) {
      const {status} = this.state;
      this.setState({status: 'loading'});
      res
        .then(() => this.setStatus(!status))
        .catch(() => this.setStatus(status));
      return
    }

    this.setStatus(!this.state.status);
  }

  public setStatus(status: boolean | 'loading'): void {
    this.setState({status})
  }

  public render(): React.ReactNode {
    const {status} = this.state;
    const {className, style} = this.props;
    const isLoading = status === 'loading';
    const borderColor = isLoading ? '#7684BD' : (status ? '#3B4FA0' : '#BFBFBF');
    const shadowColor = status ? 'rgba(12, 30, 102, 0.4)' : 'rgba(57, 57, 57, 0.4)';

    return (
      <div
        className={cx(pre + 'switch-container', className)}
        onClick={(e) => this._click(e, status)}
        style={{...style}}
      >
        <div
          className={cx(pre + 'switch-inner', isLoading && (pre + 'switch-loading'))}
          style={{width: status ? '1.06rem' : '.6rem'}}
        >
          <div
            className={cx(pre + 'switch-dot')}
            style={{borderColor, boxShadow: `0 0 .09rem 0 ${shadowColor}`}}
          />
        </div>
      </div>
    )
  }

}

export default Switch;
