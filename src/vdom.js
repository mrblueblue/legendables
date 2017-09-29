"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var snabbdom_1 = require("snabbdom");
var attributes_1 = require("snabbdom/modules/attributes");
var class_1 = require("snabbdom/modules/class");
var props_1 = require("snabbdom/modules/props");
var style_1 = require("snabbdom/modules/style");
var eventlisteners_1 = require("snabbdom/modules/eventlisteners");
exports.patch = snabbdom_1.init([
    class_1.default,
    props_1.default,
    style_1.default,
    attributes_1.default,
    eventlisteners_1.default
]);
//# sourceMappingURL=vdom.js.map