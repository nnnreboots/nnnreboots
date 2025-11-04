const nodes = [
  { type: "storage", name: "Singapore" },
  { type: "server", name: "China" },
  { type: "storage", name: "Indonesia" },
  { type: "server", name: "Japan" },
  { type: "server", name: "Germany" },
  { type: "storage", name: "UK" },
  { type: "server", name: "Poland" },
  { type: "server", name: "USA East" },
  { type: "storage", name: "USA West" },
  { type: "server", name: "Mexico" },
  { type: "server", name: "Brazil" },
  { type: "storage", name: "Chile" },
  { type: "server", name: "Australia" },
  { type: "storage", name: "New Zealand" },
];

const nodeList = document.getElementById("nodeList");

// Load saved statuses or initialize defaults
let storageStatus = JSON.parse(localStorage.getItem("storageStatus")) || {
  Chile: "Delivering",
  Indonesia: "Delivering",
};

nodes.forEach(node => {
  if (node.type === "storage" && !storageStatus[node.name]) {
    storageStatus[node.name] = Math.random() < 0.5 ? "Full" : "Delivering";
  }

  const li = document.createElement("li");
  const typeSpan = document.createElement("span");
  typeSpan.classList.add(node.type);
  typeSpan.textContent = node.type === "server" ? "Server" : "Storage";

  const nameSpan = document.createElement("span");
  nameSpan.textContent = node.name;

  const statusSpan = document.createElement("span");
  statusSpan.classList.add("status");
  if (node.type === "storage") statusSpan.textContent = storageStatus[node.name];

  li.appendChild(typeSpan);
  li.appendChild(nameSpan);
  li.appendChild(statusSpan);

  li.addEventListener("click", () => handleNodeClick(node, statusSpan));

  nodeList.appendChild(li);
});

function handleNodeClick(node, statusSpan) {
  if (node.type === "server") {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        const country = data.country_name || "your region";
        const latency = Math.floor(Math.random() * 100) + 20;
        alert(`Ping to ${node.name} from ${country}: ~${latency} ms`);
      })
      .catch(() => alert("Unable to detect location."));
  } else if (node.type === "storage") {
    if (storageStatus[node.name] === "Delivering") {
      storageStatus[node.name] = "Full";
    } else {
      storageStatus[node.name] = "Delivering";
    }
    statusSpan.textContent = storageStatus[node.name];
    localStorage.setItem("storageStatus", JSON.stringify(storageStatus));
  }
}
