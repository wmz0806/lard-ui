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
var Switch = /** @class */ (function (_super) {
    __extends(Switch, _super);
    function Switch(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            status: _this.props.status || false
        };
        return _this;
    }
    Switch.prototype._click = function (e, status) {
        var _this = this;
        if (this.state.status === 'loading')
            return;
        /* 如果显示的返回了 false , 那么阻止组件自动更改状态 */
        /* 如果返回了Promise, 那么会直接进入等待状态 */
        var onClick = this.props.onClick;
        var res = onClick(e, status);
        if (res === false)
            return;
        if (/[Pp]romise/.test(Object.prototype.toString.call(res)) && res.then) {
            var status_1 = this.state.status;
            this.setState({ status: 'loading' });
            res
                .then(function () { return _this.setStatus(!status_1); })
                .catch(function () { return _this.setStatus(status_1); });
            return;
        }
        this.setStatus(!this.state.status);
    };
    Switch.prototype.setStatus = function (status) {
        this.setState({ status: status });
    };
    Switch.prototype.render = function () {
        var _this = this;
        var status = this.state.status;
        var _a = this.props, className = _a.className, style = _a.style;
        var isLoading = status === 'loading';
        var borderColor = isLoading ? '#7684BD' : (status ? '#3B4FA0' : '#BFBFBF');
        var shadowColor = status ? 'rgba(12, 30, 102, 0.4)' : 'rgba(57, 57, 57, 0.4)';
        return (React.createElement("div", { className: cx(pre + 'switch-container', className), onClick: function (e) { return _this._click(e, status); }, style: __assign({}, style) },
            React.createElement("div", { className: cx(pre + 'switch-inner', isLoading && (pre + 'switch-loading')), style: { width: status ? '1.06rem' : '.6rem' } },
                React.createElement("div", { className: cx(pre + 'switch-dot'), style: { borderColor: borderColor, boxShadow: "0 0 .09rem 0 " + shadowColor } }))));
    };
    Switch.defaultProps = {};
    return Switch;
}(react_1.Component));
exports.default = Switch;
