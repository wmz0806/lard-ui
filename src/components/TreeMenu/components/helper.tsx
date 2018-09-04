import {BodyConfig} from '../interface/Interface';

/*
* 地柜的拿取activeIndex
* */
const recursionGetIndex = (list: BodyConfig, indexList:number[] = []): number[] => {
  const {children} = list;
  if (!children || !children.length) return indexList;

  for (let i = 0; i < children.length; i++) {
    if (children[i].isActive) {
      return recursionGetIndex(children[i], [...indexList, i]);
    }
  }

  return indexList;
};

/* 获取单一Item的index */
const getItemActiveIndex = (list: BodyConfig[]): number => {
  if (!list) return -1;

  let idx: number = -1;
  for (let i = 0; i < list.length; i++) {
    if (list[i].isActive) {
      idx = i;
      break;
    }
  }
  return idx;
};

/* 获取正确的activeIndex */
export const getActiveIndex = (data: BodyConfig[]): number[] => {
  const firstIdx: number = getItemActiveIndex(data);
  if (firstIdx === -1) return [];

  const list = data[firstIdx];

  return [firstIdx, ...recursionGetIndex(list, [])];
};

/*
 * 通过index设定数据的active状态
 * */
export const setActive = (index: number[], data: BodyConfig[], startIndex: number = 0): BodyConfig[] => {
  data.forEach((item, ind) => {
    item.isActive = index[startIndex] === ind;

    if (item.children) {
      item.children = setActive(index, item.children, startIndex + 1)
    }
  });

  return data;
};

/*
* 传入data的时候, 组件需要将错乱的active状态设置好.
* */
export const setData = (data: BodyConfig[]): BodyConfig[] => {
  const activeIndex = getActiveIndex(data);

  return setActive(activeIndex, data);
};

/*
* 获取当前列需要渲染的数据 (根据activeIndex, 来计算的字列表)
* */
export const getRenderData = (data: BodyConfig[], index: number[]): BodyConfig[] | undefined => {
  if (index[index.length - 1] === -1) return[];

  let result: BodyConfig[] | undefined = data;

  for (let i = 0; i < index.length; i++) {

    if (!result || !result[index[i]]) break;
    result = result[index[i]].children;
  }

  return result;
};

/**
 * 获取当前点击 item 处于的哪条数据
 */
export const getClickData = (data: BodyConfig[], activeIndex: number[], listIndex: number): BodyConfig[] | undefined => {
  let result: BodyConfig[] | undefined = data;

  for (let i = 0; i < listIndex; i++) {
    if (!result || !result[activeIndex[i]]) break;
    result = result[activeIndex[i]].children;
  }

  return result;
};

/**
 * 更新 activeIndex
 */
export const updateActiveIndex = (activeIndex: number[], listIndex: number, index: number): number[] => {
  activeIndex.length = listIndex + 1;
  activeIndex[activeIndex.length - 1] = index;

  return activeIndex;
};
