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
var styles = require("./style.less");
var config_1 = require("../../config");
// css 前缀
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var SliderBar = /** @class */ (function (_super) {
    __extends(SliderBar, _super);
    function SliderBar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            transition: false,
            isLeft: false,
            // 若有弹层, 左侧和右侧弹层的内容和状态
            leftBtnPop: '',
            rightBtnPop: '',
            rightBtnPopActive: false,
            leftBtnPopActive: false,
        };
        // 禁用?
        _this._isDisable = false;
        // 总宽度,
        _this._width = 0;
        // 是否需要自动完成? 在 大于 0.3 而且 < 1的时候需要
        _this._needAutoFinish = 0;
        //  是否是需要重置,  (激活状态保存稍后将要保存的transalte) 激活状态的移动距离
        _this._needRest = false;
        _this._willRememberTransform = 0;
        _this._endTransform = 0;
        // timeout flag
        _this._timer = null;
        // elements
        _this._container = null;
        _this._leftBtn = null;
        _this._rightBtn = null;
        _this._leftBtnPop = null;
        _this._rightBtnPop = null;
        // 弹出层回调
        _this._popBtnCb = null;
        // 标志位们
        _this._flag = {
            checkFlag: false,
            isHorizontal: false,
            isHidden: true,
        };
        // 移动距离,
        _this._move = {
            startX: 0,
            startY: 0,
            moveY: 0,
            moveX: 0,
        };
        // 左侧|右侧极限距离,
        _this._leftWidth = props.leftBtn ? reduceWidth(props.leftBtn) : 0;
        _this._rightWidth = props.rightBtn ? -reduceWidth(props.rightBtn) : 0;
        // 子按钮, 在不同的宽度下, translate 的距离不一样, 用数组来表示
        _this._leftMoveDistance = calcBtnDistance(props.leftBtn || [], 1);
        _this._rightMoveDistance = calcBtnDistance(props.rightBtn || [], -1);
        return _this;
    }
    SliderBar.prototype.componentDidMount = function () {
        this._width = this._container && this._container.offsetWidth;
        // 初始需要隐藏按钮, 滑动的时候再出来
        this._setBtnOpacity('0');
    };
    SliderBar.prototype.componentWillUnmount = function () {
        this._timer && clearTimeout(this._timer);
    };
    SliderBar.prototype._onTouchStart = function (e) {
        var touch = e.nativeEvent.changedTouches[0];
        this._move.startX = touch.clientX;
        this._move.startY = touch.clientY;
    };
    SliderBar.prototype._onTouchMove = function (e) {
        var _this = this;
        var activePixel = this.props.activePixel || 10;
        var touch = e.nativeEvent.changedTouches[0];
        this._move.moveX = touch.clientX;
        this._move.moveY = touch.clientY;
        if (this._flag.isHidden) {
            this._flag.isHidden = false;
            this._setBtnOpacity('1');
        }
        if (!this._flag.checkFlag) {
            if (Math.abs(this._move.moveX - this._move.startX) > activePixel) {
                this._flag.checkFlag = true;
                this._flag.isHorizontal = true;
            }
            if (Math.abs(this._move.moveY - this._move.startY) > activePixel) {
                this._flag.checkFlag = true;
                this._flag.isHorizontal = false;
            }
            return;
        }
        if (!this._flag.isHorizontal) {
            return;
        }
        var x = this._move.moveX - this._move.startX;
        var percent = (100 * x) / (this._width || 10);
        if (this._endTransform) {
            percent += this._endTransform;
        }
        // 移动方向的极限距离? 需要设置的btns?
        var changeWidth = percent > 0 ? '_leftWidth' : '_rightWidth';
        var changeBtn = percent > 0 ? 'leftBtn' : 'rightBtn';
        var changeBtnDistance = percent > 0 ? '_leftMoveDistance' : '_rightMoveDistance';
        // 左侧还是右侧? 设置btn的 zIndex
        if (this.state.isLeft !== (percent > 0)) {
            this.setState({ isLeft: percent > 0 });
        }
        if (Math.abs(percent) > Math.abs(this[changeWidth])) {
            percent = this[changeWidth];
            this._needAutoFinish = 0;
        }
        else {
            this._needAutoFinish = percent > 0 ? 1 : -1;
        }
        // 如果 大于 总宽度的30% (或者放松为Props) 那么让他处于激活状态, 并自动完成
        if (Math.abs(percent) > (this.props.autoFinishPercent || 0.3) * Math.abs(this[changeWidth])) {
            this._needRest = false;
            this._willRememberTransform = this[changeWidth];
        }
        else {
            this._needAutoFinish = 0;
            this._needRest = true;
        }
        var distance = this[changeBtnDistance].map(function (item) { return item * 100 * (percent / Math.abs(_this[changeWidth])); });
        this._setContainer(percent);
        this._setBtn(changeBtn, distance);
    };
    SliderBar.prototype._onTouchEnd = function (e) {
        this._flag.checkFlag = false;
        this._flag.isHorizontal = false;
        // 如果运动距离过小, 判断他是click, 也不触发 autoFinish
        var x = e.nativeEvent.changedTouches[0].clientX;
        var move = this._move.startX - x;
        if (Math.abs(move) < 20)
            this._needAutoFinish = 0;
        // 如果有运动距离, 而且有_endTransform, 而且判断用户是想要往回收缩按钮, 就收回
        var autoResetPixel = this.props.autoFinishPercent || 20;
        if (Math.abs(move) > autoResetPixel && this._endTransform) {
            if ((move > 0 && this._endTransform > 0) || (move < 0 && this._endTransform < 0)) {
                return this.reset();
            }
        }
        // 在结束的时候如果不是激活状态, 清空. 如果是, 记录移动的距离
        if (!this._needRest) {
            this.autoFinish(this._needAutoFinish);
            this._endTransform = this._willRememberTransform;
        }
        else {
            this.reset();
        }
    };
    SliderBar.prototype.reset = function () {
        var _this = this;
        this._needRest = false;
        this._needAutoFinish = 0;
        this._willRememberTransform = 0;
        this._endTransform = 0;
        this.state.rightBtnPopActive = false;
        this.state.leftBtnPopActive = false;
        // 归位, 设置transition
        this._setContainer(0);
        this._setBtn('all', []);
        this.setState({ transition: true });
        this._isDisable = true;
        this._timer = setTimeout(function () {
            _this.setState({ transition: false });
            _this._flag.isHidden = true;
            _this._setBtnOpacity('0');
            _this._isDisable = false;
        }, 150);
    };
    SliderBar.prototype.autoFinish = function (slide) {
        var _this = this;
        // 用户已经滑动超出边界 不需要自动完成了
        if (!slide)
            return;
        // 在用户滑动到大于某一个百分比的时候, 按钮自动完成
        // 自动完成过程中, 整个cell处于disable状态
        this._isDisable = true;
        var btnDistance = slide === 1 ? '_leftMoveDistance' : '_rightMoveDistance';
        this._setContainer(slide === 1 ? this._leftWidth : this._rightWidth);
        this._setBtn(slide === 1 ? 'leftBtn' : 'rightBtn', this[btnDistance].map(function (item) { return slide * item * 100; }));
        this.setState({ transition: true });
        this._timer = setTimeout(function () {
            _this._isDisable = false;
            _this.setState({ transition: false });
        }, 150);
    };
    // 弹出确认蒙层
    SliderBar.prototype.popButton = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.content, content = _c === void 0 ? '' : _c, _d = _b.cb, cb = _d === void 0 ? null : _d;
        if (this._endTransform > 0) {
            // left
            this.setState({
                leftBtnPop: content,
                leftBtnPopActive: true,
            });
        }
        else if (this._endTransform < 0) {
            // right
            this.setState({
                rightBtnPop: content,
                rightBtnPopActive: true,
            });
        }
        this._popBtnCb = cb;
    };
    SliderBar.prototype._setContainer = function (percent) {
        if (!this._container)
            return;
        setTransform(this._container, percent);
    };
    SliderBar.prototype._setBtn = function (type, arr) {
        if (!this._leftBtn || !this._rightBtn)
            return;
        var renderDom;
        var leftLi = Array.from(this._leftBtn.getElementsByTagName('li'));
        var rightLi = Array.from(this._rightBtn.getElementsByTagName('li'));
        switch (type) {
            case 'leftBtn':
                renderDom = leftLi;
                break;
            case 'rightBtn':
                renderDom = rightLi;
                break;
            default:
                renderDom = leftLi.concat(rightLi);
        }
        renderDom.forEach(function (dom, index) {
            setTransform(dom, arr[index] || 0);
        });
    };
    SliderBar.prototype._setBtnOpacity = function (opacity) {
        if (!this._leftBtn || !this._rightBtn || !this._leftBtnPop || !this._rightBtnPop)
            return;
        this._leftBtn.style.opacity = opacity;
        this._rightBtn.style.opacity = opacity;
        this._leftBtnPop.style.opacity = opacity;
        this._rightBtnPop.style.opacity = opacity;
    };
    SliderBar.prototype._renderBtn = function (buttons, className, ref) {
        var _this = this;
        var zIndex = (ref === '_leftBtn' && this.state.isLeft) || (ref !== '_leftBtn' && !this.state.isLeft) ? 1 : 0;
        return (React.createElement("ul", { className: cx(pre + className), ref: function (r) { return (_this[ref] = r); }, style: { zIndex: zIndex } }, buttons.map(function (btn, index) { return (React.createElement("li", { style: {
                width: btn.width || '10%',
                color: btn.color,
                backgroundColor: btn.backColor,
                transition: _this.state.transition ? 'all linear .15s' : '',
                WebkitTransition: _this.state.transition ? 'all linear .15s' : '',
            }, key: index, onClick: function () { return btn.cb && btn.cb(); } }, btn.content)); })));
    };
    SliderBar.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { onTouchStart: function (e) { return !_this._isDisable && _this._onTouchStart(e); }, onTouchMove: function (e) { return !_this._isDisable && _this._onTouchMove(e); }, onTouchEnd: function (e) { return !_this._isDisable && _this._onTouchEnd(e); }, onTouchCancel: function (e) { return !_this._isDisable && _this._onTouchEnd(e); }, className: cx(pre + 'slider-bar-main', this.props.className) },
            React.createElement("div", { className: cx(pre + 'slider-bar-left-pop'), style: {
                    width: this._leftWidth + '%',
                    left: this.state.leftBtnPopActive ? '0' : '-100%'
                }, ref: function (r) { return (_this._leftBtnPop = r); }, onClick: function () { return _this._popBtnCb && _this._popBtnCb(); } }, this.state.leftBtnPop),
            this._renderBtn(this.props.leftBtn || [], 'slider-bar-left', '_leftBtn'),
            React.createElement("div", { className: cx(pre + "slider-bar-container"), style: { transition: this.state.transition ? 'all linear .2s' : '' }, ref: function (r) { return (_this._container = r); }, onClick: function () { return _this.props.isClickRest && _this.reset(); } }, this.props.children),
            this._renderBtn(this.props.rightBtn || [], 'slider-bar-right', '_rightBtn'),
            React.createElement("div", { className: cx(pre + 'slider-bar-right-pop'), style: {
                    width: (-this._rightWidth) + '%',
                    right: this.state.rightBtnPopActive ? '0' : '-100%'
                }, ref: function (r) { return (_this._rightBtnPop = r); }, onClick: function () { return _this._popBtnCb && _this._popBtnCb(); } }, this.state.rightBtnPop)));
    };
    SliderBar.defaultProps = {
        className: '',
        leftBtn: [],
        rightBtn: [],
        activePixel: 10,
        autoResetPixel: 20,
        children: '',
        autoFinishPercent: 0.3,
        isClickRest: true
    };
    return SliderBar;
}(React.Component));
exports.default = SliderBar;
// helper
var calcBtnDistance = function (buttons, direction) {
    /*
     * 第一个 0,
     * 第二个: 100% * first / second
     * 第三个: 100% * (first + second) / third
     * */
    var result = [];
    var prevTotal = 0;
    buttons.forEach(function (item, index) {
        var width = parseFloat(item.width || '10');
        result[index] = prevTotal / width;
        prevTotal += width;
    });
    return result;
};
var reduceWidth = function (arr) {
    return arr.reduce(function (total, btn) { return total + (btn.width ? parseInt(btn.width, 10) : 10); }, 0);
};
var setTransform = function (dom, percent) {
    dom.style.transform = "translate(" + percent + "%)";
    dom.style.webkitTransform = "translate(" + percent + "%)";
};
