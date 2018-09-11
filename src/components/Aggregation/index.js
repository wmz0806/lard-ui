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
var Icon_1 = require("../Icon");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var Aggregation = /** @class */ (function (_super) {
    __extends(Aggregation, _super);
    function Aggregation(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            active: false
        };
        return _this;
    }
    Aggregation.prototype.componentDidMount = function () {
        // empty
    };
    Aggregation.prototype.componentWillUnmount = function () {
        // empty
    };
    Aggregation.prototype.toggleActive = function (active) {
        this.setState({ active: active === undefined ? !this.state.active : active });
    };
    Aggregation.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, style = _a.style, menus = _a.menus;
        return (React.createElement("div", { className: cx(pre + "agg-container", className, { active: this.state.active }), style: style },
            React.createElement("div", { className: cx(pre + "agg-box") },
                React.createElement("button", { className: cx(pre + "agg-play"), onClick: function () { return _this.toggleActive(); } },
                    React.createElement(Icon_1.default, { name: 'jia' })),
                React.createElement("div", { className: cx(pre + "agg-menus") }, menus.map(function (item, i) {
                    return React.createElement("button", { key: "agg-item-" + i, className: cx(pre + "agg-button"), onClick: function (e) {
                            _this.toggleActive(false);
                            item.onClick && item.onClick(e);
                        } }, item.children);
                })))));
    };
    Aggregation.defaultProps = {
        className: "",
        style: {},
        menus: [],
    };
    return Aggregation;
}(React.Component));
exports.default = Aggregation;
