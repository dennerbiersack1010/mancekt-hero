// main.js

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

  // Intersection Observer for counting up numbers when their section scrolls into view
  const countUpStats = [
    { id: 'mancektStatVal1', start: 0, end: 100, duration: 1200, prefix: '', suffix: '%' },
    { id: 'caseStat1', start: 0, end: 138, duration: 1800, prefix: '+', suffix: '%' },
    { id: 'caseStat2', start: 0, end: 42, duration: 1800, prefix: '-', suffix: '%' }
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
        const stat = countUpStats.find(s => s.id === targetId);
        if (stat) {
          animateValue(entry.target, stat.start, stat.end, stat.duration, stat.prefix, stat.suffix);
          observer.unobserve(entry.target); // Animate only once
        }
      }
    });
  }, observerOptions);

  countUpStats.forEach(stat => {
    const el = document.getElementById(stat.id);
    if (el) observer.observe(el);
  });

  // Toggle the hero statue's chart overlay on tap (touch devices only; desktop keeps the :hover behavior)
  const statueContainer = document.querySelector('.statue-hover-container');
  if (statueContainer && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    statueContainer.addEventListener('click', () => {
      statueContainer.classList.toggle('is-active');
    });
  }
});
