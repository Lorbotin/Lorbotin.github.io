/* ============================================================
 * custom.js —— Butterfly 主题自定义脚本（轻量增强）
 * 放置位置：<博客根目录>/source/js/custom.js
 * 加载方式：见 01-config-snippets.md 中的 inject.bottom 配置
 * ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. 正文外链自动新窗口打开 ----------
   * 只处理文章内容区的 <a>，站内链接不受影响 */
  function fixExternalLinks() {
    var links = document.querySelectorAll('.post-content a[href], #article-container a[href]');
    links.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (/^https?:\/\//i.test(href) && href.indexOf(location.host) === -1) {
        if (!a.hasAttribute('target')) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        }
      }
    });
  }

  /* ---------- 2. 图片加载失败兜底占位 ---------- */
  function watchBrokenImages() {
    document.querySelectorAll('#article-container img, .post-content img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.style.minHeight = '80px';
        img.style.background = 'repeating-linear-gradient(45deg,#eee,#eee 10px,#f5f5f5 10px,#f5f5f5 20px)';
        img.alt = img.alt || '(图片加载失败)';
      }, { once: true });
    });
  }

  /* ---------- 3. 控制台小彩蛋（可整段删掉） ---------- */
  function consoleBanner() {
    console.log(
      '%c 欢迎来我的博客逛逛 🐛 ',
      'color:#fff;background:#5b8def;padding:4px 8px;border-radius:4px;font-size:14px;'
    );
  }

  /* Butterfly 是 pjax 站点时页面切换不会重载，需要监听 pjax 事件重跑 */
  function init() {
    fixExternalLinks();
    watchBrokenImages();
    consoleBanner();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
})();
