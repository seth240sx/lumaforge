function toggleNav(){
  const nav = document.querySelector('header nav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}
function submitForm(e){
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const subject = encodeURIComponent('Detailing Request — LumaForge');
  const body = encodeURIComponent(
    `Name: ${data.get('name')}
Email: ${data.get('email')}
Phone: ${data.get('phone')}
Vehicle: ${data.get('vehicle')}

Message:
${data.get('message')}`
  );
  window.location.href = `mailto:lumaforgedetailing@gmail.com?subject=${subject}&body=${body}`;
  return false;
}
(function(){
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
  const next = document.getElementById('next-slot');
  if(next){
    const now = new Date();
    const inTwoDays = new Date(now.getTime()+48*60*60*1000);
    next.textContent = inTwoDays.toLocaleString([], {weekday:'long', month:'short', day:'numeric'}) + ' — openings available';
  }
})();
