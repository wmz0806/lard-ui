import {ISimpleDate} from './interface';

// helper
// 格式化时间
export const formatDate = (date: Date | string): Date => {
  if (typeof date === 'string') {
    if (!/\d{4}(-|\/|.)\d{1,2}\1\d{1,2}/.test(date)) console.warn('日期格式不正确!');

    let tempArr: string[] | number[] = date.split(/[-/.]/);
    tempArr = tempArr.map(
      item => parseInt(item.replace(/^\0/, ''), 10)
    );
    const [y, m, d] = tempArr;
    return new Date(y, m - 1, d);
  } else {
    return date
  }
};

// 将 date 转换成 {year, month, date} 格式
export const getSimpleDate = (d: Date): ISimpleDate => {
  const year = d.getFullYear();
  const month = d.getMonth();
  const date = d.getDate();
  return {year, month, date};
};

// 将 {year, month, date} 转换成 date
export const getNatureDate = (d: ISimpleDate): Date => {
  return new Date(d.year, d.month, d.date)
};

// 发现 Index
export const findDateIndexOfMap = (date: ISimpleDate, map: ISimpleDate[]): number => {
  const len = map.length;
  let result = -1;
  for (let i = 0; i < len; i++) {
    const m = map[i];
    if (date.year === m.year && date.month === m.month && date.date === m.date) {
      result = i;
      break;
    }
  }
  return result;
};

// 发现了index 然后删掉 map
export const deleteMap = (index: number, map: any[]): boolean => {
  if (index === -1) return false;
  map.splice(index, 1);
  return true
};

// 比对两个simpleDate是否一样
export const isSameDate = (d1: ISimpleDate, d2: ISimpleDate): boolean => {
  return d1.year === d2.year && d1.month === d2.month && d1.date === d2.date
};

// 看看时间是否越界
export const isOverDate = (curTime: ISimpleDate, compareTime: ISimpleDate, isBegin: boolean) => {
  const prefix = isBegin ? 1 : -1;

  if (curTime.year === compareTime.year) {
    return prefix * (compareTime.month - curTime.month) >= 0;
  } else {
    return prefix * (compareTime.year - curTime.year) > 0;
  }

};

// 加减 month
export const walkMonth = (date: Date, monthStep: number): ISimpleDate => {
  const simpleDate = getSimpleDate(date);

  simpleDate.month += monthStep;
  const changeYear = Math.floor(simpleDate.month / 12);

  if (changeYear < 0 || changeYear >= 1) {
    simpleDate.year += changeYear;
    simpleDate.month -= (changeYear * 12);
  }

  return simpleDate
};

