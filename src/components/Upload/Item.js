"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var classnames_1 = require("classnames");
var Icon_1 = require("../Icon");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var Item = function (opt) {
    var src = opt.src, className = opt.className, _a = opt.showClose, showClose = _a === void 0 ? true : _a, close = opt.close;
    if (!src)
        return null;
    return (React.createElement("div", { className: cx(pre + "upload-result-container", className) },
        React.createElement("div", { className: cx(pre + "item-image"), style: { backgroundImage: "url(" + src + ")" } }),
        showClose && React.createElement("div", { className: cx(pre + "item-close", 'f-db'), onClick: function () {
                close && close();
            } },
            React.createElement(Icon_1.default, { name: 'qingkongwenben', size: 0.3, color: '#fff' }))));
};
exports.default = Item;
