<p align="center">
  <img src="assets/banner.svg" alt="family-showcase · 工程健康家族全景仪表盘" width="1280">
</p>

# 🔧 family-showcase · 工程健康家族全景仪表盘

![License](https://img.shields.io/github/license/huanweide/family-showcase)
![Stars](https://img.shields.io/github/stars/huanweide/family-showcase)
![Engineering Health Family](https://img.shields.io/badge/Engineering%20Health%20Family-18%20axes-22c55e)
![Self-contained](https://img.shields.io/badge/self--contained-21KB%20single%20file-4ecca3)
![CI](https://github.com/huanweide/family-showcase/actions/workflows/ci.yml/badge.svg)

> **English** — A zero-dependency, self-contained single-page HTML that visualizes the entire **Engineering Health Family**: all 18 checkup axes, each one's severity model, run command and decision routing, filterable by governance layer. No CDN, no build, no network.

> **一句话**：一张离线单页，把「工程健康家族」18 个零依赖体检轴的**全局关系**摆在你面前——哪个维度已覆盖、哪个还空着、某类问题该交给谁。

**任意浏览器 → 打开一个 HTML → 自动完成「按治理层筛选 → 查看轴的维度/严重度/命令 → 决策分流」**

[30 秒看懂](#-30-秒看懂) · [家族轴清单](#-家族轴清单18) · [特性](#-特性) · [快速开始](#-快速开始) · [自检](#-自检) · [架构](#-架构) · [相关项目](#-相关项目)

---

## 🔧 30 秒看懂

```text
以前：想知道"重复代码该用哪个工具"，要翻十几个 README，还不确定漏没漏
      → 答案散落在仓库里，全靠人肉记忆

现在：打开 index.html，点「源码层」
      → 11 个轴一字排开，dupscan 的检查维度 / 严重度模型 / 运行命令 / 决策分流全在卡片上
      → 顶部轴数由 AXES.length 运行时实算回填，加轴漏改文案会被 CI 抓住
```

差别只有一句话：**这不是又一个体检工具，而是把已有一支同族工具的全局关系可视化。**

---

## 🔧 家族轴清单（18）

- **源码层（11）**：devdoctor / testlite / debtlens / a11ydoctor / awaitscan / cycscan / secscan / dupscan / debugdoctor / typedoctor / litdoctor
- **git 层（4）**：repodoctor / commitdoctor / reldoctor / ghadoctor
- **文档层（1）**：docdoctor
- **配置层（1）**：pkgdoctor
- **编排层（1）**：enghealth

> git 层第四件 `ghadoctor`（GitHub Actions 配置卫生：unpinned-action / script-injection /
> broad-permissions / pr-target-checkout 等 8 类规则）已发布至
> [huanweide/ghadoctor](https://github.com/huanweide/ghadoctor)。本页此前漏收了它，
> 本轮补齐 —— 轴数由 17 更正为 18。

---

## 🔧 特性

- **18 轴全景视图（零依赖）** —— 一个 `<script>` 里的 `AXES` 数组即全部数据；卡片 / 治理层筛选 / 决策分流 / 维度矩阵全部由它自动重渲染。
- **按治理层筛选** —— 源码层 / git 层 / 文档层 / 配置层 / 编排层，一眼看清覆盖密度与空白。
- **决策分流** —— 每类问题该交给谁（自动修 / 人工重构 / 换工具），直接写在卡片上，不用再查文档。
- **维度 × 工具矩阵** —— 交叉视图，找"某个维度由哪几个轴共同覆盖"。
- **真·自包含** —— 无 CDN、无外部请求、无构建步骤，整个页面（含样式、脚本、数据）就是这一个约 21KB 的 HTML 文件。CI 会断言这一点。
- **轴数防漂移** —— 运行时从 `AXES.length` 实算回填到页面；CI 里 `verify.js` 再断言一次页面与 README 声明一致。
- **CI 真绿** —— `verify.js` 校验 script 语法、字段完整性、layer 合法性、轴名唯一性，以及外部资源引用为零、单页体积 < 100KB。

---

## 🔧 快速开始

直接用浏览器打开 `index.html` 即可：

```bash
git clone https://github.com/huanweide/family-showcase.git
cd family-showcase
# 双击 index.html，或：
python -m http.server 8000   # 然后访问 http://localhost:8000
```

无任何外部请求、无 CDN、无网络依赖、无构建步骤。

---

## 🔧 自检

```bash
node verify.js
```

真实输出：

```text
  ok  script 语法通过（9854 字符）
  ok  解析出 18 条轴记录
  ok  全部轴的字段完整（layer/tag/rules/sev/langs）
  ok  rules / langs / sev 均非空
  ok  全部轴的 layer 都在 LAYERS 内声明
  ok  轴名无重复
  ok  README 轴数声明与实算一致（18 轴，匹配到 1 处声明）
  ok  页面 sub 文案轴数一致（18 轴，运行时另由 JS 实算回填）

VERIFY OK · 18 轴 · 18 个具名条目
```

最后一项是被真实事故逼出来的：新增 `ghadoctor` 后，本页与 README 仍写着 17 轴 ——
一个「全景展示站漏了自己家族的一个轴」的错误，光靠人眼很难在改动里发现。
所以轴数现在同时由两处保证：**运行时从 `AXES.length` 实算回填**，**CI 里由 `verify.js` 断言**。

---

## 🔧 架构

| 原语 Primitive | 含义 |
|---|---|
| **轴 axis** | 一个零依赖体检工具（家族现有 18 个） |
| **治理层 layer** | 轴的作用域：源码 / git / 文档 / 配置 / 编排 |
| **严重度模型 sev** | 该轴如何给问题定级（家族统一：加权健康分 0–100） |
| **决策分流 routing** | 该轴发现的问题交给谁处理 |
| **AXES** | `index.html` 内嵌的唯一数据源，新增轴只需追加一条 |

```text
   index.html（单文件，约 21KB）
        ├── <style>   内嵌样式
        ├── <body>    治理层筛选器 + 卡片容器 + 维度矩阵
        └── <script>  AXES 数组（唯一数据源）
                 ↓ 渲染
        卡片列表 / 治理层筛选 / 决策分流 / 维度×工具矩阵
                 ↓ 运行时
        轴数从 AXES.length 实算回填 → 页面与 README 永远不会漂移
```

| 模块 Module | 文件 | 说明 |
|---|---|---|
| 页面本体 | `index.html` | 样式、脚本、数据全部内嵌，自包含 |
| 轴数据源 | `index.html` → `<script>` 内 `AXES` | 18 条轴记录，新增轴只需追加一条 |
| 治理层定义 | `index.html` → `LAYERS` | layer 取值的唯一合法集合 |
| 自检脚本 | `verify.js` | 语法 / 字段 / layer 合法性 / 轴名唯一 / 轴数一致性 |
| CI | `.github/workflows/ci.yml` | 跑自检 + 断言无外部资源 + 体积门禁 |

---

## 🔧 加一个你自己的轴

新增轴只需往 `AXES` 数组追加一条，卡片 / 筛选 / 矩阵会自动重渲染：

```js
{
  name: "myaxis",
  layer: "source",            // 必须在 LAYERS 内声明，否则 verify.js 报错
  tag: "自定义维度",
  rules: "规则A / 规则B",
  sev: { high: "...", medium: "...", low: "..." },
  langs: ["Python"],
  cmd: "node myaxis.js .",
  routing: "自动修 / 人工重构"
}
```

`verify.js` 会替你把住四道门：**字段齐全、layer 合法、轴名不重复、页面与 README 轴数一致**。

---

## 🔧 统一范式（家族约定）

- 零依赖单文件 Node CLI
- 严重度加权健康分 0–100
- 内建 CI 门禁（`--fail-on-high` / `--min-score` 等，门禁只看退出码）

> 各轴的安装与运行方式以各自仓库 README 为准。多数工具尚未发布到 npm，
> `npx <name>` 目前**不可用**；本页卡片里写的 `npx -y github:huanweide/<name>`
> 需要本机能够直连 GitHub 才能拉取，环境受限时请直接 clone 对应仓库后用 `node <entry>.js` 运行。

## 🔧 归档说明（2026-08-15 变更）

`debugdoctor` 与 `litdoctor` 为本地归档轴，未发布至 GitHub，
仅存于作者本地 `Desktop/GitHub-PreStorage/当前深耕/`；其余均已发布于
[github.com/huanweide/\*](https://github.com/huanweide?tab=repositories)。

---

## 🔧 相关项目

| 项目 | 一句话 |
|---|---|
| [`doctors`](https://github.com/huanweide/doctors) | 家族 monorepo：a11y / commit / dev / doc / pkg / rel / repo / type 八件套零依赖单文件 CLI |
| [`enghealth`](https://github.com/huanweide/enghealth) | 一条命令跑完全家族的统一入口 |
| [`codehealth-loop`](https://github.com/huanweide/codehealth-loop) | 把 12 个轴接进「四道刹车」自愈闭环的 Python 引擎 |
| [`veriloop`](https://github.com/huanweide/veriloop) | 同范式的代码审计 CLI：12 个可插拔分析轴 + 4 道验证刹车 |
| [`maxloop-overlord`](https://github.com/huanweide/maxloop-overlord) | 刹车范式本体：外部判据刹车、杜绝假绿空转 |
| [`ghadoctor`](https://github.com/huanweide/ghadoctor) | git 层第 4 轴：GitHub Actions 配置卫生 |

---

## 🔧 赞助支持

如果这个项目帮到了你，欢迎 [点 Star](https://github.com/huanweide/family-showcase) 支持；
也可微信扫码自愿赞助（收款码见 `sponsor/wechat-qr.png`，作者本人带 Tri 水印的码，
纯静态图片、不含任何密钥）。

## 🔧 许可证

MIT · © huanweide —— 详见 [LICENSE](LICENSE)。

---

<div align="center">
  <b>由 ReTr · 樊斯瑞 维护</b> ·
  <a href="https://github.com/huanweide">GitHub 主页</a> ·
  <a href="https://github.com/huanweide/doctors">回到代码健康家族总览</a>
</div>
