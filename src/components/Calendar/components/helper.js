"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// helper
// 格式化时间
exports.formatDate = function (date) {
    if (typeof date === 'string') {
        if (!/\d{4}(-|\/|.)\d{1,2}\1\d{1,2}/.test(date))
            console.warn('日期格式不正确!');
        var tempArr = date.split(/[-/.]/);
        tempArr = tempArr.map(function (item) { return parseInt(item.replace(/^\0/, ''), 10); });
        var y = tempArr[0], m = tempArr[1], d = tempArr[2];
        return new Date(y, m - 1, d);
    }
    else {
        return date;
    }
};
// 将 date 转换成 {year, month, date} 格式
exports.getSimpleDate = function (d) {
    var year = d.getFullYear();
    var month = d.getMonth();
    var date = d.getDate();
    return { year: year, month: month, date: date };
};
// 将 {year, month, date} 转换成 date
exports.getNatureDate = function (d) {
    return new Date(d.year, d.month, d.date);
};
// 发现 Index
exports.findDateIndexOfMap = function (date, map) {
    var len = map.length;
    var result = -1;
    for (var i = 0; i < len; i++) {
        var m = map[i];
        if (date.year === m.year && date.month === m.month && date.date === m.date) {
            result = i;
            break;
        }
    }
    return result;
};
// 发现了index 然后删掉 map
exports.deleteMap = function (index, map) {
    if (index === -1)
        return false;
    map.splice(index, 1);
    return true;
};
// 比对两个simpleDate是否一样
exports.isSameDate = function (d1, d2) {
    return d1.year === d2.year && d1.month === d2.month && d1.date === d2.date;
};
// 看看时间是否越界
exports.isOverDate = function (curTime, compareTime, isBegin) {
    var prefix = isBegin ? 1 : -1;
    if (curTime.year === compareTime.year) {
        return prefix * (compareTime.month - curTime.month) >= 0;
    }
    else {
        return prefix * (compareTime.year - curTime.year) > 0;
    }
};
// 加减 month
exports.walkMonth = function (date, monthStep) {
    var simpleDate = exports.getSimpleDate(date);
    simpleDate.month += monthStep;
    var changeYear = Math.floor(simpleDate.month / 12);
    if (changeYear < 0 || changeYear >= 1) {
        simpleDate.year += changeYear;
        simpleDate.month -= (changeYear * 12);
    }
    return simpleDate;
};
