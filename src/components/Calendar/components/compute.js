"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("./helper");
/**
 * 从某年某月开始, 拿出几个月的数据
 */
exports.getRenderData = function (begin, month, _a) {
    var choose = _a.choose, disabled = _a.disabled;
    var copyBegin = new Date(+begin);
    copyBegin.setDate(1);
    var _beginYear = copyBegin.getFullYear();
    var _beginMonth = copyBegin.getMonth();
    // const _beginDate = begin.getDate(); 永远是1....
    var _today = new Date();
    var _simpleToday = {
        year: _today.getFullYear(),
        month: _today.getMonth(),
        date: _today.getDate(),
    };
    var endMonth = _beginMonth + month;
    var beginDate = new Date(copyBegin);
    var endDate = new Date(_beginYear + Math.floor(endMonth / 12), endMonth % 12, 0);
    var totalDate = Math.ceil((endDate.getTime() - beginDate.getTime()) / (1000 * 24 * 3600) + 1);
    // tempData 中列出了需要渲染的所有 日期 数据
    var tempData = {
        prev: [],
        current: [],
        next: [],
    };
    // 第一天是星期几?
    var beginDay = beginDate.getDay();
    // 计算实际需要渲染的日期队列, 少调用API省点性能..
    var dateQueue = [];
    // 每个月渲染几天.
    var dateForMonth = [];
    for (var i = 0; i < month; i++) {
        var monthEndDate = (new Date(_beginYear + Math.floor((_beginMonth + i) / 11), (_beginMonth + i + 1) % 12, 0)).getDate();
        dateForMonth.push(monthEndDate);
        for (var k = 0; k < monthEndDate; k++) {
            dateQueue.push(k + 1);
        }
    }
    var chooseMap = choose ? choose.slice() : null;
    var disabledMap = disabled ? disabled.slice() : null;
    var monthTime = -1; // 当前渲染的第几个月
    for (var i = 0; i < totalDate; i++) {
        var date = dateQueue[i];
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
            var curBeginDay = beginDay + tempData.current.reduce(function (i, t) { return i + t.length; }, 0);
            curBeginDay = curBeginDay % 7;
            var curEndDate = helper_1.walkMonth(copyBegin, monthTime);
            var year_1 = curEndDate.year, month_1 = curEndDate.month;
            var endDate_1 = (new Date(year_1, month_1, 0)).getDate();
            // 上个月末, 暂时做成从周日开始, 如果是周一的话, 是 i < k
            // const k = curBeginDay === 0 ? 6 : (beginDay - 1);
            for (var k = curBeginDay - 1; k >= 0; k--) {
                tempData.prev[monthTime].push({ date: endDate_1 - k, isPrev: true });
            }
            // 下个月初, 渲染6个星期 6 * 7 = 42 天 / 月;
            for (var j = 0; j < 42 - dateForMonth[monthTime] - curBeginDay; j++) {
                tempData.next[monthTime].push({ date: j + 1, isNext: true });
            }
        }
        // 获取当前渲染的是某年某月, 和 map 进行对比
        var totalMonth = _beginMonth + monthTime;
        var year = _beginYear + Math.floor(totalMonth / 12);
        var month_2 = totalMonth % 12;
        var simpleCurDate = { year: year, month: month_2, date: date };
        // disabled
        var isDisabled = false;
        if (disabledMap) {
            var index = helper_1.findDateIndexOfMap(simpleCurDate, disabledMap);
            isDisabled = helper_1.deleteMap(index, disabledMap);
        }
        // choose
        var isChoose = false;
        if (chooseMap) {
            var index = helper_1.findDateIndexOfMap(simpleCurDate, chooseMap);
            isChoose = helper_1.deleteMap(index, chooseMap);
        }
        // isToday
        var isToday = helper_1.isSameDate(_simpleToday, { year: year, month: month_2, date: date });
        // 今天星期几 ? 0 - 6 (日- 六)
        var day = (beginDay + i) % 7;
        tempData.current[monthTime].push({
            year: year,
            month: month_2,
            date: date,
            day: day,
            isDisabled: isDisabled,
            isChoose: isChoose,
            isToday: isToday,
        });
    }
    return tempData;
};
