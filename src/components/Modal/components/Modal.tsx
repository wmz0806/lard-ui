import * as React from 'react';
import {Component} from 'react';
import {CSSTransition} from 'react-transition-group';
import cn from 'classnames';

import {IModal, IButton} from './interface-modal';

import styles from '../style.less';
import config from '../../../config';

const cx = cn.bind(styles);
const pre = config.pre;

interface Props extends IModal {
  close: () => void
  index: number
}

interface State {
  show: boolean
}

// 单一的 Modal
class Modal extends Component<Props, State> {
  public static defaultProps = {
    className: '',
    title: '',
    titleCN: '',
    content: '',
    contentCN: '',
    buttons: [],
  };

  public state = {
    show: false
  };

  private _timer: any = null;

  public componentWillUnmount(): void {
    this._timer && clearTimeout(this._timer);
  }

  public setEnterAnimate(): void {
    this.setState({show: false});

    this._timer = setTimeout(() => {
      this.setState({show: true})
    }, 20)
  }

  public setOutAnimate(): void {
    this.setState({show: false})
  }

  public clickBtn(btn: IButton): void {
    btn.cb && btn.cb();
    if (btn.autoClose || btn.autoClose === undefined) {
      this.props.close();
    }
  }

  public render(): React.ReactNode {
    return (
      <CSSTransition
        in={this.state.show}
        classNames={cx(pre + 'modal-inner-animate')}
        unmountOnExit
        timeout={{enter: 233, exit: 233}}
      >
        <div className={cx(pre + 'modal-container', this.props.className)}>
          <div className={`${pre}modal-shade`}/>
          <div className={`${pre}modal-box`}>
            <div className={cx(`${pre}modal-content`)}>
              {
                this.props.title &&
                <h4 className={cx(pre + 'modal-header', this.props.titleCN)}>
                  {this.props.title}
                </h4>
              }

              {
                this.props.content &&
                <div className={cx(pre + 'modal-body', this.props.contentCN)}>
                  {this.props.content}
                </div>
              }

              <div className={cx(pre + 'modal-footer')}>
                {!!this.props.buttons.length &&
                this.props.buttons.map((btn, index) => {
                  return (
                    <div
                      key={index}
                      style={{color: btn.color && btn.color, backgroundColor: btn.backColor && btn.backColor}}
                      className={cx(pre + 'modal-footer-btn', btn.className || '')}
                      onClick={() => this.clickBtn(btn)}
                    >
                      {btn.content}
                    </div>
                  )
                })
                }
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    )
  }
}

export default Modal;
