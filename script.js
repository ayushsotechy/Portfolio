const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (navigator.webdriver) document.body.classList.add('automation');

document.body.classList.add('is-loading');
window.addEventListener('load', () => {
  window.setTimeout(() => {
    document.querySelector('.page-loader').classList.add('loaded');
    document.body.classList.remove('is-loading');
  }, prefersReducedMotion ? 0 : 950);
});

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let pointerX = 0;
let pointerY = 0;
let ringX = 0;
let ringY = 0;

window.addEventListener('pointermove', (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  dot.style.transform = `translate(${pointerX - 3}px, ${pointerY - 3}px)`;
});

function animateCursor() {
  ringX += (pointerX - ringX) * 0.14;
  ringY += (pointerY - ringY) * 0.14;
  ring.style.transform = `translate(${ringX - 17}px, ${ringY - 17}px)`;
  requestAnimationFrame(animateCursor);
}
if (!prefersReducedMotion) animateCursor();

document.querySelectorAll('a, button, input, textarea').forEach((element) => {
  element.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  element.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    if (prefersReducedMotion) return;
    const box = element.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) * 0.22;
    const y = (event.clientY - box.top - box.height / 2) * 0.22;
    element.style.transform = `translate(${x}px, ${y}px)`;
  });
  element.addEventListener('pointerleave', () => { element.style.transform = ''; });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const header = document.querySelector('.site-header');
const parallaxItems = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  if (prefersReducedMotion) return;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax);
    item.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
  });
}, { passive: true });

const roles = ['Full-stack systems', 'Product engineering', 'Data-driven tools', 'Human-first software'];
let roleIndex = 0;
const roleText = document.querySelector('#role-text');
window.setInterval(() => {
  roleText.classList.add('flip');
  window.setTimeout(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleText.textContent = roles[roleIndex];
  }, 250);
  window.setTimeout(() => roleText.classList.remove('flip'), 520);
}, 2700);

document.querySelectorAll('[data-tilt]').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    if (prefersReducedMotion || window.innerWidth < 900) return;
    const box = element.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    element.style.transform = `perspective(1000px) rotateX(${-y * 2.5}deg) rotateY(${x * 2.5}deg)`;
  });
  element.addEventListener('pointerleave', () => { element.style.transform = ''; });
});

const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    filter.classList.add('active');
    const selected = filter.dataset.filter;
    cards.forEach((card) => {
      const matches = selected === 'all' || card.dataset.category.split(' ').includes(selected);
      card.classList.toggle('hidden', !matches);
    });
  });
});

const form = document.querySelector('#contact-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent(`Portfolio enquiry from ${data.get('name')}`);
  const body = encodeURIComponent(`${data.get('message')}\n\nFrom: ${data.get('name')} (${data.get('email')})`);
  const button = form.querySelector('button');
  button.classList.add('sent');
  button.querySelector('span').innerHTML = 'Opening<br />mail app';
  window.location.href = `mailto:ayushverma3006@gmail.com?subject=${subject}&body=${body}`;
});

function updateTime() {
  const time = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date());
  document.querySelector('#local-time').textContent = `${time} IST`;
}
updateTime();
window.setInterval(updateTime, 60000);
