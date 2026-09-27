const output = document.querySelector("#terminal-output");
const form = document.querySelector("#command-form");
const input = document.querySelector("#command-input");

const sections = {
  about: `
    <p class="section-kicker">Academic homepage</p>
    <h1 class="hero-name">Hengji Li</h1>
    <p class="hero-role">M.Sc. Student · Nanjing University</p>
    <p class="lede">I am an M.Sc. student in the academic degree program at the School of Computer Science, Nanjing University, starting in 2026. My research interests sit at the intersection of <strong>3D vision</strong> and <strong>computer systems</strong>.</p>
    <p class="muted">Type <span class="command-suggestion">help</span> to explore, or use the quick commands above.</p>
  `,
  education: `
    <p class="section-kicker">Education</p>
    <div class="data-list">
      <div class="data-row"><span class="data-key">2026 — present</span><span class="data-value"><strong>Nanjing University</strong><br />M.Sc. student, School of Computer Science<br /><span class="muted">Academic degree program</span></span></div>
      <div class="data-row"><span class="data-key">2022 — 2026</span><span class="data-value"><strong>Nanjing University</strong><br />B.Sc. in Computer Science, Kuang Yaming Honors School<br /><span class="muted">GPA: 4.50 / 5.00</span></span></div>
    </div>
  `,
  research: `
    <p class="section-kicker">Research interests</p>
    <p class="lede">I am interested in building methods and systems that make complex visual and computational problems more tractable.</p>
    <div class="tag-list"><span class="tag">3D Vision</span><span class="tag">Computer Systems</span></div>
  `,
  papers: `
    <p class="section-kicker">Papers</p>
    <div class="data-list">
      <div class="data-row"><span class="data-key">2026 · arXiv</span><span class="data-value"><a class="paper-title" href="https://arxiv.org/abs/2601.17733" target="_blank" rel="noreferrer">Flatten The Complex: Joint B-Rep Generation via Compositional k-Cell Particles</a><br /><span class="muted">Junran Lu, Yuanqi Li, <strong>Hengji Li</strong>, Jie Guo, Yanwen Guo</span><br /><span class="muted">A compositional particle representation for jointly generating B-Rep topology and geometry with global context awareness.</span><br /><a href="https://doi.org/10.48550/arXiv.2601.17733" target="_blank" rel="noreferrer">arXiv:2601.17733</a></span></div>
    </div>
  `,
  awards: `
    <p class="section-kicker">Selected honors</p>
    <div class="data-list">
      <div class="data-row"><span class="data-key">2023, 2024</span><span class="data-value">Nanjing University Undergraduate Basic-Discipline Special Scholarship — Excellence Award</span></div>
      <div class="data-row"><span class="data-key">2023, 2024</span><span class="data-value">People's Scholarship — Second Prize (2023), Third Prize (2024)</span></div>
      <div class="data-row"><span class="data-key">2025</span><span class="data-value">Nanjing University Outstanding Communist Youth League Cadre</span></div>
    </div>
  `,
  contact: `
    <p class="section-kicker">Contact & links</p>
    <div class="data-list">
      <div class="data-row"><span class="data-key">Email</span><span class="data-value"><a href="mailto:221240073@smail.nju.edu.cn">221240073@smail.nju.edu.cn</a></span></div>
      <div class="data-row"><span class="data-key">GitHub</span><span class="data-value"><a href="https://github.com/Passer1202" target="_blank" rel="noreferrer">github.com/Passer1202</a></span></div>
    </div>
  `,
  help: `
    <p class="section-kicker">Available commands</p>
    <div class="command-grid">
      <code>about</code><span>short biography</span>
      <code>education</code><span>academic background</span>
      <code>research</code><span>research interests</span>
      <code>papers</code><span>publications and current work</span>
      <code>awards</code><span>selected honors</span>
      <code>contact</code><span>email and social links</span>
      <code>all</code><span>show the full profile</span>
      <code>clear</code><span>clear the terminal</span>
    </div>
  `,
};

const aliases = { bio: "about", paper: "papers", publications: "papers", edu: "education", interests: "research", links: "contact", ls: "help" };
const allOrder = ["about", "education", "research", "papers", "awards", "contact"];

function makeBlock(command, html, echo = true) {
  const block = document.createElement("section");
  block.className = "output-block";
  if (echo) block.innerHTML = `<div class="echo"><span class="dollar">$</span>${command}</div>${html}`;
  else block.innerHTML = html;
  return block;
}

function runCommand(rawCommand, options = {}) {
  const raw = rawCommand.trim();
  const key = (aliases[raw.toLowerCase()] || raw.toLowerCase());
  if (!raw) return;

  if (key === "clear") {
    output.replaceChildren();
    return;
  }

  if (key === "all") {
    const html = allOrder.map((name) => sections[name]).join("");
    output.append(makeBlock(raw, html, options.echo !== false));
  } else if (sections[key]) {
    output.append(makeBlock(raw, sections[key], options.echo !== false));
  } else {
    output.append(makeBlock(raw, `<p class="error">command not found: ${escapeHtml(raw)}</p><p class="muted">Try <span class="command-suggestion">help</span>.</p>`));
  }

  output.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(input.value);
  input.value = "";
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-command]");
  if (!trigger) return;
  event.preventDefault();
  runCommand(trigger.dataset.command);
  input.focus();
});

document.querySelector(".terminal").addEventListener("click", (event) => {
  if (!event.target.closest("a, button, input")) input.focus();
});

runCommand("about", { echo: false });
