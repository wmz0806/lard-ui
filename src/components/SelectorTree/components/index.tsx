import * as React from 'react';
import {Component} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import cn from 'classnames';

import Icon from '../../Icon';

import {Props, State, Config} from '../interface/Interface';
import {
  formatData, getChose, getSelectItem, getAllChildChose, closeItem,
  closeAll, calcChildTreeHeight, setHasChildChose, resetData
} from './helper';

import * as styles from '../style.less';
import config from '../../../config';

// TODO mock

const cx = cn.bind(styles);
const pre = config.pre;

/*
* 分为 1级, 2级, 3级的情况, 4级暂时不做, 有点乱
* 1级有可代替组件, 不做考虑
*
* */

class SelectorTree extends Component<Props, State> {
  public static defaultProps = {};

  public state: State = {
    isShow: false,
    choseData: [],
    data: []
  };

  constructor(props: Props) {
    super(props);

    /* 组件挂载中... */
    const { data, isShow } = props;

    this.state.data = formatData(data);
    this.state.choseData = getChose(data);
    this.state.isShow = !!isShow;
  }

  // public componentDidMount(): void {  }

  // public componentWillUnmount(): void { }

  public show(): void {
    this.setState({isShow: true});
  }

  public hide(): void {
    this.setState({isShow: false});
  }

  public reset(): void {
    const { onReset } = this.props;
    const { data } = this.state;

    closeAll(data);
    resetData(data);

    onReset && onReset(data);

    this.setState({data, choseData: []});
  }

  public _onSure(): void {
    const { onSure } = this.props;
    const { choseData } = this.state;

    onSure && onSure(choseData);

    this.hide();
  }

  public _addItem(item: Config, data: Config[]): void {

    const { data: stateData } = this.state;
    item.children = data;

    this._changeActive(item.index, !!item.isActive);

    formatData(stateData);

    this.setState({data: stateData});
  }

  public _clickItem(item: Config): void {
    const {onClick, isAsync} = this.props;

    const res = onClick && onClick(item, (data) => this._addItem(item, data));

    /* 只有在小于2级的时候才可能异步接收数据! */
    if (isAsync && item.index.length <= 2) {
      if (res && res.then && res.catch) {
        res.then((data: Config[]) => this._addItem(item, data))
      }
      if (!res) {
        this._changeActive(item.index, !!item.isActive);
      }
    }
  }

  public _deleteChose(indexArr: number[]): void {
    const {data} = this.state;

    const choseItem = getSelectItem(data, indexArr);

    if (choseItem) choseItem.isChoose = false;

    const choseData = getChose(data);
    setHasChildChose(data);

    this.setState({data, choseData});
  }

  public _changeActive(indexArr: number[], isActive: boolean): void {
    const { data } = this.state;

    /* 需要层层关闭相同层, 如果点击了第一层, 把所有的都关掉 */
    closeItem(data, indexArr);
    if (indexArr.length === 1) {
      closeAll(data);
    }

    const choseItem = getSelectItem(data, indexArr);

    choseItem[choseItem.children ? 'isActive' : 'isChoose'] = !isActive;

    setHasChildChose(data);

    this.setState({data});
  }

  public _changeChoose(item: Config): void {
    const { data } = this.state;

    item.isChoose = !item.isChoose;

    setHasChildChose(data);
    const choseData = getChose(data);

    this.setState({data, choseData});
  }

  public _renderChose(): React.ReactNode {
    const { choseData } = this.state;
    const { length } = choseData;

    return (
      <div className={cx(pre + 's-t-chose-container')}>
        <div className={cx(pre + 's-t-title')}>
          {length ? '已选' : '请选择'}
        </div>
        {
          <ul
            className={cx(pre + 's-t-chose')}
            style={{
              height: `${Math.ceil(length / 4) * 0.84}rem`,
            }}
          >
            <TransitionGroup>
              {
                choseData.map((item, index) => {
                  return (
                    <CSSTransition
                      key={item.uuid}
                      timeout={200}
                      classNames={pre + 's-t-chose-fade'}
                    >
                      <li
                        key={item.uuid}
                        className={cx(pre + 's-t-chose-item')}
                      >
                        <div className={cx(pre + 's-t-chose-text', 'f-toe')}>
                          {item.label}
                        </div>
                        <div
                          className={cx(pre + 's-t-chose-delete')}
                          onClick={() => this._deleteChose(item.index)}
                        >
                          <Icon name={'cha'} color={'white'} size={.2}/>
                        </div>
                      </li>
                    </CSSTransition>
                  )
                })
              }
            </TransitionGroup>
          </ul>
        }
      </div>
    )
  }

