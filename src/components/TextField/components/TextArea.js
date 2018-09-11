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
var react_1 = require("react");
var React = require("react");
var Main_1 = require("./Main");
var TextArea = /** @class */ (function (_super) {
    __extends(TextArea, _super);
    function TextArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._ref = null;
        return _this;
    }
    TextArea.prototype.getRef = function () {
        return this._ref.getRef();
    };
    TextArea.prototype.validate = function (isShowErr) {
        if (isShowErr === void 0) { isShowErr = true; }
        return this._ref.validate();
    };
    TextArea.prototype.getValue = function () {
        return this._ref.getValue();
    };
    TextArea.prototype.setValue = function (val) {
        this._ref.setValue(val);
    };
    TextArea.prototype.setDisabled = function (isDisabled) {
        this._ref.setDisabled(isDisabled);
    };
    TextArea.prototype.render = function () {
        var _this = this;
        return (React.createElement(Main_1.default, __assign({ ref: function (r) { return _this._ref = r; }, xmlTag: 'textArea' }, this.props)));
    };
    return TextArea;
}(react_1.Component));
exports.default = TextArea;
