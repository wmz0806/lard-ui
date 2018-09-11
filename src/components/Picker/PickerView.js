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
var config_1 = require("../../config");
var PickerColumn_1 = require("./PickerColumn");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
// 选择器组件
var PickerView = /** @class */ (function (_super) {
    __extends(PickerView, _super);
    function PickerView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            defaultSelectedValue: [],
        };
        _this.handleValueChange = _this.handleValueChange.bind(_this);
        return _this;
    }
    PickerView.prototype.componentDidMount = function () {
        // picker view 当做一个非受控组件
        var _a = this.props, value = _a.value, controlled = _a.controlled;
        if (!controlled)
            this.setState({ defaultSelectedValue: value });
    };
    PickerView.prototype.handleValueChange = function (newValue, index) {
        // 子组件column发生变化的回调函数
        // 每次值发生变化 都要判断整个值数组的新值
        var defaultSelectedValue = this.state.defaultSelectedValue;
        var _a = this.props, data = _a.data, cascade = _a.cascade, controlled = _a.controlled, value = _a.value, onChange = _a.onChange;
        if (controlled) {
            // 也要算一下正确的值
            var oldValue_1 = value.slice();
            oldValue_1[index] = newValue;
            if (cascade) {
                onChange(this.getNewValue(data, oldValue_1, [], 0));
            }
            else {
                onChange(oldValue_1);
            }
            return;
        }
        var oldValue = defaultSelectedValue.slice();
        oldValue[index] = newValue;
        if (cascade) {
            // 如果级联的情况下
            var newState = this.getNewValue(data, oldValue, [], 0);
            this.setState({ defaultSelectedValue: newState });
            onChange(newState);
        }
        else {
            // 不级联 单纯改对应数据
            if (!controlled) {
                this.setState({ defaultSelectedValue: oldValue });
            }
            onChange(oldValue);
        }
    };
    PickerView.prototype.getColumns = function () {
        var _a = this.props, col = _a.col, data = _a.data, cascade = _a.cascade, value = _a.value, controlled = _a.controlled;
        var defaultSelectedValue = this.state.defaultSelectedValue;
        var result = [];
        if (controlled) {
            if (value.length === 0)
                return;
        }
        else if (defaultSelectedValue.length === 0)
            return;
        var array;
        if (cascade) {
            array = controlled ?
                this.getColumnsData(data, value, [], 0) :
                this.getColumnsData(data, defaultSelectedValue, [], 0);
        }
        else {
            array = data;
        }
        for (var i = 0; i < col; i++) {
            result.push(React.createElement(PickerColumn_1.default, { key: i, index: i, value: controlled ? value[i] : defaultSelectedValue[i], data: array[i], onValueChange: this.handleValueChange }));
        }
        return result;
    };
    // 递归寻找value
    PickerView.prototype.getNewValue = function (tree, oldValue, newValue, deep) {
        // 遍历tree
        var has;
        tree.map(function (item, i) {
            if (item.value === oldValue[deep]) {
                newValue.push(item.value);
                has = i;
            }
        });
        if (has === undefined) {
            has = 0;
            newValue.push(tree[has].value);
        }
        if (tree[has].children)
            this.getNewValue(tree[has].children, oldValue, newValue, deep + 1);
        return newValue;
    };
    // 根据value找索引
    PickerView.prototype.getColumnsData = function (tree, value, hasFind, deep) {
        // 遍历tree
        var has;
        var array = [];
        tree.map(function (item, i) {
            array.push({ label: item.label, value: item.value });
            if (item.value === value[deep])
                has = i;
        });
        // 判断有没有找到
        // 没找到return
        // 找到了 没有下一集 也return
        // 有下一级 则递归
        if (has === undefined)
            return hasFind;
        hasFind.push(array);
        if (tree[has].children)
            this.getColumnsData(tree[has].children, value, hasFind, deep + 1);
        return hasFind;
    };
    PickerView.prototype.render = function () {
        var columns = this.getColumns();
        return (React.createElement("div", { className: cx(pre + "view") },
            React.createElement("div", { className: cx(pre + "view-shade-top") }),
            React.createElement("div", { className: cx(pre + "view-shade-bottom") }),
            columns));
    };
    PickerView.defaultProps = {
        children: null,
        className: "",
        style: {},
        data: [],
        value: [],
        cascade: true,
        col: 0,
        controlled: false,
        onChange: function () {
            //empty
        },
    };
    return PickerView;
}(React.Component));
// PickerView.defaultProps = {
//   prefixCls: 'gsg-picker-view',
//   col: 1,
//   cascade: true,
//   controlled: false,
// };
exports.default = PickerView;
