document.addEventListener('DOMContentLoaded', () => {
  // Inicia animações e efeitos base
  createLeavesAndPollen();
  typeEffect();
  initScrollSpyAndReveal();
  initMobileMenu();
  initContactForm();

  // Inicia novas funções (Fase 2)
  initThemeSwitcher();
  initLeafMouseInteraction();
});

// 1. Geração de Folhas Caindo e Pólen
function createLeavesAndPollen() {
  const container = document.getElementById('leaves-container');
  if (!container) return;

  const leafSVGs = [
    // Folha simples
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%234caf50" d="M50 0 Q70 40 50 80 Q30 40 50 0" opacity="0.65"/></svg>`,
    // Folha larga
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%232e7d32" d="M50 10 C65 25, 75 45, 50 90 C25 45, 35 25, 50 10 Z" opacity="0.65"/></svg>`,
    // Folha orgânica com haste
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%2381c784" d="M50 0 C60 20, 80 40, 55 60 C50 70, 50 90, 50 100 C50 90, 48 70, 45 60 C20 40, 40 20, 50 0 Z" opacity="0.55"/></svg>`
  ];

  // Spawn de 15 folhas
  for (let i = 0; i < 15; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    
    // SVG Aleatório
    const randomSVG = leafSVGs[Math.floor(Math.random() * leafSVGs.length)];
    
    // Wrapper interno para suportar desvio de mouse sem quebrar animação CSS
    const leafInner = document.createElement('div');
    leafInner.className = 'leaf-inner';
    leafInner.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(randomSVG)}')`;
    leaf.appendChild(leafInner);
    
    // Tamanho aleatório (entre 14px e 30px)
    const size = Math.random() * 16 + 14;
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    
    // Posição horizontal aleatória
    leaf.style.left = `${Math.random() * 100}vw`;
    leaf.style.top = `-${size + 20}px`;
    
    // Parâmetros de animação
    const duration = Math.random() * 10 + 10; // 10s a 20s
    const delay = Math.random() * 8; // delay até 8s
    leaf.style.animationDuration = `${duration}s, ${Math.random() * 4 + 3}s`; // falling e sway
    leaf.style.animationDelay = `${delay}s, ${Math.random() * 2}s`;
    
    container.appendChild(leaf);
  }

  // Spawn de 25 partículas de pólen flutuantes
  for (let i = 0; i < 25; i++) {
    const pollen = document.createElement('div');
    pollen.className = 'pollen';
    
    // Posição horizontal
    pollen.style.left = `${Math.random() * 100}vw`;
    
    // Tamanho aleatório (2px a 4px)
    const size = Math.random() * 2 + 2;
    pollen.style.width = `${size}px`;
    pollen.style.height = `${size}px`;
    
    // Duração e delay da ascensão
    const duration = Math.random() * 12 + 12; // 12s a 24s
    const delay = Math.random() * 12;
    pollen.style.animationDuration = `${duration}s`;
    pollen.style.animationDelay = `${delay}s`;
    
    container.appendChild(pollen);
  }
}

// 2. Efeito Máquina de Escrever (Typing Effect)
const phrases = [
  "Cultivando soluções sustentáveis para o futuro da agricultura.",
  "Inovação, tecnologia de precisão e sustentabilidade no campo.",
  "Unindo ciência agronômica e prática para alimentar o mundo."
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;

function typeEffect() {
  const typingText = document.getElementById('typing-text');
  if (!typingText) return;

  const currentPhrase = phrases[phraseIdx];
  
  if (isDeleting) {
    typingText.textContent = `"${currentPhrase.substring(0, charIdx - 1)}"`;
    charIdx--;
  } else {
    typingText.textContent = `"${currentPhrase.substring(0, charIdx + 1)}"`;
    charIdx++;
  }

  let typingSpeed = 70; // velocidade padrão
  
  if (isDeleting) {
    typingSpeed /= 2; // deleta mais rápido
  }

  if (!isDeleting && charIdx === currentPhrase.length) {
    typingSpeed = 2500; // pausa no fim da frase escrita
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    typingSpeed = 500; // pausa antes de começar a próxima
  }

  setTimeout(typeEffect, typingSpeed);
}

// 3. ScrollSpy & Scroll Reveal (Intersection Observer)
function initScrollSpyAndReveal() {
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    let currentSectionId = 'hero';
    const scrollPosition = window.scrollY;

    // Navbar Scrolled background
    if (scrollPosition > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollPosition >= sectionTop) {
        currentSectionId = section.getAttribute('id') || 'hero';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentSectionId) {
        link.classList.add('active');
      }
    });
  });

  // Intersection Observer para animações de fade-in e preenchimento de habilidades
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Se for a seção de habilidades, ativa a animação de preenchimento das barras
        if (entry.target.id === 'skills') {
          const progressSpans = entry.target.querySelectorAll('.progress-line span');
          progressSpans.forEach(span => {
            const targetWidth = span.getAttribute('data-width');
            span.style.width = targetWidth;
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

// 4. Menu Responsivo Mobile
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuBtn.querySelector('i').className = 'fas fa-bars';
    });
  });
}

// 5. Formulário de Contato com Feedback Visual
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const originalContent = submitBtn.innerHTML;
    submitBtn.style.backgroundColor = 'var(--accent)';
    submitBtn.style.color = 'var(--bg-darkest)';
    submitBtn.innerHTML = `<span>Mensagem Enviada!</span> <i class="fas fa-check-circle"></i>`;
    
    form.reset();

    setTimeout(() => {
      submitBtn.style.backgroundColor = '';
      submitBtn.style.color = '';
      submitBtn.innerHTML = originalContent;
    }, 3500);
  });
}

// 6. Alternador de Temas (Claro / Escuro)
function initThemeSwitcher() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  // Carrega tema prévio
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    toggleBtn.querySelector('i').className = 'fas fa-sun';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    
    // Altera ícone
    toggleBtn.querySelector('i').className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    
    // Salva preferência
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  });
}

// 7. Interação de Fuga das Folhas em relação ao cursor do mouse
function initLeafMouseInteraction() {
  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const leafInners = document.querySelectorAll('.leaf-inner');
    
    leafInners.forEach(inner => {
      // Pega coordenadas absolutas do elemento interno
      const rect = inner.getBoundingClientRect();
      const leafX = rect.left + rect.width / 2;
      const leafY = rect.top + rect.height / 2;
      
      // Distância matemática
      const diffX = leafX - mouseX;
      const diffY = leafY - mouseY;
      const dist = Math.sqrt(diffX * diffX + diffY * diffY);
      
      // Se o mouse estiver a menos de 120px da folha
      if (dist < 120) {
        const force = (120 - dist) / 120;
        const pushX = (diffX / dist) * 45 * force;
        const pushY = (diffY / dist) * 45 * force;
        
        inner.style.transform = `translate(${pushX}px, ${pushY}px) scale(1.15) rotate(${pushX * 0.5}deg)`;
      } else {
        inner.style.transform = '';
      }
    });
  });
}