  public _renderTree3(data: Config[], item: Config): React.ReactNode {
    return (
      <div className={cx(pre + 's-t-tree-3')}>
        <div className={cx(pre + 's-t-tree-title-3')}>
          {item.label}
        </div>
        <ul className={cx(pre + 's-t-tree-inner-3')}>
          {
            data.map((item, index) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    this._clickItem(item);
                    this._changeChoose(item);
                  }}
                  className={cx(
                    pre + 's-t-tree-item-3', 'f-toe',
                    item.isChoose && (pre +'s-t-active-3'),
                  )}
                >
                  {item.label}
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }

  /*
  * 二级树, 该组件至少需要 二级树!
  * 如果点选时没有子树, 则当做选中
  * */
  public _renderTree2(data: Config): React.ReactNode | void {
    const { children } = data;
    const { isAsync } = this.props;
    if (!children) return;

    const height = (0.6 + calcChildTreeHeight(children) + Math.ceil(children.length / 4) * 0.84) + 'rem';
    let activeChild = null;
    let activeItem = null;

    return (
      <div
        onClick={e => e.stopPropagation()}
        className={cx(pre + 's-t-tree-2')}
        style={{
          height: data.isActive ? height : '0',
        }}
      >
        <ul className={cx(pre + 's-t-tree-inner-2')}>
          {
            children.map((item: Config, index: number) => {
              if (item.isActive) {
                activeItem = item;
                activeChild = item.children;
              }

              const classNames: string[] = [];
              if (item.children) {
                item.hasChildSelect && classNames.push(pre + 's-t-has-child-2');
                item.isActive && classNames.push(pre + 's-t-active-2');
              } else {
                item.isChoose && classNames.push(pre + 's-t-choose-2')
              }

              return (
                <li
                  key={index}
                  className={cx(
                    pre + 's-t-tree-item-2', 'f-toe',
                    ...classNames
                  )}
                  onClick={() => {
                    this._clickItem(item);
                    /* 这里只是同步的逻辑, 如果是异步, 走另一套逻辑 */
                    if (!isAsync) {
                      item.children
                        ? this._changeActive(item.index, !!item.isActive)
                        : this._changeChoose(item);
                    }
                  }}
                >
                  {item.label}
                </li>
              )
            })
          }
        </ul>

        {activeChild && activeItem && this._renderTree3(activeChild, activeItem)}
      </div>
    )
  }

  /* 主树 */
  public _renderTree1(): React.ReactNode {
    const { data } = this.state;
    const { isAsync } = this.props;

    console.log(data[0].children);
    console.log(getAllChildChose(data[0].children));
    return (
      <ul className={cx(pre + 's-t-tree')}>
        {
          data.map((item, index) => {
            return (
              <li
                key={index}
                onClick={() => {
                  this._clickItem(item);
                  if (!isAsync) {
                    this._changeActive(item.index, !!item.isActive);
                  }
                }}
                className={cx(pre + 's-t-tree-item')}
              >
                <div className={cx(pre + 'tree-item-1')}>
                  <div className={cx(pre + 'tree-item-title-1', 'f-fl')}>
                    {item.label}
                  </div>
                  <div className={cx(pre + 'tree-item-chose-1', 'f-toe')}>
                    {
                      item.hasChildSelect &&
                      getAllChildChose(item.children).map(({ label }) => label).join(',')
                    }
                  </div>
                  <div
                    className={cx(pre + 'tree-item-more', 'f-fr')}
                  >
                    更多
                    <Icon name={'xiangxia'} size={.15}/>
                  </div>
                </div>

                {this._renderTree2(item)}
              </li>
            )
          })
        }
      </ul>
    )
  }

  public _renderFooter(): React.ReactNode {
    const { resetBtn = {}, sureBtn ={} } = this.props;

    return (
      <div className={cx(pre + 's-t-footer')}>
        <div
          onClick={() => this.reset()}
          className={cx(pre + 's-t-reset', resetBtn.className)}
          style={{...resetBtn.style}}
        >
          {resetBtn.content || '重置'}
        </div>

        <div
          onClick={() => this._onSure()}
          className={cx(pre + 's-t-sure', sureBtn.className)}
          style={{...sureBtn.style}}
        >
          {sureBtn.content || '确定'}
        </div>
      </div>
    )
  }

  public render(): React.ReactNode {
    const { isShow } = this.state;
    return (
      <div className={cx(pre + 'selector-tree-main', !isShow && (pre + 's-t-hidden'))}>
        <div className={cx(pre + 's-tree-scroll')}>
          {this._renderChose()}
          {this._renderTree1()}
        </div>
        {this._renderFooter()}
      </div>
    )
  }
}

export default SelectorTree;
