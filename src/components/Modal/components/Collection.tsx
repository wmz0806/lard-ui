import * as React from 'react';
import {Component} from 'react';
import * as ReactDOM from 'react-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import cn from 'classnames';

import Modal from './Modal';
import {IModal, IButton} from './interface-modal'
import styles from '../style.less';
import config from '../../../config';

const cx = cn.bind(styles);
const pre = config.pre;

interface Props {
  [key: string]: any
}

interface State {
  modalQueue: IModal[]
  animateTime: number
  transitionTime: number
  animateName: string
}

interface ICollection {
  show: (options: IModal) => void
  close: () => void
  hide: () => void
  clear: () => void
}

export default class Collection extends Component<Props, State> {
  public static defaultProps = {};
  public static create: (props?: any) => void;

  public state: State = {
    modalQueue: [],
    animateTime: 150,
    transitionTime: 20,
    animateName: cx(pre + 'modal-animate'),
  };

  private _modal: any[] = [];
  private _timer: any = null;

  constructor(props: Props) {
    super(props)
  }

  public componentWillUnmount(): void {
    this._timer && clearTimeout(this._timer);
  }

  public _removeModal(index: number): void {
    // 如果是多次弹框, 退出动画. 然后,进行完退出动画后, 删除
    // 如果是最后一个, 把动画时间设置上去
    this._modal[index].setOutAnimate();
    this.setState({transitionTime: this.state.animateTime});

    // index && this._modal[index].setOutAnimate();
    // !index && this.setState({transitionTime: this.state.animateTime});

    this._timer = setTimeout(() => {

      this.setState((prev) => {
        const modalQueue = [...prev.modalQueue];
        modalQueue.splice(index, 1);
        return {modalQueue};
      })

    }, this.state.animateTime);
  }

  public close(): void {
    const {modalQueue} = this.state;
    const index = modalQueue.length - 1;

    // 进行完退出动画后, 删除
    // 如果是最后一个, 把动画时间设置上去
    this._modal[index].setOutAnimate();
    this.setState({transitionTime: this.state.animateTime});

    // index && this._modal[index].setOutAnimate();
    // !index && this.setState({transitionTime: this.state.animateTime});

    this._timer = setTimeout(() => {

      modalQueue.pop();
      this.setState({modalQueue});

    }, this.state.animateTime);
  }

  public show(options: IModal): void{
    /**
     * 1. 增加队列的方式, 增加弹框
     * 2. 在 setState 回调当中, 设置新增的弹框的 animate 动画 (只有在大于1个的时候才设置)
     */
    this.setState(prev => ({
      modalQueue: [...prev.modalQueue, options],
      animateTime: options.animateTime || 150,
      transitionTime: 20,
      animateName: options.animateName || cx(pre + 'modal-animate'),
    }), () => {
      const index = this.state.modalQueue.length - 1;
      this._modal[index].setEnterAnimate()
    });

    // return function that could close this modal
    // return () => this._removeModal(this.state.modalQueue.length)
  }

  public clear(): void{
    this.setState({
      modalQueue: []
    })
  }

  public _renderModal(): React.ReactNode {
    return this.state.modalQueue.map((modal, index) =>
      <Modal
        ref={r => this._modal[index] = r}
        key={index}
        {...modal}
        index={index}
        close={() => this._removeModal(index)}
      />
    )
  }

  public render(): React.ReactNode {
    return (
      <TransitionGroup
        childFactory={child => {
          return React.cloneElement(child)
        }}
      >
        {
          !!this.state.modalQueue.length &&
          <CSSTransition
            classNames={this.state.animateName}
            timeout={{enter: 150, exit: this.state.animateTime}}
          >
            <div className={cx(pre + 'modal-wrapper')}
                 style={{transitionDuration: this.state.transitionTime + 'ms'}}>
              {this._renderModal()}
            </div>
          </CSSTransition>
        }
      </TransitionGroup>
    )
  }
}

// helper
interface IAdd {
  title?: string | React.ReactNode
  content?: string | React.ReactNode
  buttons: IButton[]
  options?: any
}

Collection.create = (props?: any) => {
  const div = document.createElement('div');
  let ref: ICollection | null = null;
  div.classList.add(cx(pre + 'modal-main'));
  document.body.appendChild(div);

  ReactDOM.render(
    <Collection {...props}/>,
    div,
    function (this: any): void { ref = this }
  );

  return {
    show({title = '', content = '', buttons, options = {}}: IAdd): void | null {
      return ref && ref.show({
        title,
        content,
        buttons,
        ...options
      })
    },

    hide(): void {
      ref && ref.close()
    },

    hideAll(): void {
      ref && ref.clear()
    },

    destroy(): void {
      ref && ref.clear();
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
    }
  }
};
