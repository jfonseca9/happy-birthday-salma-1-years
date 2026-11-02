/* ============================================================
   Salma 1 añito · Interacciones (estilo moderno)
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Config del evento ---------- */
  const CONFIG = {
    fechaEvento: new Date('2026-12-18T16:00:00-05:00'), // 18 dic 2026, 4:00 pm (Colombia)
    whatsappNumero: '573228518697',                      // +57 322 851 8697
    direccion: 'Salón de eventos Tu Fiesta, Cra 42h #84b-107, Plaza 85, Barranquilla',
    mapsQuery: 'Salón de eventos Tu Fiesta, Cra 42h #84b-107, Plaza 85, Barranquilla, Atlántico, Colombia'
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1) MÚSICA
     ============================================================ */
  const music = $('#bg-music');
  const musicBtn = $('#music-toggle');
  let musicOn = false;

  function playMusic() {
    if (!music) return;
    music.volume = 0.6;
    const p = music.play();
    if (p && p.then) {
      p.then(() => { musicOn = true; musicBtn.classList.add('playing'); })
       .catch(() => { musicOn = false; musicBtn.classList.remove('playing'); });
    }
  }
  function toggleMusic() {
    if (!music) return;
    if (musicOn) { music.pause(); musicOn = false; musicBtn.classList.remove('playing'); }
    else { playMusic(); }
  }
  musicBtn.addEventListener('click', toggleMusic);

  /* ============================================================
     2) PANTALLA DE BIENVENIDA + GLOBOS
     ============================================================ */
  const welcome = $('#welcome');
  const heartBtn = $('#heart-open');
  const balloonLayer = $('#balloon-layer');
  const invitation = $('#invitation');
  const dotNav = $('#dot-nav');
  let opened = false;

  const coloresGlobo = ['#ff9fcf', '#ff6fb0', '#ffbcdd', '#ff4f9e', '#ffd1e8', '#ffa6d4', '#ff87c3'];

  function crearGlobo(i, total) {
    const wrap = document.createElement('div');
    wrap.className = 'balloon';

    const color = coloresGlobo[i % coloresGlobo.length];
    const leftPct = 5 + (90 * (i / Math.max(total - 1, 1)));
    const jitter = (Math.random() * 10) - 5;
    wrap.style.left = `calc(${leftPct + jitter}%)`;

    const escala = 0.75 + Math.random() * 0.5;
    const duracion = 5 + Math.random() * 3;
    const retraso = Math.random() * 0.8;
    const derivaX = (Math.random() * 80) - 40;

    const body = document.createElement('div');
    body.className = 'balloon-body';
    body.style.color = color;
    body.style.background = `radial-gradient(circle at 35% 30%, #ffffffbb 0%, ${color} 55%, ${color} 100%)`;

    const text = document.createElement('div');
    text.className = 'balloon-text';
    text.innerHTML = 'Salma<small>1 year</small>';
    body.appendChild(text);

    const string = document.createElement('div');
    string.className = 'balloon-string';
    body.appendChild(string);

    wrap.appendChild(body);

    const subida = (window.innerHeight || 800) + 260;
    wrap.animate(
      [
        { transform: `translate3d(0, 0, 0) scale(${escala}) rotate(0deg)`, opacity: 0 },
        { opacity: 1, offset: 0.08 },
        { transform: `translate3d(${derivaX * 0.5}px, ${-subida * 0.5}px, 0) scale(${escala}) rotate(-6deg)`, offset: 0.5 },
        { transform: `translate3d(${derivaX}px, ${-subida}px, 0) scale(${escala}) rotate(6deg)`, opacity: 1 }
      ],
      { duration: duracion * 1000, delay: retraso * 1000, easing: 'cubic-bezier(.33,.0,.2,1)', fill: 'forwards' }
    ).onfinish = () => wrap.remove();

    balloonLayer.appendChild(wrap);
  }

  function lanzarGlobos() {
    const total = prefersReduced ? 6 : 16;
    for (let i = 0; i < total; i++) crearGlobo(i, total);
  }

  function lanzarConfeti() {
    if (prefersReduced) return;
    const colores = ['#ff9fcf', '#ffd1e8', '#fff3c4', '#d4f7e4', '#e9d6ff', '#ff6fb0'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colores[i % colores.length];
      const dur = 2.5 + Math.random() * 2;
      const rot = Math.random() * 720;
      const x = (Math.random() * 200) - 100;
      document.body.appendChild(piece);
      piece.animate(
        [
          { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
          { transform: `translate3d(${x}px, 110vh, 0) rotate(${rot}deg)`, opacity: .9 }
        ],
        { duration: dur * 1000, delay: Math.random() * 400, easing: 'ease-in', fill: 'forwards' }
      ).onfinish = () => piece.remove();
    }
  }

  function abrirInvitacion() {
    if (opened) return;
    opened = true;

    playMusic();
    lanzarGlobos();
    lanzarConfeti();

    invitation.hidden = false;

    const espera = prefersReduced ? 400 : 1500;
    setTimeout(() => {
      welcome.classList.add('hide');
      setTimeout(() => {
        welcome.style.display = 'none';
        document.body.style.overflow = '';
        if (dotNav) dotNav.classList.add('show');
        revealOnScroll();
        actualizarProgreso();
      }, 750);
    }, espera);
  }

  heartBtn.addEventListener('click', abrirInvitacion);
  document.body.style.overflow = 'hidden';

  /* ============================================================
     3) CUENTA REGRESIVA
     ============================================================ */
  const cdDays = $('#cd-days'), cdHours = $('#cd-hours'), cdMins = $('#cd-mins'), cdSecs = $('#cd-secs');
  const pad = (n) => String(n).padStart(2, '0');

  function actualizarCuenta() {
    const diff = CONFIG.fechaEvento.getTime() - Date.now();
    if (diff <= 0) {
      cdDays.textContent = cdHours.textContent = cdMins.textContent = cdSecs.textContent = '00';
      return;
    }
    cdDays.textContent = pad(Math.floor(diff / 86400000));
    cdHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    cdMins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    cdSecs.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  actualizarCuenta();
  setInterval(actualizarCuenta, 1000);

  /* ============================================================
     4) MAPA / UBICACIÓN
     ============================================================ */
  const mapBtn = $('#map-btn');
  mapBtn.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CONFIG.mapsQuery);

  /* ============================================================
     5) STEPPER (cantidad de personas)
     ============================================================ */
  const guestCount = $('#guest-count');
  const btnPlus = $('#plus');
  const btnMinus = $('#minus');
  const MIN = 1, MAX = 20;

  function clampCount(v) {
    v = parseInt(v, 10);
    if (isNaN(v)) v = MIN;
    return Math.min(MAX, Math.max(MIN, v));
  }
  btnPlus.addEventListener('click', () => { guestCount.value = clampCount(clampCount(guestCount.value) + 1); });
  btnMinus.addEventListener('click', () => { guestCount.value = clampCount(clampCount(guestCount.value) - 1); });

  /* ============================================================
     6) WHATSAPP
     ============================================================ */
  const waBtn = $('#whatsapp-btn');

  function construirMensaje() {
    const nombre = ($('#guest-name').value || '').trim();
    const cantidad = clampCount(guestCount.value);
    const quien = nombre ? nombre : 'Un invitado';
    const personas = cantidad === 1 ? '1 persona' : cantidad + ' personas';

    const msg =
      '🎀🤡 *¡Confirmo mi asistencia al primer añito de Salma!* 🤡🎀\n\n' +
      '👤 De parte de: ' + quien + '\n' +
      '👥 Asistimos: ' + personas + '\n' +
      '📅 Viernes 18 de diciembre de 2026 · 4:00 p. m.\n' +
      '📍 Salón de eventos Tu Fiesta · Cra 42h #84b-107 · Plaza 85 · Barranquilla\n\n' +
      '¡Qué emoción celebrar con Salma! 🎂💕🎈';

    return encodeURIComponent(msg);
  }

  waBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const url = 'https://wa.me/' + CONFIG.whatsappNumero + '?text=' + construirMensaje();
    window.open(url, '_blank', 'noopener');
  });

  /* ============================================================
     7) ANIMACIONES AL HACER SCROLL
     ============================================================ */
  const reveals = $$('[data-reveal]');

  function revealOnScroll() {
    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ============================================================
     8) BARRA DE PROGRESO + DOT NAV ACTIVO
     ============================================================ */
  const progressBar = $('#scroll-progress');
  const dots = $$('.dot');
  const secciones = dots.map((d) => document.querySelector(d.getAttribute('href')));
  let ticking = false;

  function actualizarProgreso() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    const pct = alto > 0 ? (scrollTop / alto) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';

    // Dot activo según sección más cercana al centro
    const centro = scrollTop + window.innerHeight / 2;
    let activa = 0;
    secciones.forEach((sec, i) => {
      if (sec && sec.offsetTop <= centro) activa = i;
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === activa));
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { actualizarProgreso(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  // Smooth scroll para los dots
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(dot.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

})();
