// main.js

// DOM Elements
const elements = {
  mancektStatVal1: document.getElementById('mancektStatVal1')
};

// Numerical count animation helper
function animateValue(obj, start, end, duration, suffix = '') {
  if (!obj) return;
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

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Start counter for Mancekt
  if (elements.mancektStatVal1) {
    animateValue(elements.mancektStatVal1, 0, 100, 1200, '%');
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
});
