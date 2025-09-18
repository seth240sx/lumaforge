function toggleNav() {
  const nav = document.querySelector('header nav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// Replace old mailto submit with Formspree AJAX
function submitForm(e) {
  e.preventDefault();

  const form = e.target;
  const statusEl = document.getElementById('formStatus');
  const submitBtn = form.querySelector('button[type="submit"]');
  const endpoint = form.getAttribute('action'); // Formspree endpoint
  const formData = new FormData(form);

  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  statusEl.textContent = '';

  fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
    .then(async (resp) => {
      if (resp.ok) {
        form.reset();
        // Ensure all fields are cleared
        form.querySelectorAll('input:not([type="hidden"]), textarea').forEach(el => (el.value = ''));
        form.querySelectorAll('select').forEach(el => (el.selectedIndex = 0));
        const firstInput = form.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();

        statusEl.textContent = '✅ Thanks! Your booking request was sent.';
        setTimeout(() => {
          statusEl.textContent = '';
        }, 6000);
      } else {
        let msg = 'Something went wrong. Please try again or email us directly.';
        try {
          const data = await resp.json();
          if (data.errors?.length) {
            msg = data.errors.map((e) => e.message).join(', ');
          }
        } catch (_) {}
        statusEl.textContent = msg;
      }
    })
    .catch(() => {
      statusEl.textContent = 'Network error. Please check your connection and try again.';
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });

  return false;
}

(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const next = document.getElementById('next-slot');
  if (next) {
    const now = new Date();
    const inTwoDays = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    next.textContent =
      inTwoDays.toLocaleString([], { weekday: 'long', month: 'short', day: 'numeric' }) +
      ' — openings available';
  }
})();

// Reviews marquee pause on hover
(function(){
  const track = document.getElementById('reviewTrack');
  if(track){
    track.addEventListener('mouseenter', ()=> track.style.animationPlayState='paused');
    track.addEventListener('mouseleave', ()=> track.style.animationPlayState='running');
  }
})();

// Simple "next availability" estimator (tomorrow 10:00 local)
(function(){
  const el = document.getElementById('next-slot');
  if(!el) return;
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 10, 0);
  const opts = { weekday:'short', month:'short', day:'numeric', hour:'numeric', minute:'2-digit' };
  el.textContent = `Earliest: ${tomorrow.toLocaleString([], opts)}`;
})();


// --- Happy Drivers marquee initializer ---
(function () {
  const track = document.getElementById('reviewTrack');
  if (!track) return;

  // Duplicate children once for a seamless loop (-50% translate equals originals width)
  const originals = Array.from(track.children);
  if (originals.length) {
    const clones = originals.map(n => n.cloneNode(true));
    track.append(...clones);
  }

  // Speed control (pixels per second)
  const PX_PER_SEC = 80;

  // Compute duration and start animation. Also force inline animation to bypass reduced-motion disabling.
  requestAnimationFrame(() => {
    const totalWidth = track.scrollWidth;
    const halfWidth = totalWidth / 2; // width of originals only
    const duration = Math.max(10, halfWidth / PX_PER_SEC); // seconds
    track.style.setProperty('--marquee-duration', `${duration}s`);
    track.classList.add('animate-marquee');
    track.style.animation = `lf-marquee ${duration}s linear infinite`; // inline to ensure it runs
    console.log('Marquee ON', { halfWidth, duration });
  });

  // Pause/resume on hover as a UX nicety (works even without CSS fallback)
  const container = track.closest('.card') || track.parentElement;
  if (container) {
    container.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    container.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  }
// --- Happy Drivers marquee initializer ---
(function () {
  const track = document.getElementById('reviewTrack');
  if (!track) return;

  // Duplicate children once for a seamless loop
  const originals = Array.from(track.children);
  if (originals.length) {
    const clones = originals.map(n => n.cloneNode(true));
    track.append(...clones);
  }

  // Speed control (pixels per second)
  const PX_PER_SEC = 80;

  // Compute duration and start animation
  requestAnimationFrame(() => {
    const totalWidth = track.scrollWidth;
    const halfWidth = totalWidth / 2;
    const duration = Math.max(10, halfWidth / PX_PER_SEC);
    track.style.setProperty('--marquee-duration', `${duration}s`);
    track.classList.add('animate-marquee');
    track.style.animation = `lf-marquee ${duration}s linear infinite`;
  });

  // Pause on hover
  const container = track.closest('.card') || track.parentElement;
  if (container) {
    container.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    container.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  }
})();
