/**
 * Enhanced navigation cleanup script for TradeNavigator
 * Fixes repeated forward slashes and handles WebSocket connections
 */

(function() {
  const fixUrl = (url) => {
    if (!url) return url;
    return url.replace(/([^:]\/)\/+/g, '$1');
  };

  // Wait for the DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize fix for WebSocket connections
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
      return new originalWebSocket(fixUrl(url), protocols);
    };
    // Ensure window.location.pathname doesn't get duplicated in hash navigation
    fixCurrentUrl();
    
    // Fix initial link hrefs
    fixAllHrefs();
    
    // Set up a MutationObserver to fix any links that get added to the DOM
    const observer = new MutationObserver(fixAllHrefs);
    observer.observe(document.body, { 
      childList: true,
      subtree: true 
    });
    
    // Fix hash changes
    window.addEventListener('hashchange', fixCurrentUrl);
  });
  
  // Fix the current URL by removing path segments from hash URLs
  function fixCurrentUrl() {
    if (window.location.hash) {
      // If we have a hash, ensure we don't have path segments in the URL
      // This fixes the root cause of the "repeated forward slashes" errors
      
      // Get only the origin part of the URL
      const origin = window.location.origin;
      
      // Get the hash without the # symbol
      let hashContent = window.location.hash.substring(1);
      
      // Remove any leading slashes from the hash content
      hashContent = hashContent.replace(/^\/+/, '');
      
      // Create a clean URL with just the origin and the hash
      const cleanUrl = `${origin}/#${hashContent}`;
      
      // Only update if the current URL is different
      if (window.location.href !== cleanUrl) {
        // Use history.replaceState to avoid triggering another hashchange event
        window.history.replaceState(null, '', cleanUrl);
      }
    }
  }
  
  // Fix all hrefs in the document 
  function fixAllHrefs() {
    // Get all links with hash hrefs
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // If href has format #/path, convert to #path
      if (href.match(/^#\/+/)) {
        const cleanHref = '#' + href.substring(1).replace(/^\/+/, '');
        link.setAttribute('href', cleanHref);
      }
      
      // Prevent default behavior to ensure our hash handler works
      link.addEventListener('click', function(e) {
        // Don't add this if it already exists (to avoid multiple handlers)
        if (!this.hasAttribute('data-hash-fixed')) {
          e.preventDefault();
          
          // Get the cleaned href and update the hash
          const cleanHref = this.getAttribute('href');
          const hashContent = cleanHref.substring(1);
          
          // Update the hash which will trigger the hashchange event
          window.location.hash = hashContent;
          
          // Mark as fixed
          this.setAttribute('data-hash-fixed', 'true');
        }
      }, { once: true });
    });
  }
})();