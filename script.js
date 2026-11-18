/* ---------- Course data ---------- */
const topics = [
  { icon: "🅰️", title: "Ansible", desc: "Agentless automation: configure many servers with simple YAML playbooks.",
    points: ["Inventory files & groups", "Playbooks, tasks and handlers", "Roles, variables and templates (Jinja2)", "Idempotency and Ansible Vault"],
    code: "ansible all -m ping -i inventory.ini\nansible-playbook site.yml --check" },
  { icon: "🔑", title: "SSH", desc: "Secure remote access to servers with keys, config files and tunnels.",
    points: ["Generating and using key pairs", "~/.ssh/config and jump hosts", "Port forwarding & tunnels", "Hardening sshd_config"],
    code: "ssh-keygen -t ed25519 -C \"devops\"\nssh-copy-id user@server\nssh -L 8080:localhost:80 user@server" },
  { icon: "🖥️", title: "Virtualization & VirtualBox", desc: "Build your own lab: virtual machines, networks and snapshots.",
    points: ["Hypervisors: Type 1 vs Type 2", "Creating a Linux VM in VirtualBox", "NAT, Bridged and Host-only networking", "Snapshots and cloning"],
    code: "VBoxManage list vms\nVBoxManage startvm \"ubuntu\" --type headless" },
  { icon: "🐳", title: "Installing Docker", desc: "Install the engine and run your first containers.",
    points: ["Install Docker Engine on Ubuntu", "Run Docker without sudo", "Images, containers and volumes", "Writing a Dockerfile & Docker Compose"],
    code: "curl -fsSL https://get.docker.com | sh\nsudo usermod -aG docker $USER\ndocker run hello-world" },
  { icon: "🔁", title: "CI/CD", desc: "Automate build, test and deploy with pipelines on every commit.",
    points: ["Continuous Integration vs Delivery vs Deployment", "GitHub Actions / GitLab CI pipelines", "Build, test, scan and push images", "Automated deployment & rollbacks"],
    code: "on: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: docker build -t app ." },
  { icon: "☁️", title: "AWS", desc: "Core cloud services every DevOps engineer needs.",
    points: ["IAM users, roles and policies", "EC2, VPC and security groups", "S3 storage and RDS databases", "Load balancers & auto scaling"],
    code: "aws configure\naws ec2 describe-instances\naws s3 ls" },
  { icon: "☸️", title: "Kubernetes", desc: "Orchestrate containers at scale with self-healing and rolling updates.",
    points: ["Pods, Deployments and Services", "ConfigMaps, Secrets and Ingress", "Persistent volumes & StatefulSets", "Helm charts and kubectl essentials"],
    code: "kubectl apply -f deployment.yaml\nkubectl get pods -w\nkubectl rollout undo deploy/app" },
  { icon: "🧱", title: "Terraform", desc: "Infrastructure as Code: describe your cloud, version it and apply it.",
    points: ["Providers, resources and variables", "State files & remote backends", "Modules and workspaces", "Plan → Apply → Destroy workflow"],
    code: "terraform init\nterraform plan\nterraform apply -auto-approve" },
  { icon: "📈", title: "Monitoring & Observability", desc: "See inside your systems with Prometheus, Grafana, Loki and Alloy.",
    points: ["Prometheus: metrics & PromQL", "Grafana: dashboards and alerting", "Loki: centralized log aggregation", "Alloy: one collector for metrics, logs, traces"],
    code: "rate(http_requests_total[5m])\n{app=\"web\"} |= \"error\"" }
];

const roadmap = [
  ["Linux, SSH & Virtualization", "Build a safe lab with VirtualBox and learn to work remotely."],
  ["Docker", "Package applications into portable containers."],
  ["Ansible", "Configure servers automatically and repeatably."],
  ["CI/CD", "Ship every commit through an automated pipeline."],
  ["AWS & Terraform", "Provision real cloud infrastructure as code."],
  ["Kubernetes", "Run and scale containers in production."],
  ["Monitoring & Observability", "Prometheus, Grafana, Loki & Alloy to keep it all healthy."]
];

