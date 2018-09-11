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
var react_1 = require("react");
var ReactDOM = require("react-dom");
var react_transition_group_1 = require("react-transition-group");
var classnames_1 = require("classnames");
var Modal_1 = require("./Modal");
var styles = require("../style.less");
var config_1 = require("../../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var Collection = /** @class */ (function (_super) {
    __extends(Collection, _super);
    function Collection(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            modalQueue: [],
            animateTime: 150,
            transitionTime: 20,
            animateName: cx(pre + 'modal-animate'),
        };
        _this._modal = [];
        _this._timer = null;
        return _this;
    }
    Collection.prototype.componentWillUnmount = function () {
        this._timer && clearTimeout(this._timer);
    };
    Collection.prototype._removeModal = function (index) {
        var _this = this;
        // 如果是多次弹框, 退出动画. 然后,进行完退出动画后, 删除
        // 如果是最后一个, 把动画时间设置上去
        this._modal[index].setOutAnimate();
        this.setState({ transitionTime: this.state.animateTime });
        // index && this._modal[index].setOutAnimate();
        // !index && this.setState({transitionTime: this.state.animateTime});
        this._timer = setTimeout(function () {
            _this.setState(function (prev) {
                var modalQueue = prev.modalQueue.slice();
                modalQueue.splice(index, 1);
                return { modalQueue: modalQueue };
            });
        }, this.state.animateTime);
    };
    Collection.prototype.close = function () {
        var _this = this;
        var modalQueue = this.state.modalQueue;
        var index = modalQueue.length - 1;
        // 进行完退出动画后, 删除
        // 如果是最后一个, 把动画时间设置上去
        this._modal[index].setOutAnimate();
        this.setState({ transitionTime: this.state.animateTime });
        // index && this._modal[index].setOutAnimate();
        // !index && this.setState({transitionTime: this.state.animateTime});
        this._timer = setTimeout(function () {
            modalQueue.pop();
            _this.setState({ modalQueue: modalQueue });
        }, this.state.animateTime);
    };
    Collection.prototype.show = function (options) {
        var _this = this;
        /**
         * 1. 增加队列的方式, 增加弹框
         * 2. 在 setState 回调当中, 设置新增的弹框的 animate 动画 (只有在大于1个的时候才设置)
         */
        this.setState(function (prev) { return ({
            modalQueue: prev.modalQueue.concat([options]),
            animateTime: options.animateTime || 150,
            transitionTime: 20,
            animateName: options.animateName || cx(pre + 'modal-animate'),
        }); }, function () {
            var index = _this.state.modalQueue.length - 1;
            _this._modal[index].setEnterAnimate();
        });
        // return function that could close this modal
        // return () => this._removeModal(this.state.modalQueue.length)
    };
    Collection.prototype.clear = function () {
        this.setState({
            modalQueue: []
        });
    };
    Collection.prototype._renderModal = function () {
        var _this = this;
        return this.state.modalQueue.map(function (modal, index) {
            return React.createElement(Modal_1.default, __assign({ ref: function (r) { return _this._modal[index] = r; }, key: index }, modal, { index: index, close: function () { return _this._removeModal(index); } }));
        });
    };
    Collection.prototype.render = function () {
        return (React.createElement(react_transition_group_1.TransitionGroup, { childFactory: function (child) {
                return React.cloneElement(child);
            } }, !!this.state.modalQueue.length &&
            React.createElement(react_transition_group_1.CSSTransition, { classNames: this.state.animateName, timeout: { enter: 150, exit: this.state.animateTime } },
                React.createElement("div", { className: cx(pre + 'modal-wrapper'), style: { transitionDuration: this.state.transitionTime + 'ms' } }, this._renderModal()))));
    };
    Collection.defaultProps = {};
    return Collection;
}(react_1.Component));
exports.default = Collection;
Collection.create = function (props) {
    var div = document.createElement('div');
    var ref = null;
    div.classList.add(cx(pre + 'modal-main'));
    document.body.appendChild(div);
    ReactDOM.render(React.createElement(Collection, __assign({}, props)), div, function () { ref = this; });
    return {
        show: function (_a) {
            var _b = _a.title, title = _b === void 0 ? '' : _b, _c = _a.content, content = _c === void 0 ? '' : _c, buttons = _a.buttons, _d = _a.options, options = _d === void 0 ? {} : _d;
            return ref && ref.show(__assign({ title: title,
                content: content,
                buttons: buttons }, options));
        },
        hide: function () {
            ref && ref.close();
        },
        hideAll: function () {
            ref && ref.clear();
        },
        destroy: function () {
            ref && ref.clear();
            ReactDOM.unmountComponentAtNode(div);
            document.body.removeChild(div);
        }
    };
};
