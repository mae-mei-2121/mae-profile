// 翠嶺園 下層ページ共通：季節・ヘッダー・メニュー・スクロール表示
(() => {
  /* 季節：URLの ?season= → トップで選んだ季節 → 今日の日付 の順に決める */
  const KEYS = ['spring','summer','autumn','winter'];
  const q = new URLSearchParams(location.search).get('season');
  let saved = null;
  try { saved = sessionStorage.getItem('suireien-season'); } catch (e) {}
  const m = new Date().getMonth() + 1;
  const now = m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'autumn' : 'winter';
  const season = KEYS.includes(q) ? q : KEYS.includes(saved) ? saved : now;
  document.body.dataset.season = season;
  window.SUIREIEN_SEASON = season;

  /* ヘッダー */
  const hd = document.getElementById('hd');
  const ph = document.querySelector('.ph');
  const onScroll = () => hd.classList.toggle('is-solid', scrollY > (ph ? ph.offsetHeight - 80 : 40));
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* スマホのメニュー */
  const btn = document.getElementById('menuBtn'), nav = document.getElementById('nav');
  btn.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open);
    btn.textContent = open ? 'CLOSE' : 'MENU';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { if (nav.classList.contains('is-open')) btn.click(); }));

  /* スクロールで表示・数字のカウント */
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
    e.target.querySelectorAll('[data-count]').forEach(el => {
      const end = +el.dataset.count;
      const node = [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
      if (!node || still) return;
      const t0 = performance.now();
      const step = t => {
        const k = Math.min(1, (t - t0) / 1400);
        node.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }), {threshold:.15});
  window.SUIREIEN_REVEAL = el => io.observe(el);
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
})();
