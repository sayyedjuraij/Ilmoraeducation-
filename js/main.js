/* ── ILMORA EDUCATION — MAIN JAVASCRIPT ── */

document.addEventListener('DOMContentLoaded', function () {

  // ── CUSTOM CURSOR ──
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a, button, .faq-question, .program-card, .glass-card, .uni-card').forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
  });

  // ── NAV SCROLL ──
  window.addEventListener('scroll', function () {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── MOBILE MENU ──
  document.getElementById('hamburger').addEventListener('click', function () {
    document.getElementById('mobileMenu').classList.add('open');
  });
  document.getElementById('mobileClose').addEventListener('click', function () {
    document.getElementById('mobileMenu').classList.remove('open');
  });

  // ── THREE.JS HERO 3D ──
  if (typeof THREE !== 'undefined') {
    (function () {
      const canvas = document.getElementById('hero-canvas');
      const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
      camera.position.set(0, 0, 5);

      // Gold particles
      var particleCount = 1800;
      var positions = new Float32Array(particleCount * 3);
      var speeds = new Float32Array(particleCount);
      for (var i = 0; i < particleCount; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 24;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
        speeds[i] = Math.random() * 0.008 + 0.002;
      }
      var pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      var pMat = new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.05, transparent: true, opacity: 0.6, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false });
      var particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // Globe wireframe
      var gGeo = new THREE.SphereGeometry(2.2, 18, 12);
      var edges = new THREE.EdgesGeometry(gGeo);
      var lineMat = new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.06 });
      var globe = new THREE.LineSegments(edges, lineMat);
      globe.position.set(3, -0.5, -2);
      scene.add(globe);

      // Floating rings
      var rings = [];
      var ringData = [
        { r: 0.8, x: -3, y: 1, z: -1, rx: 0.4, rz: 0.3 },
        { r: 0.5, x: 2.5, y: -1.5, z: 0.5, rx: -0.3, rz: 0.6 },
        { r: 1.1, x: -1.5, y: -2, z: -2, rx: 0.6, rz: -0.2 }
      ];
      ringData.forEach(function (d) {
        var geo = new THREE.TorusGeometry(d.r, 0.008, 6, 48);
        var mat = new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.18 });
        var mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(d.x, d.y, d.z);
        mesh.rotation.x = d.rx; mesh.rotation.z = d.rz;
        scene.add(mesh);
        rings.push({ mesh: mesh, baseY: d.y });
      });

      // Floating cubes
      var cubes = [];
      var cubeData = [
        { s: 0.15, x: -4, y: 2, z: -1.5 }, { s: 0.1, x: 4, y: 1, z: -0.5 },
        { s: 0.18, x: -2, y: -2.5, z: 0.5 }, { s: 0.12, x: 3.5, y: -2, z: -2 }
      ];
      cubeData.forEach(function (d) {
        var e2 = new THREE.EdgesGeometry(new THREE.BoxGeometry(d.s, d.s, d.s));
        var m2 = new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.4 });
        var mesh2 = new THREE.LineSegments(e2, m2);
        mesh2.position.set(d.x, d.y, d.z);
        scene.add(mesh2);
        cubes.push({ mesh: mesh2, baseY: d.y, speed: Math.random() * 0.01 + 0.005 });
      });

      var mouse = { x: 0, y: 0 };
      document.addEventListener('mousemove', function (e) {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      });

      window.addEventListener('resize', function () {
        var w = canvas.parentElement.offsetWidth;
        var h = canvas.parentElement.offsetHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      });

      var t = 0;
      function animate() {
        requestAnimationFrame(animate);
        t += 0.008;
        var pos = pGeo.attributes.position.array;
        for (var j = 0; j < particleCount; j++) {
          pos[j * 3 + 1] += speeds[j];
          if (pos[j * 3 + 1] > 8) pos[j * 3 + 1] = -8;
        }
        pGeo.attributes.position.needsUpdate = true;
        particles.rotation.y = t * 0.03;
        globe.rotation.y = t * 0.06;
        globe.rotation.x = t * 0.02;
        rings.forEach(function (r, idx) {
          r.mesh.position.y = r.baseY + Math.sin(t + idx * 1.5) * 0.25;
          r.mesh.rotation.y += 0.004;
          r.mesh.rotation.x += 0.002;
        });
        cubes.forEach(function (c, idx) {
          c.mesh.position.y = c.baseY + Math.sin(t * 0.7 + idx * 2) * 0.2;
          c.mesh.rotation.x += c.speed;
          c.mesh.rotation.y += c.speed * 0.7;
        });
        camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.03;
        camera.position.y += (mouse.y * 0.15 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      }
      animate();
    })();
  }

  // ── SCROLL REVEAL ──
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

  // ── COUNTER ANIMATION ──
  var counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var target = parseInt(el.dataset.target);
      var suffix = el.dataset.suffix || '';
      var duration = 2000;
      var start = performance.now();
      if (!el.dataset.target) { counterObs.unobserve(el); return; }
      function step(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var val = Math.floor(eased * target);
        if (target >= 1000) val = (val / 1000).toFixed(0) + 'k';
        el.textContent = val + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-target]').forEach(function (el) { counterObs.observe(el); });

  // ── FAQ ──
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement;
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── FORM SUBMIT ──
  var formBtn = document.getElementById('formBtn');
  if (formBtn) {
    formBtn.addEventListener('click', function () {
      var name  = document.getElementById('fname').value.trim();
      var phone = document.getElementById('fphone').value.trim();
      var email = document.getElementById('femail').value.trim();
      var toast = document.getElementById('toast');
      if (!name || !phone || !email) {
        toast.textContent = '⚠️ Please fill in your name, phone, and email.';
        toast.style.borderLeftColor = '#e74c3c';
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 3500);
        return;
      }
      toast.textContent = '✓ Thank you! We\'ll call you back within 24 hours.';
      toast.style.borderLeftColor = '#C9A84C';
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 4000);
      ['fname','fphone','femail','finterest'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
      });
    });
  }

  // Close mobile menu when a link is tapped
  document.querySelectorAll('.mobile-menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.getElementById('mobileMenu').classList.remove('open');
    });
  });

});
