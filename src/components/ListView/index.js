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
var react_dom_1 = require("react-dom");
var classnames_1 = require("classnames");
var rmc_list_view_1 = require("rmc-list-view");
var Zscroller = require("rmc-list-view/lib/Zscroller");
var Loading_1 = require("../Loading");
var Icon_1 = require("../Icon");
var utils_1 = require("../../utils");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
exports.PullLoading = function (_a) {
    var text = _a.text, animate = _a.animate;
    return (React.createElement("div", { className: cx(pre + "lv-pull-loading") },
        React.createElement("div", { className: cx(pre + "lv-pull-loading-b1") },
            React.createElement(Loading_1.default, { size: config_1.default.PullLoadingSize / config_1.default.baseFontSize, animate: animate })),
        React.createElement("div", { className: cx(pre + "lv-pull-loading-b2") }, text)));
};
var FooterLoading = function (_a) {
    var text = _a.text;
    return (React.createElement("div", { className: cx(pre + "lv-footer-loading") },
        React.createElement(Icon_1.default, { className: 'rotateLoop', name: 'jiazaizhong' }),
        React.createElement("span", null, text)));
};
var FooterNoneData = function () { return (React.createElement("div", { className: cx(pre + "lv-footer-none-date") },
    React.createElement("i", { className: cx('line1') }),
    React.createElement("i", { className: cx('line2') }),
    React.createElement(Loading_1.default, { size: 0.66, animate: false }))); };
