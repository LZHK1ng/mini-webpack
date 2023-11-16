import fs from "fs";
// 拿到依赖关系
import parser from "@babel/parser"
// 转换ast为树拿到依赖路径
import traverse from '@babel/traverse'
import path from "path";
// 基于bundle.ejs模版生成js文件
import ejs from "ejs"
//  转换为cjs代码
import { transformFromAst } from "babel-core"
import { jsonLoader } from './jsonLoader.js'
let id = 0

const webpackConfig = {
    module: {
        rules: [
            {
                test: /\.json$/,
                use: [jsonLoader],
            }
        ]
    }
}


function createAsset(filePath) {
    // 1，获取文件内容
    // 2. 获取依赖关系
    // ast -> 抽象语法树

    // 拿到文件内容
    let source = fs.readFileSync(filePath, {
        encoding: "utf-8"
    })

    // initLoader
    const loaders = webpackConfig.module.rules
    const loaderContext = {
        addDeps(dep) {
            console.log("addDeps", dep)
        }
    }

    loaders.forEach(({ test, use }) => {
        if (test.test(filePath)) {
            if (Array.isArray(use)) {
                use.reverse().forEach((fn) => {
                    source = fn.call(loaderContext, source)
                })
            }
            // source = use(source)
        }
    })

    // 2. 获取依赖关系
    const ast = parser.parse(source, {
        sourceType: "module",
    })
    // 需要编辑整个树
    // console.log(ast)

    // 存一下
    const deps = []
    traverse.default(ast, {
        ImportDeclaration({ node }) {
            // 拿到依赖关系
            deps.push(node.source.value)
        }
    })

    // 第三个参数设为转换为cjs的配置
    const { code } = transformFromAst(ast, null, {
        presets: ["env"] //要下一个babel-preset-env的插件
    })

    return {
        filePath,
        code,
        deps,
        mapping: {},
        id: id++,
    }
}
// const assets = createAsset()
// console.log(assets)

// 把依赖关系合起来成一个图graph
function createGraph() {
    const mainAsset = createAsset("./example/main.js")
    // 遍历图 广度优先搜索 -> 目的是拿到一堆依赖跟依赖混合在一起
    const queue = [mainAsset]

    for (const asset of queue) {
        asset.deps.forEach(relativePath => {
            // 如何处理路径才能找到foo.js
            // path.resolve("./example", relativePath)
            // 生成一个child asset
            const child = createAsset(path.resolve("./example", relativePath))
            // 处理mapping
            asset.mapping[relativePath] = child.id
            queue.push(child)
        });
    }

    return queue
}

const graph = createGraph()

// 接下来 基于图生成js文件

function build(graph) {
    const template = fs.readFileSync("./bundle.ejs", { encoding: "utf-8" })

    // 创建模版数据
    const data = graph.map((asset) => {
        const { id, code, mapping } = asset
        return {
            id, code, mapping
        }
    })

    const code = ejs.render(template, { data })

    // console.log(data)
    // console.log(code)

    fs.writeFileSync("./dist/bundle.js", code)

}

build(graph)