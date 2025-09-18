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
