/**
 * DIRECT URL FIX - Minimal implementation
 * 
 * This script uses the most direct approach possible to fix navigation issues
 */

// Execute immediately
(function() {
  // Override the default window.location.href setter to prevent invalid URLs
  const originalHrefDescriptor = Object.getOwnPropertyDescriptor(window.location, 'href');
  
  if (originalHrefDescriptor && originalHrefDescriptor.set) {
    Object.defineProperty(window.location, 'href', {
      set: function(newValue) {
        // Remove any forward slashes right after the domain and before the hash
        if (newValue.includes('//')) {
          // Get domain part
          const domainPart = newValue.split('/').slice(0, 3).join('/');
          // Get the rest (may include hash)
          let restPart = newValue.substring(domainPart.length);
          
          // Fix repeated slashes
          while (restPart.startsWith('//')) {
            restPart = restPart.replace('//', '/');
          }
          
          // Reassemble the URL
          newValue = domainPart + restPart;
        }
        
        // Call the original setter
        originalHrefDescriptor.set.call(this, newValue);
      },
      get: originalHrefDescriptor.get,
      configurable: true
    });
  }
  
  // Override window.location.hash setter
  const originalHashDescriptor = Object.getOwnPropertyDescriptor(window.location, 'hash');
  
  if (originalHashDescriptor && originalHashDescriptor.set) {
    Object.defineProperty(window.location, 'hash', {
      set: function(newValue) {
        // Ensure hash format is clean
        if (newValue.startsWith('#/')) {
          newValue = '#' + newValue.substring(2);
        }
        
        // Call the original setter
        originalHashDescriptor.set.call(this, newValue);
      },
      get: originalHashDescriptor.get,
      configurable: true
    });
  }
  
  // Fix the URL immediately if needed
  function fixUrl() {
    const location = window.location;
    const url = location.href;
    
    // Check if URL has the pattern: domain//path or domain/#/path
    if (url.match(/\/\/[^/]/) || url.includes("#/')) {
      // Get origin
      const origin = location.origin;
      
      // Get path or hash content (without leading slashes)
      let path = location.pathname;
      if (path.startsWith('//')) {
        path = path.substring(1);
      }
      
      // Get hash (without leading slash)
      let hash = location.hash;
      if (hash.startsWith('#/')) {
        hash = '#' + hash.substring(2);
      }
      
      // Build clean URL
      const cleanUrl = origin + path + hash;
      
      // Only update if different
      if (url !== cleanUrl) {
        console.log("🔧 Direct fix applied:", url, "→", cleanUrl);
        history.replaceState(null, '', cleanUrl);
      }
    }
  }
  
  // Execute fix immediately
  fixUrl();
  
  // Also fix on hashchange
  window.addEventListener('hashchange', fixUrl);
})();