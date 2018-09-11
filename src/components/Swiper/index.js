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
var ReactDom = require("react-dom");
var classnames_1 = require("classnames");
var Item_1 = require("./Item");
var config_1 = require("../../config");
var utils_1 = require("../../utils");
var styles = require("./style.less");
var timeline_js_1 = require("../../timeline.js");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var isMobile = utils_1.default.isMobile();
var Swiper = /** @class */ (function (_super) {
    __extends(Swiper, _super);
    function Swiper(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            current: 0
        };
        _this.domSlides = [];
        _this.warp = undefined;
        _this.currentDom = undefined;
        _this.nextDom = undefined;
        _this.startX = 0;
        _this.startY = 0;
        _this.moveX = 0;
        _this.nextX = 0;
        _this.isTouch = false;
        _this.isMove = false;
        _this.isAnimate = false;
        _this.timer = null;
        _this.next = 0;
        _this.count = 0;
        _this.countArray = [];
        _this.autoTimer = undefined;
        _this.state.current = props.current || 0;
        _this.count = React.Children.count(props.children);
        for (var i = 0; i < _this.count; i++) {
            _this.countArray.push(i);
        }
        return _this;
    }
    Swiper.prototype.componentDidMount = function () {
        this.launchAutoSlid();
    };
    Swiper.prototype.componentWillUnmount = function () {
        this.autoTimer && clearInterval(this.autoTimer);
        this.timer && this.timer.stop();
    };
    Swiper.prototype.launchAutoSlid = function () {
        var _this = this;
        this.stopAutoSlid();
        if (this.props.auto && this.count > 1) {
            this.autoTimer = setInterval(function () {
                _this.move(_this.state.current + 1, true);
            }, this.props.auto);
        }
    };
    Swiper.prototype.stopAutoSlid = function () {
        this.autoTimer && clearInterval(this.autoTimer);
        this.autoTimer = undefined;
    };
    // 返回滑动的角度
    Swiper.prototype.getSlideAngle = function (dx, dy) {
        return Math.atan2(dy, dx) * 180 / Math.PI;
    };
    //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    Swiper.prototype.getSlideDirection = function (startX, startY, endX, endY, openPixel) {
        var dy = startY - endY;
        var dx = endX - startX;
        var result = 0;
        //如果滑动距离太短
        if (Math.abs(dx) < openPixel && Math.abs(dy) < openPixel) {
            return result;
        }
        var angle = this.getSlideAngle(dx, dy);
        if (angle >= -45 && angle < 45) {
            result = 4;
        }
        else if (angle >= 45 && angle < 135) {
            result = 1;
        }
        else if (angle >= -135 && angle < -45) {
            result = 2;
        }
        else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        }
        return result;
    };
    ;
    Swiper.prototype.getSwiperParam = function () {
        return {
            current: this.state.current,
            currentDom: this.currentDom,
            next: this.next,
            nextDom: this.nextDom,
            count: this.count,
            domSlides: this.domSlides
        };
    };
    Swiper.prototype.setTransform = function (o, x, y, xunit, yunit) {
        if (xunit === void 0) { xunit = 'px'; }
        if (yunit === void 0) { yunit = 'px'; }
        if (!o)
            return;
        var transform = "translate3d(" + x + xunit + ", " + y + yunit + ", 0)";
        o.style.transform = transform;
        o.style.webkitTransform = transform;
    };
    Swiper.prototype.getThreshold = function () {
        if (typeof (this.props.threshold) === 'number') {
            return this.props.threshold;
        }
        else if (this.warp) {
            return this.warp.clientWidth * (parseFloat(this.props.threshold || '') / 100);
        }
    };
    Swiper.prototype.getAveAnimateTime = function (dis) {
        if (this.warp) {
            var a = (this.props.animateTime || 1000) / this.warp.clientWidth;
            var b = this.warp.clientWidth - Math.abs(dis);
            return Math.abs(parseInt("" + a * b, 10));
        }
        return 0;
    };
    Swiper.prototype.onStart = function (e) {
        if (this.isAnimate)
            return;
        this.stopAutoSlid();
        var event = e.nativeEvent.targetTouches ? e.nativeEvent.targetTouches[0] : e.nativeEvent;
        this.startX = event.pageX;
        this.startY = event.pageY;
        this.isTouch = true;
        this.currentDom = this.domSlides[this.state.current];
        this.props.onStart && this.props.onStart(e, this.getSwiperParam());
    };
    Swiper.prototype.onMove = function (e) {
        var _this = this;
        if (this.isAnimate)
            return;
        if (!this.isTouch)
            return;
        this.stopAutoSlid();
        var event = e.nativeEvent.targetTouches ? e.nativeEvent.targetTouches[0] : e.nativeEvent;
        var x = event.pageX;
        var y = event.pageY;
        this.isMove = true;
        var direction = this.getSlideDirection(this.startX, this.startY, x, y, this.props.resThreshold || 0);
        if (direction) {
            this.domSlides.forEach(function (s) {
                _this.setTransform(s, 0, 110, undefined, '%');
            });
            // 3：向左，4：向右
            var next = null;
            if (direction === 3) {
                e.stopPropagation();
                e.preventDefault();
                var nx = x - this.startX;
                this.setTransform(this.currentDom, nx, 0);
                this.moveX = nx;
                next = this.state.current + 1;
                next >= this.domSlides.length && (next = 0);
                this.next = next;
                this.nextDom = this.domSlides[next];
            }
            else if (direction === 4) {
                e.stopPropagation();
                e.preventDefault();
                var nx = x - this.startX;
                this.setTransform(this.currentDom, nx, 0);
                this.moveX = nx;
                next = this.state.current - 1;
                next < 0 && (next = this.domSlides.length - 1);
                this.next = next;
                this.nextDom = this.domSlides[next];
            }
            if (!this.nextDom || !this.warp)
                return;
            this.nextX = this.moveX > 0 ? this.warp.clientWidth * -1 : this.warp.clientWidth;
            this.setTransform(this.nextDom, this.nextX + this.moveX, 0);
            this.props.onMove && this.props.onMove(e, this.getSwiperParam());
        }
    };
    Swiper.prototype.onEnd = function (e) {
        var _this = this;
        if (this.isAnimate) {
            this.launchAutoSlid();
            return;
        }
        if (!this.isMove) {
            this.launchAutoSlid();
            return;
        }
        this.isTouch = false;
        this.isMove = false;
        this.props.onBeforeEnd && this.props.onBeforeEnd(e, this.getSwiperParam());
        var threshold = this.getThreshold();
        var temp = Math.abs(this.moveX);
        if (temp >= threshold) {
            // 切换
            this.isAnimate = true;
            this.timer = new timeline_js_1.default({
                value: [[this.moveX, this.nextX * -1], [this.nextX + this.moveX, 0]],
                timingFunction: 'easeOut',
                duration: this.getAveAnimateTime(this.moveX),
                render: function (_a) {
                    var value1 = _a[0], value2 = _a[1];
                    _this.setTransform(_this.currentDom, value1, 0);
                    _this.setTransform(_this.nextDom, value2, 0);
                },
                onEnd: function () {
                    _this.setState({ current: _this.next });
                    _this.release();
                    _this.launchAutoSlid();
                    _this.props.onAfterEnd && _this.props.onAfterEnd(e, _this.getSwiperParam());
                },
            });
            this.timer.play();
        }
        else if (temp !== 0) {
            // 还原
            this.isAnimate = true;
            this.timer = new timeline_js_1.default({
                value: [[this.moveX, 0], [this.nextX + this.moveX, this.nextX]],
                timingFunction: 'easeOut',
                duration: this.getAveAnimateTime(this.moveX),
                render: function (_a) {
                    var value1 = _a[0], value2 = _a[1];
                    _this.setTransform(_this.currentDom, value1, 0);
                    _this.setTransform(_this.nextDom, value2, 0);
                },
                onEnd: function () {
                    _this.release();
                    _this.launchAutoSlid();
                    _this.props.onAfterEnd && _this.props.onAfterEnd(e, _this.getSwiperParam());
                },
            });
            this.timer.play();
        }
        else {
            this.launchAutoSlid();
            this.props.onAfterEnd && this.props.onAfterEnd(e, this.getSwiperParam());
        }
    };
    Swiper.prototype.onCancel = function (e) {
        this.onEnd(e);
    };
    Swiper.prototype.release = function () {
        this.next = 0;
        this.timer = null;
        this.nextX = 0;
        this.isAnimate = false;
        this.currentDom = undefined;
        this.nextDom = undefined;
        this.startX = 0;
        this.startY = 0;
        this.moveX = 0;
    };
    Swiper.prototype.move = function (index, onlyTheBrave) {
        var _this = this;
        if (onlyTheBrave === void 0) { onlyTheBrave = false; }
        if (index < 0)
            index = this.count - 1;
        if (index > this.count - 1)
            index = 0;
        var current = this.state.current;
        if (index === current)
            return;
        if (this.isAnimate)
            return;
        this.isAnimate = true;
        this.currentDom = this.domSlides[this.state.current];
        this.nextDom = this.domSlides[index];
        var warpW = this.warp ? this.warp.clientWidth : 0;
        var ix = onlyTheBrave ? warpW : index > current ? warpW : warpW * -1;
        this.setTransform(this.currentDom, 0, 0);
        this.setTransform(this.nextDom, ix, 0);
        this.timer = new timeline_js_1.default({
            value: [[0, ix * -1], [ix, 0]],
            timingFunction: 'easeOut',
            duration: this.getAveAnimateTime(ix),
            render: function (_a) {
                var value1 = _a[0], value2 = _a[1];
                _this.setTransform(_this.currentDom, value1, 0);
                _this.setTransform(_this.nextDom, value2, 0);
            },
            onEnd: function () {
                _this.setState({ current: index });
                _this.release();
            },
        });
        this.timer.play();
    };
    Swiper.prototype.render = function () {
        var _this = this;
        var _a = this.props, style = _a.style, className = _a.className, children = _a.children;
        var current = this.state.current;
        var clineChildren = React.Children.map(children, function (child, i) {
            var transform = "translate3d(0, " + (i === current ? 0 : '110%') + ", 0)";
            var pre = {
                transform: transform,
                WebkitTransform: transform,
            };
            return React.cloneElement(child, {
                style: __assign({}, child.props.style, pre),
                index: i,
                ref: function (el) {
                    if (el) {
                        var index = parseInt(el.props.index, 10);
                        _this.domSlides[index] = ReactDom.findDOMNode(el);
                    }
                }
            });
        });
        var eventMap = {};
        // 小于1组的图片不处理
        if (this.count > 1) {
            if (isMobile) {
                eventMap.onTouchStart = function (e) {
                    _this.onStart(e);
                };
                eventMap.onTouchMove = function (e) {
                    _this.onMove(e);
                };
                eventMap.onTouchEnd = function (e) {
                    _this.onEnd(e);
                };
                eventMap.onTouchEnd = function (e) {
                    _this.onCancel(e);
                };
            }
            else {
                eventMap.onMouseDown = function (e) {
                    _this.onStart(e);
                };
                eventMap.onMouseMove = function (e) {
                    _this.onMove(e);
                };
                eventMap.onMouseUp = function (e) {
                    _this.onEnd(e);
                };
                eventMap.onMouseLeave = function (e) {
                    _this.onCancel(e);
                };
            }
        }
        return (React.createElement("div", { className: cx(pre + "banner-container", className), style: style },
            React.createElement("div", __assign({ ref: function (el) { return (_this.warp = el); }, className: cx(pre + "banner-warp") }, eventMap), clineChildren),
            this.props.pagination ? React.createElement("div", { className: cx(pre + "swiper-pagination") }, this.countArray.map(function (_, index) {
                if (index === _this.state.current)
                    return React.createElement("span", { key: index, className: 'active' });
                return React.createElement("span", { key: index });
            })) : null));
    };
    Swiper.defaultProps = {
        children: null,
        className: "",
        style: {},
        current: 0,
        auto: 7000,
        animateTime: 1000,
        resThreshold: 10,
        threshold: '20%',
        pagination: true,
    };
    Swiper.Item = Item_1.default;
    return Swiper;
}(React.Component));
exports.default = Swiper;
