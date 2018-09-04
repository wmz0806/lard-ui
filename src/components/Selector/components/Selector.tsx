import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import {State, Props, Config} from '../interface/Interface';

import Icon from '../../Icon';

import styles from '../style.less';
import config from '../../../config';

const cx = cn.bind(styles);
const pre = config.pre;

class Selector extends Component<Props, State> {
  public static defaultProps = {
    type: 'radio',
    direction: 'vertical',
    hasAllSelect: false,
    data: [],
  };

  public state: State = {
    allSelectStatus: 0, // 0 代表全都没选, 1 代表选了一些, 2 代表全选中
    data: []
  };

  constructor(props: Props) {
    super(props);

    this.state.data = props.data;
    if (props.type === 'checkbox') this.state.allSelectStatus = this.getAllSelectStatus();
  }

  public getChoose(): boolean[] {
    return this.state.data.map(item => !!item.isChoose);
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

  public selectAll(): void {
    const {type} = this.props;
    if (type !== 'checkbox') return console.warn('单选选择器不能全选');

    this._allSelect(true);
  }

  public unselectAll(): void {
    this._allSelect(false);
  }

  public _allSelect(isChoose: boolean): void {
    const {data} = this.state;

    data.forEach(item => {
      if (!item.isDisabled && !item.isErr) item.isChoose = isChoose
    });

    this.setState({data});
  }

  public getAllSelectStatus(): 0 | 1 | 2 {
    const {type} = this.props;
    if (type !== 'checkbox') console.warn('只有多选框才有全选状态');

    const {data} = this.state;
    const len = data.length;

    let status: 0 | 1 | 2 = 0;
    let firstCheck = true;

    /* 判断全选状态 */
    for (let i = 0; i < len; i++) {
      const {isErr, isDisabled, isChoose} = data[i];
      if (!isErr && !isDisabled) {
        if (status === 0 && isChoose) {
          if (firstCheck) {
            status = 2;
          } else {
            status = 1;
            break;
          }
        } else if (status === 2 && !isChoose) {
          status = 1;
          break;
        }

        firstCheck = false;
      }
    }

    return status;
  }

  public _validateAllSelect(): void {
    /*
    * 全选验证
    * 当有disabled 或者 err 的时候, 跳过对他们的验证, 只需要选择完了其他的选项, 就设定全选
    * */
    const {type, hasAllSelect} = this.props;
    if (type !== 'checkbox' || !hasAllSelect) return;

    const status = this.getAllSelectStatus();

    this.setState({allSelectStatus: status});
  }

  public _checkboxClick(e: any, index: number, item: Config): void {
    const {isChoose = false, isDisabled = false, isErr = false, onCheck: itemCheck} = item;

    const {data} = this.state;
    const {onCheck} = this.props;

    if (isDisabled || isErr) return;

    data[index].isChoose = !isChoose;
    this.setState({data});

    const select = data.map(({isChoose}) => !!isChoose);

    /* 公开事件 */
    onCheck && onCheck(e, index, item, select);
    itemCheck && itemCheck(e, select);

    /* 验证全选 */
    this._validateAllSelect();
  }

  public _clickAll(e: any): void {
    const {allSelectStatus, data} = this.state;
    const {onCheck} = this.props;
    allSelectStatus === 2 ? this.unselectAll() : this.selectAll();

    const select = data.map(({isChoose}) => !!isChoose);

    onCheck && onCheck(e, -1, undefined, select);
    this._validateAllSelect();
  }

  public _radioItemClick(e: any, index: number, item: Config): void {
    const {isChoose = false, isDisabled = false, isErr = false, onCheck: itemCheck} = item;
    const {data} = this.state;
    const {onCheck} = this.props;

    if (isDisabled || isErr || isChoose) return;

    data.forEach(item => {
      if (!item.isErr && !item.isDisabled) item.isChoose = false
    });
    data[index].isChoose = true;

    this.setState({data});

    /* 公开事件 */
    onCheck && onCheck(e, index, item);
    itemCheck && itemCheck(e);
  }

  public _renderIcon(isRadio: boolean, isChoose: boolean, isDisabled: boolean, isErr: boolean): React.ReactNode {
    return (
      <div className={cx(`${pre}selector-box`, {active: isChoose})}>
        <Icon
          name={isRadio ? 'danxuan-xuanzhong' : 'duoxuan-xuanzhong'}
          className={cx({error: isErr, disabled: isDisabled, choose: true})}
        />
        <Icon
          name={isRadio ? 'danxuan-weixuanzhong' : 'duoxuan-weixuanzhong'}
          className={cx({error: isErr, disabled: isDisabled, choose: false})}
        />
      </div>
    );

    /*return (
      <div className={cx(`${pre}selector-box`, {active: isChoose})}>
        <Icon
          name={
            isRadio
              ? (isChoose ? 'danxuan-xuanzhong' : 'danxuan-weixuanzhong')
              : (isChoose ? 'duoxuan-xuanzhong' : 'duoxuan-weixuanzhong')
          }
          color={isErr ? '#E4393C' : (isDisabled ? '#DDDDDD' : (isChoose ? '#3B4FA0' : '#999999'))}
          size={0.4}
        />
      </div>
    );*/
  }

  public _renderContent(): React.ReactNode {
    const {direction, itemHeight, renderItem, type, hasAllSelect = false} = this.props;
    const {data, allSelectStatus} = this.state;

    const isVertical = direction === 'vertical';
    const isRadio = type === 'radio';

    return (
      <ul
        className={cx(pre + 'selector-container')}
        style={{
          display: isVertical ? 'block' : 'flex',
        }}
      >
        {
          !isRadio && hasAllSelect && isVertical &&
          <li
            key={'all-select'}
            onClick={(e) => this._clickAll(e)}
            className={cx(pre + 's-c-item', pre + 's-c-all-select')}
            style={{
              width: isVertical ? '100%' : `${100 / data.length}%`,
            }}
          >
            <div className={cx(pre + 's-c-icon')}>
              <div className={cx(pre + 's-c-icon-inner')}>
                <Icon
                  name={['duoxuan-weixuanzhong', 'duoxuan-weiquanxuan', 'duoxuan-xuanzhong'][allSelectStatus]}
                  size={0.4}
                  color={allSelectStatus === 0 ? '#999' : '#3B4FA0'}
                />
              </div>
            </div>

            <div className={cx(pre + 's-c-context')}>
              {hasAllSelect === true ? '全选' : hasAllSelect}
            </div>
          </li>
        }
        {
          data.map((item, index) => {
            const {isChoose = false, isDisabled = false, isErr = false, height, render, className, style} = item;

            const renderResult = render ? render(index, item) : (renderItem && renderItem(index, item));
            const calcHeight = (): string => {
              // 计算行高. 优先级从 子元素 height => 总的height => 渲染的是否是string => 使用自己撑开的高度
              if (height) return height;
              if (itemHeight) return itemHeight;
              if (renderResult && typeof renderResult !== 'object') return '0.88rem';
              return '';
            };

            return (
              <li
                key={index}
                onClick={(e: any) => {
                  isRadio
                    ? this._radioItemClick(e, index, item)
                    : this._checkboxClick(e, index, item);
                }}
                className={cx(pre + 's-c-item', className)}
                style={{
                  width: isVertical ? '100%' : `${100 / data.length}%`,
                  height: calcHeight(),
                  ...style,
                }}
              >
                <div className={cx(pre + 's-c-icon')}>
                  <div className={cx(pre + 's-c-icon-inner')}>
                    {this._renderIcon(isRadio, isChoose, isDisabled, isErr)}
                  </div>
                </div>
                <div className={cx(pre + 's-c-context')}>
                  {renderResult}
                </div>
              </li>
            )
          })
        }
      </ul>
    )
  }

  public render(): React.ReactNode {
    return (
      <div className={cx(pre + 'selector-main')}>
        {this._renderContent()}
      </div>
    )
  }
}


export default Selector;
