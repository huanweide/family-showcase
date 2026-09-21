# 工程健康家族 · 全景仪表盘（组合叙事 v2）

零依赖、自包含的单页 HTML，把「工程健康家族」全部 17 个体检轴端到端呈现：
按治理层筛选、查看每个 doctor 的检查维度 / 严重度模型 / 运行命令、决策分流、维度×工具矩阵。

## 背景
家族已达 17 轴（源码层 11 + git 层 4 + 文档层 1 + 配置层 1 + 编排层 1）。
本轮尝试新增的 5 类轴——错误处理 / 文件物理层(BOM·行尾) / i18n 硬编码字符串 / 时区日期 / CI 配置卫生——
经 WebSearch 全部确认被免费工具占满（aislop / wssweep / localediff / timeloc·DateGuard / pipechecker 等），
违反铁律 2③「市场无或比竞品更好」。

横向静态坏味道切口已枯竭，正确动作不是硬造第 18 个 doctor，
而是从「单兵横铺」升级为「编排层 + 全景展示」双形态（呼应 core-memory 第 305-307 条组合叙事范式）。
本页即组合叙事 v2 的可见交付物。

## 家族轴清单（17）
- 源码层(11)：devdoctor / testlite / debtlens / a11ydoctor / awaitscan / cycscan / secscan / dupscan / debugdoctor / typedoctor / litdoctor
- git 层(4)：repodoctor / commitdoctor / reldoctor
- 文档层(1)：docdoctor
- 配置层(1)：pkgdoctor
- 编排层(1)：enghealth

## 查看方式
直接用浏览器打开 `index.html` 即可（无任何外部请求、无 CDN、无网络依赖）。

## 数据驱动
`index.html` 内 `<script>` 中的 `AXES` 数组即全部轴数据；新增轴只需往数组追加一条，
卡片 / 决策分流 / 维度矩阵会自动重渲染。

## 统一范式
- 零依赖单文件 Node CLI（`node index.js` / `npx` 即跑）
- 严重度加权健康分 0–100
- 内建 CI 门禁（`--fail-on-high` / `--min-score` 等，门禁只看退出码）

## 归档说明（2026-08-15 变更）
停止向 GitHub 推送 / 上架。debugdoctor 与 litdoctor 仅本地归档于
`C:\Users\Administrator\Desktop\GitHub-PreStorage\当前深耕\`，其余已发布于 github.com/huanweide/*。

---

## 作者

由 **ReTr · 樊斯瑞** 维护 · [GitHub 主页](https://github.com/huanweide)

## CI 门禁用法

开箱即可接入 CI：在流水线中运行本工具，它会输出健康分与严重度；若存在不达标项会以非 0 退出码结束，从而拦下问题提交（具体参数见上方「快速开始」）。

## 赞助支持

如果这个项目帮到了你，欢迎 [点 Star](https://github.com/huanweide/family-showcase) 支持；也可微信扫码自愿赞助（收款码见 `sponsor/wechat-qr.png`，作者本人带 Tri 水印的码，纯静态图片、不含任何密钥）。

## 许可证

详见 [LICENSE](LICENSE)。
