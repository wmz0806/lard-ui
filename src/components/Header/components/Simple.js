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
var styles = require("../style.less");
var config_1 = require("../../../config");
var Icon_1 = require("../../Icon");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var defaultIcon = 'fanhui';
var Header = function (props) {
    var leftBtnConfig = props.leftBtnConfig, _a = props.titleConfig, titleConfig = _a === void 0 ? {} : _a, _b = props.rightBtnConfig, rightBtnConfig = _b === void 0 ? [] : _b, style = props.style, className = props.className;
    /* 若是有leftConfig 但是没有内容, 就使用默认icon */
    if (leftBtnConfig) {
        var icon = leftBtnConfig.icon, content = leftBtnConfig.content, img = leftBtnConfig.img;
        if (!icon && !content && !img) {
            leftBtnConfig.icon = defaultIcon;
        }
    }
    var titlePadding = 0.88;
    if (rightBtnConfig.length) {
        titlePadding = titlePadding * rightBtnConfig.length;
    }
    return (React.createElement("div", { className: cx(pre + 'header-container', className), style: __assign({}, style) },
        leftBtnConfig &&
            React.createElement("button", { className: cx(pre + 'header-left-btn', leftBtnConfig.className), onClick: function (e) { return leftBtnConfig.onClick && leftBtnConfig.onClick(e); }, style: __assign({}, leftBtnConfig.style) }, leftBtnConfig.icon
                ? React.createElement(Icon_1.default, { name: leftBtnConfig.icon, size: 0.34 })
                : (leftBtnConfig.content || React.createElement("img", { src: leftBtnConfig.img }))),
        React.createElement("div", { className: cx(pre + 'header-title', titleConfig.className), style: __assign({}, titleConfig.style), onClick: function (e) { return titleConfig.onClick && titleConfig.onClick(e); } }, titleConfig.img
            ? React.createElement("img", { src: titleConfig.img })
            : React.createElement("h4", { className: cx('f-toe'), style: { padding: "0 " + titlePadding + "rem" } }, titleConfig.content ? titleConfig.content : props.children)),
        React.createElement("div", { className: cx(pre + 'header-right-group-btn') }, rightBtnConfig.map(function (btn, index) { return (React.createElement("button", { key: index, className: cx(pre + 'header-right-btn', btn.className), style: __assign({}, btn.style), onClick: function (e) { return btn.onClick && btn.onClick(e); } }, btn.icon
            ? React.createElement(Icon_1.default, { name: btn.icon, size: 0.34 })
            : (btn.content || React.createElement("img", { src: btn.img })))); }))));
};
exports.default = Header;
exports.setDefaultLeftIcon = function (name) {
    defaultIcon = name;
};
