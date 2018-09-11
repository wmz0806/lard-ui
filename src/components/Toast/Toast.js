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
var Icon_1 = require("../Icon");
var classnames_1 = require("classnames");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var empty = function () {
    // empty
};
var Toast = /** @class */ (function (_super) {
    __extends(Toast, _super);
    function Toast(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            show: true,
            hide: false,
        };
        _this.closeTimer = null;
        return _this;
    }
    Toast.prototype.componentDidMount = function () {
        var _this = this;
        if (this.props.time && this.props.time > 0) {
            this.closeTimer = setTimeout(function () {
                _this.close();
            }, this.props.time - 233);
        }
    };
    Toast.prototype.componentWillUnmount = function () {
        this.clearCloseTimer();
        if (!this.state.hide && this.props.onClose)
            this.props.onClose(); // 非正常关闭
    };
    Toast.prototype.clearCloseTimer = function () {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
    };
    Toast.prototype.close = function () {
        var _this = this;
        if (this.state.hide)
            return; // 已经是关闭状态
        this.clearCloseTimer();
        this.setState({ show: false, hide: true });
        this.closeTimer = setTimeout(function () {
            if (_this.props.onRealClose)
                _this.props.onRealClose();
            clearTimeout(_this.closeTimer);
        }, 233);
    };
    Toast.prototype.getIconName = function (type) {
        var names = {
            success: 'success',
            warning: 'warning',
            error: 'close',
            busy: 'fanmang',
            wifi: 'wuwangluo',
            loading: 'jiazaizhong',
        };
        return names[type] || type;
    };
    Toast.prototype.render = function () {
        var _this = this;
        var _a = this.props, type = _a.type, tapToClose = _a.tapToClose, content = _a.content, className = _a.className;
        var _b = this.state, show = _b.show, hide = _b.hide;
        return (React.createElement("div", { className: cx(pre + "toast-content " + className + (type === 'text' ? " " + pre + "toast-text" : '') + (show ? ' a-enter-done' : hide ? ' a-exit-active' : '')), onClick: function () {
                tapToClose && _this.close();
            } },
            type !== 'text' &&
                React.createElement("div", { className: cx(pre + "toast-icon") },
                    React.createElement(Icon_1.default, { name: this.getIconName(type || ''), color: '#fff', size: 0.66, className: cx(type === 'loading' ? pre + "rotate" : '') })),
            React.createElement("div", { className: cx(pre + "toast-name", 'f-wlc2') }, content)));
    };
    Toast.defaultProps = {
        className: "",
        style: {},
        type: 'text',
        time: 0,
        tapToClose: false,
        content: "",
        onClose: empty,
        onRealClose: empty,
    };
    return Toast;
}(React.Component));
exports.default = Toast;
