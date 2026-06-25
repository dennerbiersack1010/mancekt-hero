// main.js

// DOM Elements
const elements = {
  mancektStatVal1: document.getElementById('mancektStatVal1')
};

// Numerical count animation helper
function animateValue(obj, start, end, duration, prefix = '', suffix = '') {
  if (!obj) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = progress * (end - start) + start;
    
    obj.innerHTML = prefix + Math.floor(currentValue) + suffix;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Start counter for Mancekt
  if (elements.mancektStatVal1) {
    animateValue(elements.mancektStatVal1, 0, 100, 1200, '', '%');
  }

  // FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      // Check if already active
      const isActive = item.classList.contains('active');
      
      // Close other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Intersection Observer for counting case numbers
  const caseStats = [
    { id: 'caseStat1', start: 0, end: 138, prefix: '+', suffix: '%' },
    { id: 'caseStat2', start: 0, end: 42, prefix: '-', suffix: '%' }
  ];

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetId = entry.target.id;
        const stat = caseStats.find(s => s.id === targetId);
        if (stat) {
          animateValue(entry.target, stat.start, stat.end, 1800, stat.prefix, stat.suffix);
          observer.unobserve(entry.target); // Animate only once
        }
      }
    });
  }, observerOptions);

  caseStats.forEach(stat => {
    const el = document.getElementById(stat.id);
    if (el) observer.observe(el);
  });
});
