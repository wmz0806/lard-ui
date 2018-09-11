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
var Icon_1 = require("../../Icon");
var styles = require("../style.less");
var config_1 = require("../../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var Selector = /** @class */ (function (_super) {
    __extends(Selector, _super);
    function Selector(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            allSelectStatus: 0,
            data: []
        };
        _this.state.data = props.data;
        if (props.type === 'checkbox')
            _this.state.allSelectStatus = _this.getAllSelectStatus();
        return _this;
    }
    Selector.prototype.getChoose = function () {
        return this.state.data.map(function (item) { return !!item.isChoose; });
    };
    Selector.prototype.setChoose = function (config) {
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
    Selector.prototype.selectAll = function () {
        var type = this.props.type;
        if (type !== 'checkbox')
            return console.warn('单选选择器不能全选');
        this._allSelect(true);
    };
    Selector.prototype.unselectAll = function () {
        this._allSelect(false);
    };
    Selector.prototype._allSelect = function (isChoose) {
        var data = this.state.data;
        data.forEach(function (item) {
            if (!item.isDisabled && !item.isErr)
                item.isChoose = isChoose;
        });
        this.setState({ data: data });
    };
    Selector.prototype.getAllSelectStatus = function () {
        var type = this.props.type;
        if (type !== 'checkbox')
            console.warn('只有多选框才有全选状态');
        var data = this.state.data;
        var len = data.length;
        var status = 0;
        var firstCheck = true;
        /* 判断全选状态 */
        for (var i = 0; i < len; i++) {
            var _a = data[i], isErr = _a.isErr, isDisabled = _a.isDisabled, isChoose = _a.isChoose;
            if (!isErr && !isDisabled) {
                if (status === 0 && isChoose) {
                    if (firstCheck) {
                        status = 2;
                    }
                    else {
                        status = 1;
                        break;
                    }
                }
                else if (status === 2 && !isChoose) {
                    status = 1;
                    break;
                }
                firstCheck = false;
            }
        }
        return status;
    };
    Selector.prototype._validateAllSelect = function () {
        /*
        * 全选验证
        * 当有disabled 或者 err 的时候, 跳过对他们的验证, 只需要选择完了其他的选项, 就设定全选
        * */
        var _a = this.props, type = _a.type, hasAllSelect = _a.hasAllSelect;
        if (type !== 'checkbox' || !hasAllSelect)
            return;
        var status = this.getAllSelectStatus();
        this.setState({ allSelectStatus: status });
    };
    Selector.prototype._checkboxClick = function (e, index, item) {
        var _a = item.isChoose, isChoose = _a === void 0 ? false : _a, _b = item.isDisabled, isDisabled = _b === void 0 ? false : _b, _c = item.isErr, isErr = _c === void 0 ? false : _c, itemCheck = item.onCheck;
        var data = this.state.data;
        var onCheck = this.props.onCheck;
        if (isDisabled || isErr)
            return;
        data[index].isChoose = !isChoose;
        this.setState({ data: data });
        var select = data.map(function (_a) {
            var isChoose = _a.isChoose;
            return !!isChoose;
        });
        /* 公开事件 */
        onCheck && onCheck(e, index, item, select);
        itemCheck && itemCheck(e, select);
        /* 验证全选 */
        this._validateAllSelect();
    };
    Selector.prototype._clickAll = function (e) {
        var _a = this.state, allSelectStatus = _a.allSelectStatus, data = _a.data;
        var onCheck = this.props.onCheck;
        allSelectStatus === 2 ? this.unselectAll() : this.selectAll();
        var select = data.map(function (_a) {
            var isChoose = _a.isChoose;
            return !!isChoose;
        });
        onCheck && onCheck(e, -1, undefined, select);
        this._validateAllSelect();
    };
    Selector.prototype._radioItemClick = function (e, index, item) {
        var _a = item.isChoose, isChoose = _a === void 0 ? false : _a, _b = item.isDisabled, isDisabled = _b === void 0 ? false : _b, _c = item.isErr, isErr = _c === void 0 ? false : _c, itemCheck = item.onCheck;
        var data = this.state.data;
        var onCheck = this.props.onCheck;
        if (isDisabled || isErr || isChoose)
            return;
        data.forEach(function (item) {
            if (!item.isErr && !item.isDisabled)
                item.isChoose = false;
        });
        data[index].isChoose = true;
        this.setState({ data: data });
        /* 公开事件 */
        onCheck && onCheck(e, index, item);
        itemCheck && itemCheck(e);
    };
    Selector.prototype._renderIcon = function (isRadio, isChoose, isDisabled, isErr) {
        return (React.createElement("div", { className: cx(pre + "selector-box", { active: isChoose }) },
            React.createElement(Icon_1.default, { name: isRadio ? 'danxuan-xuanzhong' : 'duoxuan-xuanzhong', className: cx({ error: isErr, disabled: isDisabled, choose: true }) }),
            React.createElement(Icon_1.default, { name: isRadio ? 'danxuan-weixuanzhong' : 'duoxuan-weixuanzhong', className: cx({ error: isErr, disabled: isDisabled, choose: false }) })));
    };
    Selector.prototype._renderContent = function () {
        var _this = this;
        var _a = this.props, direction = _a.direction, itemHeight = _a.itemHeight, renderItem = _a.renderItem, type = _a.type, _b = _a.hasAllSelect, hasAllSelect = _b === void 0 ? false : _b;
        var _c = this.state, data = _c.data, allSelectStatus = _c.allSelectStatus;
        var isVertical = direction === 'vertical';
        var isRadio = type === 'radio';
        return (React.createElement("ul", { className: cx(pre + 'selector-container'), style: {
                display: isVertical ? 'block' : 'flex',
            } },
            !isRadio && hasAllSelect && isVertical &&
                React.createElement("li", { key: 'all-select', onClick: function (e) { return _this._clickAll(e); }, className: cx(pre + 's-c-item', pre + 's-c-all-select'), style: {
                        width: isVertical ? '100%' : 100 / data.length + "%",
                    } },
                    React.createElement("div", { className: cx(pre + 's-c-icon') },
                        React.createElement("div", { className: cx(pre + 's-c-icon-inner') },
                            React.createElement(Icon_1.default, { name: ['duoxuan-weixuanzhong', 'duoxuan-weiquanxuan', 'duoxuan-xuanzhong'][allSelectStatus], size: 0.4, color: allSelectStatus === 0 ? '#999' : '#3B4FA0' }))),
                    React.createElement("div", { className: cx(pre + 's-c-context') }, hasAllSelect === true ? '全选' : hasAllSelect)),
            data.map(function (item, index) {
                var _a = item.isChoose, isChoose = _a === void 0 ? false : _a, _b = item.isDisabled, isDisabled = _b === void 0 ? false : _b, _c = item.isErr, isErr = _c === void 0 ? false : _c, height = item.height, render = item.render, className = item.className, style = item.style;
                var renderResult = render ? render(index, item) : (renderItem && renderItem(index, item));
                var calcHeight = function () {
                    // 计算行高. 优先级从 子元素 height => 总的height => 渲染的是否是string => 使用自己撑开的高度
                    if (height)
                        return height;
                    if (itemHeight)
                        return itemHeight;
                    if (renderResult && typeof renderResult !== 'object')
                        return '0.88rem';
                    return '';
                };
                return (React.createElement("li", { key: index, onClick: function (e) {
                        isRadio
                            ? _this._radioItemClick(e, index, item)
                            : _this._checkboxClick(e, index, item);
                    }, className: cx(pre + 's-c-item', className), style: __assign({ width: isVertical ? '100%' : 100 / data.length + "%", height: calcHeight() }, style) },
                    React.createElement("div", { className: cx(pre + 's-c-icon') },
                        React.createElement("div", { className: cx(pre + 's-c-icon-inner') }, _this._renderIcon(isRadio, isChoose, isDisabled, isErr))),
                    React.createElement("div", { className: cx(pre + 's-c-context') }, renderResult)));
            })));
    };
    Selector.prototype.render = function () {
        return (React.createElement("div", { className: cx(pre + 'selector-main') }, this._renderContent()));
    };
    Selector.defaultProps = {
        type: 'radio',
        direction: 'vertical',
        hasAllSelect: false,
        data: [],
    };
    return Selector;
}(react_1.Component));
exports.default = Selector;
