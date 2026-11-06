/**
 * custom-tags.js —— Hexo 自定义标签插件（增量，无需改主题源码）
 * 放置位置：<博客根目录>/scripts/custom-tags.js
 * Hexo 会自动加载 scripts 目录下的所有 js 文件，重启 hexo s 即生效。
 *
 * 提供的标签：
 *   {% notice %}   提示/警告面板（info/tip/success/warning/danger 五种）
 *   {% announce %} 公告置顶面板
 *   {% infocard %} 信息卡片（图文卡，可跳转）
 *   {% badge %}    行内标签徽章
 */
'use strict';

/* ---------- 参数解析：支持 type=tip title="多词 标题" ---------- */
function parseArgs(args) {
  const str = (args || []).join(' ');
  const opts = {};
  // 匹配 key="value" / key='value' / key=value
  const re = /(\w+)=("([^"]*)"|'([^']*)'|(\S+))/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    opts[m[1]] = m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : m[5]);
  }
  return opts;
}

function renderMarkdown(text) {
  return hexo.render.renderSync({ text: text || '', engine: 'markdown' });
}

/* ---------- 1. 提示/警告面板 {% notice type=info title="..." %} ... {% endnotice %} ---------- */
const NOTICE_TYPES = {
  info:    { icon: 'ℹ️', title: '信息' },
  tip:     { icon: '💡', title: '提示' },
  success: { icon: '✅', title: '成功' },
  warning: { icon: '⚠️', title: '注意' },
  danger:  { icon: '🚫', title: '警告' }
};

hexo.extend.tag.register('notice', function (args, content) {
  const opts = parseArgs(args);
  const t = NOTICE_TYPES[opts.type] || NOTICE_TYPES.info;
  const title = opts.title || t.title;
  return (
    '<div class="nb-notice nb-' + (opts.type || 'info') + '">' +
      '<div class="nb-notice-head"><span>' + t.icon + '</span><span>' + title + '</span></div>' +
      '<div class="nb-notice-body">' + renderMarkdown(content) + '</div>' +
    '</div>'
  );
}, { ends: true });

/* ---------- 2. 公告置顶面板 {% announce title="..." %} ... {% endannounce %} ---------- */
hexo.extend.tag.register('announce', function (args, content) {
  const opts = parseArgs(args);
  const title = opts.title || '📌 公告';
  return (
    '<div class="nb-announce">' +
      '<div class="nb-announce-title">' + title + '</div>' +
      '<div class="nb-announce-body">' + renderMarkdown(content) + '</div>' +
    '</div>'
  );
}, { ends: true });

/* ---------- 3. 信息卡片 {% infocard title="..." desc="..." img="..." link="..." %} ---------- */
hexo.extend.tag.register('infocard', function (args) {
  const opts = parseArgs(args);
  const title = opts.title || '未命名卡片';
  const desc = opts.desc || '';
  const img = opts.img || '';
  const link = opts.link || 'javascript:void(0)';
  const imgHtml = img
    ? '<img class="nb-infocard-img" src="' + img + '" alt="' + title + '" loading="lazy">'
    : '';
  return (
    '<a class="nb-infocard" href="' + link + '" target="_blank" rel="noopener noreferrer">' +
      imgHtml +
      '<div class="nb-infocard-content">' +
        '<div class="nb-infocard-title">' + title + '</div>' +
        '<div class="nb-infocard-desc">' + desc + '</div>' +
      '</div>' +
    '</a>'
  );
});

/* ---------- 4. 标签徽章 {% badge text="新" color="#5b8def" bg="rgba(91,141,239,.12)" %} ---------- */
hexo.extend.tag.register('badge', function (args) {
  const opts = parseArgs(args);
  const text = opts.text || '徽章';
  const color = opts.color || '#5b8def';
  const bg = opts.bg || 'rgba(91,141,239,.12)';
  return '<span class="nb-badge" style="color:' + color + ';background:' + bg + ';">' + text + '</span>';
});
