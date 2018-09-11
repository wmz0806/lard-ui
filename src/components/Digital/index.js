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
var classnames_1 = require("classnames");
var Icon_1 = require("../Icon");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var Digital = /** @class */ (function (_super) {
    __extends(Digital, _super);
    function Digital(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            disabled: false,
            disabledLeft: false,
            disabledRight: false,
            value: 0,
        };
        _this.state = _this._getStateData(props);
        return _this;
    }
    Digital.prototype.componentDidMount = function () {
        // empty
    };
    Digital.prototype.componentWillReceiveProps = function (nextProps) {
        var a = this._getStateData(nextProps);
        this.setState(a);
    };
    Digital.prototype._getStateData = function (p) {
        var _a = p.min, min = _a === void 0 ? 0 : _a, _b = p.max, max = _b === void 0 ? Number.MAX_VALUE : _b, oldValue = p.value;
        var value = this.state.value;
        value = oldValue;
        var disabledLeft = (value <= min);
        var disabledRight = (value >= max);
        if (value <= min) {
            value = min;
        }
        if (value >= max) {
            value = max;
        }
        return {
            min: min,
            max: max,
            disabled: p.disabled,
            value: value,
            disabledLeft: disabledLeft,
            disabledRight: disabledRight,
        };
    };
    Digital.prototype._sub = function () {
        if (this.state.disabled || this.state.disabledLeft)
            return;
        var _a = this.props.step, step = _a === void 0 ? 1 : _a;
        var value = this.state.value;
        var _b = this.state, min = _b.min, max = _b.max;
        value -= step;
        this.setState({ value: value < min ? min : value, disabledLeft: value <= min, disabledRight: value >= max });
        this.antiShake();
    };
    Digital.prototype._add = function () {
        if (this.state.disabled || this.state.disabledRight)
            return;
        var _a = this.props.step, step = _a === void 0 ? 1 : _a;
        var value = this.state.value;
        var _b = this.state, min = _b.min, max = _b.max;
        value += step;
        this.setState({ value: value > max ? max : value, disabledLeft: value <= min, disabledRight: value >= max });
        this.antiShake();
    };
    Digital.prototype._change = function (e) {
        if (this.state.disabled)
            return;
        var v = e.target.value;
        var value = '';
        var bv = 0;
        if (v === '-') {
            value = '-';
            bv = 0;
        }
        else {
            value = parseInt(v, 10) || '';
            bv = value;
        }
        var _a = this.state, min = _a.min, max = _a.max;
        this.setState({ value: value, disabledLeft: bv <= min, disabledRight: bv >= max });
        this.antiShake();
    };
    Digital.prototype._blur = function (e) {
        if (this.state.disabled)
            return;
        var value = parseInt(e.target.value, 10) || 0;
        var _a = this.state, disabledLeft = _a.disabledLeft, disabledRight = _a.disabledRight;
        var _b = this.state, min = _b.min, max = _b.max;
        if (value <= min) {
            value = min;
            disabledLeft = true;
        }
        else if (value >= max) {
            value = max;
            disabledRight = true;
        }
        this.setState({ value: value, disabledLeft: disabledLeft, disabledRight: disabledRight });
        this.antiShake();
    };
    Digital.prototype.antiShake = function () {
        var _this = this;
        var onChange = this.props.onChange;
        if (onChange) {
            clearTimeout(this._timer);
            this._timer = setTimeout(function () {
                onChange(_this.state.value || 0);
            }, 333);
        }
    };
    Digital.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, style = _a.style;
        var _b = this.state, disabled = _b.disabled, disabledLeft = _b.disabledLeft, disabledRight = _b.disabledRight, value = _b.value;
        return (React.createElement("div", { className: cx(pre + "digital-box", 'f-cb', className), style: style },
            React.createElement("button", { className: cx(pre + "digital-left", 'f-fl', { disabled: disabled || disabledLeft }), onClick: function () { return _this._sub(); } },
                React.createElement(Icon_1.default, { name: 'jian', size: 0, color: '' })),
            React.createElement("input", { type: "tel", className: cx(pre + "digital-input", 'f-fl'), disabled: disabled, value: value, onChange: function (e) { return _this._change(e); }, onBlur: function (e) { return _this._blur(e); } }),
            React.createElement("button", { className: cx(pre + "digital-right", 'f-fl', { disabled: disabled || disabledRight }), onClick: function () { return _this._add(); } },
                React.createElement(Icon_1.default, { name: 'jia', size: 0, color: '' }))));
    };
    Digital.defaultProps = {
        className: "",
        style: {},
        disabled: false,
        min: 0,
        max: Number.MAX_VALUE,
        value: 0,
        step: 1,
    };
    return Digital;
}(React.Component));
exports.default = Digital;
