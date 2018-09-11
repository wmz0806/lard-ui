"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var rmc_list_view_1 = require("rmc-list-view");
exports.ds = new rmc_list_view_1.default.DataSource({
    rowHasChanged: function (row1, row2) { return row1 !== row2; },
});
exports.renderRow = function (d) {
    return (React.createElement("div", { style: { padding: '0.3rem', backgroundColor: 'red', marginTop: '0.1rem' } }, d));
};
