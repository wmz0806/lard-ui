import * as React from 'react';
import {Component} from 'react';
import * as ReactDom from 'react-dom';
import cn from 'classnames';

import {ISnakeBar, Props, State} from './interface/Interface';

import Icon from '../Icon';

import * as styles from './style.less';
import config from '../../config';
import * as horn from './images/horn.png';

import utils from '../../utils';

const cx = cn.bind(styles);
const pre = config.pre;

const queue: Props[] = [];

class SnakeBar extends Component<Props, State> {
  public static defaultProps = {};

  public state: State = {
    list: []
  };

  private _timer: any = null;
  private _autoCloseTimer: any = null;

  constructor(props: Props) {
    super(props)
  }

  public componentDidMount(): void {
    if (queue.length) {
      queue.forEach(props => this._add(props));
    }
  }

  public componentWillUnmount(): void {
    this._timer && clearTimeout(this._timer);
    this._autoCloseTimer && clearTimeout(this._autoCloseTimer);
  }

  public _clickItem(e: any, item: Props): void {
    const {onClick} = item;
    onClick && onClick(e, item);
  }

  public _closeItem(uuid: string): void {
    let {list} = this.state;

    list.forEach(item => {
      item.animateClass = item.uuid === uuid ? pre + 'snake-bar-out' : '';
    });

    this.setState({list});

    this._timer = setTimeout(() => {
      list = list.filter(item => item.uuid !== uuid);
      this.setState({list});
    }, 150)
  }

  /* 加入列表 */
  public _add(props: Props): () => void {
    const {list} = this.state;
    const uuid = utils.createUUID();

    list.push({...props, uuid, animateClass: pre + 'snake-bar-in'});

    this.setState({list});

    if(props.autoClose) {
      this._autoCloseTimer = setTimeout(() => {
        this._closeItem(uuid);
      }, props.autoClose)
    }

    return () => this.close(uuid);
  }

  public show(props: Props): () => void {
    return this._add(props);
  }

  public close(uuid?: string): void {
    const {list} = this.state;

    if (!list.length) return;

    uuid
      ? this._closeItem(uuid)
      : this._closeItem(list[0].uuid || '');

    this.setState({list});
  }

  public clear(): void {
    this.setState({list: []});
  }

  public destroy(container: ISnakeBar | null, div: Element | null): void {
    container && container.clear();
    if (!div) return;
    ReactDom.unmountComponentAtNode(div);
    document.body.removeChild(div);
  }

  public render(): React.ReactNode {
    const {list} = this.state;
    return list.length && (
      <ul className={cx(pre + 'snake-bar-container')}>
        {list.map((item, index) => (
          <li
            key={index}
            className={cx(pre + 'snake-bar-item', item.className, item.animateClass)}
            style={{
              bottom: `${index * 0.1}rem`,
              left: `${index * 0.05}rem`,
              zIndex: 10 - index,
              opacity: (10 - index) / 10,
              ...item.style}}
            onClick={(e) => this._clickItem(e, item)}
          >
            <div
              className={cx(pre + 'snake-bar-image')}
              style={{backgroundImage: `url(${horn})`}}
            />

            <div
              className={cx(pre + 'snake-bar-close')}
              onClick={(e) => {
                e.stopPropagation();
                this.close(item.uuid)
              }}
            >
              <Icon name={'cha'} size={.4} color={'white'}/>
            </div>

            <div className={cx(pre + 'snake-bar-content')}>
              {item.content}
            </div>
          </li>
        ))}
      </ul>
    )
  }
}

let container: ISnakeBar | null = null;
let div: Element | null = null;

const getContainer = (props?: Props): ISnakeBar | null => {
  if (!container) {
    div = document.createElement('div');
    div.className = pre + 'snake-bar-main';
    document.body.appendChild(div);

    ReactDom.render(
      <SnakeBar {...props}/>,
      div,
      function (this: ISnakeBar): void {
        container = this;
      }
    )
  }

  return container
};

export default {
  show: (props: Props): any  => {
    const con = getContainer();

    if (con) {
      return con._add(props);
    } else {
      queue.push(props);
    }
  },
  hide: (uuid?: string) => {
    const con = getContainer();

    con && con.close(uuid);
  },
  clear: () => {
    const con = getContainer();

    con && con.clear();
  },
  destroy: (): void => {
    const con = getContainer();

    con && con.destroy(con, div);
  },
}

