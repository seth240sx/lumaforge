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
  const endpoint = form.getAttribute('action');
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
        form.querySelectorAll('input:not([type="hidden"]), textarea').forEach(el => (el.value = ''));
        form.querySelectorAll('select').forEach(el => (el.selectedIndex = 0));
        const firstInput = form.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();

        statusEl.textContent = '✅ Thanks! Your booking request was sent.';
        setTimeout(() => { statusEl.textContent = ''; }, 6000);
      } else {
        let msg = 'Something went wrong. Please try again or email us directly.';
        try {
          const data = await resp.json();
          if (data.errors?.length) msg = data.errors.map((e) => e.message).join(', ');
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

// Footer year
(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

// --- Next Availability (Los Angeles 6 AM–8 PM) ---
(function(){
  const el = document.getElementById('next-slot');
  if(!el) return;

  const now = new Date();
  const laNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  const opening = 6;   // 6 AM PT
  const closing = 20;  // 8 PM PT

  let nextSlot = new Date(laNow);

  if (laNow.getHours() >= closing) {
    // After hours: tomorrow 6 AM
    nextSlot.setDate(nextSlot.getDate() + 1);
    nextSlot.setHours(opening, 0, 0, 0);
  } else if (laNow.getHours() < opening) {
    // Before opening: today 6 AM
    nextSlot.setHours(opening, 0, 0, 0);
  } else {
    // During hours: round up to next full hour
    nextSlot.setHours(laNow.getHours() + 1, 0, 0, 0);
  }

  const opts = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles'
  };
  el.textContent = `Earliest: ${nextSlot.toLocaleString([], opts)} (6 AM–8 PM PT)`;
})();

// --- Reviews marquee pause on hover ---
(function(){
  const track = document.getElementById('reviewTrack');
  if(track){
    track.addEventListener('mouseenter', ()=> track.style.animationPlayState='paused');
    track.addEventListener('mouseleave', ()=> track.style.animationPlayState='running');
  }
})();

// --- Reviews / Happy Drivers marquee initializer ---
(function () {
  const track = document.getElementById('reviewTrack');
  if (!track) return;

  const originals = Array.from(track.children);
  if (originals.length) {
    const clones = originals.map(n => n.cloneNode(true));
    track.append(...clones);
  }

  const PX_PER_SEC = 80;
  requestAnimationFrame(() => {
    const totalWidth = track.scrollWidth;
    const halfWidth = totalWidth / 2;
    const duration = Math.max(10, halfWidth / PX_PER_SEC);
    track.style.setProperty('--marquee-duration', `${duration}s`);
    track.classList.add('animate-marquee');
    track.style.animation = `lf-marquee ${duration}s linear infinite`;
    console.log('Marquee ON', { halfWidth, duration });
  });
})();
