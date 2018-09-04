import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import {
  IRadio,
  ISelectMap,
  IRadioRefMap,
  // ICheckboxRefMap, /* 这两个interface 一直抽风, 不理他了 */
  // ICheckboxASRefMap,
  Props,
  State,
  ICheckbox
} from '../interface/Interface.Single';

import styles from '../style.less';
import config from '../../../config';

import utils from '../../../utils';

import Icon from '../../Icon';

const cx = cn.bind(styles);
const pre = config.pre;

const {createUUID} = utils;

/*
* 组件内部维护选中状态
* 有变动时, 调用refMap的set方法
* ---- test ----
* */

const radioSelectMap: ISelectMap = {};
const radioRefMap: IRadioRefMap = {};

const checkboxSelectMap: ISelectMap = {};
const checkboxRefMap: any = {};
const checkboxASRefMap: any = {};

class SingleSelect extends Component<Props, State> {
  public static defaultProps = {};

  public state: State = {
    isChoose: false,
    allSelectStatus: 0,
  };

  constructor(props: Props) {
    super(props);
    const {id, isChoose = false, index, type, isAllSelect} = props;

    this.state.isChoose = isChoose;

    /* 维护组件组的选中状态, 实时更新 */
    if (type === 'radio') {
      radioSelectMap[id][index] = isChoose;
    } else if (type === 'checkbox' && !isAllSelect) {
      // 全选的状态不用关注
      checkboxSelectMap[id][index] = isChoose;
    }
  }

  public componentDidMount(): void {
    const {id, type} = this.props;
    if (type === 'checkbox') {
      const status = _getAllSelectStatus(id);
      checkboxASRefMap[id] && checkboxASRefMap[id].setAllSelectStatus(status);
    }
  }

  public componentWillUnmount(): void {
    /* 卸载缓存区的内容 */
    const {id, type, index, isAllSelect} = this.props;
    if (isAllSelect) {
      delete checkboxASRefMap[id];
    } else if (type === 'radio') {
      const refMap = radioRefMap[id];

      refMap[index] = null;

      if (refMap.every(item => !item)) {
        delete radioRefMap[id];
        delete radioSelectMap[id];
      }
    } else if (type === 'checkbox') {
      const refMap = checkboxRefMap[id];

      refMap[index] = null;

      if (refMap.every((item: boolean) => !item)) {
        delete checkboxRefMap[id];
        delete checkboxSelectMap[id];
        delete checkboxASRefMap[id];
      }
    }
  }

  public setChoose(isChoose: boolean): void {
    /*
     * 1. 更新当前组件的state
     * 2. 更新 selectMap 的值
     * 3. 如果是 checkbox, 还需要更新全选的状态
     * */
    const {type, id, index, isAllSelect} = this.props;

    if (type === 'radio') {
      this.setState({isChoose});
      radioSelectMap[id][index] = isChoose;
    } else if (type === 'checkbox') {
      this.setState(
        {isChoose},
        () => {type === 'checkbox' && !isAllSelect && this._updateAllSelectStatus()},
      );
      checkboxSelectMap[id][index] = isChoose;
    }
  }

  public setAllSelectStatus(status: 0 | 1 | 2): void {
    this.setState({allSelectStatus: status});
  }

  public getChoose(): boolean {
    return this.state.isChoose;
  }

  public getStatus(): {isErr: boolean, isDisabled: boolean, isChoose: boolean} {
    const {isErr = false, isDisabled = false} = this.props;
    const {isChoose} = this.state;
    return {isErr, isDisabled, isChoose};
  }

  public _updateAllSelectStatus(): void {
    // 更新全选的状态
    const {id} = this.props;
    const allSelectRef = checkboxASRefMap[id];
    const status: 0 | 1 | 2 = _getAllSelectStatus(id);
    if (allSelectRef) allSelectRef.setAllSelectStatus(status);
  }

  public _click(e: any): void {
    e.stopPropagation();

    const {type, isAllSelect} = this.props;

    if (isAllSelect) return this._allSelectClick(e);

    type === 'radio'
      ? this._radioClick(e)
      : this._checkboxClick(e);
  }

  public _radioClick(e: any): void {
    const {isChoose} = this.state;
    const {isErr, isDisabled, id, index, onCheck} = this.props;

    if (isErr || isDisabled || isChoose) return;

    radioRefMap[id].forEach((ref: IRadio | null) => ref && ref.setChoose(false));

    radioSelectMap[id] = radioSelectMap[id].map(() => false);

    this.setChoose(true);

    onCheck && onCheck(e, index, true);
  }

  public _checkboxClick(e: any): void {
    const {isChoose} = this.state;
    const {isErr, isDisabled, id, index, onCheck} = this.props;

    if (isErr || isDisabled) return;

    this.setChoose(!isChoose);

    const select = checkboxSelectMap[id].map(item => item);

    onCheck && onCheck(e, index, !isChoose, select);
  }

  public _allSelectClick(e: any): void {
    const {id, onCheck} = this.props;
    const {allSelectStatus} = this.state;
    if (allSelectStatus === 2) {
      this.setState({allSelectStatus: 0});
    } else {
      this.setState({allSelectStatus: 2});
    }

    _setAllCheckboxChoose(id, allSelectStatus !== 2);

    onCheck && onCheck(e, -1, allSelectStatus !== 2)
  }

