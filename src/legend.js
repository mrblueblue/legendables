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
var h_1 = require("snabbdom/h");
var vdom_1 = require("./vdom");
var d3_dispatch_1 = require("d3-dispatch");
var d3_format_1 = require("d3-format");
var commafy = function (d) { return typeof d === "number" ? d3_format_1.format(",")(parseFloat(d.toFixed(2))) : d; };
var formatNumber = function (d) {
    if (String(d).length <= 4) {
        return commafy(d);
    }
    else if (d < 0.0001) {
        return d3_format_1.format(".2")(d);
    }
    else {
        return d3_format_1.format(".2s")(d);
    }
};
function rangeStep(domain, index, bins) {
    if (bins === void 0) { bins = 9; }
    if (index === 0) {
        return domain[0];
    }
    else if (index + 1 === bins) {
        return domain[1];
    }
    else {
        var increment = (domain[1] - domain[0]) / bins;
        return domain[0] + increment * index;
    }
}
function validateNumericalInput(previousValue, nextValue) {
    if (isNaN(parseFloat(nextValue))) {
        return parseFloat(previousValue);
    }
    else {
        return parseFloat(nextValue);
    }
}
function renderTickIcon(state, dispatch) {
    var _this = this;
    return h_1.default("div.tick", { on: { click: function () { return dispatch.call("open", _this, state.index); } } });
}
function renderToggleIcon(state, dispatch) {
    var _this = this;
    return h_1.default("div.open-toggle", {
        on: {
            click: function () {
                dispatch.call("toggle", _this, state);
            }
        }
    });
}
function renderLockIcon(locked, index, dispatch) {
    var _this = this;
    return h_1.default("div.lock" + (locked ? ".locked" : ".unlocked"), { on: { click: function () { return dispatch.call("lock", _this, { locked: locked, index: index }); } } }, [
        h_1.default("svg", { attrs: { viewBox: [0, 0, 48, 48] } }, [
            h_1.default("g", { style: { stroke: "white" } }, [
                h_1.default("path", {
                    attrs: {
                        d: locked
                            ? "M34,20v-4c0-5.5-4.5-10-10-10c-5.5,0-10,4.5-10,10v4H8v20h32V20H34z M18,16c0-3.3,2.7-6,6-6s6,2.7,6,6v4H18V16z"
                            : "M18,20v-8c0-3.3,2.7-6,6-6s6,2.7,6,6v2h4v-2c0-5.5-4.5-10-10-10c-5.5,0-10,4.5-10,10v8H8v20h32V20H18z"
                    }
                })
            ])
        ])
    ]);
}
function renderInput(state, domain, dispatch) {
    var _this = this;
    return h_1.default("input", {
        hook: {
            update: function (prevNode, nextNode) {
                nextNode.elm.value = domain.value;
            }
        },
        props: {
            value: domain.value
        },
        on: {
            focus: function (e) {
                e.target.select();
            },
            blur: function (e) {
                var value = validateNumericalInput(domain.value, e.target.value);
                var _a = state.domain, min = _a[0], max = _a[1];
                dispatch.call("input", _this, {
                    index: state.index,
                    domain: domain.index === 0 ? [value, max] : [min, value]
                });
            },
            keydown: function (e) {
                if (e.code === "Enter") {
                    e.target.blur();
                }
            }
        }
    });
}
function renderGradientLegend(state, dispatch) {
    var stacked = typeof state.index === "number";
    return h_1.default("div.legend.gradient-legend" + (stacked ? ".with-header" : ".legendables") + (state.open ? ".open" : ".collapsed") + (state.position ? "." + state.position : ""), [
        stacked ?
            h_1.default("div.header", [h_1.default("div.title-text", state.title), renderTickIcon(state, dispatch)]) : h_1.default("div"),
        state.open
            ? h_1.default("div.range", state.range.map(function (color, index) {
                var isMinMax = index === 0 || index === state.range.length - 1;
                var step = Array.isArray(state.domain) ? formatNumber(rangeStep(state.domain, index, state.range.length)) : null;
                var domain = Array.isArray(state.domain) ? state.domain : [null, null];
                var min = domain[0], max = domain[1];
                return h_1.default("div.block", [
                    h_1.default("div.color", { style: { background: color } }),
                    h_1.default("div.text." + (isMinMax ? "extent" : "step"), [h_1.default("span", "" + (domain.length > 2 ? domain[index] : step))].concat(isMinMax
                        ? [
                            renderInput(state, { value: domain.length === 2 ? domain[index === 0 ? 0 : 1] : domain[index], index: index }, dispatch)
                        ]
                        : []))
                ]);
            }).slice())
            : h_1.default("div"),
        state.open ?
            renderLockIcon(state.locked, state.index, dispatch) : h_1.default("div")
    ]);
}
exports.renderGradientLegend = renderGradientLegend;
function renderNominalLegend(state, dispatch) {
    var _this = this;
    var stacked = typeof state.index === "number";
    return h_1.default("div.legend.nominal-legend" + (stacked ? "" : ".legendables") + (state.open ? ".open" : ".collapsed") + (state.position ? "." + state.position : ""), [
        !stacked ? renderToggleIcon(state, dispatch) : h_1.default("div"),
        state.title &&
            h_1.default("div.header", [h_1.default("div.title-text", state.title), renderTickIcon(state, dispatch)]),
        state.open
            ? h_1.default("div.body", state.domain.map(function (value, index) {
                return h_1.default("div.legend-row", { on: { click: function () { return dispatch.call("filter", _this, value); } } }, [
                    h_1.default("div.color", {
                        style: { background: state.range[index] }
                    }),
                    h_1.default("div.text", "" + value)
                ]);
            }))
            : h_1.default("div")
    ]);
}
exports.renderNominalLegend = renderNominalLegend;
function renderStackedLegend(state, dispatch) {
    return h_1.default("div.legendables" + (state.open ? ".open" : ".collapsed") + (state.list.length > 1 ? ".show-ticks" : ""), { style: { maxHeight: state.maxHeight + "px" } }, [renderToggleIcon(state, dispatch)].concat(state.list.map(function (legend, index) {
        if (legend.type === "gradient") {
            return renderGradientLegend(__assign({}, legend, { index: index }), dispatch);
        }
        else if (legend.type === "nominal") {
            return renderNominalLegend(__assign({}, legend, { index: index }), dispatch);
        }
    })));
}
exports.renderStackedLegend = renderStackedLegend;
var Legend = /** @class */ (function () {
    function Legend(node) {
        var _this = this;
        this.setState = function (state) {
            if (typeof state === "function") {
                _this.state = state(_this.state);
            }
            else {
                _this.state = state;
            }
            var vnode;
            if (_this.state.type === "gradient") {
                vnode = renderGradientLegend(_this.state, _this.dispatch);
            }
            else if (_this.state.type === "nominal") {
                vnode = renderNominalLegend(_this.state, _this.dispatch);
            }
            else if (_this.state.type === "stacked") {
                vnode = renderStackedLegend(_this.state, _this.dispatch);
            }
            else {
                vnode = h_1.default("div");
            }
            _this.node = vdom_1.patch(_this.node, vnode);
            _this.dispatch.call("doneRender", _this, state);
            return _this.node;
        };
        this.node = node;
        this.dispatch = d3_dispatch_1.dispatch("filter", "input", "open", "lock", "toggle", "doneRender");
        this.state = null;
    }
    Legend.prototype.on = function (event, callback) {
        this.dispatch.on(event, callback);
    };
    return Legend;
}());
exports.default = Legend;
//# sourceMappingURL=legend.js.map