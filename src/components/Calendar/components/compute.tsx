import {IData, ISimpleDate} from './interface';
import {
  // formatDate,
  // getSimpleDate,
  // getNatureDate,
  findDateIndexOfMap,
  isSameDate,
  // isOverDate,
  walkMonth,
  deleteMap,
} from './helper';

/**
 * 从某年某月开始, 拿出几个月的数据
 */
export const getRenderData = (begin: Date, month: number, { choose, disabled}: any): IData => {
  const copyBegin = new Date( +begin );

  copyBegin.setDate(1);

  const _beginYear = copyBegin.getFullYear();
  const _beginMonth = copyBegin.getMonth();
  // const _beginDate = begin.getDate(); 永远是1....

  const _today = new Date();
  const _simpleToday: ISimpleDate = {
    year: _today.getFullYear(),
    month: _today.getMonth(),
    date: _today.getDate(),
  };

  const endMonth: number = _beginMonth + month;

  const beginDate = new Date(copyBegin);
  const endDate = new Date(
    _beginYear + Math.floor(endMonth / 12),
    endMonth % 12,
    0
  );

  const totalDate = Math.ceil((endDate.getTime() - beginDate.getTime()) / (1000 * 24 * 3600) + 1);

  // tempData 中列出了需要渲染的所有 日期 数据
  const tempData: IData = {
    prev: [], // 前一个月的数据
    current: [], // 实际数据
    next: [], // 后一个月的数据
  };
  // 第一天是星期几?
  const beginDay = beginDate.getDay();
  // 计算实际需要渲染的日期队列, 少调用API省点性能..
  const dateQueue = [];
  // 每个月渲染几天.
  const dateForMonth = [];

  for (let i = 0; i < month; i++) {
    const monthEndDate = (new Date(
      _beginYear + Math.floor((_beginMonth + i) / 11),
      (_beginMonth + i + 1) % 12,
      0)).getDate();

    dateForMonth.push(monthEndDate);

    for (let k = 0; k < monthEndDate; k++) {
      dateQueue.push(k + 1);
    }
  }

  const chooseMap = choose ? [...choose] : null;
  const disabledMap = disabled ? [...disabled] : null;

  let monthTime = -1; // 当前渲染的第几个月

  for (let i = 0; i < totalDate; i++) {
    const date = dateQueue[i];
    if (date === 1) {
      /**
       * 每个月第一天的时候,
       * 1. 将三个数据增加一个月
       * 2. 计算每个数据应该填入的数据
       */
      monthTime += 1;
      tempData.prev.push([]);
      tempData.current.push([]);
      tempData.next.push([]);

      // 计算上个月所剩余的天数.
      let curBeginDay: number = beginDay + tempData.current.reduce((i, t) => i + t.length , 0);
      curBeginDay = curBeginDay % 7;

      const curEndDate: ISimpleDate = walkMonth(copyBegin, monthTime);
      const {year, month} = curEndDate;
      const endDate: number = (new Date(year, month, 0)).getDate();

      // 上个月末, 暂时做成从周日开始, 如果是周一的话, 是 i < k
      // const k = curBeginDay === 0 ? 6 : (beginDay - 1);
      for (let k = curBeginDay - 1; k >= 0; k--) {
        tempData.prev[monthTime].push({ date: endDate - k, isPrev: true });
      }

      // 下个月初, 渲染6个星期 6 * 7 = 42 天 / 月;
      for (let j = 0; j < 42 - dateForMonth[monthTime] - curBeginDay; j++) {
        tempData.next[monthTime].push({ date: j + 1 , isNext: true});
      }
    }

    // 获取当前渲染的是某年某月, 和 map 进行对比
    const totalMonth = _beginMonth + monthTime;
    const year = _beginYear + Math.floor(totalMonth / 12);
    const month = totalMonth % 12;

    const simpleCurDate = {year, month, date};

    // disabled
    let isDisabled = false;
    if (disabledMap) {
      const index = findDateIndexOfMap(simpleCurDate, disabledMap);
      isDisabled = deleteMap(index, disabledMap);
    }

    // choose
    let isChoose = false;
    if (chooseMap) {
      const index = findDateIndexOfMap(simpleCurDate, chooseMap);
      isChoose = deleteMap(index, chooseMap);
    }

    // isToday
    const isToday = isSameDate(_simpleToday, {year, month, date});

    // 今天星期几 ? 0 - 6 (日- 六)
    const day = (beginDay + i) % 7;

    tempData.current[monthTime].push({
      year,
      month,
      date,
      day,
      isDisabled,   // 是否禁用中?
      isChoose,     // 是否选中了的?
      isToday,      // 是否是今天?
      // isDayStart isDayEnd
    });
  }

  return tempData;
};
