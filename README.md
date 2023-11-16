# mini-webpack

1. 分析代码生成图

**多个有相互依赖关系的模块通过js打包变成一个模块。**

- 1. 内容

- 2. 依赖关系

2. 2023.11.16 08.26

- 开始通过createAsset获取一个文件内容并给此文件创建一个块
  - 拿到文件内容 re.readFileSync
  - 获取依赖关系 ast = parser.parse(source)
  - 用一个dep存起来这些依赖关系
  - 转成cjs形式 -> transformFromAst(ast, null, {presets: ["env"]})

- 把这些依赖关系合成一个图然后进行遍历createGraph()
  - 把这些Asset放到一个队列里面 const queue = [createAsset("xxx")]
  - 循环这个队列 + 这个队列里的路径 -> 拿到当前文件对应的依赖 -> queue.push(child) child = createAssets(path.resolve("xx", relativePath))
  - 返回一个 queue，这个就是所有文件依赖关联图

- 通过图生成js文件 const graph = createGraph()
  - 创建一个模版数据 data
  - 通过ejs.render 将模版和data一起渲染出 code 写入 bundle.js