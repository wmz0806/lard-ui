import * as React from 'react';
import {Component} from 'react';
import * as ReactDom from 'react-dom';
import cn from 'classnames';

import Icon from '../Icon';

import {Props, State, Item, IDrawerMenu} from './interface/Interface';

import * as styles from './style.less';
import config from '../../config';

const cx = cn.bind(styles);
const pre = config.pre;

const defaultState: State = {
  isShow: false,
  isAutoHidden: true,
  headerConfig: undefined,
  lists: [],
  onHide: undefined,
  onClick: undefined,
};

class DrawerMenu extends Component<Props, State> {
  public static defaultProps = {};

  public state: State = defaultState;

  constructor(props: Props) {
    super(props);
  }

  public _show(props: Props, initShow?: boolean): void {
    /* 需要检验是不是第一次加载 */
    const isShow = typeof initShow === 'undefined' ? true : initShow;

    this.setState({...defaultState, ...props, isShow});
  }

  public _hide(): void {
    const { onHide } = this.state;
    this.setState({isShow: false});

    onHide && onHide();
  }

  public _clickItem(e: any, index: number, subIndex: number, item: Item): void {
    const itemClick = item.onClick;
    const { isAutoHidden, onClick, lists } = this.state;

    lists && lists.forEach(list => {
      list && list.forEach(item => item.active = false);
    });

    if (lists) lists[index][subIndex].active = true;

    onClick && onClick(e, index, subIndex, item);
    itemClick && itemClick(e, index, subIndex, item);

    this.setState({lists});

    isAutoHidden && this._hide()
  }

  public _renderHeader(): React.ReactNode | void {
    const {headerConfig} = this.state;
    if (!headerConfig) return;

    const {image, icon, detail, className, style, isNoAvatar} = headerConfig;

    return (
      <div
        className={cx(pre + 'drawer-menu-header', className)}
        style={{...style}}
      >
        <div className={cx(pre + 'drawer-menu-header-gradient')}>
          {
            !isNoAvatar &&
            <div
              className={cx(pre + 'drawer-menu-avatar')}
              style={{backgroundImage: image ? `url(${image})` : ''}}
            >

              {!image &&
              <Icon name={icon ? icon : 'maika'} size={.9} color={'#3B4FA0'}/>}

            </div>
          }
          <div
            className={cx(pre + 'drawer-menu-header-details')}
            style={{left: isNoAvatar ? '0' : ''}}
          >
            {detail}
          </div>
        </div>
      </div>
    )
  }

  public _renderBody(): React.ReactNode {
    const {headerConfig, lists} = this.state;
    const hasHeader = !!headerConfig;

    return (
      <div
        className={cx(
          pre + 'drawer-menu-body',
          pre + (hasHeader ? 'drawer-menu-body-white' : 'drawer-menu-body-blue')
        )}
        style={{top: headerConfig ? '3.4rem' : '0'}}
      >
        {
          lists && lists.map((list, index) => (
            <ul
              key={index}
              className={cx(pre + 'drawer-menu-list')}
              style={{
                borderBottomColor: hasHeader ? '#E5E5E5' : '#334489'
              }}
            >
              {list.map((item, subIndex) => {
                const {icon, image, content, className, style, active} = item;

                return (
                  <li
                    key={subIndex}
                    className={cx(pre + 'drawer-menu-item', active && (pre + 'drawer-menu-item-active'), className)}
                    style={{...style}}
                    onClick={(e: any) => this._clickItem(e, index, subIndex, item)}
                  >
                    <div className={cx(pre + 'drawer-menu-item-icon')}>
                      {icon && <Icon name={icon} size={.44} color={hasHeader ? '#3B4FA0' : 'white'}/>}
                      {image && <img src={image}/>}
                    </div>
                    <div className={cx(pre + 'drawer-menu-item-content')}>
                      {content}
                    </div>
                  </li>
                )
              })}
            </ul>
          ))
        }
      </div>
    )
  }


  public render(): React.ReactNode {
    const {headerConfig, isShow} = this.state;

    return (
      <div
        className={cx(
          pre + 'drawer-menu-container',
          pre + (isShow ? 'drawer-menu-opacity-show' : 'drawer-menu-opacity-hide')
        )}
        onClick={() => this._hide()}
      >
        <div
          className={cx(
            pre + 'drawer-menu-main',
            pre + (isShow ? 'drawer-menu-slide-show' : 'drawer-menu-slide-hide')
          )}
          onClick={e => e.stopPropagation()}
        >
          {headerConfig && this._renderHeader()}
          {this._renderBody()}
        </div>
      </div>
    )
  }

}

/* 标签化使用 */
let container: null | IDrawerMenu = null;
let div: Element | null = null;

const getContainer = (props?: Props): IDrawerMenu | null => {
  if (!container) {
    div = document.createElement('div');
    div.className = pre + 'drawer-menu-wrapper';
    document.body.appendChild(div);

    ReactDom.render(
      <DrawerMenu {...props}/>,
      div,
      function (this: IDrawerMenu): void {
        container = this;
      }
    )
  }

  return container
};

class Container extends Component<Props, object> {
  public static defaultProps = {
    isAutoHidden: true,
    isShow: false
  };

  public static show = (props: Props): void => {
    container && container._show(props);
  };

  public static hide = (): void => {
    container && container._hide()
  };

  public componentDidMount(): void {
    this.show(!!this.props.isShow)
  }

  public show(initShow?: boolean): void {
    getContainer();

    container && container._show(this.props, initShow)
  }

  public hide(): void {
    container && container._hide()
  }

  public render(): React.ReactNode {
    return (
      <div style={{display: 'none'}}/>
    )
  }
}

export default Container;

