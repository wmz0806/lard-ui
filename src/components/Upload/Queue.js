"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var classnames_1 = require("classnames");
var Upload_1 = require("./Upload");
var Item_1 = require("./Item");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var Queue = function (props) {
    var className = props.className, _a = props.max, max = _a === void 0 ? 0 : _a, _b = props.images, images = _b === void 0 ? [] : _b, _c = props.srcKey, srcKey = _c === void 0 ? '' : _c, delCallback = props.delCallback, _d = props.uploadProps, uploadProps = _d === void 0 ? {} : _d;
    return (React.createElement("div", { className: cx(pre + "upload-queue", 'f-cb', className) },
        images.map(function (item, i) {
            return (React.createElement(Item_1.default, { key: "upload-item-" + i, src: srcKey ? item[srcKey] : item, close: function () {
                    delCallback && delCallback(i, item);
                } }));
        }),
        max === 0 || images.length < max ?
            React.createElement(Upload_1.default, __assign({ autoShow: false, autoCloseLoading: false }, uploadProps)) : null));
};
exports.default = Queue;
