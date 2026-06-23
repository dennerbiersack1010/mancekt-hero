// main.js

// DOM Elements
const elements = {
  mancektStatVal1: document.getElementById('mancektStatVal1'),
  statueBase: document.getElementById('statueBase'),
  statueHover: document.getElementById('statueHover')
};

// Background removal using edge-protected flood-fill from all four corners
function removeImageBackground(imgElement) {
  if (!imgElement) return;
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
  // Perform background cutout on both statue layers
  if (elements.statueBase) {
    removeImageBackground(elements.statueBase);
  }
  if (elements.statueHover) {
    removeImageBackground(elements.statueHover);
  }
  
  // Start counter for Mancekt
  if (elements.mancektStatVal1) {
    animateValue(elements.mancektStatVal1, 0, 100, 1200, '%');
  }

  // 3D Tilt Effect on Hover for both images
  const wrapper = document.querySelector('.image-wrapper');
  if (wrapper && elements.statueBase && elements.statueHover) {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation based on offset from center
      const rotateX = -(y - centerY) / 15; 
      const rotateY = (x - centerX) / 15;
      
      const transformStyle = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03) translateZ(10px)`;
      elements.statueBase.style.transform = transformStyle;
      elements.statueHover.style.transform = transformStyle;
    });
    
    wrapper.addEventListener('mouseleave', () => {
      const resetStyle = 'rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
      elements.statueBase.style.transform = resetStyle;
      elements.statueHover.style.transform = resetStyle;
    });
  }
});
