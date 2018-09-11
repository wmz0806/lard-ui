import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import PopWindow from '../PopWindow';

import * as styles from './style.less';
import config from '../../config';

const cx = cn.bind(styles);
const pre = config.pre;

interface IList {
  content: React.ReactNode | string
  color?: string
  disabled?: boolean
  isCancel?: boolean
  isDelete?: boolean
  onClick?: (e: any) => void
}

interface Props {
  /*
  * 唤出弹窗的数据集合
  * @default []
  * */
  list: IList[]
  /*
  * 窗口隐藏回调
  * @default empty
  * */
  onHide?: () => void
}

interface State {
  active: boolean
}

let popWindowRef: any = null;

class ActionSheet extends Component<Props, State> {
  public static defaultProps = {};

  public state: State = {
    active: false,
  };

  constructor(props: Props) {
    super(props)
  }

  public _renderContent(): React.ReactNode {
    let cancel: IList = {
      content: '取消',
      color: '#3B4FA0',
    };

    const content = this.props.list.filter((item) => {
      if (item.isCancel) cancel = item;
      return !item.isCancel
    });

    return (
      <div>
        <ul className={cx(pre + 'a-s-main')}>
          {content.map((
            {color, content, disabled, isDelete, onClick}, index) => (
            <li
              key={index}
              className={cx(
                pre + 'a-s-item',
                isDelete ? pre + 'a-s-delete' : '',
                disabled ? pre + 'a-s-disabled' : '',
              )}
              style={{color: color ? color : ''}}
              onClick={(e) => {
                !disabled && onClick && onClick(e);
                !disabled && popWindowRef &&  popWindowRef.hide();
              }}
            >
              {content}
            </li>
          ))}
        </ul>

        <div
          className={cx(pre + 'a-s-cancel')}
          onClick={(e) => {
            cancel.onClick && cancel.onClick(e);
            popWindowRef && popWindowRef.hide()
          }}
        >
          {cancel.content}
        </div>
      </div>
    )
  }

  public render(): React.ReactNode {
    return (
      <div className={cx(pre + 'action-sheet-container')}>
        {this._renderContent()}
      </div>
    )
  }
}

// 导出方法..

export default {
  show: (props: Props): void => {
    if (popWindowRef) {
      popWindowRef._show({
        content: <ActionSheet list={props.list}/>,
        backColor: 'transparent',
        type: 'bottom',
        onHide: props.onHide,
        animateTime: 250, // 动画时间
      })
    } else {
      popWindowRef = PopWindow.show({
        content: <ActionSheet list={props.list}/>,
        backColor: 'transparent',
        type: 'bottom',
        onHide: props.onHide,
        animateTime: 250, // 动画时间
      }, pre + 'action-sheet-wrapper')
    }

  },
  hide: (): void => {
    popWindowRef.hide()
  }
};
