(function (modules) {
    // 基于文件路径找到对应函数
    function require(id) {

        // 找到对应的函数
        const [fn, mapping] = modules[id]

        const module = {
            exports: {}
        }

        // 当调用require要变，现在变为id了
        function localRequire(filePath) {
            const id = mapping[filePath]
            return require(id)
        }

        fn(localRequire, module, module.exports)

        return module.exports
    }

    // 需要执行当前的入口文件mainjs
    require(0)


})({

    "0": [function (require, module, exports) {
        "use strict";

        var _foo = require("./foo.js");

        (0, _foo.foo)();
        console.log("main.js");
    }, { "./foo.js": 1 }],

    "1": [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.foo = foo;

        function foo() {
            console.log("foo");
        }
    }, {}],

})