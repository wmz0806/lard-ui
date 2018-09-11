"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var classnames_1 = require("classnames");
var Icon_1 = require("../Icon");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
exports.FontLoading = function (props) {
    var _a = props.size, size = _a === void 0 ? 0.88 : _a, _b = props.animate, animate = _b === void 0 ? true : _b, unit = props.unit, _c = props.color, color = _c === void 0 ? '#3B4EA0' : _c, _d = props.borderColor, borderColor = _d === void 0 ? '#3B4EA0' : _d;
    var className = props.className;
    return (React.createElement("div", { className: cx(pre + "loading", pre + "font-loading", className) },
        React.createElement("div", { className: cx(pre + "font-loading-box"), style: { borderColor: borderColor } },
            React.createElement(Icon_1.default, { className: cx(pre + "font-loading-mk"), name: 'maika', size: size, unit: unit, color: color }),
            React.createElement(Icon_1.default, { className: cx(pre + "font-loading-border", animate ? pre + "loading-animate" : 'hidden'), name: 'jiazai', size: size, unit: unit, color: borderColor }))));
};
var Loading = function (props) {
    var size = props.size, animate = props.animate, unit = props.unit;
    var className = props.className;
    var custom = {};
    animate = animate === undefined ? true : animate;
    unit = unit === undefined ? 'rem' : unit;
    if (size !== 0.29 && size !== 0.44 && size !== 1.14 && size !== 1.71) {
        custom = {
            width: "" + size + unit, height: "" + size + unit,
        };
        size = 1.14;
    }
    if (!size)
        size = 1.14;
    if (unit === 'rem')
        size = Math.round(config_1.default.baseFontSize * size);
    return (React.createElement("div", { className: cx(pre + "loading", pre + "loading-" + size, className), style: custom },
        React.createElement("i", { className: cx('bg_contain', animate ? '' : 'hidden') }),
        React.createElement("em", { className: cx('bg_contain') }),
        React.createElement("span", { className: cx("bg_contain", animate ? pre + "loading-animate" : 'hidden') })));
};
exports.default = Loading;
