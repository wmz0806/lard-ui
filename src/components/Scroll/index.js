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
var Scroll = /** @class */ (function (_super) {
    __extends(Scroll, _super);
    function Scroll(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.view = null;
        _this.scroll = null;
        _this.zscroller = null;
        return _this;
    }
    Scroll.prototype.componentDidMount = function () {
        var _a = this.props, scrollingX = _a.scrollingX, scrollingY = _a.scrollingY, animating = _a.animating, animationDuration = _a.animationDuration, bouncing = _a.bouncing, locking = _a.locking, paging = _a.paging, snapping = _a.snapping, zooming = _a.zooming, minZoom = _a.minZoom, maxZoom = _a.maxZoom, speedMultiplier = _a.speedMultiplier, penetrationDeceleration = _a.penetrationDeceleration, penetrationAcceleration = _a.penetrationAcceleration, onScroll = _a.onScroll, scrollingComplete = _a.scrollingComplete, script = _a.script;
        if (script) {
            if (this.view) {
                this.view.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, false);
            }
            //console.log(this.zscroller.scroller.getValues());
            // this.zscroller.reflow() //  更新
            this.zscroller = new zscroller_1.default(this.scroll, {
                scrollingX: scrollingX,
                scrollingY: scrollingY,
                animating: animating,
                animationDuration: animationDuration,
                bouncing: bouncing,
                locking: locking,
                paging: paging,
                snapping: snapping,
                zooming: zooming,
                minZoom: minZoom,
                maxZoom: maxZoom,
                speedMultiplier: speedMultiplier,
                penetrationDeceleration: penetrationDeceleration,
                penetrationAcceleration: penetrationAcceleration,
                scrollingComplete: scrollingComplete,
                onScroll: onScroll,
            });
        }
    };
    Scroll.prototype.componentWillUnmount = function () {
        if (this.zscroller) {
            this.zscroller.destroy();
        }
    };
    Scroll.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, style = _a.style;
        return (React.createElement("div", { ref: function (el) { return (_this.view = el); }, className: cx(pre + "scroll-view", className), style: style },
            React.createElement("div", { className: cx(pre + "scroll-content"), ref: function (el) { return (_this.scroll = el); } }, this.props.children)));
    };
    Scroll.defaultProps = {
        children: null,
        className: "",
        style: {},
        script: true,
        scrollingX: false,
        scrollingY: true,
        animating: true,
        animationDuration: 250,
        bouncing: true,
        locking: true,
        paging: false,
        snapping: false,
        zooming: false,
        minZoom: 0.5,
        maxZoom: 3,
        speedMultiplier: 1,
        penetrationDeceleration: 0.03,
        penetrationAcceleration: 0.08,
        onScroll: function () {
            //empty
        },
        scrollingComplete: function () {
            //empty
        }
    };
    return Scroll;
}(React.Component));
exports.default = Scroll;
