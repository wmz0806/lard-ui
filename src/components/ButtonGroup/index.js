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
var GroupButton = /** @class */ (function (_super) {
    __extends(GroupButton, _super);
    function GroupButton(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            data: [],
            isAllChoose: false,
        };
        _this.state.data = props.data;
        _this.state.isAllChoose = _this.getAllSelectStatus();
        return _this;
    }
    GroupButton.prototype.setChoose = function (config) {
        var data = this.state.data;
        if (typeof config === 'number') {
            data.forEach(function (item) { return item.isChoose = false; });
            data[config].isChoose = true;
        }
        else if (Array.isArray(config)) {
            data.forEach(function (item, index) { return item.isChoose = config[index]; });
        }
        this.setState({ data: data });
    };
    GroupButton.prototype.getChoose = function () {
        return this.state.data.map(function (item) { return !!item.isChoose; });
    };
    GroupButton.prototype.selectAll = function () {
        var type = this.props.type;
        if (type !== 'multiple')
            return console.warn('单选button不能全选');
        this._allSelect(true);
    };
    GroupButton.prototype.unselectAll = function () {
        this._allSelect(false);
    };
    GroupButton.prototype.getAllSelectStatus = function () {
        var data = this.state.data;
        return data.every(function (item) { return !!item.isDisabled || !!item.isChoose; });
    };
    GroupButton.prototype._allSelect = function (isChoose) {
        var data = this.state.data;
        data.forEach(function (item) {
            if (!item.isDisabled)
                item.isChoose = isChoose;
        });
        this.setState({ data: data });
    };
    GroupButton.prototype._clickAll = function (e) {
        var isAllChoose = this.state.isAllChoose;
        this._allSelect(!isAllChoose);
        this.setState({ isAllChoose: !isAllChoose });
    };
    GroupButton.prototype._itemClick = function (e, index, isChoose, isDisabled) {
        if (isDisabled)
            return;
        var _a = this.props, type = _a.type, onClick = _a.onClick, canCancel = _a.canCancel;
        var data = this.state.data;
        var isSingle = type === 'single';
        var chooseItem = data[index];
        if (isSingle) {
            if (!canCancel) {
                if (isChoose)
                    return;
                data.forEach(function (item) { return item.isChoose = false; });
                data[index].isChoose = true;
            }
            else {
                data.forEach(function (item) { return item.isChoose = false; });
                data[index].isChoose = !isChoose;
            }
        }
        else {
            data[index].isChoose = !isChoose;
            this.setState({ isAllChoose: this.getAllSelectStatus() });
        }
        var select = data.map(function (item) { return item.isChoose; });
        onClick && onClick(e, index, select, chooseItem);
        chooseItem.onClick && chooseItem.onClick(e, select, chooseItem);
        this.setState({ data: data });
    };
    GroupButton.prototype._renderContent = function () {
        var _this = this;
        var _a = this.state, data = _a.data, isAllChoose = _a.isAllChoose;
        var _b = this.props, col = _b.col, type = _b.type, allSelect = _b.allSelect;
        if (!data.length)
            return;
        var isSingle = type === 'single';
        return (React.createElement("ul", { className: cx(pre + 'b-g-container') },
            !isSingle && allSelect &&
                React.createElement("li", { key: 'all-select', onClick: function (e) { return _this._clickAll(e); }, style: { width: col ? 100 / col + "%" : '' } },
                    React.createElement("div", { className: cx(pre + 'b-g-text', isAllChoose && 'b-g-active'), style: { borderRadius: '.06rem' } }, allSelect)),
            data.map(function (item, index) {
                var content = item.content, _a = item.isChoose, isChoose = _a === void 0 ? false : _a, _b = item.isDisabled, isDisabled = _b === void 0 ? false : _b, className = item.className, style = item.style;
                return (React.createElement("li", { key: index, onClick: function (e) { return _this._itemClick(e, index, isChoose, isDisabled); }, className: className, style: __assign({ width: col ? 100 / col + "%" : '' }, style) },
                    React.createElement("div", { className: cx(pre + 'b-g-text', isChoose && 'b-g-active', isDisabled && 'b-g-disabled'), style: {
                            borderRadius: isSingle ? '.6rem' : '.06rem'
                        } }, content)));
            })));
    };
    GroupButton.prototype.render = function () {
        var _a = this.props, className = _a.className, style = _a.style;
        return (React.createElement("div", { className: cx(pre + 'button-group-main', className), style: __assign({}, style) }, this._renderContent() || ''));
    };
    GroupButton.defaultProps = {
        type: 'single',
        allSelect: '全部'
    };
    return GroupButton;
}(react_1.Component));
exports.default = GroupButton;
