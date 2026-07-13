/* ==========================================================================
   HAPI LUXE HOTEL — ROOM TEMPLATE SCRIPT (room.js)
   Shared behaviour for room01.html – room07.html
   Vanilla JS only. No jQuery. No external libraries.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  initGallery();
  initCarousels();
  initRippleButtons();
  initScrollReveal();

});


/* ==========================================================================
   1. GALLERY  (large image + thumbnail slider + lightbox)
   Fully data-driven: reads every <img class="thumb"> already in the page,
   so it works for any number of images ("unlimited images" requirement)
   without touching this file when new rooms are added.
   ========================================================================== */
function initGallery() {

  const mainImage   = document.getElementById('mainImage');
  const thumbTrack   = document.getElementById('thumbTrack');
  const thumbPrevBtn = document.getElementById('thumbPrev');
  const thumbNextBtn = document.getElementById('thumbNext');
  const galleryCount = document.getElementById('galleryCount');
  const openLightboxBtn = document.getElementById('openLightbox');

  // Gallery is optional per page — bail out safely if markup is missing.
  if (!mainImage || !thumbTrack) return;

  const thumbs = Array.from(thumbTrack.querySelectorAll('.thumb'));
  if (thumbs.length === 0) return;

  // Build the image list from each thumbnail's data-full attribute
  // (falls back to the thumbnail's own src if data-full isn't set).
  const images = thumbs.map(function (thumb) {
    return thumb.getAttribute('data-full') || thumb.getAttribute('src');
  });

  let currentIndex = 0;

  function updateCounter() {
    if (galleryCount) {
      galleryCount.textContent = (currentIndex + 1) + ' / ' + images.length;
    }
  }

  function setActiveThumb(index) {
    thumbs.forEach(function (thumb, i) {
      thumb.classList.toggle('active', i === index);
    });

    // Keep the active thumbnail scrolled into view.
    const activeThumb = thumbs[index];
    if (activeThumb) {
      const trackRect = thumbTrack.getBoundingClientRect();
      const thumbRect  = activeThumb.getBoundingClientRect();
      if (thumbRect.left < trackRect.left || thumbRect.right > trackRect.right) {
        activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }

  function goToImage(index, skipLightboxSync) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;

    currentIndex = index;

    // Fade transition on the main image.
    mainImage.classList.add('is-fading');
    window.setTimeout(function () {
      mainImage.src = images[currentIndex];
      mainImage.classList.remove('is-fading');
    }, 180);

    setActiveThumb(currentIndex);
    updateCounter();

    if (!skipLightboxSync && lightboxIsOpen()) {
      setLightboxImage(currentIndex);
    }
  }

  // Thumbnail click.
  thumbs.forEach(function (thumb, i) {
    thumb.addEventListener('click', function () { goToImage(i); });
  });

  // Thumbnail row prev / next arrows (scrolls the strip, not the image).
  if (thumbPrevBtn) {
    thumbPrevBtn.addEventListener('click', function () {
      thumbTrack.scrollBy({ left: -160, behavior: 'smooth' });
    });
  }
  if (thumbNextBtn) {
    thumbNextBtn.addEventListener('click', function () {
      thumbTrack.scrollBy({ left: 160, behavior: 'smooth' });
    });
  }

  // Clicking the main image (or the zoom button) opens the lightbox.
  mainImage.addEventListener('click', function () { openLightbox(currentIndex); });
  if (openLightboxBtn) {
    openLightboxBtn.addEventListener('click', function () { openLightbox(currentIndex); });
  }

  updateCounter();


  /* ------------------------------------------------------------------
     LIGHTBOX
     ------------------------------------------------------------------ */
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxClose   = document.getElementById('lightboxClose');
  const lightboxPrev    = document.getElementById('lightboxPrev');
  const lightboxNext    = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  function lightboxIsOpen() {
    return !!(lightbox && lightbox.classList.contains('open'));
  }

  function setLightboxImage(index) {
    if (!lightboxImg) return;
    lightboxImg.src = images[index];
    if (lightboxCounter) {
      lightboxCounter.textContent = (index + 1) + ' / ' + images.length;
    }
  }

  function openLightbox(index) {
    if (!lightbox) return;
    currentIndex = index;
    setLightboxImage(currentIndex);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function lightboxNextImage() {
    goToImage(currentIndex + 1, true);
    setLightboxImage(currentIndex);
  }

  function lightboxPrevImage() {
    goToImage(currentIndex - 1, true);
    setLightboxImage(currentIndex);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext)  lightboxNext.addEventListener('click', lightboxNextImage);
  if (lightboxPrev)  lightboxPrev.addEventListener('click', lightboxPrevImage);

  // Click on the dark backdrop (but not the image itself) closes it.
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard support: ESC closes, arrow keys navigate.
  document.addEventListener('keydown', function (e) {
    if (!lightboxIsOpen()) return;
    if (e.key === 'Escape')      closeLightbox();
    else if (e.key === 'ArrowRight') lightboxNextImage();
    else if (e.key === 'ArrowLeft')  lightboxPrevImage();
  });

  // Touch swipe support on mobile.
  let touchStartX = 0;
  let touchEndX   = 0;
  const SWIPE_THRESHOLD = 40;

  if (lightbox) {
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      if (delta < 0) lightboxNextImage();
      else           lightboxPrevImage();
    }, { passive: true });
  }
}


/* ==========================================================================
   2. CAROUSELS  (Hotel Facilities + Nearby Places)
   Any element with class="carousel" is auto-wired: it looks for a
   [data-prev] button, a .carousel-track, and a [data-next] button inside it.
   Always advances by one full card width so 3 cards stay visible on desktop.
   ========================================================================== */
function initCarousels() {

  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(function (carousel) {
    const track    = carousel.querySelector('.carousel-track');
    const prevBtn  = carousel.querySelector('[data-prev]');
    const nextBtn  = carousel.querySelector('[data-next]');

    if (!track) return;

    function cardStep() {
      const firstCard = track.firstElementChild;
      if (!firstCard) return track.clientWidth;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      return firstCard.getBoundingClientRect().width + gap;
    }

    function updateButtons() {
      if (!prevBtn || !nextBtn) return;
      const maxScroll = track.scrollWidth - track.clientWidth - 2; // small tolerance
      prevBtn.disabled = track.scrollLeft <= 0;
      nextBtn.disabled = track.scrollLeft >= maxScroll;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        track.scrollBy({ left: cardStep(), behavior: 'smooth' });
      });
    }

    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();

    // Touch swipe support on mobile for these carousels too.
    let startX = 0;
    track.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      const endX = e.changedTouches[0].screenX;
      const delta = endX - startX;
      if (Math.abs(delta) < 40) return;
      track.scrollBy({ left: delta < 0 ? cardStep() : -cardStep(), behavior: 'smooth' });
    }, { passive: true });
  });
}


/* ==========================================================================
   3. BUTTON RIPPLE EFFECT
   Adds a Material-style expanding ripple centred on the click point of
   every .btn / .icon-btn element, matching the "Button Ripple" requirement.
   ========================================================================== */
function initRippleButtons() {

  const rippleTargets = document.querySelectorAll('.btn, .icon-btn');

  rippleTargets.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');

      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';

      btn.appendChild(ripple);
      window.setTimeout(function () { ripple.remove(); }, 600);
    });
  });
}


/* ==========================================================================
   4. SCROLL REVEAL
   Fades + slides sections into view as the user scrolls, using
   IntersectionObserver (falls back gracefully if unsupported).
   ========================================================================== */
function initScrollReveal() {

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el) { observer.observe(el); });
}
