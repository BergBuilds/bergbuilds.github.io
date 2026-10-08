// Zeta's motion on the page (the look of ProjectZeta/motion/src/parts.tsx and Devlog.tsx): headlines whose
// words blur in one by one with the keyword landing last, numbers counting up, checklists ticking off, cards
// springing in one after another, and slow specks of light drifting up in the hero.
// All the text is in the HTML already (Google, AI search and no-JS visitors read it as is): this only animates
// it, and only when <html> has the "motion" class (set in <head> unless the visitor asked for reduced motion).
(() => {
  const root = document.documentElement;
  const moving = root.classList.contains('motion');

  // the spotlight on cards follows the mouse
  document.querySelectorAll('.spot').forEach((c) => c.addEventListener('pointermove', (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));
  // the devlog Shorts: a picture until clicked, then YouTube's player (no-cookie domain) in its place
  document.querySelectorAll('.short[data-yt]').forEach((b) => b.addEventListener('click', () => {
    const box = document.createElement('div');
    box.className = 'shortbox';
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&playsinline=1&rel=0`;
    f.title = b.querySelector('.t')?.textContent || 'YouTube';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    box.append(f);
    b.replaceWith(box);
  }));
  if (!moving) return;

  // a thin bar along the top that fills as you scroll (Zeta's Progress)
  const bar = document.querySelector('.progress');
  if (bar) {
    const set = () => bar.style.setProperty('--p', Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)).toFixed(4));
    addEventListener('scroll', set, { passive: true }); set();
  }

  // terminal lines and chat bubbles appear one after another
  document.querySelectorAll('.terminal .ln, .chat .bubble').forEach((el) => el.style.setProperty('--i', [...el.parentElement.children].indexOf(el)));

  // a fixed pseudo-random sequence (Zeta's rand): the same specks on every visit
  const rand = (k) => { const x = Math.sin(k * 999.13) * 43758.5453; return x - Math.floor(x); };

  // headlines: every word gets its own delay; the gradient keyword stays one piece and lands last
  document.querySelectorAll('h1, h2').forEach((h) => {
    let i = 0;
    const wrap = (text) => {
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach((p) => {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.append(p); return; }
        const s = document.createElement('span');
        s.className = 'w';
        s.style.setProperty('--i', i++);
        s.textContent = p;
        frag.append(s);
      });
      return frag;
    };
    [...h.childNodes].forEach((n) => {
      if (n.nodeType === 3) n.replaceWith(wrap(n.textContent));
      else if (n.nodeType === 1) { n.classList.add('w'); n.style.setProperty('--i', i++); }
    });
  });

  // numbers: the real value is in the HTML; start them at 0 and count up when they come into view
  const count = (n) => {
    const to = +n.dataset.to, pre = n.dataset.prefix || '', suf = n.dataset.suffix || '', t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1400);
      n.textContent = pre + Math.round(to * (1 - Math.pow(1 - k, 3))) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  document.querySelectorAll('[data-to]').forEach((n) => { n.textContent = (n.dataset.prefix || '') + '0' + (n.dataset.suffix || ''); });

  // checklists tick off one by one; cards in a row come in one after another
  document.querySelectorAll('.card ul').forEach((ul) => ul.querySelectorAll('li').forEach((li, i) => li.style.setProperty('--i', i)));
  document.querySelectorAll('.bento, .prices, .steps, .apps').forEach((g) => g.querySelectorAll(':scope > .fade').forEach((c, i) => c.style.setProperty('--d', i)));

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-to]').forEach(count);
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  document.querySelectorAll('.fade').forEach((el) => io.observe(el));

  // the hero: slow specks of light drifting up (Zeta's devlog motif)
  const hero = document.querySelector('header');
  if (hero) {
    const sky = document.createElement('div');
    sky.className = 'specks';
    sky.setAttribute('aria-hidden', 'true');
    for (let k = 1; k <= 28; k++) {
      const s = document.createElement('i');
      s.style.left = (rand(k) * 100).toFixed(1) + '%';
      s.style.setProperty('--s', (1.5 + rand(k + 50) * 2.5).toFixed(1) + 'px');
      s.style.setProperty('--t', (14 + rand(k + 100) * 16).toFixed(1) + 's');
      s.style.animationDelay = (-rand(k + 150) * 30).toFixed(1) + 's';
      s.style.setProperty('--o', (0.25 + rand(k + 200) * 0.5).toFixed(2));
      sky.append(s);
    }
    hero.prepend(sky);
  }
})();
