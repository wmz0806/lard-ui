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
var PickerView_1 = require("./PickerView");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
// 选择器组件
var Picker = /** @class */ (function (_super) {
    __extends(Picker, _super);
    function Picker(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            defaultValue: [],
            selectedValue: [],
            animation: 'out',
            show: false,
            title: "",
            col: 0,
            data: []
        };
        _this.resize = function (e) {
            _this.handleClickClose(e);
        };
        _this.handleCancel = _this.handleCancel.bind(_this);
        _this.handleClickOpen = _this.handleClickOpen.bind(_this);
        _this.handleConfirm = _this.handleConfirm.bind(_this);
        _this.handlePickerViewChange = _this.handlePickerViewChange.bind(_this);
        var title = props.title;
        _this.state.title = title;
        return _this;
    }
    Picker.prototype.componentDidMount = function () {
        var _a = this.props, col = _a.col, data = _a.data, value = _a.value;
        this.getInitialize({ col: col, data: data, value: value });
        window.addEventListener('resize', this.resize, false);
    };
    Picker.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.resize, false);
    };
    Picker.prototype.getInitialize = function (options) {
        var type = this.props.type;
        var col = options.col, value = options.value;
        var data = options.data;
        if (type !== 'date' && (!data || !data.length)) {
            console.log("data is not array");
            return;
        }
        var nCol = col;
        if (nCol === undefined) {
            //没有col 自动计算
            if (type === 'basic')
                nCol = data.length;
            else if (type === 'cascade') {
                var recursion_1 = function (o, index) {
                    if (index === void 0) { index = 0; }
                    if (o.children)
                        return recursion_1(o.children[0], ++index);
                    else
                        return index;
                };
                nCol = recursion_1(data[0], 1);
            }
            else if (type === 'date') {
                nCol = 3;
            }
        }
        if (type === 'date' && nCol > 3)
            nCol = 3;
        var nValue = value;
        if (nValue === undefined || !nValue.join()) {
            //没有默认值
            nValue = [];
            if (type === 'basic') {
                data.forEach(function (item) {
                    nValue.push(item.length ? item[0].value : '');
                });
            }
            else if (type === 'cascade') {
                var recursion_2 = function (o, array) {
                    if (array === void 0) { array = []; }
                    array.push(o.value);
                    if (o.children)
                        recursion_2(o.children[0], array);
                };
                recursion_2(data[0], nValue);
            }
            else if (type === 'date')
                nValue = ['1991', '8', '6'];
        }
        if (type === 'date') {
            data = this.getDateData(nCol, nValue);
        }
        this.setState({
            col: nCol,
            defaultValue: nValue,
            selectedValue: nValue,
            data: data,
        });
    };
    Picker.prototype.getDateData = function (nCol, selectedValue) {
        var year = parseInt(selectedValue[0], 10);
        var month = parseInt(selectedValue[1] || 1, 10);
        var day = new Date(year, month, 0).getDate();
        var max = this.props.max;
        var min = this.props.min;
        if (min && max && min > max) {
            max = min;
        }
        var minYear = 1899;
        var maxYear = 9999;
        var minMonth = 1;
        var maxMonth = 12;
        var minDay = 1;
        var maxDay = 31;
        if (min) {
            minYear = min.getFullYear();
            minMonth = min.getMonth() + 1;
            minDay = min.getDate();
        }
        if (max) {
            maxYear = max.getFullYear();
            maxMonth = max.getMonth() + 1;
            maxDay = max.getDate();
        }
        var startYear = year - 20;
        if (startYear < minYear) {
            startYear = minYear;
        }
        if (selectedValue[0] < minYear) {
            selectedValue[0] = "" + minYear;
        }
        else if (selectedValue[0] > maxYear) {
            selectedValue[0] = "" + maxYear;
        }
        var arr = [];
        var yearArr = [];
        var monthArr = [];
        var dayArr = [];
        for (var i = 0; i < 41; i++) {
            if (startYear <= maxYear) {
                yearArr.push({ value: "" + startYear, label: "" + startYear });
            }
            startYear++;
        }
        arr[0] = yearArr;
        if (nCol >= 2) {
            var isMinCheck = (selectedValue[0] == minYear);
            var isMaxCheck = (selectedValue[0] == maxYear);
            if (isMinCheck) {
                if (selectedValue[1] < minMonth)
                    selectedValue[1] = "" + minMonth;
            }
            else if (isMaxCheck) {
                if (selectedValue[1] > maxMonth)
                    selectedValue[1] = "" + maxMonth;
            }
            for (var i = 1; i <= 12; i++) {
                if (isMinCheck && isMaxCheck) {
                    if (i >= minMonth && i <= maxMonth)
                        monthArr.push({ value: "" + i, label: i + "\u6708" });
                }
                else if (isMinCheck) {
                    if (i >= minMonth)
                        monthArr.push({ value: "" + i, label: i + "\u6708" });
                }
                else if (isMaxCheck) {
                    if (i <= maxMonth)
                        monthArr.push({ value: "" + i, label: i + "\u6708" });
                }
                else {
                    monthArr.push({ value: "" + i, label: i + "\u6708" });
                }
            }
            arr[1] = monthArr;
        }
        if (nCol >= 3) {
            var isMinCheck = (selectedValue[0] == minYear && selectedValue[1] == minMonth);
            var isMaxCheck = (selectedValue[0] == maxYear && selectedValue[1] == maxMonth);
            if (isMinCheck) {
                if (selectedValue[2] < minDay)
                    selectedValue[2] = "" + minDay;
            }
            else if (isMaxCheck) {
                if (selectedValue[2] > maxDay)
                    selectedValue[2] = "" + maxDay;
            }
            for (var i = 1; i <= day; i++) {
                if (isMinCheck && isMaxCheck) {
                    if (i >= minDay && i <= maxDay)
                        dayArr.push({ value: "" + i, label: i + "\u65E5" });
                }
                else if (isMinCheck) {
                    if (i >= minDay)
                        dayArr.push({ value: "" + i, label: i + "\u65E5" });
                }
                else if (isMaxCheck) {
                    if (i <= maxDay)
                        dayArr.push({ value: "" + i, label: i + "\u65E5" });
                }
                else {
                    dayArr.push({ value: "" + i, label: i + "\u65E5" });
                }
            }
            arr[2] = dayArr;
        }
        return arr;
    };
    Picker.prototype.handleClickOpen = function (e) {
        var _this = this;
        if (e)
            e.preventDefault();
        this.setState({ show: true });
        // const t = this;
        // css动画
        var timer = setTimeout(function () {
            _this.setState({
                animation: 'in',
            });
            clearTimeout(timer);
        }, 0);
    };
    Picker.prototype.show = function () {
        this.handleClickOpen();
    };
    Picker.prototype.handleClickClose = function (e) {
        var _this = this;
        if (e)
            e.preventDefault();
        this.setState({ animation: 'out' });
        // css动画
        var timer = setTimeout(function () {
            _this.setState({
                show: false,
            });
            clearTimeout(timer);
        }, 300);
    };
    Picker.prototype.handlePickerViewChange = function (newValue) {
        var _a = this.props, onPickerChange = _a.onPickerChange, type = _a.type;
        if (type === 'date') {
            var data = this.getDateData(this.state.col, newValue);
            this.setState({ selectedValue: newValue, data: data });
        }
        else {
            this.setState({ selectedValue: newValue });
        }
        onPickerChange && onPickerChange(newValue);
    };
    Picker.prototype.handleCancel = function () {
        var defaultValue = this.state.defaultValue;
        var onCancel = this.props.onCancel;
        this.handleClickClose();
        this.setState({ selectedValue: defaultValue });
        onCancel && onCancel();
    };
    Picker.prototype.handleConfirm = function () {
        // 点击确认之后的回调
        var selectedValue = this.state.selectedValue;
        var onChange = this.props.onChange;
        this.handleClickClose();
        if (selectedValue) {
            this.setState({ defaultValue: selectedValue });
            onChange && onChange(selectedValue);
        }
    };
    Picker.prototype.getPopupDOM = function () {
        var _a = this.state, show = _a.show, animation = _a.animation, title = _a.title;
        var _b = this.props, cancelText = _b.cancelText, confirmText = _b.confirmText;
        var pickerViewDOM = this.getPickerView();
        if (show) {
            return (React.createElement("div", { className: cx(pre + "picker-content") },
                React.createElement("div", { className: cx([pre + "picker-mask", { hide: animation === 'out' }]), onClick: this.handleCancel }),
                React.createElement("div", { className: cx([pre + "picker-wrap", { show: animation === 'in' }]) },
                    React.createElement("div", { className: cx(pre + "picker-header f-toe") },
                        React.createElement("span", { className: cx(pre + "picker-item " + pre + "header-left"), onClick: this.handleCancel }, cancelText),
                        React.createElement("span", { className: cx(pre + "picker-item " + pre + "header-title") }, title),
                        React.createElement("span", { className: cx(pre + "picker-item " + pre + "header-right"), onClick: this.handleConfirm }, confirmText)),
                    React.createElement("div", { className: cx(pre + "picker-body") }, pickerViewDOM))));
        }
        else
            return null;
    };
    Picker.prototype.getPickerView = function () {
        var type = this.props.type;
        var _a = this.state, selectedValue = _a.selectedValue, col = _a.col, data = _a.data;
        if (this.state.show) {
            return (React.createElement(PickerView_1.default, { col: col, data: data, value: selectedValue, cascade: type === 'cascade', controlled: false, onChange: this.handlePickerViewChange }));
        }
        else
            return null;
    };
    Picker.prototype.render = function () {
        var popupDOM = this.getPopupDOM();
        return (React.createElement("div", { className: cx(pre + "picker-main", this.props.className) },
            popupDOM,
            this.props.children && React.createElement("div", { onClick: this.handleClickOpen }, this.props.children)));
    };
    Picker.defaultProps = {
        children: null,
        className: "",
        style: {},
        title: "",
        type: 'basic',
        cancelText: '取消',
        confirmText: '确定',
        onChange: function () {
            //empty
        },
        onCancel: function () {
            //empty
        },
        onPickerChange: function () {
            //empty
        }
    };
    return Picker;
}(React.Component));
exports.default = Picker;
