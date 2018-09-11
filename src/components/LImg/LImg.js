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
var classnames_1 = require("classnames");
var config_1 = require("../../config");
var utils_1 = require("../../utils");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var LImg = /** @class */ (function (_super) {
    __extends(LImg, _super);
    function LImg(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            src: "",
            def: "",
            done: false,
            error: false,
            width: 0,
            height: 0,
            defLoading: null,
            launch: true,
        };
        _this.img = null;
        _this.div = null;
        return _this;
    }
    LImg.prototype.componentDidMount = function () {
        var props = this.props;
        this.state.src = this.getSrc(props.src);
        if (props.lazy) {
            if (props.src) {
                this.img = this.createImage();
            }
            else {
                this.state.done = true;
                this.state.error = true;
            }
        }
        else {
            this.state.done = true;
        }
        this.state.def = props.def || '';
        if (props.defLoading) {
            this.state.defLoading = React.cloneElement(props.defLoading, { className: cx(pre + "img-loading") });
        }
        this.state.width = props.width;
        this.state.height = props.height === undefined ? props.width : props.height;
        if (props.displayToLazy) {
            this.state.launch = false;
        }
        this.setState({});
    };
    LImg.prototype.getSrc = function (src) {
        if (!src)
            return src;
        if (/\/\/yanxuan\./.test(src)) {
            src += '?imageView&quality=65&thumbnail=330x330';
        }
        else if (/360buyimg/.test(src)) {
            src += '!q50.dpg.webp';
        }
        if (src.indexOf('http:') === 0) {
            return src.substring(5);
        }
        else {
            return src;
        }
    };
    LImg.prototype.createImage = function () {
        var _this = this;
        if (!this.state.src) {
            this.setState({ src: "", done: true, error: true });
            return null;
        }
        var uuid = utils_1.default.createUUID();
        return (React.createElement("img", { key: uuid, className: cx(pre + "img-shade"), src: this.state.src, onLoad: function () {
                if (_this.state.done)
                    return;
                _this.setState({ src: _this.state.src, done: true, error: false });
            }, onError: function () {
                if (_this.state.done)
                    return;
                _this.setState({ src: "", done: true, error: true });
            } }));
    };
    LImg.prototype.setLaunch = function (v) {
        this.setState({ launch: v });
    };
    LImg.prototype.render = function () {
        var _this = this;
        var _a = this.props, style = _a.style, className = _a.className, unit = _a.unit, bgSize = _a.bgSize, imgShade = _a.imgShade, clickReload = _a.clickReload;
        var _b = this.state, width = _b.width, height = _b.height, def = _b.def, done = _b.done, error = _b.error, src = _b.src, defLoading = _b.defLoading, launch = _b.launch;
        var boxStyle = __assign({}, style);
        if (width)
            boxStyle.width = "" + width + unit;
        if (height)
            boxStyle.height = "" + height + unit;
        if (!defLoading || done) {
            boxStyle.backgroundImage = "url(" + def + ")";
        }
        var sizeClass = bgSize === 'cover' ? 'bg_cover' : bgSize === 'contain' ? 'bg_contain' : '';
        var linerStyle = launch ? done ? error ? { backgroundColor: 'transparent' } : { backgroundImage: "url(" + src + ")" } : { backgroundColor: 'transparent' } : { backgroundColor: 'transparent' };
        return (React.createElement("div", { className: cx(pre + "img-box", className), style: boxStyle },
            defLoading && !done ? defLoading : null,
            React.createElement("div", { ref: function (el) { return (_this.div = el); }, className: cx(pre + "img-liner", sizeClass), style: linerStyle, onClick: function () {
                    if (clickReload && done && error) {
                        _this.img = _this.createImage();
                        _this.setState({ done: false, error: false });
                    }
                } }, launch ? done ? (imgShade ? this.img : null) : this.img : null)));
    };
    LImg.defaultProps = {
        className: '',
        style: {},
        def: '',
        defLoading: null,
        src: '',
        lazy: false,
        displayToLazy: false,
        bgSize: 'cover',
        width: 0,
        height: undefined,
        unit: 'rem',
        imgShade: false,
        clickReload: false
    };
    return LImg;
}(React.Component));
exports.default = LImg;
