'use strict';

const websites = new Map([
  ['https://github.com/AndersH3/IQ-test-differences', 'https://iqdiff.hellstrom.pw/'],
  ['https://github.com/AndersH3/Scoring', 'https://scoring.hellstrom.pw/']
]);

function parseProjects(text) {
  const projects = [], seen = new Set();
  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^(.*?)\s+(https:\/\/github\.com\/[^\s]+)\s*$/i);
    if (!match) throw new Error('Invalid project on line ' + (index + 1));
    const url = new URL(match[2]);
    if (url.hostname !== 'github.com' || url.username || url.password || url.port || url.search || url.hash || !/^\/[\w-]+\/[\w.-]+\/?$/.test(url.pathname)) {
      throw new Error('Invalid repository on line ' + (index + 1));
    }
    const href = url.href.replace(/\/$/, '');
    if (seen.has(href.toLowerCase())) continue;
    seen.add(href.toLowerCase());
    projects.push({name: match[1].trim(), href, repository: url.pathname.slice(1).replace(/\/$/, '').replace('/', ' / ')});
  }
  return projects;
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function renderProjects(projects) {
  const fragment = document.createDocumentFragment();
  projects.forEach((project, i) => {
    const li = element('li'), article = element('article'), details = element('div'), nav = element('nav');
    details.append(element('h3', project.name), element('p', project.repository, 'repo'));
    nav.setAttribute('aria-label', project.name + ' links');
    const website = websites.get(project.href);
    if (website) {const a = element('a', 'Visit website ↗'); a.href = website; nav.append(a);}
    const link = element('a', 'Repository ↗'); link.href = project.href; nav.append(link);
    article.append(element('span', String(i + 1).padStart(2, '0'), 'number'), details, nav);
    li.append(article); fragment.append(li);
  });
  document.getElementById('projects').replaceChildren(fragment);
  filterProjects();
}

function filterProjects() {
  const query = document.getElementById('search').value.trim().toLowerCase();
  const items = [...document.querySelectorAll('#projects > li')];
  let visible = 0;
  for (const item of items) {
    item.hidden = !item.querySelector('h3').textContent.toLowerCase().includes(query) && !item.querySelector('.repo').textContent.toLowerCase().includes(query);
    if (!item.hidden) visible++;
  }
  document.getElementById('status').textContent = query ? visible + ' of ' + items.length + ' projects' : items.length + (items.length === 1 ? ' project' : ' projects');
  document.getElementById('empty').hidden = visible !== 0;
}

document.getElementById('search').addEventListener('input', filterProjects);
fetch('./include.txt', {cache: 'no-store', signal: AbortSignal.timeout(10000)})
  .then(response => {if (!response.ok) throw new Error('Project list unavailable'); return response.text();})
  .then(text => renderProjects(parseProjects(text)))
  .catch(() => {document.getElementById('notice').textContent = 'The latest project list could not be loaded. Showing the saved listing; use the Project list link below to check for updates.';});
