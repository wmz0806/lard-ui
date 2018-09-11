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
var react_transition_group_1 = require("react-transition-group");
var classnames_1 = require("classnames");
var styles = require("../style.less");
var config_1 = require("../../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
// 单一的 Modal
var Modal = /** @class */ (function (_super) {
    __extends(Modal, _super);
    function Modal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            show: false
        };
        _this._timer = null;
        return _this;
    }
    Modal.prototype.componentWillUnmount = function () {
        this._timer && clearTimeout(this._timer);
    };
    Modal.prototype.setEnterAnimate = function () {
        var _this = this;
        this.setState({ show: false });
        this._timer = setTimeout(function () {
            _this.setState({ show: true });
        }, 20);
    };
    Modal.prototype.setOutAnimate = function () {
        this.setState({ show: false });
    };
    Modal.prototype.clickBtn = function (btn) {
        btn.cb && btn.cb();
        if (btn.autoClose || btn.autoClose === undefined) {
            this.props.close();
        }
    };
    Modal.prototype.render = function () {
        var _this = this;
        return (React.createElement(react_transition_group_1.CSSTransition, { in: this.state.show, classNames: cx(pre + 'modal-inner-animate'), unmountOnExit: true, timeout: { enter: 233, exit: 233 } },
            React.createElement("div", { className: cx(pre + 'modal-container', this.props.className) },
                React.createElement("div", { className: pre + "modal-shade" }),
                React.createElement("div", { className: pre + "modal-box" },
                    React.createElement("div", { className: cx(pre + "modal-content") },
                        this.props.title &&
                            React.createElement("h4", { className: cx(pre + 'modal-header', this.props.titleCN) }, this.props.title),
                        this.props.content &&
                            React.createElement("div", { className: cx(pre + 'modal-body', this.props.contentCN) }, this.props.content),
                        React.createElement("div", { className: cx(pre + 'modal-footer') }, !!this.props.buttons.length &&
                            this.props.buttons.map(function (btn, index) {
                                return (React.createElement("div", { key: index, style: { color: btn.color && btn.color, backgroundColor: btn.backColor && btn.backColor }, className: cx(pre + 'modal-footer-btn', btn.className || ''), onClick: function () { return _this.clickBtn(btn); } }, btn.content));
                            })))))));
    };
    Modal.defaultProps = {
        className: '',
        title: '',
        titleCN: '',
        content: '',
        contentCN: '',
        buttons: [],
    };
    return Modal;
}(react_1.Component));
exports.default = Modal;
