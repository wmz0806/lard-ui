"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
* 地柜的拿取activeIndex
* */
var recursionGetIndex = function (list, indexList) {
    if (indexList === void 0) { indexList = []; }
    var children = list.children;
    if (!children || !children.length)
        return indexList;
    for (var i = 0; i < children.length; i++) {
        if (children[i].isActive) {
            return recursionGetIndex(children[i], indexList.concat([i]));
        }
    }
    return indexList;
};
/* 获取单一Item的index */
var getItemActiveIndex = function (list) {
    if (!list)
        return -1;
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
        if (list[i].isActive) {
            idx = i;
            break;
        }
    }
    return idx;
};
/* 获取正确的activeIndex */
exports.getActiveIndex = function (data) {
    var firstIdx = getItemActiveIndex(data);
    if (firstIdx === -1)
        return [];
    var list = data[firstIdx];
    return [firstIdx].concat(recursionGetIndex(list, []));
};
/*
 * 通过index设定数据的active状态
 * */
exports.setActive = function (index, data, startIndex) {
    if (startIndex === void 0) { startIndex = 0; }
    data.forEach(function (item, ind) {
        item.isActive = index[startIndex] === ind;
        if (item.children) {
            item.children = exports.setActive(index, item.children, startIndex + 1);
        }
    });
    return data;
};
/*
* 传入data的时候, 组件需要将错乱的active状态设置好.
* */
exports.setData = function (data) {
    var activeIndex = exports.getActiveIndex(data);
    return exports.setActive(activeIndex, data);
};
/*
* 获取当前列需要渲染的数据 (根据activeIndex, 来计算的字列表)
* */
exports.getRenderData = function (data, index) {
    if (index[index.length - 1] === -1)
        return [];
    var result = data;
    for (var i = 0; i < index.length; i++) {
        if (!result || !result[index[i]])
            break;
        result = result[index[i]].children;
    }
    return result;
};
/**
 * 获取当前点击 item 处于的哪条数据
 */
exports.getClickData = function (data, activeIndex, listIndex) {
    var result = data;
    for (var i = 0; i < listIndex; i++) {
        if (!result || !result[activeIndex[i]])
            break;
        result = result[activeIndex[i]].children;
    }
    return result;
};
/**
 * 更新 activeIndex
 */
exports.updateActiveIndex = function (activeIndex, listIndex, index) {
    activeIndex.length = listIndex + 1;
    activeIndex[activeIndex.length - 1] = index;
    return activeIndex;
};
