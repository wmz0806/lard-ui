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
var Loading_1 = require("../Loading");
var Icon_1 = require("../Icon");
var Toast_1 = require("../Toast");
var Item_1 = require("./Item");
var lib_js_1 = require("./lib.js");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var Upload = /** @class */ (function (_super) {
    __extends(Upload, _super);
    function Upload(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            showInput: true,
            showLoading: false,
            showResult: true,
            src: "",
            autoShow: true,
        };
        var _a = _this.props, autoShow = _a.autoShow, src = _a.src;
        _this.state.autoShow = autoShow;
        _this.state.src = src;
        return _this;
    }
    Upload.prototype._onChange = function (e) {
        var files = e.target.files || e.dataTransfer.files;
        this._filter(files);
        this._input && (this._input.value = null);
    };
    Upload.prototype._closeLoading = function () {
        this.setState({ showLoading: false });
    };
    Upload.prototype._filter = function (files) {
        var _this = this;
        var file = files[0];
        var postfix = this._getPostfix(file.name);
        if (!this.props.types.includes(postfix)) {
            Toast_1.default.show("\u9009\u62E9\u7684\u6587\u4EF6\u683C\u5F0F\u4E0D\u5BF9\uFF0C\u4EC5\u652F\u6301 " + this.props.types.join(',') + " \u7684\u683C\u5F0F");
            return;
        }
        // 判断是否需要压缩
        if (this.props.compress) {
            this.setState({ showLoading: true });
            // 压缩后的图片基本符合大小要求 如果在强行判断会影响性能 所以就不再进行大小的判断
            lib_js_1.default.compressImage(file, this.props.width, this.props.quality, this.props.isGetEXIF).then(function (result) {
                _this.setState(_this.props.autoCloseLoading ? { showLoading: false, src: result.base64 } : { src: result.base64 });
                _this.props.onComplete(result, function () {
                    _this._closeLoading();
                });
            }).catch(function () {
                Toast_1.default.show('文件读取失败');
                _this.props.onError && _this.props.onError();
            });
        }
        else if (file.size >= this.props.size * 1024) {
            Toast_1.default.show("\u9009\u62E9\u6587\u4EF6\u592A\u5927\u5E94\u5C0F\u4E8E " + this.props.size + " KB");
            return;
        }
        else {
            lib_js_1.default.loadToBase64(file).then(function (result) {
                _this.setState(_this.props.autoCloseLoading ? { showLoading: false, src: result.base64 } : { src: result.base64 });
                _this.props.onComplete(result, function () {
                    _this._closeLoading();
                });
            }).catch(function () {
                Toast_1.default.show('文件读取失败');
                _this.props.onError && _this.props.onError();
            });
        }
    };
    Upload.prototype._getPostfix = function (name) {
        var a = name.split('.');
        return a[a.length - 1].toLocaleLowerCase();
    };
    Upload.prototype.componentDidMount = function () {
        //empty
    };
    Upload.prototype.componentWillUnmount = function () {
        this._closeLoading = function () {
            //empty
        };
    };
    Upload.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: cx(pre + "upload-container", this.props.className) },
            this.state.showInput && React.createElement("div", { className: cx(pre + "upload-input-container") },
                React.createElement("input", { onChange: function (e) {
                        _this._onChange(e);
                    }, ref: function (el) {
                        _this._input = el;
                    }, type: "file" })),
            this.state.showLoading && React.createElement("div", { className: cx(pre + "upload-loading-container") },
                React.createElement(Loading_1.default, { size: 0.68 })),
            this.state.showResult && this.state.autoShow && this.state.src && React.createElement(Item_1.default, { src: this.state.src, showClose: false, close: function () {
                    _this.setState({ src: '' });
                } }),
            React.createElement("div", { className: pre + "upload-bg-container" },
                React.createElement(Icon_1.default, { name: 'jia', size: 0.98, color: '#CBCBCB' }))));
    };
    Upload.defaultProps = {
        className: '',
        style: {},
        src: '',
        autoShow: true,
        autoCloseLoading: true,
        types: ['jpg', 'png', 'jpeg'],
        size: 1024,
        compress: true,
        width: 640,
        quality: 0.8,
        isGetEXIF: true,
        onComplete: function () {
            //empty
        },
        onError: function () {
            //empty
        },
    };
    return Upload;
}(React.Component));
exports.default = Upload;
