const form = document.querySelector("#command-form");
const input = document.querySelector("#command-input");
const output = document.querySelector("#command-output");

const destinations = {
  home: "top",
  bio: "bio",
  about: "bio",
  research: "bio",
  papers: "papers",
  paper: "papers",
  publications: "papers",
  honors: "honors",
  awards: "honors",
  education: "education",
  edu: "education",
  contact: "contact",
  email: "contact",
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = input.value.trim().toLowerCase();
  input.value = "";
  output.classList.remove("error");
  if (!command) return;

  if (command === "clear") {
    output.textContent = "";
    return;
  }
  if (command === "help" || command === "ls") {
    output.textContent = "Commands: home · bio · papers · honors · education · contact · help · clear";
    return;
  }

  const destination = destinations[command];
  if (!destination) {
    output.textContent = `Command not found: ${command}. Type help for available commands.`;
    output.classList.add("error");
    return;
  }

  output.textContent = `Opening ${destination === "top" ? "home" : destination}…`;
  document.getElementById(destination).scrollIntoView({ behavior: "smooth", block: "start" });
});

