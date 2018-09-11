"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var classnames_1 = require("classnames");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var Item = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, children = _a.children, _c = _a.style, style = _c === void 0 ? {} : _c, onClick = _a.onClick;
    return (React.createElement("button", { className: cx(pre + "toolbar-item", className), style: style, onClick: onClick }, children));
};
exports.default = Item;
