// main.js

// Content definitions for both views
const contentStates = {
  original: {
    logoText: 'NeoVision',
    metaNum: '05',
    metaLabel: 'FUTURISTIC',
    titleHTML: `NEW <span class="accent-word">DIGITAL<svg class="heading-loop" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 5,28 C 60,32 120,30 190,15 C 140,32 70,36 35,42 C 20,44 15,38 32,34 C 65,26 135,16 195,8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><br>UNIVERSE`,
    subtitleHTML: 'In this futuristic realm, users can explore hyper-realistic virtual environments, interact with AI-driven avatars.',
    primaryCta: 'Get Started'
  },
  mancekt: {
    logoText: 'Mancekt',
    metaNum: '',
    metaLabel: 'Marketing Inteligente para Representantes de Consórcio',
    // Configured exactly on 3 lines as requested
    titleHTML: 'OS CLIENTES CERTOS<br>PRECISAM CHEGAR<br>ATÉ VOCÊ', 
    subtitleHTML: 'Sua carteira depende de indicação, panfletagem e lista fria de telefone. Você não tem controle sobre quantos interessados em consórcio entram, nem quando. Sem previsibilidade, não tem como bater meta. Nem escalar a operação.<br><br><strong>A Mancekt constrói o sistema que muda isso.</strong>',
    primaryCta: 'Quero ter controle sobre minhas vendas'
  }
};

let currentTheme = 'original';

// DOM Elements
const elements = {
  logoText: document.getElementById('logoText'),
  metaNum: document.getElementById('metaNum'),
  metaLabel: document.getElementById('metaLabel'),
  heroTitle: document.getElementById('heroTitle'),
  heroSubtitle: document.getElementById('heroSubtitle'),
  primaryCta: document.getElementById('primaryCta'),
  btnOriginal: document.getElementById('btnOriginal'),
  btnMancekt: document.getElementById('btnMancekt'),
  statsGroupOriginal: document.getElementById('statsGroupOriginal'),
  statsGroupMancekt: document.getElementById('statsGroupMancekt'),
  statValOriginal: document.getElementById('statValOriginal'),
  mancektStatVal1: document.getElementById('mancektStatVal1'),
  vrPortraitImg: document.getElementById('vrPortraitImg')
};

// Background removal using edge-protected flood-fill from top corners
function removeImageBackground(imgElement) {
  const img = new Image();
  img.src = imgElement.src;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const w = canvas.width;
    const h = canvas.height;
    
    // Grid coordinate visitor registry
    const visited = new Uint8Array(w * h);
    
    // Sample color from top-left (0,0)
    const targetR = data[0];
    const targetG = data[1];
    const targetB = data[2];
    
    // Seed queue from all four corners to clear bottom gray wedges
    const queue = [0, w - 1, (h - 1) * w, h * w - 1]; 
    
    const threshold = 60; // Safe tolerance range
    
    while (queue.length > 0) {
      const idx = queue.shift();
      if (visited[idx]) continue;
      visited[idx] = 1;
      
      const px = idx * 4;
      const r = data[px];
      const g = data[px + 1];
      const b = data[px + 2];
      
      const dist = Math.sqrt((r - targetR)**2 + (g - targetG)**2 + (b - targetB)**2);
      
      // Clear background pixels
      if (dist < threshold || (r > 215 && g > 215 && b > 215)) {
        data[px + 3] = 0; // Transparent alpha
        
        const cx = idx % w;
        const cy = Math.floor(idx / w);
        
        // Push 4-way neighbors
        if (cx > 0) queue.push(cy * w + (cx - 1));
        if (cx < w - 1) queue.push(cy * w + (cx + 1));
        if (cy > 0) queue.push((cy - 1) * w + cx);
        if (cy < h - 1) queue.push((cy + 1) * w + cx);
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    imgElement.src = canvas.toDataURL();
  };
}

// Numerical count animation helper
function animateValue(obj, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = progress * (end - start) + start;
    
    if (end % 1 !== 0) {
      obj.innerHTML = currentValue.toFixed(1) + suffix;
    } else {
      obj.innerHTML = Math.floor(currentValue) + suffix;
    }
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Global Switch Theme function
window.switchTheme = function(themeName) {
  if (themeName === currentTheme) return;
  currentTheme = themeName;
  
  const state = contentStates[themeName];
  
  // Transition fade effect
  const mainWrapper = document.querySelector('.hero-wrapper');
  mainWrapper.style.opacity = '0.3';
  mainWrapper.style.transition = 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
  
  setTimeout(() => {
    // Update active button state
    if (themeName === 'original') {
      elements.btnOriginal.classList.add('active');
      elements.btnMancekt.classList.remove('active');
      
      // Toggle stats groups
      elements.statsGroupOriginal.classList.remove('hidden');
      elements.statsGroupMancekt.classList.add('hidden');
      
      // Show meta num
      elements.metaNum.style.display = 'inline-block';
      elements.metaNum.textContent = state.metaNum;
      
      // Trigger counter animation
      animateValue(elements.statValOriginal, 0, 47.2, 1000, '%');
    } else {
      elements.btnMancekt.classList.add('active');
      elements.btnOriginal.classList.remove('active');
      
      // Toggle stats groups
      elements.statsGroupOriginal.classList.add('hidden');
      elements.statsGroupMancekt.classList.remove('hidden');
      
      // Hide meta num
      elements.metaNum.style.display = 'none';
      
      // Trigger counter animation
      animateValue(elements.mancektStatVal1, 0, 100, 1000, '%');
    }
    
    // Update standard fields
    elements.logoText.textContent = state.logoText;
    elements.metaLabel.textContent = state.metaLabel;
    elements.heroTitle.innerHTML = state.titleHTML;
    elements.heroSubtitle.innerHTML = state.subtitleHTML;
    elements.primaryCta.textContent = state.primaryCta;
    
    // Fade-in layout again
    mainWrapper.style.opacity = '1';
  }, 200);
};

// Initialize default state
document.addEventListener('DOMContentLoaded', () => {
  // Perform background cutout
  if (elements.vrPortraitImg) {
    removeImageBackground(elements.vrPortraitImg);
  }
  
  // Start counter
  animateValue(elements.statValOriginal, 0, 47.2, 1200, '%');
});
