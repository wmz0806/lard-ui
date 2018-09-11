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
var react_1 = require("react");
var classnames_1 = require("classnames");
var Icon_1 = require("../../Icon");
var helper_1 = require("./helper");
var Picker_1 = require("../../Picker");
var compute_1 = require("./compute");
var styles = require("../style.less");
var config_1 = require("../../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var Calendar = /** @class */ (function (_super) {
    __extends(Calendar, _super);
    function Calendar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            disabledLeft: false,
            disabledRight: false,
            dateCollection: { current: [], prev: [], next: [] },
        };
        // 开始时间 结束时间 选择时间 禁用时间
        _this._beginDate = new Date();
        _this._endDate = new Date();
        _this._chooseDate = null;
        _this._disabledDate = null;
        // 记录当前 已经渲染 的开始时间和结束时间: **注意**, 当前组件中,由于动画原因, 是实际的日期还要减少一个月份.
        _this._currentBeginDate = null;
        // private _currentEndDate: Date | null = null;
        // 渲染几个月呢?
        _this._renderMonthNum = 3;
        // ref
        _this._contentRef = null;
        // 禁用组件中
        _this._disabled = false;
        // timer
        _this._timer = null;
        _this._picker = null;
        // touch flag
        _this._moveFlag = {
            startX: 0,
            startY: 0,
        };
        _this._width = 1;
        _this.isCheck = false;
        _this.isHorizontal = false;
        var beginDate = props.beginDate, endDate = props.endDate, chooseDate = props.chooseDate, disabledDate = props.disabledDate;
        // 转换时间
        if (beginDate)
            _this._beginDate = helper_1.formatDate(beginDate);
        if (endDate)
            _this._endDate = helper_1.formatDate(endDate);
        if (chooseDate) {
            _this._chooseDate = chooseDate.map(function (item) { return helper_1.getSimpleDate(helper_1.formatDate(item)); });
        }
        if (disabledDate) {
            _this._disabledDate = disabledDate.map(function (item) { return helper_1.getSimpleDate(helper_1.formatDate(item)); });
        }
        return _this;
    }
    Calendar.prototype.componentDidMount = function () {
        // 初始化 width;
        this._width = this._contentRef ? this._contentRef.offsetWidth : 1;
        // 初始化render
        var _chooseDate = this._chooseDate;
        var _disabledDate = this._disabledDate;
        var num = this._renderMonthNum;
        var begin;
        var td = helper_1.getSimpleDate(new Date());
        var bd = helper_1.getSimpleDate(this._beginDate);
        var ed = helper_1.getSimpleDate(this._endDate);
        // 优先级: chooseDate(选第一个), new Date(), beginDate - 1,
        if (_chooseDate && _chooseDate.length) {
            begin = helper_1.getNatureDate(helper_1.walkMonth(helper_1.getNatureDate(_chooseDate[0]), -1));
        }
        else if (!helper_1.isOverDate(td, bd, true) && !helper_1.isOverDate(td, ed, false)) {
            begin = helper_1.getNatureDate(helper_1.walkMonth(new Date(), -1));
        }
        else {
            begin = helper_1.getNatureDate(helper_1.walkMonth(this._beginDate, -1));
        }
        this.setData(begin, num, _chooseDate, _disabledDate);
    };
    Calendar.prototype.componentWillUnmount = function () {
        this._timer && clearTimeout(this._timer);
    };
    Calendar.prototype.changeMonth = function (monthStep, curBegin, curEnd) {
        var beginTime = helper_1.getNatureDate(curBegin);
        var month = (curEnd.month - curBegin.month + 1) + 12 * (curEnd.year - curBegin.year);
        var _chooseDate = this._chooseDate;
        var _disabledDate = this._disabledDate;
        this.setData(beginTime, month, _chooseDate, _disabledDate);
    };
    Calendar.prototype.changeAnimate = function (monthStep) {
        var _this = this;
        if (this._disabled)
            return;
        this._disabled = true;
        // 验证时间超限
        var res = this._validateDate(monthStep);
        if (!res) {
            this._disabled = false;
            return;
        }
        var curEnd = res.curEnd, curBegin = res.curBegin;
        // 150 ms 动画时间, 禁用组件. 动画后执行重新渲染, 然后回来..
        this.setContentTransition(true);
        this.setContentTransform(monthStep < 0 ? '0' : '-66.666666%');
        this._timer = setTimeout(function () {
            _this._disabled = false;
            _this.changeMonth(monthStep, curBegin, curEnd);
            _this.setContentTransition(false);
            _this.setContentTransform('-33.333333%');
        }, 250);
    };
    Calendar.prototype.setContentTransform = function (x) {
        if (!this._contentRef)
            return;
        this._contentRef.style.transform = "translateX(" + x + ")";
    };
    Calendar.prototype.setContentTransition = function (on) {
        if (!this._contentRef)
            return;
        this._contentRef.style.transition = on ? 'all linear .25s' : '';
    };
    // 生成渲染数据, 设定起始时间.
    Calendar.prototype.setData = function (begin, month, choose, disabled) {
        var dateCollection = compute_1.getRenderData(begin, month, { choose: choose, disabled: disabled });
        this._currentBeginDate = new Date(begin.getFullYear(), begin.getMonth(), 1);
        this.setState({ dateCollection: dateCollection });
    };
    Calendar.prototype._validateDate = function (monthStep) {
        // 如果超出了界限, 就算了吧: 注意, 收尾需要 加减一个月
        if (!this._currentBeginDate)
            return false;
        this.setState({ disabledLeft: false, disabledRight: false });
        var curBegin = helper_1.walkMonth(this._currentBeginDate, monthStep);
        var endMonth = curBegin.month + this._renderMonthNum - 1;
        var curEnd = helper_1.getSimpleDate(new Date(curBegin.year + Math.floor(endMonth / 12), endMonth % 12, 1));
        // 如果即将超出界限 更换箭头颜色
        if (helper_1.isOverDate(curBegin, helper_1.walkMonth(this._beginDate, -1), true)) {
            this.setState({ disabledLeft: true });
        }
        else if (helper_1.isOverDate(curEnd, helper_1.walkMonth(this._endDate, 1), false)) {
            this.setState({ disabledRight: true });
        }
        // 这才是超出了真正的界限....
        var _begin = helper_1.walkMonth(this._beginDate, -2);
        var _end = helper_1.walkMonth(this._endDate, 2);
        if (helper_1.isOverDate(curBegin, _begin, true)) {
            return false;
        }
        else if (helper_1.isOverDate(curEnd, _end, false)) {
            return false;
        }
        else {
            return { curBegin: curBegin, curEnd: curEnd };
        }
    };
    // 强制设定选中了某一天 (或者几天)
    Calendar.prototype.setDate = function (choose) {
        this._chooseDate = choose.map(function (item) { return helper_1.getSimpleDate(helper_1.formatDate(item)); });
        var d = choose[0];
        this.setMonth(d || new Date());
        return;
    };
    // 强制设定当前显示到某一个 年, 月
    Calendar.prototype.setMonth = function (date) {
        var d = helper_1.formatDate(date);
        var td = helper_1.getSimpleDate(d);
        // bd 和 ed 需要 加减1, 因为会多渲染一个月
        var bd = helper_1.walkMonth(this._beginDate, -1);
        var ed = helper_1.walkMonth(this._endDate, 1);
        if (helper_1.isOverDate(td, bd, true) || helper_1.isOverDate(td, ed, false)) {
            return console.warn('超限了, 大兄弟');
        }
        var begin = helper_1.getNatureDate(helper_1.walkMonth(d, -1));
        var _chooseDate = this._chooseDate;
        var _disabledDate = this._disabledDate;
        this.setData(begin, 3, _chooseDate, _disabledDate);
    };
    // 前往上一个月
    Calendar.prototype.goPrevMonth = function (date) {
        this.changeAnimate(-1);
    };
    // 前往下一个月
    Calendar.prototype.goNextMonth = function (date) {
        this.changeAnimate(1);
    };
    Calendar.prototype.chooseDate = function (cDate) {
        if (!this.props.isMultiple) {
            // 单选的时候.
            var _a = cDate.year, year = _a === void 0 ? 0 : _a, _b = cDate.month, month = _b === void 0 ? 0 : _b, date = cDate.date;
            this._chooseDate = [{ year: year, month: month, date: date }];
            this.setData(this._currentBeginDate || new Date(), this._renderMonthNum, this._chooseDate, this._disabledDate);
            this.props.onChoose && this.props.onChoose(cDate);
        }
        else {
            // 多选的时候, 还没做 0 0
            console.log(cDate);
        }
    };
    Calendar.prototype._touchStart = function (e) {
        var touch = e.nativeEvent.changedTouches[0];
        this._moveFlag.startX = touch.clientX;
        this._moveFlag.startY = touch.clientY;
    };
    Calendar.prototype._touchMove = function (e) {
        var touch = e.nativeEvent.changedTouches[0];
        var _a = this._moveFlag, startX = _a.startX, startY = _a.startY;
        var moveX = touch.clientX;
        var moveY = touch.clientY;
        if (!this.isCheck) {
            // 写死了.. 10px 之后, 确定移动方向
            if (Math.abs(moveX - startX) >= 10) {
                this.isCheck = true;
                this.isHorizontal = true;
            }
            if (Math.abs(moveY - startY) >= 10) {
                this.isCheck = true;
                this.isHorizontal = false;
            }
        }
        // 竖向滑动, 阻止组件动画
        if (!this.isHorizontal)
            return;
        var movePercent = (startX - moveX) / (this._width);
        var percent = (-1 / 3) - movePercent;
        this.setContentTransform((percent * 100) + '%');
        // 横向移动, 阻止上下滑动
        // TODO 我也不晓得为什么. ... 不用写这个了
        // e.nativeEvent.preventDefault();
    };
    Calendar.prototype._touchEnd = function (e) {
        // 写死了 20 px 以上, 就动
        if (this.isHorizontal) {
            var endX = e.nativeEvent.changedTouches[0].clientX;
            var startX = this._moveFlag.startX;
            var move = endX - startX;
            var moveMonth = move > 0 ? -1 : 1;
            if (Math.abs(move) < 20 || !this._validateDate(moveMonth)) {
                this.setContentTransform('-33.33333333%');
            }
            else {
                this.changeAnimate(moveMonth);
            }
        }
        this._clearFlag();
    };
    Calendar.prototype._chooseMonth = function () {
        this._picker.show();
    };
    Calendar.prototype._clearFlag = function () {
        this._moveFlag = {
            startX: 0,
            startY: 0,
        };
        this.isCheck = false;
        this.isHorizontal = false;
    };
    Calendar.prototype._renderMonth = function (index) {
        var _this = this;
        var dateCollection = this.state.dateCollection;
        var prev = dateCollection.prev, current = dateCollection.current, next = dateCollection.next;
        return (React.createElement("ul", { key: 'month' + index },
            prev[index].map(function (date, index) { return (React.createElement("li", { key: 'prev' + index, className: cx('calendar-prev'), onClick: function () { return _this.goPrevMonth(date); } },
                React.createElement("span", null, date.date))); }),
            current[index].map(function (date, index) { return (React.createElement("li", { key: 'current' + index, className: cx('calendar-current', date.isToday ? 'calendar-today' : '', date.isChoose ? 'calendar-choose' : ''), onClick: function () { return _this.chooseDate(date); } },
                React.createElement("span", null, date.date))); }),
            next[index].map(function (date, index) { return (React.createElement("li", { key: 'next' + index, className: cx('calendar-next'), onClick: function () { return _this.goNextMonth(date); } },
                React.createElement("span", null, date.date))); })));
    };
    Calendar.prototype._renderHeader = function () {
        var _this = this;
        var _a = this.state, disabledLeft = _a.disabledLeft, disabledRight = _a.disabledRight;
        if (!this._currentBeginDate)
            return;
        // 由于渲染的是第二个月, 所以实际显示的是前进一个月.
        var begin = helper_1.walkMonth(this._currentBeginDate, 1);
        return (React.createElement("div", { className: cx(pre + 'calendar-header') },
            React.createElement("div", { className: cx(pre + 'calendar-header-year') },
                React.createElement("span", { onClick: function () { return _this._chooseMonth(); } },
                    begin.year,
                    "\u5E74")),
            React.createElement("div", { className: cx(pre + 'calendar-header-month') },
                React.createElement("div", { className: cx(pre + 'c-h-m-left'), onClick: function () { return _this.goPrevMonth(); } },
                    React.createElement(Icon_1.default, { name: 'fanhui', size: 0.4, color: disabledLeft ? '#ccc' : '#333' })),
                React.createElement("div", null,
                    begin.month + 1,
                    "\u6708"),
                React.createElement("div", { onClick: function () { return _this.goNextMonth(); }, className: cx(pre + 'c-h-m-right') },
                    React.createElement(Icon_1.default, { name: 'xiangyou', size: 0.4, color: disabledRight ? '#ccc' : '#333' })))));
    };
    Calendar.prototype._renderContent = function () {
        var _this = this;
        var dateCollection = this.state.dateCollection;
        var totalMonth = dateCollection.current.length;
        var content = [];
        for (var i = 0; i < totalMonth; i++) {
            content.push(this._renderMonth(i));
        }
        return (React.createElement("div", { className: cx(pre + 'calendar-month-content'), style: { transform: 'translateX(-33.3333%)' }, ref: function (r) { return (_this._contentRef = r); }, onTouchStart: function (e) { return _this._touchStart(e); }, onTouchMove: function (e) { return _this._touchMove(e); }, onTouchEnd: function (e) { return _this._touchEnd(e); }, onTouchCancel: function (e) { return _this._touchEnd(e); } }, content));
    };
    Calendar.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: cx(pre + 'calendar-main') },
            React.createElement("div", { className: cx(pre + 'calendar-container') },
                this._renderHeader(),
                React.createElement("ul", { className: cx(pre + 'calendar-days') }, Array.from('日一二三四五六').map(function (item, index) { return (React.createElement("li", { key: 'day' + index }, item)); })),
                this._renderContent()),
            React.createElement(Picker_1.default, { ref: function (r) { return _this._picker = r; }, title: '请选择', onChange: function (v) {
                    _this.setMonth(v[0] + "-" + v[1] + "-1");
                }, type: 'date', col: 2, min: this._beginDate, max: this._endDate })));
    };
    Calendar.defaultProps = {};
    return Calendar;
}(react_1.Component));
exports.default = Calendar;
