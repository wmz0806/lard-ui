import * as React from 'react';
import * as ReactDOM from 'react-dom';
import cn from 'classnames';
import Toast from './Toast';
import Utils from '../../utils';

import config from '../../config';
import * as styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

const beforeQueue: any[] = []; //队列

interface StateObj {
  toast: ToastObj,
  loading: ToastObj
}

interface ToastObj {
  key?: string,
  type?: string; //toast的类型
  content?: string; // 文字
  time?: number; // 时间
  shade?: boolean; // 是否显示背景层 默认不显示
  shadeType?: string; // 背景层颜色类型 black | white | transparent 默认 transparent
  css?: string; //额外的样式
  tapToClose?: boolean; //是否点击立马关闭toast
  // onClose?: (e:Event) => void;  //关闭回调
  onClose?(): void;  //关闭回调
}

export interface ContainerObj {
  toast(toastProps: ToastObj): void;
  hide(): void;
  hideLoading(): void;
  destroy(): void;
}

type timerType = number | undefined | any;

class Container extends React.Component<object, StateObj> {

  public static independentLoading: boolean = true; // 是否是独立的loading

  public static create = (properties: object = {}):ContainerObj => {
    const {...props} = properties;
    const div = document.createElement('div');
    div.classList.add(cx(`${pre}toast-main-container`));
    document.body.appendChild(div);

    var container:any = ReactDOM.render(<Container {...props} />, div, function (this: Container):any {
      container = this;
      container.releaseQueue(); // 释放队列数据
    });

    return {
      toast(toastProps: ToastObj): void {
        if (container) {
          container.add(toastProps);
        } else {
          beforeQueue.push(toastProps); // 当控件还没有加载好的时候放入暂存队列中进行缓存
        }
      },
      hideLoading(): void {
        if (Container.independentLoading) {
          if (container) {
            container.hideLoading();
          } else {
            beforeQueue.push('hideLoading');
          }
        }
      },
      hide(): void {
        if (container) {
          container.hide();
        } else {
          beforeQueue.push('hide');
        }
      },
      destroy(): void {
        container && container.destroy();
        ReactDOM.unmountComponentAtNode(div);
        document.body.removeChild(div);
      },
    };
  };


  public state: StateObj = {
    toast: {},
    loading: {},
  };

  public child: any | null = null;

  public loadingChild: any | null = null;

  public hideLoadingTimer: timerType = undefined;

  public hideTimer: timerType = undefined;

  public releaseQueue(): void {
    type op = 'hide' | 'hideLoading' | ToastObj;
    beforeQueue.forEach((options: op) => {
      if (typeof (options) === 'string') {
        this[options] && this[options]();
      } else this.add(options);
    });
  }

  public add(toast: ToastObj): void {
    // 添加toast
    toast.key = Utils.createUUID();
    if (Container.independentLoading && toast.type === 'loading') {
      this.setState({loading: toast});
    } else {
      this.setState({toast});
    }
  }

  public closePack(toast: ToastObj): void {
    this.setState({toast: {}});
    toast.onClose && toast.onClose();
  }

  public destroy(): void {
    if (Container.independentLoading) this.setState({toast: {}, loading: {}});
    else this.setState({toast: {}});
  }


  public hideLoading(): void {
    clearTimeout(this.hideLoadingTimer);
    this.hideLoadingTimer = setTimeout(() => {
      if (this.loadingChild) this.loadingChild.close();
    }, 16);

  }


  public hide(): void {
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => {
      if (this.child) this.child.close();
    }, 16);
  }

  public closeLoadingPack(loading: any): void {
    this.setState({loading: {}});
    loading.onClose && loading.onClose();
  }

  public getToastDom(): JSX.Element | any {
    const {toast} = this.state;
    if (toast.type) {
      return (<Toast
        ref={(child) => {
          this.child = child;
        }}
        className={cx(`${pre}toast-child`)}
        {...toast}
        onRealClose={() => this.closePack(toast)}
      />);
    }
  }

  public getShadeDom(): JSX.Element | any {
    const {toast, loading} = this.state;
    if (Container.independentLoading && loading.shade) {
      return <div className={cx(`${pre}toast-shade ${loading.shadeType}`)}/>;
    }
    if (toast.shade) {
      return <div className={cx(`${pre}toast-shade ${toast.shadeType}`)}/>;
    }
  }

  public getLoadingDom(): JSX.Element | any {
    const {loading} = this.state;
    if (Container.independentLoading && loading.type) {
      return (<div className={cx(`${pre}toast-independent-loading`)}>
        <Toast
          ref={(child) => {
            this.loadingChild = child;
          }}
          className={cx(`${pre}loading-child`)}
          {...loading}
          onRealClose={() => this.closeLoadingPack(loading)}
        />
      </div>);
    }
  }

  public render(): React.ReactNode {
    const {toast, loading} = this.state;
    const shadeDom = this.getShadeDom();
    const toastDom = this.getToastDom();
    const loadingDom = this.getLoadingDom();
    return (
      <div className={cx(`${pre}toast-box`, toast.css, loading)}>
        {shadeDom}
        {toastDom}
        {loadingDom}
      </div>
    );
  }
}

export default Container;
