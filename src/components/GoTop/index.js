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
var react_transition_group_1 = require("react-transition-group");
var config_1 = require("../../config");
var index_1 = require("../../components/Icon/index");
var style_less_1 = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(style_less_1.default);
var GoTop = /** @class */ (function (_super) {
    __extends(GoTop, _super);
    function GoTop(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            show: false,
        };
        _this.state.show = !!props.show;
        return _this;
    }
    GoTop.prototype.show = function () {
        if (this.state.show)
            return;
        this.setState({ show: true });
    };
    GoTop.prototype.hide = function () {
        if (!this.state.show)
            return;
        this.setState({ show: false });
    };
    GoTop.prototype.render = function () {
        var _a = this.props, className = _a.className, style = _a.style, onClick = _a.onClick;
        return (React.createElement(react_transition_group_1.CSSTransition, { in: this.state.show, timeout: { enter: 16, exit: 555 }, classNames: "a", unmountOnExit: true },
            React.createElement("div", { className: cx(pre + "go-top", className), style: style, onClick: function (e) {
                    onClick && onClick(e);
                } },
                React.createElement(index_1.default, { name: 'fanhuidingbu' }))));
    };
    GoTop.defaultProps = {
        className: "",
        style: {},
        show: false,
    };
    return GoTop;
}(React.Component));
exports.default = GoTop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsNkJBQStCO0FBQy9CLHlDQUE0QjtBQUM1QixpRUFBcUQ7QUFDckQsdUNBQWtDO0FBQ2xDLHFEQUErQztBQUUvQywyQ0FBa0M7QUFFbEMsSUFBTSxHQUFHLEdBQUcsZ0JBQU0sQ0FBQyxHQUFHLENBQUM7QUFDdkIsSUFBTSxFQUFFLEdBQUcsb0JBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQU0sQ0FBQyxDQUFDO0FBMkIzQjtJQUFtQyx5QkFBOEI7SUFZL0QsZUFBWSxLQUFZO1FBQXhCLFlBQ0Usa0JBQU0sS0FBSyxDQUFDLFNBR2I7UUFSTSxXQUFLLEdBQVE7WUFDbEIsSUFBSSxFQUFFLEtBQUs7U0FDWixDQUFDO1FBS0EsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7O0lBQ2pDLENBQUM7SUFFTSxvQkFBSSxHQUFYO1FBQ0UsSUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUk7WUFBRSxPQUFPO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU0sb0JBQUksR0FBWDtRQUNFLElBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUk7WUFBRSxPQUFPO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU0sc0JBQU0sR0FBYjtRQUNRLElBQUEsZUFBd0MsRUFBdkMsd0JBQVMsRUFBRSxnQkFBSyxFQUFFLG9CQUFPLENBQWU7UUFFL0MsT0FBTyxDQUNMLG9CQUFDLHNDQUFhLElBQ1osRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUNuQixPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUMsRUFDL0IsVUFBVSxFQUFDLEdBQUcsRUFDZCxhQUFhO1lBRWIsNkJBQ0UsU0FBUyxFQUFFLEVBQUUsQ0FBSSxHQUFHLFdBQVEsRUFBRSxTQUFTLENBQUMsRUFDeEMsS0FBSyxFQUFFLEtBQUssRUFDWixPQUFPLEVBQUUsVUFBQyxDQUFDO29CQUNULE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLENBQUM7Z0JBQ0Qsb0JBQUMsZUFBSSxJQUFDLElBQUksRUFBRSxjQUFjLEdBQUcsQ0FDekIsQ0FDUSxDQUVqQixDQUFDO0lBQ0osQ0FBQztJQS9DYSxrQkFBWSxHQUFVO1FBQ2xDLFNBQVMsRUFBRSxFQUFFO1FBQ2IsS0FBSyxFQUFFLEVBQUU7UUFDVCxJQUFJLEVBQUUsS0FBSztLQUNaLENBQUM7SUE2Q0osWUFBQztDQUFBLEFBbkRELENBQW1DLEtBQUssQ0FBQyxTQUFTLEdBbURqRDtrQkFuRG9CLEtBQUsifQ==