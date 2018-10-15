"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var legend_1 = require("../src/legend");
var gradient = new legend_1.default(document.getElementById("gradient-legend-container"));
gradient.setState({
    type: "stacked",
    width: 50,
    height: 50,
    list: [
        {
            title: "Legend",
            type: "gradient",
            locked: true,
            width: 50,
            height: 100,
            domain: [
                0, 100
            ],
            range: [
                "#ea5545",
                "#f46a9b",
                "#ef9b20",
                "#edbf33",
                "#ede15b",
                "#bdcf32"
            ]
        },
        {
            title: "Legend",
            type: "nominal",
            width: 50,
            height: 100,
            domain: [
                "Manhattan",
                "Queens",
                "Bronx",
                "Brooklyn",
                "Staten Island",
                "Other"
            ],
            range: [
                "#ea5545",
                "#f46a9b",
                "#ef9b20",
                "#edbf33",
                "#ede15b",
                "#bdcf32"
            ]
        },
        {
            title: "Legend",
            type: "gradient",
            locked: false,
            width: 50,
            height: 100,
            domain: [
                0, 100
            ],
            range: [
                "#ea5545",
                "#f46a9b",
                "#ef9b20",
                "#edbf33",
                "#ede15b",
                "#bdcf32"
            ]
        },
        {
            title: "amount[contributions]",
            type: "nominal",
            open: true,
            width: 50,
            height: 100,
            domain: [
                "Manhattan",
                "Queens",
                "Bronx",
                "Brooklyn",
                "Staten Island",
                "Other"
            ],
            range: [
                "#ea5545",
                "#f46a9b",
                "#ef9b20",
                "#edbf33",
                "#ede15b",
                "#bdcf32"
            ]
        }
    ]
});
gradient.on("lock", function input(_a) {
    var locked = _a.locked, index = _a.index;
    gradient.setState(function (state) {
        var list = state.list.slice();
        list[index].locked = !locked;
        return __assign({}, state, { list: list });
    });
});
gradient.on("input", function input(_a) {
    var domain = _a.domain, index = _a.index;
    gradient.setState(function (state) {
        var list = state.list.slice();
        list[index].domain = domain;
        return __assign({}, state, { list: list });
    });
});
gradient.on("open", function (index) {
    gradient.setState(function (state) {
        var list = state.list.slice();
        list[index].open = !list[index].open;
        return __assign({}, state, { list: list });
    });
});
//# sourceMappingURL=index.js.map