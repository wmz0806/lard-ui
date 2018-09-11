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
var Icon_1 = require("../../Icon");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var Header = /** @class */ (function (_super) {
    __extends(Header, _super);
    function Header(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isActive: false,
            curValue: '',
        };
        _this._delayTimer = null;
        _this._blurTimer = null;
        _this._isNotBlur = false;
        _this._isClickClear = false;
        _this._inputRef = null;
        if (props.searchConfig.value)
            _this.state.curValue = props.searchConfig.value;
        return _this;
    }
    Header.prototype.componentWillUnmount = function () {
        this._blurTimer && clearTimeout(this._blurTimer);
        this._delayTimer && clearTimeout(this._delayTimer);
    };
    Header.prototype.setActive = function (isActive) {
        this.setState({ isActive: isActive });
        isActive ? this._inputRef.focus() : this._inputRef.blur();
    };
    Header.prototype.setValue = function (val) {
        this.setState({ curValue: val });
    };
    Header.prototype.getInputRef = function () {
        return this._inputRef;
    };
    Header.prototype._searchClick = function (e) {
        var onClick = this.props.searchConfig.onClick;
        onClick && onClick(e, this.state.curValue);
    };
    Header.prototype._searchFocus = function (e) {
        var searchConfig = this.props.searchConfig;
        var curValue = this.state.curValue;
        if (!searchConfig)
            console.warn('缺少必要的 searchConfig 属性');
        this.setState({ isActive: true });
        var searchValue = searchConfig.searchValue, onFocus = searchConfig.onFocus;
        if (!this._isNotBlur) {
            if (!curValue && searchValue) {
                this._setSearchValue(searchValue);
            }
            onFocus && onFocus(e, curValue);
        }
    };
    Header.prototype._searchBlur = function (e) {
        /* 使用了 touchstart 解决点击事件冲突.. */
        var onBlur = this.props.searchConfig.onBlur;
        // 如果不是点击x触发的 blur 就公开出去
        if (!this._isNotBlur) {
            onBlur && onBlur(e, this.state.curValue);
            this.setState({ isActive: false });
            this._inputRef.blur();
        }
        else {
            this._inputRef.focus();
            this._isClickClear && this._setSearchValue('');
        }
        this._isNotBlur = false;
        this._isClickClear = false;
        return false;
    };
    Header.prototype._searchChange = function (e) {
        var _a = this.props.searchConfig, onChangeDelay = _a.onChangeDelay, onChange = _a.onChange;
        var value = e.target.value;
        this.setState({ curValue: value });
        if (!onChangeDelay) {
            onChange && onChange(e, value);
        }
        else {
            this._delaychange(e, value);
        }
    };
    Header.prototype._searchKeyDown = function (e) {
        var _a = this.props.searchConfig, onSearch = _a.onSearch, onKeyDown = _a.onKeyDown;
        var curValue = this.state.curValue;
        onKeyDown && onKeyDown(e, curValue);
        if (e.keyCode === 13 || e.key === 'Enter') {
            onSearch && onSearch(e, curValue);
            this.setState({ isActive: false });
            this._inputRef.blur();
        }
    };
    Header.prototype._setSearchValue = function (val) {
        var onChange = this.props.searchConfig.onChange;
        this.setState({ curValue: val });
        onChange && onChange(null, val);
    };
    Header.prototype._delaychange = function (e, value) {
        var _a = this.props.searchConfig, onChangeDelay = _a.onChangeDelay, onChange = _a.onChange;
        if (this._delayTimer)
            clearTimeout(this._delayTimer);
        this._delayTimer = setTimeout(function () {
            onChange && onChange(e, value);
        }, onChangeDelay);
    };
    Header.prototype._renderRight = function () {
        var _a = this.props, _b = _a.rightBtnConfig, rightBtnConfig = _b === void 0 ? {} : _b, onCancel = _a.searchConfig.onCancel;
        var _c = this.state, isActive = _c.isActive, curValue = _c.curValue;
        var renderConfig = [];
        if (!Array.isArray(rightBtnConfig)) {
            renderConfig = [rightBtnConfig];
        }
        else {
            renderConfig = rightBtnConfig;
        }
        if (isActive) {
            return (React.createElement("div", { className: cx(pre + 'header-search-right-btn'), onTouchStart: function (e) {
                    onCancel && onCancel(e, curValue);
                } }, "\u53D6\u6D88"));
        }
        return renderConfig.map(function (item, index) {
            var style = item.style, onClick = item.onClick, icon = item.icon, content = item.content, img = item.img;
            return (React.createElement("div", { key: 'right' + index, className: cx(pre + 'header-search-right-btn'), style: __assign({}, style), onClick: function (e) { return onClick && onClick(e); }, onTouchStart: function (e) { return isActive && onCancel && onCancel(e, curValue); } }, icon
                ? React.createElement(Icon_1.default, { name: icon, size: 0.44, style: { lineHeight: '.88rem' } })
                : (content ? content :
                    (img ? React.createElement("img", { src: img }) : ''))));
        });
    };
    Header.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.leftBtnConfig, leftBtnConfig = _b === void 0 ? {} : _b, searchConfig = _a.searchConfig;
        var isActive = this.state.isActive;
        return (React.createElement("div", { className: cx(pre + 'header-container') },
            leftBtnConfig &&
                React.createElement("div", { className: cx(pre + 'header-left-btn', leftBtnConfig.className), onClick: function (e) { return leftBtnConfig.onClick && leftBtnConfig.onClick(e); }, style: __assign({}, leftBtnConfig.style) }, leftBtnConfig.icon
                    ? React.createElement(Icon_1.default, { name: leftBtnConfig.icon, size: 0.44, style: { lineHeight: '.88rem' } })
                    : (leftBtnConfig.content || React.createElement("img", { src: leftBtnConfig.img }))),
            React.createElement("div", { className: cx(pre + 'header-search-container'), style: { left: isActive ? '.3rem' : '.9rem' } },
                React.createElement("div", { className: cx(pre + 'header-search-icon'), onTouchStart: function () { return _this.state.isActive && (_this._isNotBlur = true); } },
                    React.createElement(Icon_1.default, { name: 'sousuo', size: .3, style: { lineHeight: '.6rem' } })),
                React.createElement("form", { onSubmit: function (e) { return e.preventDefault(); }, action: '' },
                    React.createElement("input", { type: "search", ref: function (r) { return _this._inputRef = r; }, placeholder: searchConfig.placeholder, value: this.state.curValue, maxLength: searchConfig.maxLength, onKeyDown: function (e) { return _this._searchKeyDown(e); }, onClick: function (e) { return _this._searchClick(e); }, onFocus: function (e) { return _this._searchFocus(e); }, onBlur: function (e) { return _this._searchBlur(e); }, onChange: function (e) { return _this._searchChange(e); } })),
                this.state.isActive && this.state.curValue && React.createElement("div", { className: cx(pre + 'header-search-clear'), onTouchStart: function () {
                        if (_this.state.isActive) {
                            _this._isNotBlur = true;
                            _this._isClickClear = true;
                        }
                    } },
                    React.createElement(Icon_1.default, { name: 'qingkongwenben', size: .32, color: '#C5C5C5', style: { lineHeight: '.6rem' } }))),
            React.createElement("div", { className: cx(pre + 'header-search-right-btn-group') }, this._renderRight())));
    };
    Header.defaultProps = {};
    return Header;
}(react_1.Component));
exports.default = Header;
