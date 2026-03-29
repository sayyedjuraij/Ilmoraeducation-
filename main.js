/* ═══════════════════════════════════════════════════════════════════
   ILMORA EDUCATION — ENHANCED main.js v3.0
   Advanced 3D Effects, GSAP Animations, Tilt Effects & Particles
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────────── */
  var scrollBar = document.getElementById('scrollBar');
  if (scrollBar) {
    window.addEventListener('scroll', function () {
      var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      scrollBar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     CUSTOM CURSOR
  ───────────────────────────────────────── */
  var cursor = document.getElementById('cursor');
  var ring   = document.getElementById('cursorRing');
  if (cursor && ring) {
    var mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });
    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();
    document.querySelectorAll('a, button, .faq-question, .program-card, .glass-card, .uni-card, .service-card, .testi-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }

  /* ─────────────────────────────────────────
     NAV SCROLL STATE
  ───────────────────────────────────────── */
  window.addEventListener('scroll', function () {
    var nb = document.getElementById('navbar');
    if (nb) nb.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ─────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────── */
  var ham    = document.getElementById('hamburger');
  var mmenu  = document.getElementById('mobileMenu');
  var mclose = document.getElementById('mobileClose');
  if (ham && mmenu && mclose) {
    ham.addEventListener('click', function () { mmenu.classList.add('open'); });
    mclose.addEventListener('click', function () { mmenu.classList.remove('open'); });
    mmenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mmenu.classList.remove('open'); });
    });
  }

  /* ─────────────────────────────────────────
     THREE.JS HERO 3D (particles + globe + rings + cubes)
  ───────────────────────────────────────── */
  if (typeof THREE !== 'undefined') {
    (function () {
      var canvas = document.getElementById('hero-canvas');
      if (!canvas) return;

      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
      renderer.setClearColor(0x000000, 0);

      var scene  = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
      camera.position.set(0, 0, 5);

      /* particles */
      var N = 1800, pos = new Float32Array(N * 3), spd = new Float32Array(N);
      for (var i = 0; i < N; i++) {
        pos[i*3]   = (Math.random() - 0.5) * 24;
        pos[i*3+1] = (Math.random() - 0.5) * 16;
        pos[i*3+2] = (Math.random() - 0.5) * 12;
        spd[i] = Math.random() * 0.008 + 0.002;
      }
      var pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      var pMat = new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.05, transparent: true, opacity: 0.6, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false });
      var particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      /* globe wireframe */
      var globe = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.SphereGeometry(2.2, 18, 12)),
        new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.06 })
      );
      globe.position.set(3, -0.5, -2);
      scene.add(globe);

      /* rings */
      var rings = [];
      [{r:.8,x:-3,y:1,z:-1,rx:.4,rz:.3},{r:.5,x:2.5,y:-1.5,z:.5,rx:-.3,rz:.6},{r:1.1,x:-1.5,y:-2,z:-2,rx:.6,rz:-.2}].forEach(function (d) {
        var m = new THREE.Mesh(
          new THREE.TorusGeometry(d.r, 0.008, 6, 48),
          new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.18 })
        );
        m.position.set(d.x, d.y, d.z); m.rotation.x = d.rx; m.rotation.z = d.rz;
        scene.add(m); rings.push({ mesh: m, baseY: d.y });
      });

      /* cubes */
      var cubes = [];
      [{s:.15,x:-4,y:2,z:-1.5},{s:.1,x:4,y:1,z:-.5},{s:.18,x:-2,y:-2.5,z:.5},{s:.12,x:3.5,y:-2,z:-2}].forEach(function (d) {
        var m = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(d.s, d.s, d.s)),
          new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.4 })
        );
        m.position.set(d.x, d.y, d.z);
        scene.add(m); cubes.push({ mesh: m, baseY: d.y, spd: Math.random() * 0.01 + 0.005 });
      });

      var mouse = { x: 0, y: 0 };
      document.addEventListener('mousemove', function (e) {
        mouse.x = (e.clientX / innerWidth  - 0.5) * 2;
        mouse.y = -(e.clientY / innerHeight - 0.5) * 2;
      });

      window.addEventListener('resize', function () {
        var w = canvas.parentElement.offsetWidth, h = canvas.parentElement.offsetHeight;
        renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
      });

      var t = 0;
      (function animate() {
        requestAnimationFrame(animate); t += 0.008;
        var pa = pGeo.attributes.position.array;
        for (var j = 0; j < N; j++) { pa[j*3+1] += spd[j]; if (pa[j*3+1] > 8) pa[j*3+1] = -8; }
        pGeo.attributes.position.needsUpdate = true;
        particles.rotation.y = t * 0.03;
        globe.rotation.y = t * 0.06; globe.rotation.x = t * 0.02;
        rings.forEach(function (r, idx) { r.mesh.position.y = r.baseY + Math.sin(t + idx * 1.5) * 0.25; r.mesh.rotation.y += 0.004; r.mesh.rotation.x += 0.002; });
        cubes.forEach(function (c, idx) { c.mesh.position.y = c.baseY + Math.sin(t * 0.7 + idx * 2) * 0.2; c.mesh.rotation.x += c.spd; c.mesh.rotation.y += c.spd * 0.7; });
        camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.03;
        camera.position.y += (mouse.y * 0.15 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      })();
    })();
  }

  /* ─────────────────────────────────────────
     SCROLL REVEAL (.reveal)
  ───────────────────────────────────────── */
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });

  /* ─────────────────────────────────────────
     STEP CARDS sequential reveal
  ───────────────────────────────────────── */
  var stepsGrid = document.querySelector('.steps-grid');
  if (stepsGrid) {
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          document.querySelectorAll('.step-item').forEach(function (s) { s.classList.add('step-visible'); });
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 }).observe(stepsGrid);
  }

  /* ─────────────────────────────────────────
     SERVICE CARDS slide in
  ───────────────────────────────────────── */
  var sGrid = document.querySelector('.services-grid');
  if (sGrid) {
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          document.querySelectorAll('.service-card').forEach(function (c) { c.classList.add('s-visible'); });
          obs.disconnect();
        }
      });
    }, { threshold: 0.15 }).observe(sGrid);
  }

  /* ─────────────────────────────────────────
     TESTIMONIAL CARDS stagger
  ───────────────────────────────────────── */
  var tGrid = document.querySelector('.testi-grid');
  if (tGrid) {
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          document.querySelectorAll('.testi-card').forEach(function (c) { c.classList.add('t-visible'); });
          obs.disconnect();
        }
      });
    }, { threshold: 0.15 }).observe(tGrid);
  }

  /* ─────────────────────────────────────────
     GOLD DIVIDERS animate width
  ───────────────────────────────────────── */
  var divObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('animated'); divObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.gold-divider').forEach(function (d) { divObs.observe(d); });

  /* ─────────────────────────────────────────
     COUNTER ANIMATION
  ───────────────────────────────────────── */
  var cntObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el     = e.target;
      var target = parseInt(el.dataset.target || '0', 10);
      var suffix = el.dataset.suffix || '';

      el.classList.add('counted');

      if (!el.dataset.target) {
        el.textContent = suffix;
        cntObs.unobserve(el);
        return;
      }

      var duration = 2200, start = performance.now();
      (function step(now) {
        var p     = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val   = Math.floor(eased * target);
        el.textContent = (target >= 1000 ? (val / 1000).toFixed(0) + 'k' : val) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);

      cntObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-num').forEach(function (el) { cntObs.observe(el); });

  /* ─────────────────────────────────────────
     PARALLAX on section titles
  ───────────────────────────────────────── */
  var isMobile = window.innerWidth < 768;
  if (!isMobile) {
    window.addEventListener('scroll', function () {
      var sy = window.scrollY;
      document.querySelectorAll('.section-title').forEach(function (el) {
        var rect   = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (window.innerHeight / 2 - center) * 0.04;
        el.style.transform = 'translateY(' + offset + 'px)';
      });
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     FOOTER FADE IN
  ───────────────────────────────────────── */
  var foot = document.querySelector('footer');
  if (foot) {
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('f-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.05 }).observe(foot);
  }

  /* ─────────────────────────────────────────
     FAQ ACCORDION
  ───────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item   = q.parentElement;
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ─────────────────────────────────────────
     CONTACT FORM
  ───────────────────────────────────────── */
  var formBtn = document.getElementById('formBtn');
  if (formBtn) {
    formBtn.addEventListener('click', function () {
      var n  = (document.getElementById('fname')  || {}).value || '';
      var p  = (document.getElementById('fphone') || {}).value || '';
      var em = (document.getElementById('femail') || {}).value || '';
      var toast = document.getElementById('toast');
      if (!toast) return;

      if (!n.trim() || !p.trim() || !em.trim()) {
        toast.textContent = '⚠️ Please fill in your name, phone, and email.';
        toast.style.borderLeftColor = '#e74c3c';
      } else {
        toast.textContent = '✓ Thank you! We\'ll call you back within 24 hours.';
        toast.style.borderLeftColor = '#C9A84C';
        ['fname','fphone','femail','finterest'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.value = '';
        });
      }
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 4000);
    });
  }

});
