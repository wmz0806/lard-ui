import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import styles from './style.less';
import config from '../../config';

import {Props, State} from './interface/Interface';

const cx = cn.bind(styles);
const pre = config.pre;

class NavBar extends Component<Props, State> {
  public static defaultProps = {};

  public state: State = {
    list: []
  };

  private _activeRef: any = null;

  constructor(props: Props) {
    super(props);
    const {list, noNeedAutoActive} = props;

    if (!list || !list[0]) return;

    if (!noNeedAutoActive) list[0].active = true;

    this.state.list = list;
  }

  public componentDidMount(): void {
    const {isAutoSlide} = this.props;
    if (isAutoSlide && this._activeRef) {
      this._activeRef.scrollIntoViewIfNeeded();
    }
  }

  public componentWillReceiveProps(props: Props): void {
    if (props.list !== this.state.list) this.setState({list: props.list});
  }

  public _clickItem(e: any, index: number): void {
    const {onClick} = this.props;
    const isActive = this.setActive(index, true);
    const itemClick = this.state.list[index].onClick;

    !isActive && onClick && onClick(e, index, this.state.list[index]);
    !isActive && itemClick && itemClick(e, index);
  }

  public setActive(index: number, isAutoScroll: boolean): boolean {
    const {list} = this.state;
    const {isSlide} = this.props;
    if (list[index].active) return true;

    list.forEach((item, idx) => item.active = index === idx);
    this.setState({list}, () => {
      if (isAutoScroll && isSlide) {
        this._activeRef.scrollIntoViewIfNeeded();
      }
    });

    return false
  }

  public render(): React.ReactNode {
    const {list} = this.state;
    const {isSlide, defaultColor, activeColor} = this.props;
    return (
      <ul
        className={cx(pre + 'nav-bar-container')}
        style={{
          color: defaultColor ? defaultColor : '',
          whiteSpace: isSlide ? 'nowrap' : 'normal',
          overflowX: isSlide ? 'auto' : 'hidden',
        }}
      >
        {
          list.map((item, index) => {
            const {active, content} = item;
            return (
              <li
                key={index}
                className={cx(pre + 'nav-bar-item', active && (pre + 'nav-bar-active'))}
                onClick={(e) => this._clickItem(e, index)}
                style={{
                  width: isSlide ? '' : `${100 / (list.length || 1)}%`,
                  color: active && activeColor ? activeColor : '',
                }}
                ref={r => active && (this._activeRef = r)}
              >
                <span style={{borderColor: activeColor ? activeColor : ''}}>
                  {content}
                </span>
              </li>
            )
          })
        }
      </ul>
    )
  }

}

export default NavBar;