var ds = new rmc_list_view_1.default.DataSource({
    rowHasChanged: function (row1, row2) { return row1 !== row2; },
});
var ListView = /** @class */ (function (_super) {
    __extends(ListView, _super);
    function ListView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            // refreshState: 0, //下拉刷新状态， 0默认状态， 1 松开即可刷新， 2刷新中， 3 刷新完成
            showFinishTxt: false,
            autoScrollKey: _this.props.autoScrollKey,
            dataSource: _this.props.dataSource || ds.cloneWithRows([]),
        };
        _this.autoLocalEnd = true;
        _this.domScroller = undefined;
        _this.scroller = undefined;
        _this._setDistanceToRefreshTimer = undefined;
        _this._setDistanceToRefresh = function () {
            clearTimeout(_this._setDistanceToRefreshTimer);
            _this._setDistanceToRefreshTimer = setTimeout(function () {
                var distanceToRefresh = parseInt("" + utils_1.default.getZoomRate() * config_1.default.PullSize, 10);
                if (_this.lv) {
                    _this.lv.ListViewRef.domScroller.scroller.__refreshHeight = distanceToRefresh;
                }
            }, 16);
        };
        return _this;
    }
    ListView.prototype.componentDidMount = function () {
        var _this = this;
        var autoRenderLocal = this.props.autoRenderLocal;
        var autoRenderRemote = this.props.autoRenderRemote;
        var autoScrollKey = this.state.autoScrollKey;
        if (!this.lv)
            return;
        if (this.lv.ListViewRef && this.lv.ListViewRef.domScroller) {
            this.domScroller = this.lv.ListViewRef.domScroller;
            if (this.domScroller.scroller) {
                this.scroller = this.domScroller.scroller;
            }
        }
        if (autoScrollKey && window.sessionStorage) {
            var offset = { left: 0, top: 0, zoom: 1 };
            try {
                offset = JSON.parse(window.sessionStorage["_" + autoScrollKey + "_"] || '{left: 0, top: 0, zoom: 1}');
                window.sessionStorage.removeItem("_" + autoScrollKey + "_"); //删除key
            }
            catch (e) {
                //console.log(e);
            }
            this.lv.scrollTo(offset.left, offset.top);
        }
        this.lvDom = react_dom_1.findDOMNode(this.lv);
        this.innerDom = this.lv.getInnerViewNode();
        if (autoRenderRemote)
            autoRenderLocal = true;
        if (autoRenderLocal) {
            this.autoLocalEnd = false;
            this.renderLocal();
        }
        else if (autoRenderRemote) {
            this.renderRemote();
        }
        if (this.props.refreshControl) {
            //开启下拉刷新
            //计算下拉刷新图标的大小
            this._setDistanceToRefresh();
            window.addEventListener('resize', this._setDistanceToRefresh, false);
            //计算下拉刷新的距离
            if (this.scroller && this.scroller.__refreshActivate) {
                var oldDeactivate_1 = this.scroller.__refreshDeactivate;
                var oldActivate_1 = this.scroller.__refreshActivate;
                var lvScroller_1 = this.scroller;
                lvScroller_1.__refreshDeactivate = function () {
                    lvScroller_1.__refreshHeight = parseInt("" + utils_1.default.getZoomRate() * config_1.default.PullSize, 10);
                    oldDeactivate_1();
                    setTimeout(function () {
                        _this.setState({ showFinishTxt: false }); // 回到下拉刷新初始状态
                    }, _this.props.scrollerOptions.animationDuration || 250); // 250 默认动画时间
                };
                lvScroller_1.__refreshActivate = function () {
                    lvScroller_1.__refreshHeight = parseInt("" + utils_1.default.getZoomRate() * config_1.default.PullActiveSize, 10);
                    oldActivate_1();
                };
            }
        }
    };
    ListView.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.dataSource !== this.props.dataSource) {
            this.setState({
                dataSource: nextProps.dataSource,
            });
        }
    };
    ListView.prototype.componentWillUnmount = function () {
        this.setState({ dataSource: ds.cloneWithRows([]) }); //清空数据
        var autoScrollKey = this.state.autoScrollKey;
        if (autoScrollKey && window.sessionStorage) {
            if (this.scroller) {
                var offset = this.scroller.getValues();
                window.sessionStorage["_" + autoScrollKey + "_"] = JSON.stringify(offset);
            }
        }
        clearTimeout(this._setDistanceToRefreshTimer);
        window.removeEventListener('resize', this._setDistanceToRefresh, false);
    };
    ListView.prototype.renderLocal = function () {
        if (!this.checkRenderTheBottom()) {
            var metrics = this.lv.getMetrics();
            if (metrics.renderedRows < metrics.totalRows) {
                this.lv.ListViewRef.handleScroll();
            }
            else {
                // 全部渲染完毕
                this.autoLocalEnd = true;
                this.renderRemote();
            }
        }
        else {
            // 达到临界点
            this.autoLocalEnd = true;
            this.renderRemote();
        }
    };
    ListView.prototype.renderRemote = function () {
        if (this.props.autoRenderRemote && !this.checkRenderTheBottom()) {
            this.lv.ListViewRef.handleScroll();
        }
    };
    ListView.prototype.checkRenderTheBottom = function () {
        var _a = this.props.onEndReachedThreshold, onEndReachedThreshold = _a === void 0 ? 100 : _a;
        return this.innerDom.offsetHeight - this.lvDom.offsetHeight >= onEndReachedThreshold;
    };
    ListView.prototype._renderCustomIcon = function () {
        return [
            React.createElement("div", { key: "i0", className: cx('zscroller-refresh-control-pull') }, this.state.showFinishTxt ? this.props.icon3 : this.props.icon0),
            React.createElement("div", { key: "i1", className: cx('zscroller-refresh-control-release') }, this.props.icon1),
        ];
    };
    ListView.prototype.onRefresh = function (e) {
        this.setState({
            showFinishTxt: true,
        });
        this.props.onRefresh && this.props.onRefresh();
    };
    ListView.prototype.scrollTo = function (x, y) {
        this.lv.scrollTo(x, y);
    };
    ListView.prototype.render = function () {
        var _this = this;
        var className = this.props.className;
        return (React.createElement(rmc_list_view_1.default, __assign({ ref: function (el) { return (_this.lv = el); } }, this.props, { className: cx(pre + "list-view", className), onScroll: function (e) {
                if (!_this.autoLocalEnd)
                    _this.renderLocal();
                _this.props.onScroll && _this.props.onScroll(e);
            }, icon: this._renderCustomIcon(), loading: this.props.icon2, distanceToRefresh: 0, onRefresh: function (e) { return _this.onRefresh(e); } })));
    };
    ListView.defaultProps = {
        className: "",
        style: {},
        listViewPrefixCls: pre.substring(0, pre.length - 1),
        initialListSize: 20,
        pageSize: 20,
        sectionBodyClassName: pre + "list-view-section-body",
        renderBodyComponent: function () { return React.createElement("div", { className: cx(pre + "list-view-body") }); },
        renderScrollComponent: function (props) { return React.createElement(Zscroller, __assign({}, props)); },
        scrollerOptions: { bouncing: true, scrollbars: false },
        onEndReachedThreshold: 100,
        autoRenderLocal: true,
        autoRenderRemote: true,
        onRefresh: undefined,
        icon0: React.createElement(exports.PullLoading, { text: '下拉即可刷新···', animate: false }),
        icon1: React.createElement(exports.PullLoading, { text: '松开即可刷新···', animate: false }),
        icon2: React.createElement(exports.PullLoading, { text: '刷新中···', animate: true }),
        icon3: React.createElement(exports.PullLoading, { text: '刷新完毕', animate: false }),
    };
    ListView.DataSource = rmc_list_view_1.default.DataSource;
    ListView.FooterLoading = FooterLoading;
    ListView.FooterNoneData = FooterNoneData;
    return ListView;
}(React.Component));
exports.default = ListView;
