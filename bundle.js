; (function (modules) {
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
    require(1)


})({
    1: [
        function (require, module, exports) {
            // mainjs
            const { foo } = require("./foo.js")

            foo()
            console.log("main.js")
        },
        { "./foo.js": 2, }
    ],
    2: [
        function (require, module, exports) {
            // foojs
            function foo() {
                console.log("foo")
            }
            module.exports = {
                foo,
            }
        },
        {}
    ],
})

// 我们要生成这样一个模版 使用 ejs模版生成器