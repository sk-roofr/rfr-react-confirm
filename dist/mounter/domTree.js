"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDomTreeMounter = createDomTreeMounter;
var jsx_runtime_1 = require("react/jsx-runtime");
var client_1 = require("react-dom/client");
function createDomTreeMounter(defaultMountNode) {
    var confirms = {};
    var callbacks = {};
    var generateKey = function () { return Math.floor(Math.random() * (1 << 30)).toString(16); };
    var getParentNode = function (mountNode) {
        return (mountNode || defaultMountNode || document.body);
    };
    function mount(Component, props, mountNode) {
        var _a;
        var key = generateKey();
        try {
            var parent_1 = getParentNode(mountNode);
            var wrapper = parent_1.appendChild(document.createElement("div"));
            var root = (0, client_1.createRoot)(wrapper);
            confirms[key] = { wrapper: wrapper, root: root };
            root.render((0, jsx_runtime_1.jsx)(Component, __assign({}, props)));
            (_a = callbacks.mounted) === null || _a === void 0 ? void 0 : _a.call(callbacks);
            return key;
        }
        catch (error) {
            delete confirms[key];
            throw error;
        }
    }
    function unmount(key) {
        var confirmation = confirms[key];
        if (!confirmation)
            return;
        delete confirms[key];
        try {
            confirmation.root.unmount();
        }
        catch (error) {
            console.warn("react-confirm: Failed to unmount React root:", error);
        }
        try {
            confirmation.wrapper.remove();
        }
        catch (error) {
            console.warn("react-confirm: Failed to remove DOM wrapper:", error);
        }
    }
    return {
        mount: mount,
        unmount: unmount,
        options: {}, // Keep for backward compatibility
    };
}
