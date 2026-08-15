// 仅做语法校验：抽出 index.html 的 <script> 块，用 new Function 编译（不执行 DOM）
const fs = require("fs");
const p = require("path").resolve(__dirname, "index.html");
const html = fs.readFileSync(p, "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error("FAIL: 未找到 script 块"); process.exit(1); }
try {
  new Function(m[1]); // 编译期语法检查，不运行
  console.log("OK: script 语法通过，长度 " + m[1].length + " 字符");
  // 顺便确认 17 轴数据完整
  const n = (m[1].match(/name:"/g) || []).length;
  console.log("轴数据条目数(含字段名计数, 仅参考): " + n);
} catch (e) {
  console.error("FAIL 语法错误: " + e.message);
  process.exit(1);
}
