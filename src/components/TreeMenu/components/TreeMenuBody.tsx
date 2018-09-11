import * as React from 'react';
import {Component} from 'react';
import * as ReactDom from 'react-dom';
import cn from 'classnames';

import {
  setData, getActiveIndex, setActive,
  getRenderData, getClickData,
  updateActiveIndex,
} from './helper';
import {IBody, BodyConfig, BodyProps as Props, BodyState as State} from '../interface/Interface';

import * as styles from '../style.less';
import config from '../../../config';


const cx = cn.bind(styles);
const pre = config.pre;

let beforeLoad: Props | null = null;

/* body内的容器节点和实例化容器 */
let div: HTMLDivElement | null = null;
let Container: IBody | null = null;

class TreeMenuBody extends Component<Props, State> {
  public static defaultProps = {
    top: '0',
    isActive: false,
    data: [],
  };

  public state: State = {
    isShow: false,
    data: [],
    activeIndex: [],

    transformQueue: [],
    bodyScale: '0',

    onClick: undefined,
    top: '0',

    onShow: undefined,
    onHide: undefined,
  };

  /* 总的列数 */
  private col: number = 0;
  /* 实际上看得到的列数 */
  private showCol: number = 0;
  private _timer: any = null;

  constructor(props: Props) {
    super(props);

    const {isShow = false, data} = props;

    this.state.isShow = isShow;

    /* 存入数据, 追踪选中的数据 */
    this.state.data = setData(data);
    this.state.activeIndex = getActiveIndex(data);
  }

  public componentDidMount(): void {
    this._setCSS();

    if (beforeLoad) {
      this.show(beforeLoad);
      beforeLoad = null;
    }
  }

  public componentWillUnmount(): void {
    this._timer && clearTimeout(this._timer);
  }

  public show(props: Props): void {
    const {data, isShow = true, isAsync = false, onClick, top, onHide, onShow} = props;
    if (div) div.style.top = top || '';

    this.setState(
      {
        isAsync, isShow, onClick, onHide, onShow,
        data: setData(data || []),
        activeIndex: getActiveIndex(data || []),
      },
      () => {
        this._setCSS();
      }
    );

    if (isShow) {
      this._timer = setTimeout(() => {
        this._mainTransition(true);
        this.setState({bodyScale: '1'})
      }, 16)
    }

    onShow && onShow();
  }

  public hide(): void {
    const {onHide} = this.state;
    this._mainTransition(false);
    this.setState({bodyScale: '0'});

    onHide && onHide();
  }

  public _mainTransition(isShow: boolean): void {
    if (!div) return;
    div.style.opacity = isShow ? '1' : '0';
    div.style.visibility = isShow ? 'visible' : 'hidden';
  }

  public _update(nextActiveIndex: number[]): void {
    const {data} = this.state;
    // 根据新的index 设定组件的 data;
    const newData = setActive(nextActiveIndex, data);

    this.setState(
      {activeIndex: nextActiveIndex, data: newData},
      () => this._setCSS(),
    );
  }

  public _setCSS(): void {
    /* 设定每一个list的位移 */
    const col = this.col;
    const showCol = this.showCol;
    const {transformQueue} = this.state;

    if (!col || !showCol) return;

    transformQueue.length = col;

    transformQueue.fill('');
    transformQueue.forEach((item, index) => {
      transformQueue[index] = (!index || index >= showCol)
        ? '0'
        : `${-(showCol - index) * (100 / showCol)}%`;
    });

    this.setState({transformQueue});
  }

  public _addListAndUpdate(res: BodyConfig[], clickData: BodyConfig | undefined, nextIndex: number[]): void {

    const {data, isAsync} = this.state;
    // 同步数据的时候, 不让外部调用这个方法
    if (!isAsync) return;

    if (clickData) clickData.children = res;

    const newData = setActive(nextIndex, data);

    this.setState(
      {data: newData, activeIndex: nextIndex},
      () => this._setCSS(),
    );
  }

