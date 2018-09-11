"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var react_1 = require("react");
var classnames_1 = require("classnames");
var styles = require("../style.less");
var config_1 = require("../../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var TreeMenuHeader = /** @class */ (function (_super) {
    __extends(TreeMenuHeader, _super);
    function TreeMenuHeader(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            data: []
        };
        _this._headerEl = null;
        var count = 0;
        // 最多只能有一个active的
        props.data.forEach(function (item) { return item.isActive && count++; });
        if (count > 1)
            console.warn('只能有一个active的');
        _this.state.data = props.data;
        return _this;
    }
    TreeMenuHeader.prototype.getRef = function () {
        return this._headerEl;
    };
    TreeMenuHeader.prototype.setActive = function (index, isActive) {
        var data = this.state.data;
        data.forEach(function (item) { return item.isActive = false; });
        if (index !== -1)
            data[index].isActive = isActive;
        this.setState({ data: data });
    };
    TreeMenuHeader.prototype.setValue = function (index, value) {
        var data = this.state.data;
        data.forEach(function (item, idx) {
            if (idx === index)
                item.content = value;
        });
        this.setState({ data: data });
    };
    TreeMenuHeader.prototype._clickItem = function (e, index) {
        var data = this.state.data;
        var _a = data[index], isActive = _a.isActive, onClick = _a.onClick;
        var propsClick = this.props.onClick;
        this.setActive(index, !isActive);
        onClick && onClick(e, !isActive);
        propsClick && propsClick(e, index, !isActive);
    };
    TreeMenuHeader.prototype.render = function () {
        var _this = this;
        var data = this.state.data;
        var _a = this.props, style = _a.style, className = _a.className;
        return (React.createElement("ul", { className: cx(pre + 'tree-menu-header', className), ref: function (r) { return _this._headerEl = r; }, style: __assign({}, style) }, data.map(function (_a, index) {
            var content = _a.content, _b = _a.isActive, isActive = _b === void 0 ? false : _b, onClick = _a.onClick, className = _a.className, style = _a.style;
            return (React.createElement("li", { key: index, onClick: function (e) { return _this._clickItem(e, index); }, className: cx(isActive ? (pre + 't-m-h-active') : '', className), style: __assign({ width: 100 / data.length + "%" }, style) },
                React.createElement("div", { className: cx(pre + 't-m-h-text') }, content),
                React.createElement("div", { className: cx(pre + 't-m-h-triangle') },
                    React.createElement("div", { className: cx(pre + 't-m-h-triangle-inner') }))));
        })));
    };
    TreeMenuHeader.defaultProps = {};
    return TreeMenuHeader;
}(react_1.Component));
exports.default = TreeMenuHeader;
