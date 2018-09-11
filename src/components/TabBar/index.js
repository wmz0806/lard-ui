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
var styles = require("./style.less");
var config_1 = require("../../config");
var Icon_1 = require("../Icon");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var TabBar = /** @class */ (function (_super) {
    __extends(TabBar, _super);
    function TabBar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            list: []
        };
        _this._width = '100%';
        _this._width = 100 / (props.list.length || 1) + "%";
        var list = props.list, noNeedAutoActive = props.noNeedAutoActive;
        if (!list || !list[0])
            return _this;
        if (!noNeedAutoActive)
            list[0].active = true;
        _this.state.list = props.list;
        return _this;
    }
    TabBar.prototype.componentWillReceiveProps = function (props) {
        if (props.list !== this.state.list)
            this.setState({ list: props.list });
    };
    TabBar.prototype.setActiveItem = function (index) {
        var list = this.state.list;
        list.forEach(function (item, idx) { return item.active = index === idx; });
        this.setState({ list: list });
    };
    TabBar.prototype._clickItem = function (e, index, item) {
        var onClick = item.onClick;
        var list = this.state.list;
        // 激活状态的时候不做任何事情
        if (list[index].active)
            return;
        this.setActiveItem(index);
        onClick && onClick(e, index, item);
    };
    TabBar.prototype._renderAbove = function (active, icon, defaultImg, activeImg) {
        var _a = this.props, defaultColor = _a.defaultColor, activeColor = _a.activeColor;
        if (icon)
            return (React.createElement(Icon_1.default, { name: icon, color: active ? activeColor : defaultColor, size: .50 }));
        if (activeImg)
            return (React.createElement("img", { src: active ? activeImg : defaultImg }));
        return '';
    };
    TabBar.prototype._renderNormal = function (item) {
        var active = item.active, icon = item.icon, defaultImg = item.defaultImg, activeImg = item.activeImg, text = item.text;
        var _a = this.props, defaultColor = _a.defaultColor, activeColor = _a.activeColor;
        return [
            React.createElement("div", { className: cx(pre + 'tab-bar-item-above'), key: 1 }, this._renderAbove(active, icon, defaultImg, activeImg)),
            React.createElement("div", { key: 2, className: cx(pre + 'tab-bar-item-lower'), style: { color: active ? activeColor : defaultColor } }, text)
        ];
    };
    TabBar.prototype._renderBig = function (item) {
        var activeColor = this.props.activeColor;
        var icon = item.icon, activeImg = item.activeImg;
        return (icon
            ? React.createElement(Icon_1.default, { name: icon, color: activeColor, size: .75 })
            : React.createElement("img", { src: activeImg }));
    };
    TabBar.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, style = _a.style;
        var list = this.state.list;
        return (React.createElement("ul", { className: cx(pre + 'tab-bar-container', className), style: __assign({}, style) }, list.map(function (item, index) {
            var active = item.active, isBigActiveImg = item.isBigActiveImg, className = item.className, style = item.style;
            return (React.createElement("li", { className: cx(pre + 'tab-bar-item', active && isBigActiveImg && (pre + 'tab-bar-big'), className), style: __assign({ width: _this._width }, style), key: index, onClick: function (e) { return _this._clickItem(e, index, item); } }, (active && isBigActiveImg)
                ? _this._renderBig(item)
                : _this._renderNormal(item)));
        })));
    };
    TabBar.defaultProps = {
        defaultColor: '#999999',
        activeColor: '#3C4EA0',
    };
    return TabBar;
}(react_1.Component));
exports.default = TabBar;
