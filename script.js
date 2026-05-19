/* ============================================
   MASTER MÓVEIS — JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========== NAVBAR SCROLL ==========
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Hamburger Menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Fechar menu ao clicar em link (exceto o dropdown toggle)
  navLinks.querySelectorAll('a:not(.navbar__dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Dropdown Mobile Toggle
  const navDropdown = document.getElementById('navDropdown');
  if (navDropdown) {
    const dropdownToggle = navDropdown.querySelector('.navbar__dropdown-toggle');
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        navDropdown.classList.toggle('open');
      }
    });
  }

  // ========== HERO SLIDESHOW ==========
  const slides = document.querySelectorAll('.hero__slide');
  let currentSlide = 0;
  let slideInterval;
  const SLIDE_DURATION = 6000;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active', 'exiting'));

    const prev = slides[currentSlide];
    prev.classList.add('exiting');

    currentSlide = index;
    slides[currentSlide].classList.add('active');

    setTimeout(() => prev.classList.remove('exiting'), 1500);
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startSlideshow() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, SLIDE_DURATION);
  }

  startSlideshow();

  // ========== ANIMAÇÃO TEXTO PUZZLE ==========
  const heroTitle = document.getElementById('heroTitle');
  const chars = heroTitle.querySelectorAll('.char');
  const badge = document.getElementById('heroBadge');
  const subtitle = document.getElementById('heroSubtitle');
  const ctaWrapper = document.getElementById('heroCta');
  const highlights = heroTitle.querySelectorAll('.highlight');

  // Revelar caracteres com delay progressivo
  chars.forEach((char, i) => {
    setTimeout(() => {
      char.classList.add('visible');

      // Depois que todos aparecem, aplicar shake e manter visível
      if (i === chars.length - 1) {
        setTimeout(() => {
          chars.forEach((c, j) => {
            setTimeout(() => {
              c.style.opacity = '1';
              c.style.transform = 'translateY(0) rotateX(0)';
              c.classList.add('shake');
            }, j * 30);
          });

          // Ativar linha do highlight
          highlights.forEach(h => h.classList.add('line-visible'));

          // Garantir visibilidade permanente após shake
          setTimeout(() => {
            chars.forEach(c => {
              c.style.opacity = '1';
              c.style.transform = 'none';
              c.style.animation = 'none';
            });
          }, chars.length * 30 + 600);
        }, 400);
      }
    }, 200 + i * 50);
  });

  // Revelar badge, subtitle, CTA
  setTimeout(() => badge.classList.add('visible'), 100);
  setTimeout(() => subtitle.classList.add('visible'), 600);
  setTimeout(() => ctaWrapper.classList.add('visible'), 900);

  // ========== PARTÍCULAS ==========
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 20 : 50;

  let resizeTimeout;
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 150);
  }, { passive: true });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.fadeDir = Math.random() > 0.5 ? 1 : -1;
      // Cores da paleta: bege, cinza claro
      const colors = ['196,169,125', '197,194,186', '160,119,80'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Fade in/out suave
      this.opacity += this.fadeDir * 0.003;
      if (this.opacity >= 0.5) this.fadeDir = -1;
      if (this.opacity <= 0.05) this.fadeDir = 1;

      // Reposicionar se sair da tela
      if (this.x < -10 || this.x > canvas.width + 10 ||
          this.y < -10 || this.y > canvas.height + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();

      // Glow sutil
      ctx.shadowBlur = this.size * 4;
      ctx.shadowColor = `rgba(${this.color}, ${this.opacity * 0.5})`;
    }
  }

  // Inicializar partículas
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Linhas de conexão entre partículas próximas
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(196, 169, 125, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  let particlesRunning = true;

  function animateParticles() {
    if (!particlesRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    if (!isMobile) drawConnections();
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // Pausar partículas quando aba não visível (economia de bateria mobile)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      particlesRunning = false;
    } else {
      particlesRunning = true;
      animateParticles();
    }
  });

  // ========== CARROSSEL 3D SERVIÇOS ==========
  const carouselItems = document.querySelectorAll('.servicos__carousel-item');
  const descItems = document.querySelectorAll('.servicos__desc-item');
  const dots = document.querySelectorAll('.servicos__dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let carouselIndex = 0;
  const totalItems = carouselItems.length;

  function positionCarouselItems() {
    const angleStep = 360 / totalItems;
    const radius = 180; // raio do círculo vertical

    carouselItems.forEach((item, i) => {
      let offset = ((i - carouselIndex + totalItems) % totalItems);
      if (offset > totalItems / 2) offset -= totalItems;

      const angle = offset * angleStep;
      const rad = (angle * Math.PI) / 180;
      const y = Math.sin(rad) * radius;
      const z = Math.cos(rad) * radius - radius;
      const rotateX = -angle;
      const scale = offset === 0 ? 1 : 0.75;

      item.style.transform = `translate(-50%, -50%) translateY(${y}px) translateZ(${z}px) rotateX(${rotateX}deg) scale(${scale})`;

      if (offset === 0) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function goToCarousel(index) {
    carouselIndex = ((index % totalItems) + totalItems) % totalItems;
    positionCarouselItems();

    // Atualizar descrições
    descItems.forEach(d => d.classList.remove('active'));
    descItems[carouselIndex].classList.add('active');

    // Atualizar dots
    dots.forEach(d => d.classList.remove('active'));
    dots[carouselIndex].classList.add('active');
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => goToCarousel(carouselIndex - 1));
    nextBtn.addEventListener('click', () => goToCarousel(carouselIndex + 1));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToCarousel(parseInt(dot.dataset.index));
    });
  });

  positionCarouselItems();

  // Auto-rotate
  let carouselAuto = setInterval(() => goToCarousel(carouselIndex + 1), 5000);

  // Pausar auto no hover
  const carouselWrapper = document.getElementById('servicosCarousel');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', () => clearInterval(carouselAuto));
    carouselWrapper.addEventListener('mouseleave', () => {
      carouselAuto = setInterval(() => goToCarousel(carouselIndex + 1), 5000);
    });
  }

  // ========== SCROLL REVEAL ==========
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========== CONTADOR ANIMADO STATS ==========
  const statNumbers = document.querySelectorAll('.sobre__stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 60);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = current;
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ========== FILTROS SEÇÃO PROJETOS ==========
  const filterBtns = document.querySelectorAll('.projetos__filter-btn');
  const trackLeft = document.getElementById('trackLeft');
  const trackRight = document.getElementById('trackRight');

  const projetosImgs = {
    cozinhas: {
      left: [
        './img/2°/Cozinhas/cozinha-planejada-1.webp',
        './img/2°/Cozinhas/cozinha-planejada-2.webp',
        './img/2°/Cozinhas/cozinha-planejada-3.webp',
        './img/2°/Cozinhas/cozinha-planejada-4.webp',
        './img/2°/Cozinhas/cozinha-planejada-5.webp',
        './img/2°/Cozinhas/cozinha-planejada-6.webp',
        './img/2°/Cozinhas/cozinha-planejada-7.webp'
      ],
      right: [
        './img/2°/Cozinhas/cozinha-planejada-8.webp',
        './img/2°/Cozinhas/cozinha-planejada-9.webp',
        './img/2°/Cozinhas/cozinha-planejada-10.webp',
        './img/2°/Cozinhas/cozinha-planejada-11.webp',
        './img/2°/Cozinhas/cozinha-planejada-12.webp',
        './img/2°/Cozinhas/cozinha-planejada-13.webp',
        './img/2°/Cozinhas/cozinha-planejada-14.webp'
      ]
    },
    quartos: {
      left: [
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-1.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-2.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-3.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-4.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-5.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-6.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-7.webp'
      ],
      right: [
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-8.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-9.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-10.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-11.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-12.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-13.webp',
        './img/2°/Quartos e Closet/quarto-e-closet-planejado-14.webp'
      ]
    },
    banheiros: {
      left: [
        './img/2°/Banheiros/banheiro-planejado-1.webp',
        './img/2°/Banheiros/banheiro-planejado-2.webp',
        './img/2°/Banheiros/banheiro-planejado-3.webp',
        './img/2°/Banheiros/banheiro-planejado-4.webp',
        './img/2°/Banheiros/banheiro-planejado-5.webp',
        './img/2°/Banheiros/banheiro-planejado-6.webp',
        './img/2°/Banheiros/banheiro-planejado-7.webp'
      ],
      right: [
        './img/2°/Banheiros/banheiro-planejado-8.webp',
        './img/2°/Banheiros/banheiro-planejado-9.webp',
        './img/2°/Banheiros/banheiro-planejado-10.webp',
        './img/2°/Banheiros/banheiro-planejado-11.webp',
        './img/2°/Banheiros/banheiro-planejado-12.webp',
        './img/2°/Banheiros/banheiro-planejado-13.webp',
        './img/2°/Banheiros/banheiro-planejado-14.webp'
      ]
    },
    salas: {
      left: [
        './img/2°/Salas/sala-planejada-1.webp',
        './img/2°/Salas/sala-planejada-2.webp',
        './img/2°/Salas/sala-planejada-3.webp',
        './img/2°/Salas/sala-planejada-4.webp',
        './img/2°/Salas/sala-planejada-5.webp',
        './img/2°/Salas/sala-planejada-6.webp',
        './img/2°/Salas/sala-planejada-7.webp'
      ],
      right: [
        './img/2°/Salas/sala-planejada-8.webp',
        './img/2°/Salas/sala-planejada-9.webp',
        './img/2°/Salas/sala-planejada-10.webp',
        './img/2°/Salas/sala-planejada-11.webp',
        './img/2°/Salas/sala-planejada-12.webp',
        './img/2°/Salas/sala-planejada-13.webp',
        './img/2°/Salas/sala-planejada-14.webp'
      ]
    },
    diversos: {
      left: [
        './img/2°/Diversos/moveis-diversos-planejados-1.webp',
        './img/2°/Diversos/moveis-diversos-planejados-2.webp',
        './img/2°/Diversos/moveis-diversos-planejados-3.webp',
        './img/2°/Diversos/moveis-diversos-planejados-4.webp',
        './img/2°/Diversos/moveis-diversos-planejados-5.webp',
        './img/2°/Diversos/moveis-diversos-planejados-6.webp',
        './img/2°/Diversos/moveis-diversos-planejados-7.webp'
      ],
      right: [
        './img/2°/Diversos/moveis-diversos-planejados-8.webp',
        './img/2°/Diversos/moveis-diversos-planejados-9.webp',
        './img/2°/Diversos/moveis-diversos-planejados-10.webp',
        './img/2°/Diversos/moveis-diversos-planejados-11.webp',
        './img/2°/Diversos/moveis-diversos-planejados-12.webp',
        './img/2°/Diversos/moveis-diversos-planejados-13.webp',
        './img/2°/Diversos/moveis-diversos-planejados-14.webp'
      ]
    }
  };

  function updateMarquee(filter) {
    if (!trackLeft || !trackRight) return;

    // Adiciona fade-out suave
    trackLeft.classList.add('fade-out');
    trackRight.classList.add('fade-out');

    setTimeout(() => {
      const data = projetosImgs[filter];
      if (!data) return;
      
      // Limpa os tracks
      trackLeft.innerHTML = '';
      trackRight.innerHTML = '';

      // Popula Track Left (imagens + clones)
      data.left.forEach((src, idx) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${filter} planejado sob medida ${idx + 1}`;
        img.loading = 'lazy';
        trackLeft.appendChild(img);
      });
      // Clones
      data.left.forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        img.loading = 'lazy';
        trackLeft.appendChild(img);
      });

      // Popula Track Right (imagens + clones)
      data.right.forEach((src, idx) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${filter} de alto padrão ${idx + 1}`;
        img.loading = 'lazy';
        trackRight.appendChild(img);
      });
      // Clones
      data.right.forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        img.loading = 'lazy';
        trackRight.appendChild(img);
      });

      // Remove fade-out (fade-in automático)
      trackLeft.classList.remove('fade-out');
      trackRight.classList.remove('fade-out');
    }, 400);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      updateMarquee(filter);
    });
  });

});
