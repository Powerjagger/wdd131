// coolpics.js - Menu toggle, resize handling, and image viewer modal

console.log("CoolPics JavaScript is loaded!");

// ---- Menu toggle + resize handling ----
const menuButton = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

if (!menuButton || !navLinks) {
  console.warn('Menu button or nav links not found in the DOM.');
} else {
  // Ensure menu button has proper type / aria attribute initially (defensive)
  if (!menuButton.hasAttribute('type')) menuButton.setAttribute('type', 'button');
  if (!menuButton.hasAttribute('aria-controls')) menuButton.setAttribute('aria-controls', 'nav-links');

  // Toggle menu on button click and keep aria-expanded in sync
  menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('hide');
    const isOpen = !navLinks.classList.contains('hide');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  // Make sure the menu state matches viewport on load/resize
  function handleResize() {
    // breakpoint must match your CSS media query (1000px)
    if (window.innerWidth > 1000) {
      // On large screens always show menu and reflect that in aria
      navLinks.classList.remove('hide');
      menuButton.setAttribute('aria-expanded', 'true');
    } else {
      // On small screens hide menu by default and reflect that in aria
      navLinks.classList.add('hide');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  }

  // Run on load and on resize
  window.addEventListener('resize', handleResize);
  // call once to initialize correct state
  handleResize();
}

// ---- Image viewer modal ----

// Utility: construct full-size image path from the small image src attribute.
// This handles simple paths and optional query/hash fragments.
// Examples:
//  - "images/norris-sm.jpeg" -> "images/norris-full.jpeg"
//  - "norris-sm.jpg?v=1" -> "norris-full.jpg?v=1"
function makeFullSrcFromSmall(srcAttr) {
  if (!srcAttr) return srcAttr;
  // Split off query/hash if present
  const [baseAndName, ...rest] = srcAttr.split(/([?#].*)$/); // keeps query/hash in rest[0] if present
  const base = baseAndName;
  const suffix = rest.length ? rest[0] : '';

  // Replace the last "-sm.<ext>" occurrence with "-full.<ext>"
  // This will only replace when "-sm" is just before the file extension.
  const replaced = base.replace(/-sm(?=\.[^.\/\\]+$)/, '-full');

  // If nothing changed (pattern not found), try a more permissive replace of "-sm" before extension
  const finalBase = replaced === base ? base.replace(/-sm(\.[^.\/\\]+)$/, '-full$1') : replaced;

  return finalBase + suffix;
}

// Create a single dialog element once and reuse it
const modal = document.createElement('dialog');
modal.id = 'image-viewer';
// Add a semantic inner wrapper for easy positioning
modal.innerHTML = `<div class="viewer-inner" role="document"></div>`;
document.body.appendChild(modal);

// Grab inner container for content updates
const inner = modal.querySelector('.viewer-inner');

// Close helper
function closeModal() {
  // dialog.close() will throw if dialog isn't open in some environments — guard with modal.open
  if (typeof modal.open !== 'undefined' ? modal.open : modal.hasAttribute('open')) {
    try {
      if (typeof modal.close === 'function') modal.close();
      else modal.removeAttribute('open');
    } catch (err) {
      // fallback: remove the open attribute if present
      modal.removeAttribute('open');
    }

    // Clean up contents so next open starts fresh
    inner.innerHTML = '';
    // restore page scrolling if you added no-scroll class
    document.body.classList.remove('no-scroll');
  }
}

// Open helper: fill modal with the correct image and show it
function openModalWithImage(srcAttr, altText = '') {
  const fullSrc = makeFullSrcFromSmall(srcAttr);
  if (!fullSrc) {
    console.warn('Could not determine full image source for', srcAttr);
    return;
  }

  // Build inner HTML: image plus close button
  inner.innerHTML = `
    <img src="${fullSrc}" alt="${escapeHtml(altText)}">
    <button class="close-viewer" aria-label="Close image viewer">X</button>
  `;

  // showModal gives native keyboard handling and backdrop
  try {
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      // fallback for environments without dialog.showModal
      modal.setAttribute('open', 'true');
    }
  } catch (err) {
    // Some browsers may require dialog polyfills or special handling
    console.error('dialog.showModal failed:', err);
    modal.setAttribute('open', 'true');
  }

  // optional: prevent body scroll if needed
  document.body.classList.add('no-scroll');
}

// Event delegation: click inside the gallery
const gallery = document.querySelector('.gallery');
if (gallery) {
  gallery.addEventListener('click', (event) => {
    const clickedImg = event.target.closest('img');
    if (!clickedImg || !gallery.contains(clickedImg)) return;

    // Use the attribute src (the literal filename you placed in HTML)
    const srcAttr = clickedImg.getAttribute('src');
    const altText = clickedImg.getAttribute('alt') || '';

    openModalWithImage(srcAttr, altText);
  });
}

// Close when clicking the close button inside modal (delegated)
modal.addEventListener('click', (event) => {
  const btn = event.target.closest('.close-viewer');
  if (btn) {
    closeModal();
    return;
  }
  // close if user clicks the backdrop area (the dialog itself)
  if (event.target === modal) {
    closeModal();
  }
});

// Close on Escape key: dialog typically handles this, but provide a fallback
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && (typeof modal.open !== 'undefined' ? modal.open : modal.hasAttribute('open'))) {
    closeModal();
  }
});

// Also listen for the dialog cancel event (when supported) to clean up
modal.addEventListener('cancel', (event) => {
  // cancel is fired on Escape for native dialogs; prevent default so we can close cleanly
  event.preventDefault();
  closeModal();
});

// Small HTML-escaping helper for alt text insertion safety
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[m];
  });
}
