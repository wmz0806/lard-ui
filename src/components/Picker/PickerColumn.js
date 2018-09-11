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
var zscroller_1 = require("zscroller");
var classnames_1 = require("classnames");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
// picker-view 中的列
var PickerColumn = /** @class */ (function (_super) {
    __extends(PickerColumn, _super);
    function PickerColumn(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.indicator = null;
        _this.content = null;
        _this.itemHeight = 0;
        return _this;
    }
    PickerColumn.prototype.componentDidMount = function () {
        var _this = this;
        // getBoundingClientRect js原生方法
        // 根据变量判断dom是否渲染完毕
        if (this.indicator) {
            this.itemHeight = this.indicator.getBoundingClientRect().height;
            if (this.itemHeight !== 0) {
                // 绑定事件
                this.bindScrollEvent();
                // 列表滚到对应位置
                this.scrollToPosition();
                return;
            }
        }
        setTimeout(function () {
            // 绑定事件
            _this.bindScrollEvent();
            // 列表滚到对应位置
            _this.scrollToPosition();
        }, 16);
    };
    PickerColumn.prototype.componentDidUpdate = function () {
        if (!this.zscroller)
            return;
        this.zscroller.reflow();
        this.scrollToPosition();
    };
    PickerColumn.prototype.componentWillUnmount = function () {
        if (!this.zscroller)
            return;
        this.zscroller.destroy();
    };
    PickerColumn.prototype.bindScrollEvent = function () {
        var _this = this;
        if (!this.indicator)
            return;
        // 绑定滚动的事件
        var content = this.content;
        // getBoundingClientRect js原生方法
        this.itemHeight = this.indicator.getBoundingClientRect().height;
        // zscroll插件
        // http://yiminghe.me/zscroller/examples/demo.html
        this.zscroller = new zscroller_1.default(content, {
            scrollbars: false,
            scrollingX: false,
            snapping: true,
            animationDuration: 133,
            penetrationDeceleration: 0.1,
            minVelocityToKeepDecelerating: 0.5,
            scrollingComplete: function () {
                // 滚动结束 回调
                _this.scrollingComplete();
            },
        });
        // 设置每个格子的高度 这样滚动结束 自动滚到对应格子上
        // 单位必须是px 所以要动态取一下
        this.zscroller.scroller.setSnapSize(0, this.itemHeight);
    };
    PickerColumn.prototype.scrollingComplete = function () {
        // 滚动结束 判断当前选中值
        var top = this.zscroller.scroller.getValues().top;
        var _a = this.props, data = _a.data, value = _a.value, index = _a.index, onValueChange = _a.onValueChange;
        var currentIndex = top / this.itemHeight;
        var floor = Math.floor(currentIndex);
        currentIndex = currentIndex - floor > 0.5 ? floor + 1 : floor;
        var selectedValue;
        if (data[currentIndex]) {
            selectedValue = data[currentIndex].value;
        }
        if (selectedValue && selectedValue !== value) {
            // 值发生变化 通知父组件
            onValueChange(selectedValue, index);
        }
    };
    PickerColumn.prototype.scrollToPosition = function () {
        // 滚动到选中的位置
        var _a = this.props, data = _a.data, value = _a.value;
        for (var i = 0; i < data.length; i++) {
            if (data[i].value === value) {
                this.selectByIndex(i);
                return;
            }
        }
        this.selectByIndex(0);
    };
    PickerColumn.prototype.selectByIndex = function (index) {
        // 滚动到index对应的位置
        var top = this.itemHeight * index;
        this.zscroller.scroller.scrollTo(0, top);
    };
    PickerColumn.prototype.getCols = function () {
        // 根据value 和 address 获取到对应的data
        var _a = this.props, data = _a.data, value = _a.value, index = _a.index;
        return data.map(function (item, i) { return (React.createElement("div", { key: index + "-" + i, className: cx([pre + "col", { selected: data[i].value === value }]) }, data[i].label)); });
    };
    PickerColumn.prototype.render = function () {
        var _this = this;
        var cols = this.getCols();
        return (React.createElement("div", { className: cx(pre + "col-content") },
            React.createElement("div", { className: cx(pre + "list") },
                React.createElement("div", { className: cx(pre + "window") }),
                React.createElement("div", { className: cx(pre + "indicator"), ref: function (e) { return (_this.indicator = e); } }),
                React.createElement("div", { className: cx(pre + "content"), ref: function (e) { return (_this.content = e); } }, cols))));
    };
    PickerColumn.defaultProps = {
        children: null,
        className: "",
        style: {},
        value: "",
        data: [],
        index: 0,
        onValueChange: function () {
            //empty
        },
    };
    return PickerColumn;
}(React.Component));
exports.default = PickerColumn;
