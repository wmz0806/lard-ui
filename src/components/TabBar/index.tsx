import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import * as styles from './style.less';
import config from '../../config';

import Icon from '../Icon';

import {Props, State, Config} from './interface/Interface';

const cx = cn.bind(styles);
const pre = config.pre;

class TabBar extends Component<Props, State> {
  public static defaultProps = {
    defaultColor: '#999999',
    activeColor: '#3C4EA0',
  };

  public state: State = {
    list: []
  };

  private _width: string = '100%';

  constructor(props: Props) {
    super(props);

    this._width = `${100 / (props.list.length || 1)}%`;

    const {list, noNeedAutoActive} = props;

    if (!list || !list[0]) return;

    if (!noNeedAutoActive) list[0].active = true;

    this.state.list = props.list;
  }

  public componentWillReceiveProps(props: Props): void {
    if (props.list !== this.state.list) this.setState({list: props.list});
  }

  public setActiveItem(index: number): void {
    const {list} = this.state;

    list.forEach((item, idx) => item.active = index === idx);

    this.setState({list});
  }

  public _clickItem(e: any, index: number, item: Config): void {
    const {onClick} = item;
    const {list} = this.state;

    // 激活状态的时候不做任何事情
    if (list[index].active) return;

    this.setActiveItem(index);

    onClick && onClick(e, index, item);
  }

  public _renderAbove(active?: boolean, icon?: string, defaultImg?: string, activeImg?: string): React.ReactNode {
    const {defaultColor, activeColor} = this.props;

    if (icon) return (
      <Icon
        name={icon}
        color={active ? activeColor : defaultColor}
        size={.50}
      />
    );

    if (activeImg) return (
      <img src={active ? activeImg : defaultImg} />
    );

    return ''
  }

  public _renderNormal(item: Config): React.ReactNode {
    const {active, icon, defaultImg, activeImg, text} = item;
    const {defaultColor, activeColor} = this.props;
    return [
        <div
          className={cx(pre + 'tab-bar-item-above')}
             key={1}
        >
          {this._renderAbove(active, icon, defaultImg, activeImg)}
        </div>,
        <div
          key={2}
          className={cx(pre + 'tab-bar-item-lower')}
          style={{color: active ? activeColor : defaultColor}}
        >
          {text}
        </div>
    ]
  }

  public _renderBig(item: Config): React.ReactNode {
    const {activeColor} = this.props;
    const {icon, activeImg} = item;
    return (
      icon
        ? <Icon name={icon} color={activeColor} size={.75}/>
        : <img src={activeImg}/>
    )
  }

  public render(): React.ReactNode {
    const { className, style } = this.props;
    const {list} = this.state;

    return (
      <ul
        className={cx(pre + 'tab-bar-container', className)}
        style={{...style}}
      >
        {
          list.map((item, index) => {
            const {active, isBigActiveImg, className, style} = item;
            return (
              <li
                className={cx(
                  pre + 'tab-bar-item',
                  active && isBigActiveImg && (pre + 'tab-bar-big'),
                  className
                )}
                style={{
                  width: this._width,
                  ...style
                }}
                key={index}
                onClick={(e) => this._clickItem(e, index, item)}
              >
                {
                  (active && isBigActiveImg)
                    ? this._renderBig(item)
                    : this._renderNormal(item)
                }
              </li>

            )
          })
        }
      </ul>
    )
  }
}

export default TabBar;
