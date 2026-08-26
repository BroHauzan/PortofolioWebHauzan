/* ============================================================
   apple.js — interaksi bergaya Apple untuk index-apple.html.

   Reuse data dari js/data.js (PROFILE, CATEGORIES, PROJECTS, TOOLS, SOCIALS).
   Tidak ada dependency CDN / ES module → jalan juga di file://.

   Implementasi mengikuti AppleDesign.md:
   - Spring engine sendiri (model damping ratio + response, persis §4),
     interruptible & velocity-aware → dipakai untuk semua elemen gesture-driven.
   - Direct manipulation 1:1 + setPointerCapture (§2), hormati grab offset.
   - Velocity handoff (§5) + momentum projection (§6) + rubber-band (§9).
   - Feedback pointer-down instan (§1). Reduced-motion (§14).
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================
     1) SPRING ENGINE (AppleDesign §4)
     Parameter designer-friendly: damping ratio + response (detik),
     bukan mass/stiffness/damping. Integrasi sub-step untuk stabilitas.
     Interruptible: setTarget() cukup ganti target; velocity ikut terbawa
     (tak ada "brick wall" saat reversal). Selalu animasi dari presentation
     value (this.value), bukan dari target.
     ========================================================== */
  class Spring {
    constructor({ value = 0, response = 0.4, damping = 1, onUpdate, onRest, restDist = 0.1, restVel = 0.1 } = {}) {
      this.value = value;
      this.target = value;
      this.velocity = 0;
      this.response = response;
      this.damping = damping;
      this.onUpdate = onUpdate;
      this.onRest = onRest;
      this.restDist = restDist;
      this.restVel = restVel;
      this._raf = 0;
      this._last = 0;
      this._running = false;
      this._tick = this._tick.bind(this);
    }

    /* set posisi seketika tanpa animasi (dipakai selama drag 1:1). */
    jump(v) {
      this.stop();
      this.value = v;
      this.target = v;
      this.velocity = 0;
      this.onUpdate && this.onUpdate(v, 0);
    }

    /* retarget. velocity opsional = handoff dari gesture (px/s). */
    setTarget(target, velocity) {
      this.target = target;
      if (typeof velocity === "number") this.velocity = velocity;
      if (REDUCED) {
        // §14: tanpa spring — langsung ke target, cross-fade ditangani CSS.
        this.value = target;
        this.velocity = 0;
        this.onUpdate && this.onUpdate(target, 0);
        this.onRest && this.onRest();
        return;
      }
      if (!this._running) {
        this._running = true;
        this._last = 0;
        this._raf = requestAnimationFrame(this._tick);
      }
    }

    stop() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = 0;
      this._running = false;
      this._last = 0;
    }

    _tick(now) {
      if (!this._last) this._last = now;
      let frame = (now - this._last) / 1000;
      this._last = now;
      if (frame > 0.064) frame = 0.064; // clamp lompatan (tab switch)

      const w = (2 * Math.PI) / this.response; // angular frequency
      const k = w * w;                          // stiffness
      const c = 2 * this.damping * w;           // damping coefficient
      const step = 1 / 240;

      let t = frame;
      while (t > 0) {
        const h = t > step ? step : t;
        const a = -k * (this.value - this.target) - c * this.velocity;
        this.velocity += a * h;
        this.value += this.velocity * h;
        t -= h;
      }

      this.onUpdate && this.onUpdate(this.value, this.velocity);

      if (Math.abs(this.value - this.target) < this.restDist && Math.abs(this.velocity) < this.restVel) {
        this.value = this.target;
        this.velocity = 0;
        this.onUpdate && this.onUpdate(this.value, 0);
        this._running = false;
        this._last = 0;
        this._raf = 0;
        this.onRest && this.onRest();
        return;
      }
      this._raf = requestAnimationFrame(this._tick);
    }
  }

  /* ==========================================================
     2) FISIKA GESTURE (AppleDesign §6, §9)
     ========================================================== */

  // Momentum projection persis dari sample code Designing Fluid Interfaces.
  function project(initialVelocity, decelerationRate = 0.998) {
    return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
  }

  // Rubber-band: makin jauh lewat batas, makin ditahan (resistensi progresif).
  function rubberband(overshoot, dimension, constant = 0.55) {
    return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
  }

  // Clamp lunak: di dalam batas 1:1, di luar batas ditahan rubber-band.
  function softClamp(v, min, max, dim) {
    if (v < min) return min - rubberband(min - v, dim);
    if (v > max) return max + rubberband(v - max, dim);
    return v;
  }

  // Pelacak kecepatan pointer (butuh velocity saat release, §2/§5).
  function velocityTracker() {
    let hist = [];
    return {
      reset(x, y) { hist = [{ x, y, t: performance.now() }]; },
      push(x, y) {
        hist.push({ x, y, t: performance.now() });
        if (hist.length > 6) hist.shift();
      },
      get() {
        if (hist.length < 2) return { vx: 0, vy: 0 };
        const a = hist[0];
        const b = hist[hist.length - 1];
        const dt = (b.t - a.t) / 1000;
        if (dt <= 0) return { vx: 0, vy: 0 };
        return { vx: (b.x - a.x) / dt, vy: (b.y - a.y) / dt };
      },
    };
  }

  /* ==========================================================
     3) RENDER KONTEN (dari data.js)
     ========================================================== */
  document.title = PROFILE.name;
  $("[data-logo]").textContent = PROFILE.shortName;
  $("[data-kicker]").textContent = PROFILE.kicker || "";
  $("[data-hero-title]").textContent = PROFILE.name;
  $("[data-hero-tag]").textContent = PROFILE.tagline;
  $("[data-about]").innerHTML = PROFILE.about.map((p) => `<p>${p}</p>`).join("");

  // About: summary cards per category (data-driven from PROJECTS).
  const contentCats = Object.entries(CATEGORIES).filter(([k]) => k !== "semua");
  $("[data-about-cards]").innerHTML = contentCats
    .map(([key, cat]) => {
      const n = PROJECTS.filter((p) => p.category === key).length;
      return `<div class="stat glass">
        <span class="stat__dot" style="--dot-color:${cat.color}"></span>
        <span class="stat__label">${cat.label}</span>
        <span class="stat__val">${n} ${n === 1 ? 'work' : 'works'}</span>
      </div>`;
    })
    .join("");

  // Tools: flatten into chips (pressable).
  $("[data-tools]").innerHTML = TOOLS.flat()
    .map((t) => `<span class="chip" data-press>${t}</span>`)
    .join("");

  // Socials + footer action.
  $("[data-socials]").innerHTML = SOCIALS.map(
    (s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}
      <span class="handle">${s.handle}</span></a></li>`
  ).join("");
  $("[data-footer-actions]").innerHTML =
    `<a class="btn btn--plain" href="mailto:${PROFILE.email}">${PROFILE.email}</a>`;
  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ==========================================================
     4) KARTU KARYA + FILTER
     ========================================================== */
  const playIcon = `<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M1 1l10 6-10 6z"/></svg>`;

  function cardHTML(p, i) {
    const cat = CATEGORIES[p.category];
    const tag = p.playable
      ? `button type="button" class="card" data-id="${p.id}" data-press`
      : `article class="card" data-press`;
    const cover = p.cover
      ? `<img src="${p.cover}" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`
      : "";
    return `<${tag} style="--c:${cat.color}">
      <div class="card__cover" style="--cover-ratio:${p.ratio || "3 / 2"}">
        ${cover}
        <span class="card__cat glass">${cat.label}</span>
        ${p.playable ? `<span class="card__play">${playIcon}</span>` : ""}
        <span class="card__index">${String(i + 1).padStart(2, "0")}</span>
      </div>
      <div class="card__body">
        <h3 class="card__title">${p.title}</h3>
        <p class="card__desc">${p.desc}</p>
        <p class="card__year">${p.year}</p>
      </div>
    </${p.playable ? "button" : "article"}>`;
  }

  const grid = $("[data-grid]");
  const emptyEl = $("[data-empty]");
  function renderGrid(filter) {
    const list = PROJECTS.filter((p) => {
      if (filter === "semua") return p.featured || p.playable;
      return p.category === filter;
    });
    grid.innerHTML = list.map(cardHTML).join("");
    emptyEl.hidden = list.length > 0;
  }

  /* ==========================================================
     5) SEGMENTED CONTROL
     - klik/keyboard: thumb spring ke segmen.
     - drag di container: scrub 1:1, lalu projection ke segmen terdekat (§6),
       velocity di-handoff ke spring (§5). Thumb selalu mulai dari presentation
       value (interruptible, §3).
     ========================================================== */
  const seg = $("[data-segmented]");
  const thumb = $("[data-thumb]");
  seg.insertAdjacentHTML(
    "beforeend",
    Object.entries(CATEGORIES)
      .map(([key, cat]) => {
        const dot = cat.color ? `<span class="seg__dot" style="--dot-color:${cat.color}"></span>` : "";
        return `<button class="seg" role="tab" data-key="${key}" aria-selected="${key === "semua"}">${dot}${cat.label}</button>`;
      })
      .join("")
  );

  const springX = new Spring({ damping: 1, response: 0.35, onUpdate: (x) => (thumb.style.transform = `translate3d(${x}px,0,0)`) });
  const springW = new Spring({ damping: 1, response: 0.35, onUpdate: (w) => (thumb.style.width = `${w}px`) });

  let segs = [];
  let currentKey = "semua";
  function measureSegs() {
    segs = $$(".seg", seg).map((el) => ({
      key: el.dataset.key,
      el,
      left: el.offsetLeft,
      width: el.offsetWidth,
      get center() { return this.left + this.width / 2; },
    }));
  }
  function segByKey(key) { return segs.find((s) => s.key === key); }

  function selectSeg(key, vx, animate = true) {
    const s = segByKey(key);
    if (!s) return;
    currentKey = key;
    $$(".seg", seg).forEach((el) => el.setAttribute("aria-selected", el.dataset.key === key));
    if (animate) {
      springX.setTarget(s.left, vx);
      springW.setTarget(s.width, 0);
    } else {
      springX.jump(s.left);
      springW.jump(s.width);
    }
    renderGrid(key);
  }

  // Klik segmen (delegasi) — dipakai kalau bukan drag.
  seg.addEventListener("click", (e) => {
    const btn = e.target.closest(".seg");
    if (btn && !segDragMoved) selectSeg(btn.dataset.key);
  });
  // Keyboard kiri/kanan.
  seg.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const idx = segs.findIndex((s) => s.key === currentKey);
    const next = segs[(idx + (e.key === "ArrowRight" ? 1 : -1) + segs.length) % segs.length];
    next.el.focus();
    selectSeg(next.key);
  });

  // Drag scrub di container.
  let segDragging = false;
  let segDragMoved = false;
  let segStartX = 0;
  let segThumbStart = 0;
  const segTracker = velocityTracker();

  seg.addEventListener("pointerdown", (e) => {
    measureSegs();
    segDragging = true;
    segDragMoved = false;
    segStartX = e.clientX;
    springX.stop();
    springW.stop();
    segThumbStart = springX.value; // presentation value (interruptible)
    segTracker.reset(e.clientX, e.clientY);
    seg.setPointerCapture(e.pointerId);
  });
  seg.addEventListener("pointermove", (e) => {
    if (!segDragging) return;
    const dx = e.clientX - segStartX;
    if (Math.abs(dx) > 6) segDragMoved = true;
    if (!segDragMoved) return;
    segTracker.push(e.clientX, e.clientY);
    const first = segs[0];
    const last = segs[segs.length - 1];
    const minX = first.left;
    const maxX = last.left;
    const x = softClamp(segThumbStart + dx, minX, maxX, 120);
    springX.jump(x);
    // morph lebar ke segmen yang sedang dilewati pusat thumb.
    const center = x + thumb.offsetWidth / 2;
    const near = segs.reduce((a, b) => (Math.abs(b.center - center) < Math.abs(a.center - center) ? b : a));
    springW.setTarget(near.width, 0);
  });
  function endSegDrag(e) {
    if (!segDragging) return;
    segDragging = false;
    try { seg.releasePointerCapture(e.pointerId); } catch (_) {}
    if (!segDragMoved) return; // itu klik, biar handler click yang urus
    const { vx } = segTracker.get();
    const center = springX.value + thumb.offsetWidth / 2;
    const projected = center + project(vx);
    const near = segs.reduce((a, b) => (Math.abs(b.center - projected) < Math.abs(a.center - projected) ? b : a));
    selectSeg(near.key, vx);
  }
  seg.addEventListener("pointerup", endSegDrag);
  seg.addEventListener("pointercancel", endSegDrag);

  // Init posisi thumb setelah layout siap.
  function initSeg() {
    measureSegs();
    selectSeg("semua", undefined, false);
  }

  /* ==========================================================
     6) BOTTOM SHEET (draggable, drag-to-dismiss)
     Direct manipulation + velocity handoff + projection + rubber-band.
     ========================================================== */
  const sheetRoot = $("[data-sheet-root]");
  const sheet = $("[data-sheet]");
  const scrim = $("[data-sheet-scrim]");
  const dragZone = $("[data-sheet-drag]");
  const sheetVideo = $("[data-sheet-video]");
  let sheetH = 0;
  let sheetOpen = false;
  let lastFocus = null;

  const sheetSpring = new Spring({
    damping: 0.82,
    response: 0.32, // drawer feel (§4: damping 0.8 / response 0.3)
    onUpdate: (y) => {
      sheet.style.transform = `translate3d(0, ${y}px, 0)`;
      const progress = sheetH ? clamp(1 - y / sheetH, 0, 1) : 0;
      scrim.style.opacity = String(progress * 0.6);
    },
    onRest: () => {
      if (!sheetOpen) {
        sheetRoot.hidden = true;
        document.body.classList.remove("sheet-open");
        sheetVideo.removeAttribute("src");
        sheetVideo.load();
        sheetInstagram.removeAttribute("src");
        if (lastFocus) lastFocus.focus();
      }
    },
  });

  const sheetInstagram = $("[data-sheet-instagram]");

  function openSheet(project) {
    lastFocus = document.activeElement;
    const cat = CATEGORIES[project.category];
    $("[data-sheet-cat]").textContent = cat.label;
    $("[data-sheet-cat]").style.color = cat.color;
    $("[data-sheet-title]").textContent = project.title;
    $("[data-sheet-meta]").textContent = `${project.year} · ${project.desc}`;
    const placeholder = $("[data-sheet-placeholder]");
    
    if (project.instagram) {
      sheetVideo.hidden = true;
      sheetInstagram.hidden = false;
      placeholder.hidden = true;
      sheetInstagram.src = project.instagram;
    } else if (project.video) {
      sheetVideo.hidden = false;
      sheetInstagram.hidden = true;
      placeholder.hidden = true;
      sheetVideo.src = project.video;
      sheetVideo.poster = project.cover || "";
    } else {
      sheetVideo.hidden = true;
      sheetInstagram.hidden = true;
      placeholder.hidden = false;
    }

    sheetRoot.hidden = false;
    document.body.classList.add("sheet-open");
    // ukur tinggi lalu masuk dari bawah (§7: muncul & pergi lewat jalur sama).
    sheetH = sheet.offsetHeight;
    sheetSpring.jump(sheetH);
    sheetOpen = true;
    sheetSpring.setTarget(0);
    $("[data-sheet-close]").focus();
  }

  function closeSheet(velocity) {
    sheetOpen = false;
    sheetSpring.setTarget(sheetH, velocity);
  }

  // Drag pada handle/header.
  let sheetDragging = false;
  let sheetStartY = 0;
  let sheetStartTranslate = 0;
  const sheetTracker = velocityTracker();

  dragZone.addEventListener("pointerdown", (e) => {
    sheetDragging = true;
    sheetStartY = e.clientY;
    sheetSpring.stop();
    sheetStartTranslate = sheetSpring.value; // presentation value
    sheetTracker.reset(e.clientX, e.clientY);
    dragZone.setPointerCapture(e.pointerId);
  });
  dragZone.addEventListener("pointermove", (e) => {
    if (!sheetDragging) return;
    sheetTracker.push(e.clientX, e.clientY);
    const dy = e.clientY - sheetStartY;
    // batas atas (y=0): rubber-band saat ditarik lebih tinggi dari fully-open.
    const y = softClamp(sheetStartTranslate + dy, 0, sheetH, sheetH);
    sheetSpring.jump(y);
  });
  function endSheetDrag(e) {
    if (!sheetDragging) return;
    sheetDragging = false;
    try { dragZone.releasePointerCapture(e.pointerId); } catch (_) {}
    const { vy } = sheetTracker.get();
    const y = sheetSpring.value;
    // §6: proyeksikan endpoint dari velocity, lalu putuskan open/close.
    const projected = y + project(vy);
    const shouldClose = projected > sheetH / 2;
    if (shouldClose) closeSheet(vy);
    else { sheetOpen = true; sheetSpring.setTarget(0, vy); }
  }
  dragZone.addEventListener("pointerup", endSheetDrag);
  dragZone.addEventListener("pointercancel", endSheetDrag);

  // Buka via kartu playable (delegasi).
  grid.addEventListener("click", (e) => {
    const card = e.target.closest("button.card");
    if (card && !cardWasDragged) openSheet(PROJECTS.find((p) => p.id === card.dataset.id));
  });
  // Tutup: scrim, tombol, Esc.
  scrim.addEventListener("click", () => closeSheet(0));
  $("[data-sheet-close]").addEventListener("click", () => closeSheet(0));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sheetOpen) closeSheet(0);
  });
  // Focus trap sederhana selama sheet terbuka.
  sheet.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = $$('button, a[href], video[controls], [tabindex]:not([tabindex="-1"])', sheet)
      .filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // (cardWasDragged tak dipakai untuk kartu — placeholder agar guard klik aman)
  const cardWasDragged = false;


  /* ==========================================================
     8) PRESS FEEDBACK INSTAN (§1) — pointer-down, bukan release.
     ========================================================== */
  document.addEventListener("pointerdown", (e) => {
    const t = e.target.closest("[data-press]");
    if (t) t.classList.add("is-pressed");
  });
  const clearPress = () => $$(".is-pressed").forEach((el) => el.classList.remove("is-pressed"));
  document.addEventListener("pointerup", clearPress);
  document.addEventListener("pointercancel", clearPress);

  /* ==========================================================
     9) NAV: scroll edge state + section spy (wayfinding §16)
     ========================================================== */
  const nav = $("[data-nav]");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const navLinks = $$(".nav__links a");
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        // Cari entry dengan intersectionRatio tertinggi (paling dominan di viewport)
        const activeEntry = entries.reduce((prev, curr) => {
          return (curr.intersectionRatio > prev.intersectionRatio) ? curr : prev;
        }, { intersectionRatio: 0 });

        if (activeEntry.isIntersecting) {
          const id = "#" + activeEntry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle("is-active", a.getAttribute("href") === id);
          });
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-20% 0px -20% 0px" }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ==========================================================
     10) INIT
     ========================================================== */
  renderGrid("semua");
  // ukur segmented setelah font/layout siap.
  if (document.readyState === "complete") initSeg();
  else window.addEventListener("load", initSeg);
  // re-measure saat resize (spring ke posisi baru, tanpa animasi kalau reduced).
  let rz;
  window.addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      measureSegs();
      const s = segByKey(currentKey);
      if (s) { springX.jump(s.left); springW.jump(s.width); }
    }, 120);
  });

  /* ==========================================================
     11) POINTER-TRACKED SHEEN on hero Liquid Glass CTAs only
     Update CSS custom props --mx/--my so ::after radial highlight
     follows cursor (desktop/touch not needed).
     ========================================================== */
  if (!REDUCED && "matchMedia" in window && !window.matchMedia("(pointer: coarse)").matches) {
    const heros = document.querySelectorAll(".glass-btn--interactive");
    let raf;
    document.addEventListener("mousemove", (e) => {
      for (const btn of heros) {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        btn.style.setProperty("--mx", x.toFixed(2) + "%");
        btn.style.setProperty("--my", y.toFixed(2) + "%");
      }
    }, { passive: true });
    // Reset when mouse leaves the page entirely
    document.addEventListener("mouseleave", () => {
      for (const btn of heros) {
        btn.style.removeProperty("--mx");
        btn.style.removeProperty("--my");
      }
    }, { passive: true });
  }
})();
