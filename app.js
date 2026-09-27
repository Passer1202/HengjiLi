const transcript = document.querySelector("#terminal-history");
const form = document.querySelector("#command-form");
const input = document.querySelector("#command-input");
const promptUser = document.querySelector(".prompt-user");

const aliases = { about: "bio", paper: "papers", publications: "papers", awards: "honors", edu: "education", links: "contact" };
const sections = ["bio", "papers", "honors", "education", "contact"];
const documents = ["home", ...sections, "help"];
const tools = ["ls", "cat", "head", "tail", "grep", "find", "tree", "cd", "pwd", "wc", "more", "clear", "exit"];
const commandHistory = [];
let historyIndex = 0;
let cwd = "/";

function setDirectory(path) {
  cwd = path;
  promptUser.textContent = `hengji:${cwd}`;
}

function appendEntry(command, { panel, output, error } = {}) {
  const entry = document.createElement("section");
  entry.className = `terminal-entry${error ? " error" : ""}`;
  const echo = document.createElement("p");
  echo.className = "command-echo";
  const dollar = document.createElement("span");
  dollar.className = "dollar";
  dollar.textContent = "$";
  echo.append(dollar, document.createTextNode(command));
  entry.append(echo);
  if (panel) {
    entry.append(document.getElementById(`panel-${panel}`).content.cloneNode(true));
  } else if (output !== undefined || error) {
    const result = document.createElement("pre");
    result.className = "plain-output";
    result.textContent = error || output || "";
    entry.append(result);
  }
  transcript.append(entry);
  entry.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function resolvePath(path = ".") {
  const parts = path.startsWith("/") ? [] : cwd.split("/").filter(Boolean);
  for (const part of path.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part.toLowerCase());
  }
  return `/${parts.join("/")}`;
}

function documentText(path) {
  const name = resolvePath(path).slice(1);
  if (name === "home") return "Hengji Li\nMaster's Student · School of Computer Science · Nanjing University\nI explore 3D generation, world models, and embodied intelligence.\nEmail: hengji1202@gmail.com\nGitHub: github.com/Passer1202";
  if (!documents.includes(name)) throw new Error(`No such document: ${path}`);
  const template = document.getElementById(`panel-${name}`);
  return [...template.content.querySelectorAll("h2, h3, p, li")]
    .filter((node) => !node.closest("li") || node.tagName === "LI")
    .map((node) => (node.tagName === "LI" ? [...node.children].map((part) => part.textContent.trim()).join("  ") : node.textContent).replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function tokenize(source) {
  const tokens = [];
  for (const match of source.matchAll(/"([^"]*)"|'([^']*)'|([^\s]+)/g)) tokens.push(match[1] ?? match[2] ?? match[3]);
  return tokens;
}

function readInput(args, stdin) {
  if (args.length) return documentText(args[0]);
  if (stdin !== undefined) return stdin;
  throw new Error("A document path or piped input is required.");
}

function listDirectory(path) {
  const resolved = resolvePath(path || ".");
  if (resolved === "/") return `${documents.join("  ")}  bin/`;
  if (resolved === "/bin") return tools.join("  ");
  throw new Error(`Not a directory: ${path}`);
}

function formatTree(path) {
  const resolved = resolvePath(path || "/");
  if (resolved === "/bin") return `/bin\n${tools.map((name, i) => `${i === tools.length - 1 ? "└" : "├"}── ${name}`).join("\n")}`;
  if (resolved !== "/") throw new Error(`Not a directory: ${path}`);
  return `/\n${documents.map((name) => `├── ${name}`).join("\n")}\n└── bin/\n${tools.map((name, i) => `    ${i === tools.length - 1 ? "└" : "├"}── ${name}`).join("\n")}`;
}

function linesOf(value) { return value ? value.split(/\r?\n/) : []; }

function execute(tokens, stdin) {
  const [rawName, ...args] = tokens;
  const name = rawName.toLowerCase();
  if (name === "ls") return listDirectory(args[0]);
  if (name === "pwd") return cwd;
  if (name === "tree") return formatTree(args[0]);
  if (name === "cat" || name === "more") return readInput(args, stdin);
  if (name === "head" || name === "tail") {
    let count = 10;
    if (args[0] === "-n") {
      count = Number(args[1]);
      args.splice(0, 2);
      if (!Number.isInteger(count) || count < 0) throw new Error("Use a non-negative integer after -n.");
    }
    const lines = linesOf(readInput(args, stdin));
    return (name === "head" ? lines.slice(0, count) : count === 0 ? [] : lines.slice(-count)).join("\n");
  }
  if (name === "grep") {
    if (!args.length) throw new Error("Usage: grep <pattern> [path]");
    const [pattern, path] = args;
    return linesOf(readInput(path ? [path] : [], stdin)).filter((line) => line.toLowerCase().includes(pattern.toLowerCase())).join("\n");
  }
  if (name === "wc") {
    const source = readInput(args, stdin);
    return `${linesOf(source).length} lines  ${source.trim() ? source.trim().split(/\s+/).length : 0} words  ${new TextEncoder().encode(source).length} bytes`;
  }
  if (name === "find") {
    const nameIndex = args.indexOf("-name");
    const pattern = nameIndex < 0 ? "" : args[nameIndex + 1];
    if (nameIndex >= 0 && !pattern) throw new Error("Usage: find [path] [-name pattern]");
    const path = nameIndex === 0 || !args.length ? "/" : args[0];
    const base = resolvePath(path);
    if (base !== "/" && base !== "/bin") throw new Error(`Not a directory: ${path}`);
    return ["/", ...documents.map((item) => `/${item}`), "/bin", ...tools.map((item) => `/bin/${item}`)]
      .filter((item) => item === base || item.startsWith(`${base === "/" ? "" : base}/`))
      .filter((item) => !pattern || item.split("/").pop().includes(pattern.replaceAll("*", "")))
      .join("\n");
  }
  if (name === "cd") {
    const next = resolvePath(args[0] || "/");
    if (next !== "/" && next !== "/bin") throw new Error(`Not a directory: ${args[0]}`);
    setDirectory(next);
    return cwd;
  }
  throw new Error(`Command not found: ${rawName}. Type help for available commands.`);
}

function runCommand(raw) {
  const command = raw.trim();
  if (!command) return;
  commandHistory.push(command);
  historyIndex = commandHistory.length;
  const key = aliases[command.toLowerCase()] || command.toLowerCase();
  if (key === "clear") { transcript.replaceChildren(); return; }
  if (key === "home" || key === "exit") {
    transcript.replaceChildren();
    setDirectory("/");
    document.querySelector("#home").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (key === "all") { sections.forEach((section) => appendEntry(section, { panel: section })); return; }
  if (sections.includes(key) || key === "help") { appendEntry(command, { panel: key }); return; }
  try {
    let output;
    for (const stage of command.split("|")) {
      const tokens = tokenize(stage.trim());
      if (!tokens.length) throw new Error("An empty pipe stage is not a command.");
      output = execute(tokens, output);
    }
    appendEntry(command, { output });
  } catch (error) {
    appendEntry(command, { error: error.message });
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = input.value;
  input.value = "";
  runCommand(command);
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-command]");
  if (trigger) runCommand(trigger.dataset.command);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && commandHistory.length) {
    event.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    input.value = commandHistory[historyIndex];
  } else if (event.key === "ArrowDown" && commandHistory.length) {
    event.preventDefault();
    historyIndex = Math.min(commandHistory.length, historyIndex + 1);
    input.value = commandHistory[historyIndex] || "";
  }
});