/* ---------- Build cards ---------- */
const grid = document.getElementById("grid");
topics.forEach((t) => {
  const el = document.createElement("article");
  el.className = "card reveal";
  el.innerHTML = `
    <div class="icon">${t.icon}</div>
    <h3>${t.title}</h3>
    <p class="desc">${t.desc}</p>
    <div class="more"><span>Details</span><span class="chev">▼</span></div>
    <div class="details">
      <ul>${t.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      <pre>${t.code.replace(/</g, "&lt;")}</pre>
    </div>`;
  el.addEventListener("click", () => el.classList.toggle("open"));
  grid.appendChild(el);

  // 3D tilt effect
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `rotateY(${(x - 0.5) * 18}deg) rotateX(${(0.5 - y) * 18}deg) translateZ(10px)`;
    el.style.setProperty("--mx", x * 100 + "%");
    el.style.setProperty("--my", y * 100 + "%");
  });
  el.addEventListener("mouseleave", () => (el.style.transform = ""));
});

/* ---------- Timeline ---------- */
const tl = document.getElementById("timeline");
roadmap.forEach(([title, text], i) => {
  const s = document.createElement("div");
  s.className = "step reveal";
  s.dataset.n = i + 1;
  s.innerHTML = `<h4>${title}</h4><p>${text}</p>`;
  tl.appendChild(s);
});

/* ---------- Theme toggle (remembered) ---------- */
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
} catch (e) {}
document.getElementById("theme-toggle").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add("show");
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 80 + "ms";
  io.observe(el);
});

/* ---------- Animated counters ---------- */
document.querySelectorAll("[data-count]").forEach((el) => {
  const target = +el.dataset.count;
  let n = 0;
  const step = () => {
    n += Math.max(1, target / 50);
    if (n >= target) { el.textContent = target + "+"; return; }
    el.textContent = Math.floor(n);
    requestAnimationFrame(step);
  };
  setTimeout(step, 600);
});

/* ---------- Scroll progress bar ---------- */
const bar = document.getElementById("progress");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
});

/* ---------- Hero 3D mouse parallax ---------- */
const scene = document.getElementById("scene");
scene.addEventListener("mousemove", (e) => {
  const r = scene.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  scene.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
});
scene.addEventListener("mouseleave", () => (scene.style.transform = ""));
scene.style.transition = "transform .2s";

/* ---------- Observability tips ---------- */
const tip = document.getElementById("tip");
document.querySelectorAll(".layer").forEach((l) => {
  l.addEventListener("mouseenter", () => (tip.textContent = l.dataset.tip));
});

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Animated 3D particle network background ---------- */
const cv = document.getElementById("bg");
const ctx = cv.getContext("2d");
let W, H, pts = [], mouse = { x: 0, y: 0 };
function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
addEventListener("resize", resize); resize();
for (let i = 0; i < 90; i++) {
  pts.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1,
             vx: (Math.random() - .5) * .0008, vy: (Math.random() - .5) * .0008 });
}
addEventListener("mousemove", (e) => { mouse.x = e.clientX / W - .5; mouse.y = e.clientY / H - .5; });
let t = 0;
(function draw() {
  t += 0.003;
  ctx.clearRect(0, 0, W, H);
  const light = root.dataset.theme === "light";
  const col = light ? "74,91,255" : "120,170,255";
  const proj = pts.map((p) => {
    p.x += p.vx; p.y += p.vy;
    if (Math.abs(p.x) > 1) p.vx *= -1;
    if (Math.abs(p.y) > 1) p.vy *= -1;
    const cx = Math.cos(t + mouse.x), sx = Math.sin(t + mouse.x);
    const rx = p.x * cx - p.z * sx, rz = p.x * sx + p.z * cx;
    const s = 1 / (2.2 - rz);
    return { x: W / 2 + (rx + mouse.x * .3) * W * .55 * s * 1.6, y: H / 2 + (p.y + mouse.y * .3) * H * .55 * s * 1.6, s };
  });
  for (let i = 0; i < proj.length; i++) {
    const a = proj[i];
    ctx.fillStyle = `rgba(${col},${.25 + a.s * .5})`;
    ctx.beginPath(); ctx.arc(a.x, a.y, 1 + a.s * 2.2, 0, 7); ctx.fill();
    for (let j = i + 1; j < proj.length; j++) {
      const b = proj[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(${col},${(1 - d / 130) * .25})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
})();
