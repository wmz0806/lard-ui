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
var styles = require("./style.less");
var config_1 = require("../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var queue = [];
var defaultOptions = {
    isHidden: false,
    type: 'left',
    children: '',
    content: '',
    animateTime: 150,
    animateClass: '',
    backColor: 'white',
    onHide: function () { return void 0; },
};
var PopWindow = /** @class */ (function (_super) {
    __extends(PopWindow, _super);
    function PopWindow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = __assign({ show: false, isRemoveAnimate: true }, defaultOptions);
        _this.div = null;
        _this._timer = null;
        return _this;
    }
    PopWindow.prototype.componentDidMount = function () {
        var props = this.props;
        if (!Object.keys(props))
            return;
        this.setState(__assign({}, props));
        !props.isHidden && this.show();
        /* 如果有队列 */
        if (queue.length) {
            queue.forEach(function (props) { return PopWindow.show(props); });
        }
    };
    PopWindow.prototype.componentWillUnmount = function () {
        this._timer && clearTimeout(this._timer);
    };
    // 为了 内嵌popWindow 准备
    PopWindow.prototype.show = function () {
        this.setState(function () { return ({ isHidden: false }); });
        this._animateIn();
    };
    PopWindow.prototype.hide = function () {
        this._hide();
    };
    PopWindow.prototype.destroy = function () {
        if (!this.div)
            return;
        ReactDOM.unmountComponentAtNode(this.div);
        document.body.removeChild(this.div);
    };
    // 为了调用方法准备
    PopWindow.prototype._show = function (params, div) {
        this.div = div;
        this.setState(function () { return (__assign({ isRemoveAnimate: true }, defaultOptions, params)); });
        this._animateIn();
    };
    PopWindow.prototype._hide = function () {
        this.state.onHide && this.state.onHide();
        this.setState({ show: false, isHidden: true });
    };
    PopWindow.prototype._animateIn = function () {
        var _this = this;
        this._timer = setTimeout(function () {
            _this.setState({ show: true, isRemoveAnimate: false });
        }, 20);
    };
    PopWindow.prototype.render = function () {
        var _this = this;
        /*
         * 刚开始 show 的时候, 不要使用动画
         * */
        var _a = this.state, type = _a.type, isRemoveAnimate = _a.isRemoveAnimate, animateClass = _a.animateClass, isHidden = _a.isHidden, backColor = _a.backColor, onClick = _a.onClick;
        var _b = this.state.animateTime, animateTime = _b === void 0 ? 150 : _b;
        if (isRemoveAnimate)
            animateTime = 0;
        var acPre = pre + 'pw-animate-';
        var enterClass = acPre + 'enter';
        var enterActiveClass = acPre + 'enter-active';
        var enterDoneClass = enterActiveClass + '-done';
        var exitClass = acPre + 'exit';
        var exitActiveClass = acPre + 'exit-active';
        var isBottom = type === 'bottom';
        return (React.createElement(react_transition_group_1.CSSTransition, { in: this.state.show, classNames: animateClass
                ? animateClass
                : {
                    enter: cx(enterClass + "-" + type),
                    enterActive: cx(enterActiveClass),
                    enterDone: cx(enterDoneClass),
                    exit: cx(exitClass, exitClass + "-" + type),
                    exitActive: cx(exitActiveClass, exitActiveClass + "-" + type),
                    exitDone: cx(pre + 'pw-animate-none'),
                }, timeout: animateTime },
            React.createElement("div", { onClick: function () {
                    isBottom && _this._hide();
                    onClick && onClick();
                }, style: {
                    opacity: this.state.show ? 1 : 0,
                    visibility: isHidden ? 'hidden' : 'visible',
                    transition: "all " + animateTime + "ms ease-in",
                }, className: cx(pre + 'pop-window-container', pre + ("pop-window-container-" + type)) },
                React.createElement(react_transition_group_1.CSSTransition, { in: isBottom && this.state.show, classNames: isBottom ? cx(pre + 'pw-animate-bottom') : '', timeout: animateTime },
                    React.createElement("div", { onClick: function (e) { return isBottom && e.stopPropagation(); }, className: cx(isBottom && pre + 'pop-window-bottom-inner', pre + 'pop-window-inner'), style: {
                            backgroundColor: backColor ? backColor : '',
                            transitionDuration: animateTime + "ms",
                        } },
                        this.state.children,
                        this.state.content)))));
    };
    PopWindow.defaultProps = __assign({}, defaultOptions);
    return PopWindow;
}(react_1.Component));
var getContainer = function (props, wrapperCSS) {
    var Container = null;
    var div = document.createElement('div');
    div.classList.add(cx(pre + 'pop-window-main'));
    wrapperCSS && div.classList.add(wrapperCSS);
    document.body.appendChild(div);
    ReactDOM.render(React.createElement(PopWindow, __assign({}, props)), div, function () {
        Container = this;
    });
    return {
        show: function (props) {
            Container
                ? Container._show(props, div)
                : queue.push(props);
            return Container;
        },
        hide: function () {
            Container && Container._hide();
        }
    };
};
PopWindow.show = function (props, wrapperCSS) {
    return getContainer({}, wrapperCSS).show(props);
};
exports.default = PopWindow;
