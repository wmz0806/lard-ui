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
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var NavBar = /** @class */ (function (_super) {
    __extends(NavBar, _super);
    function NavBar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            list: []
        };
        _this._activeRef = null;
        var list = props.list, noNeedAutoActive = props.noNeedAutoActive;
        if (!list || !list[0])
            return _this;
        if (!noNeedAutoActive)
            list[0].active = true;
        _this.state.list = list;
        return _this;
    }
    NavBar.prototype.componentDidMount = function () {
        var isAutoSlide = this.props.isAutoSlide;
        if (isAutoSlide && this._activeRef) {
            this._activeRef.scrollIntoViewIfNeeded();
        }
    };
    NavBar.prototype.componentWillReceiveProps = function (props) {
        if (props.list !== this.state.list)
            this.setState({ list: props.list });
    };
    NavBar.prototype._clickItem = function (e, index) {
        var onClick = this.props.onClick;
        var isActive = this.setActive(index, true);
        var itemClick = this.state.list[index].onClick;
        !isActive && onClick && onClick(e, index, this.state.list[index]);
        !isActive && itemClick && itemClick(e, index);
    };
    NavBar.prototype.setActive = function (index, isAutoScroll) {
        var _this = this;
        var list = this.state.list;
        var isSlide = this.props.isSlide;
        if (list[index].active)
            return true;
        list.forEach(function (item, idx) { return item.active = index === idx; });
        this.setState({ list: list }, function () {
            if (isAutoScroll && isSlide) {
                _this._activeRef.scrollIntoViewIfNeeded();
            }
        });
        return false;
    };
    NavBar.prototype.render = function () {
        var _this = this;
        var list = this.state.list;
        var _a = this.props, isSlide = _a.isSlide, defaultColor = _a.defaultColor, activeColor = _a.activeColor, className = _a.className, style = _a.style;
        return (React.createElement("ul", { className: cx(pre + 'nav-bar-container', className), style: __assign({ color: defaultColor ? defaultColor : '', whiteSpace: isSlide ? 'nowrap' : 'normal', overflowX: isSlide ? 'auto' : 'hidden' }, style) }, list.map(function (item, index) {
            var active = item.active, content = item.content;
            return (React.createElement("li", { key: index, className: cx(pre + 'nav-bar-item', active && (pre + 'nav-bar-active')), onClick: function (e) { return _this._clickItem(e, index); }, style: {
                    width: isSlide ? '' : 100 / (list.length || 1) + "%",
                    color: active && activeColor ? activeColor : '',
                }, ref: function (r) { return active && (_this._activeRef = r); } },
                React.createElement("span", { style: { borderColor: activeColor ? activeColor : '' } }, content)));
        })));
    };
    NavBar.defaultProps = {};
    return NavBar;
}(react_1.Component));
exports.default = NavBar;