  /*
  * 点击item事件
  * 1. 需截断跟踪的activeIndex
  * 2. 需更改UI展示data
  * */
  public _itemClick(e: any, listIndex: number, index: number, item: BodyConfig): void {
    const {activeIndex, data, onClick, isAsync} = this.state;

    /*
      * 1. 如果是异步情况
      * 如果返回Promise, 那么等待结果返回
      * 也可以调用 callback, 组件回调观察回调事件返回
      * 若没有返回, 则认为以后没有数据, 若返回, 则动态添加数据到state内
      * */
    const clickData = getClickData(data, activeIndex, listIndex);
    const nextActiveIndex = updateActiveIndex(activeIndex, listIndex, index);

    const res = onClick && onClick(
      e, listIndex, index, item, data, nextActiveIndex,
      (res: BodyConfig[]) => this._addListAndUpdate(res, clickData && clickData[index], nextActiveIndex),
    );

    if (isAsync) {
      if (res && res.then && res.catch) {
        res.then((res: BodyConfig[]) => {
          this._addListAndUpdate(res, clickData && clickData[index], nextActiveIndex);
        })
      }
    } else {
      /*
      * 2. 如果是同步情况, 数据已经全都给组件了, 只需要整起
      * */
      this._update(nextActiveIndex);
    }
  }

  public _renderItem(data: BodyConfig[], listIndex: number[]): React.ReactNode {
    if (listIndex[listIndex.length - 1] === -1) return (<li/>);

    const showCol = this.showCol;
    const list = getRenderData(data, listIndex);

    return list && list.map((item, index) => {
      const {isActive, label} = item;

      return (
        <li
          key={'item' + index}
          onClick={(e) => {
            this._itemClick(e, listIndex.length, index, item)
          }}

          className={cx(pre + 't-m-b-item', isActive && (pre + 't-m-b-item-active'))}
        >
          <div
            className={cx(pre + 't-m-b-item-text')}
            style={{width: `${100 / showCol}%`}}
          >
            {label}
          </div>
        </li>
      )
    })
  }


  public _renderCol(): React.ReactNode {
    const {data, activeIndex, transformQueue} = this.state;

    /*
     * 必须要显示已经选中的, 还有选中的那个的下一级(如果有)
     * activeIndex的长度, 代表了渲染了几列列表
     * */
    const renderIndex: number[] = [];
    const renderList = [];

    let renderCol = 0;

    for (let i = 0; i <= activeIndex.length; i++) {
      const Item = this._renderItem(data, [...renderIndex]);
      Item && renderCol++;
      renderList.push(
        <ul
          key={'col' + i}
          className={cx(pre + 't-m-b-list')}
          style={{
            left: i === 0 ? '0' : '100%',
            backgroundColor: (i !== 0 && i === activeIndex.length) ? '#F8F8F8' : '',
            transform: `translateX(${transformQueue[i]})`,
            WebkitTransform: `translateX(${transformQueue[i]})`,
          }}
        >
          {Item}
        </ul>
      );
      renderIndex.push(activeIndex.length > i ? activeIndex[i] : -1);
    }

    /* 不删除 ul 节点 保留动画 */
    const al = activeIndex.length;

    if (this.col > al) {
      for (let i = 0; i < this.col - al; i++) {
        renderList.push(
          <ul
            key={'pre-col' + i}
            className={cx(pre + 't-m-b-list', pre + 't-m-b-list-prev')}
            style={{
              transform: `translateX(0)`,
              WebkitTransform: `translateX(0)`,
            }}
          >
            <li/>
          </ul>
        )
      }
    }

    /* 如果已经渲染了一列, 就不删除节点, 只是让他隐藏掉 */
    if (renderCol > this.col) this.col = renderCol;
    this.showCol = renderCol;

    return renderList;
  }

  public render(): React.ReactNode {
    const {bodyScale} = this.state;

    return (
      <div
        className={cx(pre + 'tree-menu-container')}
        onClick={() => this.hide()}
      >
        <div className={cx(pre + 'tree-menu-body', {active: bodyScale === '1'})}
          onClick={e => e.stopPropagation()}
        >
          {this._renderCol()}
        </div>
      </div>
    )
  }
}

const getContainer = (props?: Props): IBody | null => {

  if (!div) {
    div = document.createElement('div');
    div.className = 'lui-tree-menu-body-main';
    document.body.appendChild(div);


    ReactDom.render(
      <TreeMenuBody data={[]}/>,
      div,
      function (this: IBody): void {
        Container = this
      }
    );
  }

  return Container;
};

const Body = {
  show: (props: Props) => {
    const Container = getContainer();

    Container ? Container.show(props) : beforeLoad = props;
    getContainer(props);
  },
  hide: () => {
    const Container = getContainer();
    Container && Container.hide();
  }
};

export default Body;
