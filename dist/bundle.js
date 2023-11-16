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

var _user = require("./user.json");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_user2.default);
(0, _foo.foo)();
console.log("main.js");
            },{"./foo.js":1,"./user.json":2} ],
                
    "1": [function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = require("./bar.js");

function foo() {
  console.log("foo");
  (0, _bar.bar)();
}
            },{"./bar.js":3} ],
                
    "2": [function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "{\n    \"a\": 1,\n    \"b\": 2\n}";
            },{} ],
                
    "3": [function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

function bar() {
  console.log("bar");
}
            },{} ],
                
                    })