import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import {
  HeaderProps as Props,
  HeaderState as State,
} from '../interface/Interface';

import * as styles from '../style.less';
import config from '../../../config';

const cx = cn.bind(styles);
const pre = config.pre;

class TreeMenuHeader extends Component<Props, State> {
  public static defaultProps = {};

  public state: State = {
    data: []
  };

  private _headerEl: HTMLUListElement | null = null;

  constructor(props: Props) {
    super(props);

    let count = 0;

    // 最多只能有一个active的
    props.data.forEach(item => item.isActive && count++);
    if (count > 1) console.warn('只能有一个active的');

    this.state.data = props.data;
  }

  public getRef(): HTMLUListElement | null {
    return this._headerEl;
  }

  public setActive(index: number, isActive: boolean): void {
    const {data} = this.state;


    data.forEach(item => item.isActive = false);
    if (index !== -1) data[index].isActive = isActive;

    this.setState({data});
  }

  public setValue(index: number, value: string | React.ReactNode): void {
    const {data} = this.state;

    data.forEach((item, idx) => {
      if (idx === index) item.content = value;
    });

    this.setState({data});
  }

  public _clickItem(e: any, index: number): void {
    const {data} = this.state;

    const {isActive, onClick} = data[index];
    const {onClick: propsClick} = this.props;

    this.setActive(index, !isActive);

    onClick && onClick(e, !isActive);
    propsClick && propsClick(e, index, !isActive);
  }

  public render(): React.ReactNode {
    const {data} = this.state;
    const {style, className} = this.props;

    return (
      <ul
        className={cx(pre + 'tree-menu-header', className)}
        ref={r => this._headerEl = r}
        style={{...style}}
      >
        {
          data.map(({content, isActive = false, onClick, className, style}, index) => (
            <li
              key={index}
              onClick={e => this._clickItem(e, index)}

              className={cx(
                isActive ? (pre + 't-m-h-active') : '',
                className,
              )}
              style={{width: `${100 / data.length}%` ,...style}}
            >
              <div className={cx(pre + 't-m-h-text')}>
                {content}
              </div>
              <div className={cx(pre + 't-m-h-triangle')}>
                <div className={cx(pre + 't-m-h-triangle-inner')}/>
              </div>
            </li>
          ))
        }
      </ul>
    )
  }
}

export default TreeMenuHeader;
