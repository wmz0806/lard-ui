import {Config} from '../interface/Interface';
import utils from '../../../utils';

const {createUUID} = utils;

/* 根据 data 状态来增减属性, 初始化判断 */
/**
 * @param {Config[]} data
 * @returns {Config[]}
 */
export const formatData = (data: Config[], index?: number[]): Config[] => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    const curIndex = index === undefined ? [i] : [...index, i];

    item.index = curIndex;
    if (!item.uuid) item.uuid = createUUID();

    if (item.children) {
      delete item.isChoose;
      formatData(item.children, curIndex);
    } else {
      delete item.isActive;
      delete item.hasChildSelect;
    }
  }

  setHasChildChose(data);

  return data;
};

/* 根据传进来的数据, 设置 hasChildSelect 属性 */
/**
 * @param {Config[]} data
 * @returns {boolean}
 */
export const setHasChildChose = (data?: Config[]): void | boolean => {
  if (!data) return;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const {children, isChoose} = item;

    /* 如果有子节点, 才有可能有 hasChildSelect 属性 */
    if (children) {
      item.hasChildSelect = !!setHasChildChose(children) || getChildChose(children);
    } else {
      if (isChoose) return true;
    }
  }
};
// setHasChildChose 的辅助函数
const getChildChose = (data: Config[]): boolean => {
  for (let i = 0; i < data.length; i++) {
    const { isChoose, hasChildSelect } = data[i];
    if (isChoose || hasChildSelect) return true;
  }
  return false;
};

/**
 * 根据isChoose来判断哪些选项已经被选中了, 初始的时候进行判断.
 * @param {Config[]} data
 * @param {Config[]} chose
 * @returns {Config[]}
 */
export const getChose = (data: Config[], chose:Config[] = []): Config[] => {

  for (let i = 0; i < data.length; i++) {
    const { isChoose, children } = data[i];

    /* 只能是叶子节点被选中 */
    if (children) {
      getChose(children, chose);
    } else if (isChoose) {
      chose.push(data[i]);
    }
  }

  return chose
};

export const getAllChildChose = (data?: Config[], chose:Config[] = []): Config[] => {
  if (data) {
    for (let i = 0; i < data.length; i++) {
      const {isChoose, children} = data[i];

      if (children) {
        getAllChildChose(children, chose);
      } else if (isChoose) {
        chose.push(data[i]);
      }

    }
  }

  return chose;
};

/**
 * 根据 indexArr 获取当前选中的item
 * @param {Config[]} data
 * @param {number[]} indexArr
 * @returns {any}
 */
export const getSelectItem = (data: Config[], indexArr: number[]): any => {
  let choseItem: any = data;

  indexArr.forEach((idx, choseIdx) => {
    choseItem = choseIdx !== (indexArr.length - 1) ?
      choseItem[idx].children : choseItem[idx];
  });

  return choseItem;
};

/**
 * 关闭某一特定层的树
 * @param {Config[]} data
 * @param {number[]} indexArr
 */
export const closeItem = (data: Config[], indexArr: number[]): void => {
  let changeData: Config[] | undefined = data;
  for (let i = 0; i < indexArr.length - 1; i++) {
    changeData = data[indexArr[i]].children
  }

  changeData && changeData.forEach(item => item.isActive = false);
};

/**
 * 关闭所有展开的树
 * @param {Config[]} data
 */
export const closeAll = (data: Config[]): void => {
  data.forEach(item => {
    item.isActive = false;
    if (item.children) closeAll(item.children);
  })
};

/**
 * 计算第三层树的高度, 下拉动画需要
 * @param {Config[]} data
 * @returns {number}
 */
export const calcChildTreeHeight = (data: Config[]): number => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if(item.isActive && item.children) {
      return 0.5 + 0.96 + Math.ceil(item.children.length / 4) * 0.84;
    }
  }

  return 0;
};

/**
 * 重置data
 * @param {Config[]} data
 */
export const resetData = (data?: Config[]): void => {
  if (!data) return;
  for (let i = 0; i < data.length; i++) {
    if (data[i].children) {
      data[i].hasChildSelect = false;
      resetData(data[i].children);
    } else {
      data[i].isChoose = false;
    }
  }
};
