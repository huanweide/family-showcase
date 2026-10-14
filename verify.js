#!/usr/bin/env node
// family-showcase 自检（零依赖，仅用 Node 内置模块）
//
// 校验四件事：
//   1. index.html 的 <script> 块语法可编译（不执行 DOM）
//   2. AXES 数据结构完整：每条必须有 name/layer/tag/rules/sev/langs，layer 必须在 LAYERS 内
//   3. 轴名不重复
//   4. 页面与 README 的轴数声明与 AXES 实算一致（防止加了轴忘了改文案 —— 历史上漂过）
//
// 运行：node verify.js

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

let failed = 0;
function ok(msg) { console.log('  ok  ' + msg); }
function bad(msg, detail) { failed++; console.error('  FAIL ' + msg + (detail ? '\n       ' + detail : '')); }

// ---------- 1. 语法 ----------
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) {
  console.error('FAIL: 未找到 script 块');
  process.exit(1);
}
const script = m[1];
try {
  new Function(script); // 只编译，不执行
  ok('script 语法通过（' + script.length + ' 字符）');
} catch (e) {
  bad('script 语法', e.message);
  process.exit(1);
}

// ---------- 2. AXES 数据结构 ----------
const names = [...script.matchAll(/name:"([^"]+)"/g)].map(x => x[1]);
const axisRecords = [...script.matchAll(/\{name:"([^"]+)",\s*layer:"([^"]+)"/g)];
const layerKeys = new Set(
  [...script.matchAll(/\{k:"([^"]+)",\s*label:"([^"]+)"\}/g)].map(x => x[1])
);

if (axisRecords.length === 0) {
  bad('能解析出 AXES 轴记录', '一条都没有，请检查 index.html 的 AXES 写法');
} else {
  ok('解析出 ' + axisRecords.length + ' 条轴记录');
}

// 每条轴必须有 tag / rules / sev / langs，且 rules 与 langs 不得为空数组
// （只查 substring 存在会漏掉 rules:[] 这种「有字段但内容空」的退化写法，
//   该写法会让卡片渲染出空规则列表，是典型假数据）
const blocks = script.split(/\n\s*\{name:"/).slice(1);
let incomplete = 0;
let emptyArr = 0;
for (const b of blocks) {
  const name = (b.match(/^([^"]+)"/) || [, '?'])[1];
  const need = ['layer:', 'tag:', 'rules:', 'sev:', 'langs:'];
  const missing = need.filter(k => !b.includes(k));
  if (missing.length) {
    incomplete++;
    console.error('       轴 ' + name + ' 缺字段: ' + missing.join(', '));
  }
  // 空数组 / 空字符串检查（取该字段到下一个字段或行尾之间的内容）
  for (const key of ['rules', 'langs']) {
    const km = b.match(new RegExp(key + ':\\s*\\[([^\\]]*)\\]'));
    if (km && km[1].trim() === '') {
      emptyArr++;
      console.error('       轴 ' + name + ' 的 ' + key + ' 是空数组（会让卡片渲染出空列表）');
    }
  }
  const sev = b.match(/sev:\s*"([^"]*)"/);
  if (!sev || !sev[1].trim()) {
    emptyArr++;
    console.error('       轴 ' + name + ' 的 sev 为空');
  }
}
if (incomplete === 0) ok('全部轴的字段完整（layer/tag/rules/sev/langs）');
else bad('轴字段完整性', incomplete + ' 条轴缺字段');
if (emptyArr === 0) ok('rules / langs / sev 均非空');
else bad('轴内容非空性', emptyArr + ' 处为空（空数组会让卡片渲染成空列表）');

// layer 取值必须在 LAYERS 内声明（否则卡片上的治理层标签会显示 undefined）
const badLayer = axisRecords.filter(([, , layer]) => !layerKeys.has(layer));
if (badLayer.length === 0) ok('全部轴的 layer 都在 LAYERS 内声明');
else bad('layer 合法性', badLayer.map(a => a[0] + '=' + a[2]).join(', '));

// 名字不得重复（重复会导致统计与矩阵错位）
const dup = names.filter((n, i) => names.indexOf(n) !== i);
if (dup.length === 0) ok('轴名无重复');
else bad('轴名重复', [...new Set(dup)].join(', '));

// ---------- 3. 轴数声明一致性 ----------
const axisCount = axisRecords.length;

// 3a. README 里所有 "N 个体检轴 / N 轴" 的声明必须等于实算值
const readmePath = path.join(ROOT, 'README.md');
if (fs.existsSync(readmePath)) {
  const readme = fs.readFileSync(readmePath, 'utf8');
  // 各种可能的轴数声明写法都要抓到，漏一种等于给漂移留后门
  const claims = [
    ...readme.matchAll(/全部\s*(\d+)\s*个体检轴/g),
    ...readme.matchAll(/家族已达\s*(\d+)\s*轴/g),
    ...readme.matchAll(/轴清单[（(]\s*(\d+)\s*[)）]/g),
    ...readme.matchAll(/本页.*?(\d+)\s*轴\b/g),
  ].map(x => Number(x[1]));
  const wrong = claims.filter(c => c !== axisCount);
  if (claims.length === 0) {
    bad('README 轴数声明', '一条都没匹配到 —— 断言规则本身可能已失效（正则过期），' +
        '属于假门禁，必须更新正则去匹配当前的声明写法');
  } else if (wrong.length === 0) {
    ok('README 轴数声明与实算一致（' + axisCount + ' 轴，匹配到 ' + claims.length + ' 处声明）');
  } else {
    bad('README 轴数声明', '声明为 ' + wrong.join('/') + '，实算为 ' + axisCount +
        ' —— 新增轴后忘了改文案（本项目历史上就漂过一次）');
  }
}

// 3b. 页面顶部 sub 文案的静态兜底文本也必须一致
//     （运行时该文本会由 JS 从 AXES 实算回填，这里只防有人手改 HTML）
const sub = html.match(/id="axisCountText"[^>]*>(\d+)\s*</);
if (sub && Number(sub[1]) !== axisCount) {
  bad('页面 sub 文案轴数', '静态兜底文本为 ' + sub[1] + '，实算为 ' + axisCount);
} else if (sub) {
  ok('页面 sub 文案轴数一致（' + axisCount + ' 轴，运行时另由 JS 实算回填）');
}

// ---------- 收尾 ----------
console.log('');
if (failed === 0) {
  console.log('VERIFY OK · ' + axisCount + ' 轴 · ' + names.length + ' 个具名条目');
  process.exit(0);
} else {
  console.error(failed + ' 项校验失败');
  process.exit(1);
}