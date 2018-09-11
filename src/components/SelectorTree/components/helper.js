"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../utils");
var createUUID = utils_1.default.createUUID;
/* 根据 data 状态来增减属性, 初始化判断 */
/**
 * @param {Config[]} data
 * @returns {Config[]}
 */
exports.formatData = function (data, index) {
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var curIndex = index === undefined ? [i] : index.concat([i]);
        item.index = curIndex;
        if (!item.uuid)
            item.uuid = createUUID();
        if (item.children) {
            delete item.isChoose;
            exports.formatData(item.children, curIndex);
        }
        else {
            delete item.isActive;
            delete item.hasChildSelect;
        }
    }
    exports.setHasChildChose(data);
    return data;
};
/* 根据传进来的数据, 设置 hasChildSelect 属性 */
/**
 * @param {Config[]} data
 * @returns {boolean}
 */
exports.setHasChildChose = function (data) {
    if (!data)
        return;
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var children = item.children, isChoose = item.isChoose;
        /* 如果有子节点, 才有可能有 hasChildSelect 属性 */
        if (children) {
            item.hasChildSelect = !!exports.setHasChildChose(children) || getChildChose(children);
        }
        else {
            if (isChoose)
                return true;
        }
    }
};
// setHasChildChose 的辅助函数
var getChildChose = function (data) {
    for (var i = 0; i < data.length; i++) {
        var _a = data[i], isChoose = _a.isChoose, hasChildSelect = _a.hasChildSelect;
        if (isChoose || hasChildSelect)
            return true;
    }
    return false;
};
/**
 * 根据isChoose来判断哪些选项已经被选中了, 初始的时候进行判断.
 * @param {Config[]} data
 * @param {Config[]} chose
 * @returns {Config[]}
 */
exports.getChose = function (data, chose) {
    if (chose === void 0) { chose = []; }
    for (var i = 0; i < data.length; i++) {
        var _a = data[i], isChoose = _a.isChoose, children = _a.children;
        /* 只能是叶子节点被选中 */
        if (children) {
            exports.getChose(children, chose);
        }
        else if (isChoose) {
            chose.push(data[i]);
        }
    }
    return chose;
};
exports.getAllChildChose = function (data, chose) {
    if (chose === void 0) { chose = []; }
    if (data) {
        for (var i = 0; i < data.length; i++) {
            var _a = data[i], isChoose = _a.isChoose, children = _a.children;
            if (children) {
                exports.getAllChildChose(children, chose);
            }
            else if (isChoose) {
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
exports.getSelectItem = function (data, indexArr) {
    var choseItem = data;
    indexArr.forEach(function (idx, choseIdx) {
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
exports.closeItem = function (data, indexArr) {
    var changeData = data;
    for (var i = 0; i < indexArr.length - 1; i++) {
        changeData = data[indexArr[i]].children;
    }
    changeData && changeData.forEach(function (item) { return item.isActive = false; });
};
/**
 * 关闭所有展开的树
 * @param {Config[]} data
 */
exports.closeAll = function (data) {
    data.forEach(function (item) {
        item.isActive = false;
        if (item.children)
            exports.closeAll(item.children);
    });
};
/**
 * 计算第三层树的高度, 下拉动画需要
 * @param {Config[]} data
 * @returns {number}
 */
exports.calcChildTreeHeight = function (data) {
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.isActive && item.children) {
            return 0.5 + 0.96 + Math.ceil(item.children.length / 4) * 0.84;
        }
    }
    return 0;
};
/**
 * 重置data
 * @param {Config[]} data
 */
exports.resetData = function (data) {
    if (!data)
        return;
    for (var i = 0; i < data.length; i++) {
        if (data[i].children) {
            data[i].hasChildSelect = false;
            exports.resetData(data[i].children);
        }
        else {
            data[i].isChoose = false;
        }
    }
};
