import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import Icon from '../Icon';

import * as styles from './style.less';
import config from '../../config';

const cx = cn.bind(styles);
const pre = config.pre;

export interface List {
  /**
   * item 标题
   */
  title?: string | React.ReactNode
  /**
   * item 内容
   */
  content?: string | React.ReactNode
  /**
   * 该item是否是激活状态? (组件只会默认设置第一个为true的item)
   * @default false
   */
  active?: boolean
  /**
   * 单个列表的点击回调函数
   */
  onClick?: (e: any, active: boolean) => void
  className?: string
  style?: object
}

interface Props {
  /**
   * 组件需要的参数集合, 参见 List interface
   */
  list: List[]
  /**
   * 是否需要开启默认第一个active? (如果有一个item设置了active: true, 该属性会被忽略)
   * @default false
   */
  noNeedAutoActive?: boolean
  /**
   * 总的click 回调函数
   */
  onClick?: (e: any, index: number, item: List) => void

  className?: string
  style?: object
}

interface State {
  list: List[]
  opacity: number
}

class Index extends Component<Props, State> {
  public static defaultProps = {};

  public state: State = {
    list: [],
    opacity: 0
  };

  private _activeIndex: number = -1;

  private _itemRef: any[] = [];

  private _itemHeight: string[] = [];

  constructor(props: Props) {
    super(props);
    const {list, noNeedAutoActive} = props;

    if (!list) return;

    /* 缓存到activeIndex 以后用 */
    this._activeIndex = list.findIndex(item => item.active === true);

    if (this._activeIndex === -1 && !noNeedAutoActive) {
      this._activeIndex = 0;
    }

    list.forEach(item => item.active = true);

    this.state.list = list;
  }

  public componentDidMount(): void {
    this._itemHeight = this._itemRef.map(item => item.offsetHeight + 'px');

    const {list} = this.state;
    list.forEach((item, index) => item.active = this._activeIndex === index);

    this.setState({opacity: 1, list});
  }

  public componentWillReceiveProps(props: Props): void {
    if (props.list !== this.state.list) this.setState({list: props.list});
  }

  public _clickItem(e: any, index: number, active: boolean): void {
    const {onClick} = this.props;
    const {list} = this.state;

    const itemClick = list[index].onClick;

    this.setActiveItem(index);

    onClick && onClick(e, index, list[index]);
    itemClick && itemClick(e, active)
  }

  public setActiveItem(index: number): void {
    const {list} = this.state;
    const {active} = list[index];

    if (!active) list.forEach(item => item.active = false);

    list[index].active = !active;

    this.setState({list});
  }

  public render(): React.ReactNode {
    const {list, opacity} = this.state;
    return (
      <ul className={cx(pre + 'accordion-container')}>
        {
          list.map(({title, content, className, style, active}, index) => (
            <li
              key={index}
              ref={r => this._itemRef[index] = r}
              className={cx(pre + 'accordion-item', active && 'accordion-item-active', className)}
              style={{...style, opacity, height: active ? this._itemHeight[index] : '0.98rem'}}
            >
              <div
                className={cx(pre + 'accordion-item-header')}
                onClick={(e) => this._clickItem(e, index, !active)}
              >
                {title}
                <div
                  className={cx(pre + 'accordion-header-icon')}
                  style={{transform: `rotate(${active ? '180deg' : '0deg'})`}}
                >
                  <Icon name={'xiangxia'} size={.24} color={'#999999'}/>
                </div>
              </div>
              <div className={cx(pre + 'accordion-item-body')}>
                {content}
              </div>
            </li>
          ))
        }
      </ul>
    )
  }

}

export default Index;
