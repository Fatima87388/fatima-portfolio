/* render.js — fetch + build all DOM sections */
import { initCarousel } from './modules/carousel.js';
console.log("NEW RENDER.JS LOADED");
import { initCounters, initSkillRings, typewrite } from './modules/animations.js';

const $ = s => document.querySelector(s);

export async function loadresume_new(path = 'src/data/resume_new.json') {
  const r = await fetch(path);
  if (!r.ok) throw new Error('resume_new.json not found');
  return r.json();
}

export function render(d) {
  const p = d.profile;

  // Profile
  if ($('#availability')) $('#availability').textContent = p.availability;
  if ($('#emailLink'))    $('#emailLink').href = `mailto:${p.email}`;
  if ($('#linkedin'))     $('#linkedin').href = p.linkedin;
  if ($('#year'))         $('#year').textContent = new Date().getFullYear();

  // Hero intro — typewriter
  const introEl = $('#intro');
  if (introEl) {
    introEl.textContent = '';
    setTimeout(() => typewrite(introEl, p.intro), 500);
  }

  // Hero stats
  if ($('#heroStats')) {
    $('#heroStats').innerHTML = p.stats.map(x => `
      <div class="hero-stat">
        <span class="hstat-value" data-target="${x.value}">${x.value}</span>
        <span class="hstat-label">${x.label}</span>
      </div>
    `).join('');
  }

  // Skills ticker
  if ($('#tickerTrack')) {
    const items = [...d.expertise, ...d.expertise].join('  ·  ');
    $('#tickerTrack').textContent = items + '  ·  ' + items;
  }

  // Work — stacked list
  if ($('#workList')) {
    const tints = ['tint-1', 'tint-2', 'tint-3'];
    const resultParts = r => {
      const m = r.match(/^([0-9.×−+%]+x?k?)\s*(.*)$/);
      return m ? [m[1], m[2]] : [r, ''];
    };
    console.log("RENDER WORK LINKS:", d.work.map(x => x.link));
    $('#workList').innerHTML = d.work.map((x, i) => {
      const [rv, rl] = resultParts(x.result);
      return `
        <div class="work-item ${tints[i % 3]}" tabindex="0" data-index="${i}" aria-label="${x.title}">
          <div class="work-meta">
            <span class="work-num">0${i + 1}</span>
            <span class="work-type">${x.type}</span>
            <span class="work-year">${x.year}</span>
          </div>
          <div class="work-content">
            <h3>${x.title}</h3>
            <p>${x.summary}</p>
          </div>
          <div class="work-result">
  <span class="result-big">${rv}</span>
  <span class="result-lbl">${rl || 'outcome'}</span>
  ${
    x.link
      ? `<a
          href="${x.link}"
          target="_blank"
          rel="noopener noreferrer"
          class="work-arrow"
          aria-label="Open project"
        >↗</a>`
      : ''
  }
</div>
        </div>
      `;
    }).join('');
  }

  // Experience — accordion
  if ($('#expList')) {
    $('#expList').innerHTML = d.experience.map((x, i) => `
      <div class="exp-item ${i === 0 ? 'open' : ''}" data-idx="${i}">
        <div class="exp-header">
          <span class="exp-period">${x.period}</span>
          <div class="exp-info">
            <span class="exp-company">${x.company}</span>
            <div class="exp-role">${x.title}</div>
          </div>
          <button class="exp-toggle" aria-expanded="${i === 0}">${i === 0 ? '×' : '+'}</button>
        </div>
        <div class="exp-body">
          <div class="exp-body-inner">
            <p>${x.description}</p>
            <div class="tags">${x.tags.map(t => `<span>${t}</span>`).join('')}</div>
          </div>
        </div>
      </div>
    `).join('');

    // Accordion interaction
    $('#expList').addEventListener('click', e => {
      const header = e.target.closest('.exp-header');
      if (!header) return;
      const item   = header.closest('.exp-item');
      const toggle = item.querySelector('.exp-toggle');
      const isOpen = item.classList.toggle('open');
      toggle.textContent = isOpen ? '×' : '+';
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Skills — ring charts
  if ($('#skillsGrid') && d.skills) {
    const CIRC = 251.3; // 2π × 40
    $('#skillsGrid').innerHTML = d.skills.map(cat => {
      const avg    = Math.round(cat.items.reduce((s, x) => s + x.level, 0) / cat.items.length);
      const offset = CIRC * (1 - avg / 100);
      return `
        <div class="skill-ring-group">
          <div class="skill-ring-header">
            <span class="skill-cat">${cat.category}</span>
            <span class="skill-avg-num">${avg}</span>
          </div>
          <div class="ring-figure">
            <svg class="ring-svg" viewBox="0 0 100 100">
              <circle class="ring-track" cx="50" cy="50" r="40"/>
              <circle class="ring-fill" cx="50" cy="50" r="40"
                      style="--offset:${offset}" data-offset="${offset}"/>
            </svg>
            <div class="ring-center-label">${avg}</div>
          </div>
          <ul class="skill-items">
            ${cat.items.map(item => `
              <li class="skill-row">
                <span class="skill-name">${item.name}</span>
                <div class="skill-track">
                  <div class="skill-fill-bar" style="--level:${item.level}%"></div>
                </div>
                <span class="skill-pct">${item.level}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }).join('');
    initSkillRings();
  }

  // Principles
  if ($('#principles')) {
    $('#principles').innerHTML = d.principles.map(x => `
      <div class="principle-panel">
        <span class="principle-num">${x.number}</span>
        <h3>${x.title}</h3>
        <p>${x.text}</p>
      </div>
    `).join('');
  }

  // Testimonials
  if ($('#testimonialTrack') && d.testimonials) {
    initCarousel(d.testimonials);
  }

  // Counters after paint
  requestAnimationFrame(initCounters);
}
