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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var classnames_1 = require("classnames");
var TreeMenuHeader_1 = require("./TreeMenuHeader");
var TreeMenuBody_1 = require("./TreeMenuBody");
var styles = require("../style.less");
var config_1 = require("../../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var TreeMenu = /** @class */ (function (_super) {
    __extends(TreeMenu, _super);
    function TreeMenu(props) {
        var _this = _super.call(this, props) || this;
        _this._headerRef = null;
        _this._bodyTop = '';
        _this._bodyActive = false;
        _this._timer = null;
        return _this;
    }
    TreeMenu.prototype.componentDidMount = function () {
        var headerConfig = this.props.headerConfig;
        var headerRef = this._headerRef && this._headerRef.getRef();
        this._bodyTop = headerRef ? headerRef.getBoundingClientRect().bottom + 'px' : '0';
        for (var i = 0; i < headerConfig.length; i++) {
            if (headerConfig[i].isActive) {
                this._showBody(i, true);
                break;
            }
        }
    };
    TreeMenu.prototype.componentWillUnmount = function () {
        this._timer && clearTimeout(this._timer);
    };
    TreeMenu.prototype.hide = function () {
        TreeMenuBody_1.default.hide();
        this._hide();
    };
    TreeMenu.prototype.show = function (index) {
        this._hide();
        this._showBody(index, true);
    };
    TreeMenu.prototype.setHeaderValue = function (index, value) {
        this._headerRef.setValue(index, value);
    };
    TreeMenu.prototype._hide = function () {
        // 只设置状态
        this._headerRef && this._headerRef.setActive(-1, false);
        this._bodyActive = false;
    };
    TreeMenu.prototype._showBody = function (index, isActive) {
        var _this = this;
        var _bodyActive = this._bodyActive;
        var _a = this.props, bodyData = _a.bodyData, isAsync = _a.isAsync, bodyClick = _a.bodyClick;
        var config = {
            top: this._bodyTop,
            data: bodyData[index] || [],
            isAsync: isAsync,
            onClick: bodyClick,
            onHide: function () { _this._hide(); },
        };
        /* 如果本来就没有打开 */
        if (!_bodyActive) {
            if (isActive) {
                TreeMenuBody_1.default.show(config);
            }
        }
        else {
            /* 如果已经是打开状态 */
            TreeMenuBody_1.default.hide();
            if (isActive) {
                this._timer = setTimeout(function () {
                    TreeMenuBody_1.default.show(config);
                }, 200);
            }
        }
        this._headerRef && this._headerRef.setActive(index, isActive);
        this._bodyActive = isActive;
    };
    TreeMenu.prototype._headerClick = function (e, index, isActive) {
        var headerClick = this.props.headerClick;
        var headerRef = this._headerRef && this._headerRef.getRef();
        this._bodyTop = headerRef ? headerRef.getBoundingClientRect().bottom + 'px' : '0';
        headerClick && headerClick(e, index, isActive);
        this._showBody(index, isActive);
    };
    TreeMenu.prototype.render = function () {
        var _this = this;
        var _a = this.props, headerConfig = _a.headerConfig, headerClassName = _a.headerClassName, headerStyle = _a.headerStyle;
        return (React.createElement("div", { className: cx(pre + 'tree-menu') },
            React.createElement(TreeMenuHeader_1.default, { ref: function (r) { return _this._headerRef = r; }, data: headerConfig, onClick: function (e, index, isActive) { return _this._headerClick(e, index, isActive); }, className: headerClassName, style: headerStyle })));
    };
    TreeMenu.defaultProps = {
        bodyData: []
    };
    return TreeMenu;
}(react_1.Component));
exports.default = TreeMenu;