  public _renderIcon(): React.ReactNode {
    const {isChoose, allSelectStatus} = this.state;
    const {isErr, isDisabled, type, isAllSelect} = this.props;
    let color = isErr ? '#E4393C' : (isDisabled ? '#DDDDDD' : (isChoose ? '#3B4FA0' : '#999'));
    if (isAllSelect) color = allSelectStatus ? '#3B4FA0' : '#999';

    let name = '';

    if (isAllSelect) {
      name = ['duoxuan-weixuanzhong', 'duoxuan-weiquanxuan', 'duoxuan-xuanzhong'][allSelectStatus];
    } else if (type === 'radio') {
      name = isChoose ? 'danxuan-xuanzhong' : 'danxuan-weixuanzhong'
    } else if (type === 'checkbox') {
      name = isChoose ? 'duoxuan-xuanzhong' : 'duoxuan-weixuanzhong'
    }

    return (
      <Icon
        name={name}
        size={0.4}
        color={color}
        style={{position: 'absolute'}}
      />
    )
  }

  public render(): React.ReactNode {
    const {id, index, className, style} = this.props;

    return (
      <div
        key={id + index}
        onClick={(e) => this._click(e)}
        className={cx(pre + 'single-main', className)}
        style={{...style}}
      >
        <div className={cx(pre + 'single-icon')}>
          {this._renderIcon()}
        </div>
      </div>
    )
  }
}

const Render = (props: Props, config: any, id: string) => {
  const {isChoose, isDisabled, isErr, isAllSelect} = props;
  const {onCheck, type} = config;

  let {index} = props;

  if (index === undefined && !isAllSelect) {
    index = type === 'radio' ? radioSelectMap[id].length - 1 : checkboxSelectMap[id].length - 1;
  }

  return (
    <SingleSelect
      id={id}
      index={index}
      type={type}
      isChoose={isChoose}
      isDisabled={isDisabled}
      isErr={isErr}
      isAllSelect={isAllSelect}
      ref={r => {
        if (type === 'radio') {
          radioRefMap[id] = radioRefMap[id] || [];
          radioRefMap[id][index] = r;
        } else if (type === 'checkbox') {
          /* 狗东西不知道为啥一直抽风报错 */
          checkboxRefMap[id] = checkboxRefMap[id] || [];
          if (isAllSelect) {
            checkboxASRefMap[id] = r;
          } else {
            checkboxRefMap[id][index] = r;
          }
        }
      }}
      onCheck={(e: any, index: number, choose: boolean, select?: boolean[]) => onCheck(e, index, choose, select)}
    />
  )
};

const Wrapper = (props: any, id: string, type: string): React.ReactNode => {
  const {index, children, isAllSelect} = props;

  const isRadio = type === 'radio';

  const _onClick = (e: any) => {

    const ref = isRadio
      ? radioRefMap[id][index]
      : (isAllSelect ? checkboxASRefMap[id] : checkboxRefMap[id][index]);

    if (isRadio) {
      ref._radioClick(e)
    } else {
      isAllSelect ? ref._allSelectClick(e) : ref._checkboxClick(e);
    }

  };

  return (
    <div
      className={cx(pre + 'selector-wrapper')}
      onClick={(e) => _onClick(e)}
    >
      {children}
    </div>
  )
};


const RadioItem = (config: any) => {
  const id = createUUID();

  /* 一系列组件的状态维护 */
  radioSelectMap[id] = radioSelectMap[id] || [];

  /*
  * 返回组件 function
  * */
  const Radio = (props: Props) => {
    config.type = 'radio';
    return Render(props, config, id);
  };

  /*
  * 返回 wrapper 组件
  * */
  const RadioWrapper = (props: any): React.ReactNode => {
    return Wrapper(props, id, 'radio');
  };

  const getChoose = () => radioSelectMap[id].map((item: boolean) => item);

  const getRef = () => radioRefMap[id];

  return {
    Radio, RadioWrapper, getChoose, getRef,
  }
};

const CheckboxItem = (config: any) => {
  const id = createUUID();

  /* 一系列组件的状态维护 */
  checkboxSelectMap[id] = checkboxSelectMap[id] || [];

  /*
  * 返回组件 function
  * */
  const Checkbox = (props: Props) => {
    config.type = 'checkbox';
    return Render(props, config, id);
  };

  /*
  * 返回 wrapper 组件
  * */
  const CheckboxWrapper = (props: any): React.ReactNode => {
    return Wrapper(props, id, 'checkbox');
  };

  const getChoose = () => checkboxSelectMap[id].map((item: boolean) => item);

  const getRef = () => checkboxRefMap[id];

  const getAllSelectStatus = (): 0 | 1 | 2 => _getAllSelectStatus(id);

  const selectAll = (isChoose: boolean) => {
    _setAllCheckboxChoose(id, isChoose)
  };

  return {
    Checkbox, CheckboxWrapper, getChoose, getRef, getAllSelectStatus, selectAll,
  }
};

export {
  RadioItem,
  CheckboxItem,
} ;

/* helper */

/* 获取某一组 checkbox 的全选状态 */
const _getAllSelectStatus = (id: string): 0 | 1 | 2 => {

  const refs = checkboxRefMap[id];
  if (!refs) return 0;

  let status: 0 | 1 | 2 = 0;

  const len = refs.length;
  let firstCheck = true;

  // 初始设置为0, 遇到选择则变成2, 再遇到未选择则变成1, break;
  for (let i = 0; i < len; i++) {
    const ref: ICheckbox | null = refs[i];
    if (ref) {
      const {isErr, isDisabled, isChoose} = ref.getStatus();
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
  }

  return status;
};

const _setAllCheckboxChoose = (id: string, isChoose: boolean): void => {
  const checkboxRefs = checkboxRefMap[id];
  checkboxRefs.forEach((item: any) => {
    if (item) {
      const {isErr, isDisabled} = item.getStatus();
      !isErr && !isDisabled && item.setChoose(isChoose);
    }
  });
};

