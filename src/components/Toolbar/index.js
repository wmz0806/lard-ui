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
var ReactDOM = require("react-dom");
var classnames_1 = require("classnames");
var Item_1 = require("./Item");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var Toolbar = /** @class */ (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            direction: _this.props.direction,
            show: false,
            x: 0,
            y: 0,
            ix: 0
        };
        _this.triangle = null;
        _this.box = null;
        return _this;
    }
    Toolbar.prototype.componentDidMount = function () {
        // empty
    };
    Toolbar.prototype.show = function (target, direction, ox, oy) {
        var _this = this;
        if (direction === void 0) { direction = this.props.direction; }
        ox = ox || this.props.offsetX;
        oy = oy || this.props.offsetY;
        var dir = direction ? direction : this.state.direction;
        var bodyReact = document.body.getBoundingClientRect();
        var targetRect = target.getBoundingClientRect();
        var triangleReact = this.triangle.getBoundingClientRect();
        var boxReact = this.box.getBoundingClientRect();
        var fx = targetRect.width / 2;
        var fy = targetRect.height;
        var offset = Math.sqrt(Math.pow(triangleReact.width, 2) + Math.pow(triangleReact.height, 2)) / 2;
        var y = targetRect.top + oy + fy;
        if (direction === 'top') {
            y = targetRect.top - boxReact.height + oy;
        }
        this.setState({
            show: true,
            x: targetRect.left + ox,
            y: y,
            direction: dir,
            ix: fx - offset + ox
        }, function () {
            var reactWidth = boxReact.width + boxReact.left;
            var c = 0;
            if (reactWidth > bodyReact.width) {
                c = reactWidth - bodyReact.width;
            }
            c !== 0 && _this.setState({ x: _this.state.x - c, ix: _this.state.ix + c });
        });
    };
    Toolbar.prototype.hide = function () {
        this.setState({
            show: false,
            x: 0, y: 0, ix: 0
        });
    };
    Toolbar.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, style = _a.style, children = _a.children;
        var _b = this.state, show = _b.show, x = _b.x, y = _b.y, ix = _b.ix, direction = _b.direction;
        var transform = "translate3d(" + x + "px, " + y + "px, 0)";
        return ReactDOM.createPortal(React.createElement("div", { className: cx(pre + "toolbar-container", className, { active: show, top: direction === 'top' }), style: style, onClick: function () {
                _this.hide();
            } },
            React.createElement("div", { className: cx(pre + "toolbar-main"), style: { transform: transform, WebkitTransform: transform }, ref: function (e) { return (_this.box = e); } },
                React.createElement("div", { className: cx(pre + "toolbar-box") },
                    React.createElement("i", { className: cx(pre + "toolbar-triangle"), style: { left: ix + "px" }, ref: function (e) { return (_this.triangle = e); } }),
                    children))), document.body);
    };
    Toolbar.defaultProps = {
        children: null,
        className: "",
        style: {},
        direction: 'bottom',
        offsetY: 0,
        offsetX: 0,
    };
    Toolbar.Item = Item_1.default;
    return Toolbar;
}(React.Component));
exports.default = Toolbar;
;
