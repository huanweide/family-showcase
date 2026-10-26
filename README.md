<!-- badges -->
[![License](https://img.shields.io/github/license/huanweide/family-showcase)](LICENSE)
[![Stars](https://img.shields.io/github/stars/huanweide/family-showcase)](https://github.com/huanweide/family-showcase/stargazers)
[![Engineering Health Family](https://img.shields.io/badge/Engineering%20Health%20Family-18%20axes-22c55e)](https://github.com/huanweide/family-showcase)
<!-- /badges -->

> **English**: A zero-dependency, self-contained single-page HTML that visualizes the entire Engineering Health Family — every checkup axis, its severity model, run command, and decision routing, filterable by governance layer.

**🔧 This is the [Engineering Health Family](https://github.com/huanweide/family-showcase) front door** (18 zero-dependency checkup axes). Companion hubs: [doctors](https://github.com/huanweide/doctors) (monorepo + `doctors` CLI) and [enghealth](https://github.com/huanweide/enghealth) (one-command unified runner).

# 工程健康家族 · 全景仪表盘（组合叙事 v2）

零依赖、自包含的单页 HTML，把「工程健康家族」全部体检轴端到端呈现：
按治理层筛选、查看每个 doctor 的检查维度 / 严重度模型 / 运行命令、决策分流、维度×工具矩阵。

## 背景

本项目的存在意义不是"再造一个体检工具"，而是**把已有一支同族工具的全局关系可视化**：
哪个维度已被覆盖、哪个还空着、某类问题该交给谁。以前这件事只能靠翻十几个 README。

## 家族轴清单（18）

- **源码层（11）**：devdoctor / testlite / debtlens / a11ydoctor / awaitscan / cycscan / secscan / dupscan / debugdoctor / typedoctor / litdoctor
- **git 层（4）**：repodoctor / commitdoctor / reldoctor / ghadoctor
- **文档层（1）**：docdoctor
- **配置层（1）**：pkgdoctor
- **编排层（1）**：enghealth

> git 层第四件 `ghadoctor`（GitHub Actions 配置卫生：unpinned-action / script-injection /
> broad-permissions / pr-target-checkout 等 8 类规则）已发布至
> [huanweide/ghadoctor](https://github.com/huanweide/ghadoctor)，本页此前漏收了它，
> 本轮补齐 —— 轴数由 17 更正为 18。

## 查看方式

直接用浏览器打开 `index.html` 即可。无任何外部请求、无 CDN、无网络依赖、无构建步骤 ——
整个页面（含样式、脚本、数据）就是这一个 21KB 的 HTML 文件。

## 数据驱动

`index.html` 内 `<script>` 中的 `AXES` 数组即全部轴数据。新增轴只需往数组追加一条，
卡片 / 治理层筛选 / 决策分流 / 维度矩阵会自动重渲染。

## 自检

```bash
node verify.js
```

`verify.js` 会校验：script 语法、AXES 每条字段完整（layer/tag/rules/sev/langs）、
layer 取值是否在 `LAYERS` 内声明、轴名是否重复，以及**页面与 README 声明的轴数
是否与 AXES 实算一致**。

最后一项是被真实事故逼出来的：新增 `ghadoctor` 后，本页与 README 仍写着 17 轴 ——
一个「全景展示站漏了自己家族的一个轴」的错误，光靠人眼很难在改动里发现。
所以轴数现在同时由两处保证：运行时从 `AXES.length` 实算回填，CI 里由 `verify.js` 断言。

## 统一范式（家族约定）

- 零依赖单文件 Node CLI
- 严重度加权健康分 0–100
- 内建 CI 门禁（`--fail-on-high` / `--min-score` 等，门禁只看退出码）

> 各轴的安装与运行方式以各自仓库 README 为准。多数工具尚未发布到 npm，
> `npx <name>` 目前**不可用**；本页卡片里写的 `npx -y github:huanweide/<name>`
> 需要本机能够直连 GitHub 才能拉取，环境受限时请直接 clone 对应仓库后
> 用 `node <entry>.js` 运行。

## 归档说明（2026-08-15 变更）

`debugdoctor` 与 `litdoctor` 为本地归档轴，未发布至 GitHub，
仅存于作者本地 `Desktop/GitHub-PreStorage/当前深耕/`；其余均已发布于
[github.com/huanweide/*](https://github.com/huanweide?tab=repositories)。

---

## 作者

由 **ReTr · 樊斯瑞** 维护 · [GitHub 主页](https://github.com/huanweide)

## 赞助支持

如果这个项目帮到了你，欢迎 [点 Star](https://github.com/huanweide/family-showcase) 支持；
也可微信扫码自愿赞助（收款码见 `sponsor/wechat-qr.png`，作者本人带 Tri 水印的码，
纯静态图片、不含任何密钥）。

## 许可证

MIT · © huanweide — 详见 [LICENSE](LICENSE)。
---

← [回到代码健康家族总览](https://github.com/huanweide/doctors)
