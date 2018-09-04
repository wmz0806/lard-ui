import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import {Props, State} from './interface/Interface';

import styles from './style.less';

import config from '../../config';

const cx = cn.bind(styles);
const pre = config.pre;

class GroupButton extends Component<Props, State> {
  public static defaultProps = {
    type: 'single',
    allSelect: '全部'
  };

  public state: State = {
    data: [],
    isAllChoose: false,
  };

  constructor(props: Props) {
    super(props);

    this.state.data = props.data;
    this.state.isAllChoose = this.getAllSelectStatus();
  }

  public setChoose(config: boolean[] | number): void {
    const {data} = this.state;

    if (typeof config === 'number') {
      data.forEach(item => item.isChoose = false);
      data[config].isChoose = true;
    } else if (Array.isArray(config)) {
      data.forEach((item, index) => item.isChoose = config[index])
    }

    this.setState({data});
  }

  public getChoose(): boolean[] {
    return this.state.data.map(item => !!item.isChoose);
  }

  public selectAll(): void {
    const {type} = this.props;
    if (type !== 'multiple') return console.warn('单选button不能全选');

    this._allSelect(true);
  }

  public unselectAll(): void {
    this._allSelect(false);
  }

  public getAllSelectStatus(): boolean {
    const {data} = this.state;

    return data.every(item => !!item.isDisabled || !!item.isChoose)
  }

  public _allSelect(isChoose: boolean): void {
    const {data} = this.state;

    data.forEach(item => {
      if (!item.isDisabled) item.isChoose = isChoose
    });

    this.setState({data});
  }

  public _clickAll(e: any): void {
    const {isAllChoose} = this.state;
    this._allSelect(!isAllChoose);
    this.setState({isAllChoose: !isAllChoose})
  }

  public _itemClick(e: any, index: number, isChoose: boolean, isDisabled: boolean): void {
    if (isDisabled) return;

    const {type, onClick, canCancel} = this.props;
    const {data} = this.state;
    const isSingle = type === 'single';

    const chooseItem = data[index];

    if (isSingle) {
      if (!canCancel) {
        if (isChoose) return;

        data.forEach(item => item.isChoose = false);
        data[index].isChoose = true;
      } else {
        data.forEach(item => item.isChoose = false);
        data[index].isChoose = !isChoose;
      }

    } else {
      data[index].isChoose = !isChoose;
      this.setState({isAllChoose: this.getAllSelectStatus()});
    }

    const select = data.map(item => item.isChoose);

    onClick && onClick(e, index, select, chooseItem);
    chooseItem.onClick && chooseItem.onClick(e, select, chooseItem);

    this.setState({data});
  }

  public _renderContent(): React.ReactNode | void {
    const {data, isAllChoose} = this.state;
    const {col, type, allSelect} = this.props;

    if (!data.length) return;

    const isSingle = type === 'single';

    return (
      <ul className={cx(pre + 'b-g-container')}>
        {
          !isSingle && allSelect &&
          <li
            key={'all-select'}
            onClick={(e) => this._clickAll(e)}
            style={{ width: col ? `${100 / col}%` : '' }}
          >
            <div
              className={cx(
                pre + 'b-g-text',
                isAllChoose && 'b-g-active',
              )}
              style={{borderRadius: '.06rem'}}
            >
              {allSelect}
            </div>
          </li>
        }
        {
          data.map((item, index) => {
            const {content, isChoose = false, isDisabled = false, className, style} = item;
            return (
              <li
                key={index}
                onClick={(e) => this._itemClick(e, index, isChoose, isDisabled)}
                className={className}
                style={{
                  width: col ? `${100 / col}%` : '',
                  ...style
                }}
              >
                <div
                  className={cx(
                    pre + 'b-g-text',
                    isChoose && 'b-g-active',
                    isDisabled && 'b-g-disabled',
                  )}
                  style={{
                    borderRadius: isSingle ? '.6rem' : '.06rem'
                  }}
                >
                  {content}
                </div>
              </li>
            )
          })
        }
      </ul>
    )
  }

  public render(): React.ReactNode {
    const {className, style} = this.props;
    return (
      <div
        className={cx(pre + 'button-group-main', className)}
        style={{...style}}
      >
        {this._renderContent() || ''}
      </div>
    )
  }

}

export default GroupButton;
