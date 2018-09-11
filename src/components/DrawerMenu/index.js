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
var ReactDom = require("react-dom");
var classnames_1 = require("classnames");
var Icon_1 = require("../Icon");
var styles = require("./style.less");
var config_1 = require("../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var defaultState = {
    isShow: false,
    isAutoHidden: true,
    headerConfig: undefined,
    lists: [],
    onHide: undefined,
    onClick: undefined,
};
var DrawerMenu = /** @class */ (function (_super) {
    __extends(DrawerMenu, _super);
    function DrawerMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.state = defaultState;
        return _this;
    }
    DrawerMenu.prototype._show = function (props, initShow) {
        /* 需要检验是不是第一次加载 */
        var isShow = typeof initShow === 'undefined' ? true : initShow;
        this.setState(__assign({}, defaultState, props, { isShow: isShow }));
    };
    DrawerMenu.prototype._hide = function () {
        var onHide = this.state.onHide;
        this.setState({ isShow: false });
        onHide && onHide();
    };
    DrawerMenu.prototype._clickItem = function (e, index, subIndex, item) {
        var itemClick = item.onClick;
        var _a = this.state, isAutoHidden = _a.isAutoHidden, onClick = _a.onClick, lists = _a.lists;
        lists && lists.forEach(function (list) {
            list && list.forEach(function (item) { return item.active = false; });
        });
        if (lists)
            lists[index][subIndex].active = true;
        onClick && onClick(e, index, subIndex, item);
        itemClick && itemClick(e, index, subIndex, item);
        this.setState({ lists: lists });
        isAutoHidden && this._hide();
    };
    DrawerMenu.prototype._renderHeader = function () {
        var headerConfig = this.state.headerConfig;
        if (!headerConfig)
            return;
        var image = headerConfig.image, icon = headerConfig.icon, detail = headerConfig.detail, className = headerConfig.className, style = headerConfig.style, isNoAvatar = headerConfig.isNoAvatar;
        return (React.createElement("div", { className: cx(pre + 'drawer-menu-header', className), style: __assign({}, style) },
            React.createElement("div", { className: cx(pre + 'drawer-menu-header-gradient') },
                !isNoAvatar &&
                    React.createElement("div", { className: cx(pre + 'drawer-menu-avatar'), style: { backgroundImage: image ? "url(" + image + ")" : '' } }, !image &&
                        React.createElement(Icon_1.default, { name: icon ? icon : 'maika', size: .9, color: '#3B4FA0' })),
                React.createElement("div", { className: cx(pre + 'drawer-menu-header-details'), style: { left: isNoAvatar ? '0' : '' } }, detail))));
    };
    DrawerMenu.prototype._renderBody = function () {
        var _this = this;
        var _a = this.state, headerConfig = _a.headerConfig, lists = _a.lists;
        var hasHeader = !!headerConfig;
        return (React.createElement("div", { className: cx(pre + 'drawer-menu-body', pre + (hasHeader ? 'drawer-menu-body-white' : 'drawer-menu-body-blue')), style: { top: headerConfig ? '3.4rem' : '0' } }, lists && lists.map(function (list, index) { return (React.createElement("ul", { key: index, className: cx(pre + 'drawer-menu-list'), style: {
                borderBottomColor: hasHeader ? '#E5E5E5' : '#334489'
            } }, list.map(function (item, subIndex) {
            var icon = item.icon, image = item.image, content = item.content, className = item.className, style = item.style, active = item.active;
            return (React.createElement("li", { key: subIndex, className: cx(pre + 'drawer-menu-item', active && (pre + 'drawer-menu-item-active'), className), style: __assign({}, style), onClick: function (e) { return _this._clickItem(e, index, subIndex, item); } },
                React.createElement("div", { className: cx(pre + 'drawer-menu-item-icon') },
                    icon && React.createElement(Icon_1.default, { name: icon, size: .44, color: hasHeader ? '#3B4FA0' : 'white' }),
                    image && React.createElement("img", { src: image })),
                React.createElement("div", { className: cx(pre + 'drawer-menu-item-content') }, content)));
        }))); })));
    };
    DrawerMenu.prototype.render = function () {
        var _this = this;
        var _a = this.state, headerConfig = _a.headerConfig, isShow = _a.isShow;
        return (React.createElement("div", { className: cx(pre + 'drawer-menu-container', pre + (isShow ? 'drawer-menu-opacity-show' : 'drawer-menu-opacity-hide')), onClick: function () { return _this._hide(); } },
            React.createElement("div", { className: cx(pre + 'drawer-menu-main', pre + (isShow ? 'drawer-menu-slide-show' : 'drawer-menu-slide-hide')), onClick: function (e) { return e.stopPropagation(); } },
                headerConfig && this._renderHeader(),
                this._renderBody())));
    };
    DrawerMenu.defaultProps = {};
    return DrawerMenu;
}(react_1.Component));
/* 标签化使用 */
var container = null;
var div = null;
var getContainer = function (props) {
    if (!container) {
        div = document.createElement('div');
        div.className = pre + 'drawer-menu-wrapper';
        document.body.appendChild(div);
        ReactDom.render(React.createElement(DrawerMenu, __assign({}, props)), div, function () {
            container = this;
        });
    }
    return container;
};
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Container.prototype.componentDidMount = function () {
        this.show(!!this.props.isShow);
    };
    Container.prototype.show = function (initShow) {
        getContainer();
        container && container._show(this.props, initShow);
    };
    Container.prototype.hide = function () {
        container && container._hide();
    };
    Container.prototype.render = function () {
        return (React.createElement("div", { style: { display: 'none' } }));
    };
    Container.defaultProps = {
        isAutoHidden: true,
        isShow: false
    };
    Container.show = function (props) {
        container && container._show(props);
    };
    Container.hide = function () {
        container && container._hide();
    };
    return Container;
}(react_1.Component));
exports.default = Container;
