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
var Icon_1 = require("../Icon");
var styles = require("./style.less");
var config_1 = require("../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var Index = /** @class */ (function (_super) {
    __extends(Index, _super);
    function Index(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            list: [],
            opacity: 0
        };
        _this._activeIndex = -1;
        _this._itemRef = [];
        _this._itemHeight = [];
        var list = props.list, noNeedAutoActive = props.noNeedAutoActive;
        if (!list)
            return _this;
        /* 缓存到activeIndex 以后用 */
        _this._activeIndex = list.findIndex(function (item) { return item.active === true; });
        if (_this._activeIndex === -1 && !noNeedAutoActive) {
            _this._activeIndex = 0;
        }
        list.forEach(function (item) { return item.active = true; });
        _this.state.list = list;
        return _this;
    }
    Index.prototype.componentDidMount = function () {
        var _this = this;
        this._itemHeight = this._itemRef.map(function (item) { return item.offsetHeight + 'px'; });
        var list = this.state.list;
        list.forEach(function (item, index) { return item.active = _this._activeIndex === index; });
        this.setState({ opacity: 1, list: list });
    };
    Index.prototype.componentWillReceiveProps = function (props) {
        if (props.list !== this.state.list)
            this.setState({ list: props.list });
    };
    Index.prototype._clickItem = function (e, index, active) {
        var onClick = this.props.onClick;
        var list = this.state.list;
        var itemClick = list[index].onClick;
        this.setActiveItem(index);
        onClick && onClick(e, index, list[index]);
        itemClick && itemClick(e, active);
    };
    Index.prototype.setActiveItem = function (index) {
        var list = this.state.list;
        var active = list[index].active;
        if (!active)
            list.forEach(function (item) { return item.active = false; });
        list[index].active = !active;
        this.setState({ list: list });
    };
    Index.prototype.render = function () {
        var _this = this;
        var _a = this.state, list = _a.list, opacity = _a.opacity;
        return (React.createElement("ul", { className: cx(pre + 'accordion-container') }, list.map(function (_a, index) {
            var title = _a.title, content = _a.content, className = _a.className, style = _a.style, active = _a.active;
            return (React.createElement("li", { key: index, ref: function (r) { return _this._itemRef[index] = r; }, className: cx(pre + 'accordion-item', active && 'accordion-item-active', className), style: __assign({}, style, { opacity: opacity, height: active ? _this._itemHeight[index] : '0.98rem' }) },
                React.createElement("div", { className: cx(pre + 'accordion-item-header'), onClick: function (e) { return _this._clickItem(e, index, !active); } },
                    title,
                    React.createElement("div", { className: cx(pre + 'accordion-header-icon'), style: { transform: "rotate(" + (active ? '180deg' : '0deg') + ")" } },
                        React.createElement(Icon_1.default, { name: 'xiangxia', size: .24, color: '#999999' }))),
                React.createElement("div", { className: cx(pre + 'accordion-item-body') }, content)));
        })));
    };
    Index.defaultProps = {};
    return Index;
}(react_1.Component));
exports.default = Index;
