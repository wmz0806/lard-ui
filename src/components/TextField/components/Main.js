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
var index_1 = require("../../Icon/index");
var styles = require("../style.less");
var config_1 = require("../../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            value: '',
            isActive: false,
            isErr: false,
            isShowEncrypt: false,
            isShake: false,
            isDisabled: false,
        };
        _this._textRef = null;
        _this._isNotBlur = false;
        _this._shakeTimer = null;
        _this._scrollTimer = null;
        _this._changeTimer = null;
        _this._isAndroid = /[Aa]ndroid/.test(window.navigator.userAgent);
        var needEncrypt = props.needEncrypt;
        _this.state.isShowEncrypt = !needEncrypt;
        _this.state.isDisabled = !!props.isDisabled;
        return _this;
    }
    default_1.prototype.componentWillUnmount = function () {
        this._shakeTimer && clearTimeout(this._shakeTimer);
        this._scrollTimer && clearTimeout(this._scrollTimer);
    };
    default_1.prototype.getRef = function () {
        return this._textRef;
    };
    default_1.prototype.validate = function (isShowErr) {
        if (isShowErr === void 0) { isShowErr = true; }
        var isSuccess = this._validateValue();
        isShowErr && !isSuccess && this._showErr();
        return isSuccess;
    };
    default_1.prototype.getValue = function () {
        return this.state.value;
    };
    default_1.prototype.setValue = function (value) {
        this.setState({ value: value });
    };
    default_1.prototype.setDisabled = function (isDisabled) {
        this.setState({ isDisabled: isDisabled });
    };
    default_1.prototype._showErr = function () {
        var _this = this;
        var validateType = this.props.validateType;
        this.setState({ isErr: true });
        if (validateType === 'shake') {
            this.setState({ isShake: true });
            this._shakeTimer = setTimeout(function () { return _this.setState({ isShake: false }); }, 400);
        }
    };
    default_1.prototype._validateValue = function () {
        var _a = this.props, validateReg = _a.validateReg, validateFunc = _a.validateFunc;
        var value = this.state.value;
        /* 若是字符串或者RegExp */
        if (validateReg) {
            if (typeof validateReg === 'string') {
                return value.indexOf(validateReg) !== -1;
            }
            else if (/RegExp/.test(Object.prototype.toString.call(validateReg))) {
                return validateReg.test(value);
            }
            else {
                console.warn('validateReg 格式错误, 直接通过验证');
                return true;
            }
        }
        /* 若是验证函数 */
        if (typeof validateFunc === 'function') {
            return validateFunc(value);
        }
        return true;
    };
    /* 失焦时, 由于其优先级高, 仍然需要判断用户的真实意图 */
    default_1.prototype._onBlur = function (e) {
        var _a = this.props, onBlur = _a.onBlur, isBlurValidate = _a.isBlurValidate;
        // 某些时候, 不需要将他失焦
        if (!this._isNotBlur) {
            this.setState({ isActive: false });
            onBlur && onBlur(e, this.state.value);
            /* 若失焦时需要验证 */
            if (isBlurValidate) {
                !this._validateValue() && this._showErr();
            }
            this._textRef.blur();
        }
        else {
            this._textRef.focus();
        }
        this._isNotBlur = false;
        return false;
    };
    default_1.prototype._onFocus = function (e) {
        var _this = this;
        var _a = this.props, onFocus = _a.onFocus, initValue = _a.initValue;
        var value = this.state.value;
        this.setState({
            isActive: true,
            isErr: false,
        });
        if (!this._isNotBlur) {
            if (initValue && !value)
                this.setState({ value: initValue });
            if (!this._isNotBlur)
                onFocus && onFocus(e, this.state.value);
        }
        this._scrollTimer = setTimeout(function () {
            _this._isAndroid && _this._textRef && _this._textRef.scrollIntoViewIfNeeded();
        }, 350);
    };
    default_1.prototype._onChange = function (e) {
        var _this = this;
        var _a = this.props, onChange = _a.onChange, onChangeDelay = _a.onChangeDelay;
        var nativeEvent = e.nativeEvent;
        this.setState({ value: e.target.value }, function () {
            if (onChangeDelay) {
                var now = Date.now();
                if (!_this._changeTimer || (now - _this._changeTimer) >= onChangeDelay) {
                    onChange && onChange(nativeEvent, _this.state.value);
                    _this._changeTimer = now;
                }
            }
            else {
                onChange && onChange(nativeEvent, _this.state.value);
            }
        });
    };
    default_1.prototype._onClick = function (e) {
        var onClick = this.props.onClick;
        onClick && onClick(e, this.state.value);
    };
    default_1.prototype._renderInput = function () {
        var _this = this;
        var _a = this.props, placeholder = _a.placeholder, type = _a.type, maxLength = _a.maxLength, needClearIcon = _a.needClearIcon, needEncrypt = _a.needEncrypt, validateType = _a.validateType, validateMsg = _a.validateMsg, validateColor = _a.validateColor;
        var _b = this.state, value = _b.value, isActive = _b.isActive, isErr = _b.isErr, isShowEncrypt = _b.isShowEncrypt, isDisabled = _b.isDisabled;
        var paddingRight = function () {
            var total = Number(needClearIcon) + Number(needEncrypt);
            if (!total)
                return '0';
            return (56 * total + 20) / 100 + "rem";
        };
        return (React.createElement("div", { className: cx(pre + 't-f-input') },
            React.createElement("input", { ref: function (r) { return _this._textRef = r; }, placeholder: placeholder, type: isShowEncrypt ? type : 'password', pattern: type === 'number' ? '[0-9]*' : '', maxLength: maxLength, disabled: isDisabled, onBlur: function (e) { return _this._onBlur(e); }, onFocus: function (e) { return _this._onFocus(e); }, onChange: function (e) { return _this._onChange(e); }, style: { paddingRight: paddingRight() }, value: value }),
            React.createElement("div", { className: cx(pre + 't-f-input-icon'), onTouchStart: function () {
                    _this._isNotBlur = isActive && true;
                } },
                needClearIcon && this.state.value &&
                    React.createElement("div", { onClick: function () {
                            var onClear = _this.props.onClear;
                            _this.setState({ value: '' });
                            onClear && onClear();
                        } },
                        React.createElement(index_1.default, { name: 'cha', size: .3, color: '#999' })),
                needEncrypt &&
                    React.createElement("div", { onClick: function () { return _this.setState({ isShowEncrypt: !isShowEncrypt }); } },
                        React.createElement(index_1.default, { name: isShowEncrypt ? 'xianshi' : 'yincang', size: .3, color: isShowEncrypt ? '#3B4FA0' : '#999' }))),
            React.createElement("div", { className: cx(pre + 't-f-input-line') },
                React.createElement("div", { className: cx(pre + 't-f-input-line-inner'), style: {
                        transform: "scale(" + (isActive ? '1' : '0') + ")",
                        WebkitTransform: "scale(" + (isActive ? '1' : '0') + ")",
                        backgroundColor: '#3B4FA0',
                    } }),
                React.createElement("div", { className: cx(pre + 't-f-input-line-inner'), style: {
                        transform: "scale(" + (isErr ? '1' : '0') + ")",
                        WebkitTransform: "scale(" + (isErr ? '1' : '0') + ")",
                        backgroundColor: validateColor,
                    } })),
            validateType === 'msg' &&
                React.createElement("div", { className: cx(pre + 't-f-v-msg'), style: {
                        color: validateColor,
                        opacity: isErr ? 1 : 0,
                    } }, validateMsg)));
    };
    default_1.prototype._renderTextArea = function () {
        var _this = this;
        var _a = this.props, placeholder = _a.placeholder, maxLength = _a.maxLength, validateMsg = _a.validateMsg, validateColor = _a.validateColor, overLengthMsg = _a.overLengthMsg, height = _a.height;
        var _b = this.state, value = _b.value, isActive = _b.isActive, isErr = _b.isErr, isDisabled = _b.isDisabled;
        var renderErr = function () {
            if (isErr) {
                return React.createElement("div", { className: cx(pre + 't-f-ta-err') }, validateMsg);
            }
            else if (!isErr && ((maxLength || 0) <= value.length)) {
                return React.createElement("div", { className: cx(pre + 't-f-ta-err') }, overLengthMsg);
            }
            else
                return null;
        };
        return (React.createElement("div", { className: cx(pre + 't-f-ta') },
            React.createElement("textarea", { ref: function (r) { return _this._textRef = r; }, value: value, placeholder: placeholder, disabled: isDisabled, maxLength: maxLength, onChange: function (e) { return _this._onChange(e); }, onBlur: function (e) { return _this._onBlur(e); }, onFocus: function (e) { return _this._onFocus(e); }, style: { height: height ? height : '2.23rem' } }),
            React.createElement("div", { className: cx(pre + 't-f-ta-footer'), style: { color: validateColor }, onTouchStart: function () {
                    _this._isNotBlur = isActive && true;
                } },
                renderErr(),
                maxLength &&
                    React.createElement("div", { className: cx(pre + 't-f-ta-count') },
                        React.createElement("span", { style: { color: maxLength === value.length ? validateColor : '#999' } }, value.length),
                        React.createElement("span", null,
                            " / ",
                            maxLength)))));
    };
    default_1.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, style = _a.style, xmlTag = _a.xmlTag;
        var _b = this.state, isShake = _b.isShake, isDisabled = _b.isDisabled;
        return (React.createElement("div", { className: cx(pre + 'text-field-wrapper', isShake && (pre + 't-f-shake'), className), onClick: function (e) { return _this._onClick(e); }, style: __assign({ opacity: isDisabled ? .3 : 1 }, style) },
            xmlTag === 'input' && this._renderInput(),
            xmlTag === 'textArea' && this._renderTextArea()));
    };
    default_1.defaultProps = {
        placeholder: '',
        initValue: '',
        type: 'text',
        isDisabled: false,
        needClearIcon: false,
        needEncrypt: false,
        isBlurValidate: false,
        validateType: 'msg',
        validateMsg: '信息有误, 请重新输入',
        validateColor: '#E4393C',
        overLengthMsg: '不能再输入了',
        needTextAreaFooter: true,
        xmlTag: 'input',
    };
    return default_1;
}(react_1.Component));
exports.default = default_1;
