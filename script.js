const stages = [
  { progress: 0, name: "种子", className: "stage-seed" },
  { progress: 5, name: "萌芽", className: "stage-sprout" },
  { progress: 10, name: "嫩芽", className: "stage-bud" },
  { progress: 20, name: "幼苗", className: "stage-sapling" },
  { progress: 30, name: "成长苗", className: "stage-growing" },
  { progress: 40, name: "小树", className: "stage-young" },
  { progress: 50, name: "繁茂树", className: "stage-leafy" },
  { progress: 60, name: "壮年树", className: "stage-strong" },
  { progress: 70, name: "开花树", className: "stage-flower" },
  { progress: 80, name: "繁花树", className: "stage-bloom" },
  { progress: 90, name: "结果树", className: "stage-fruit" },
  { progress: 100, name: "知识古树", className: "stage-ancient" }
];

const species = [
  { type: "文学类", tree: "樱花树", color: "#8edc96" },
  { type: "历史类", tree: "银杏树", color: "#c9a12f" },
  { type: "哲学类", tree: "古松", color: "#2b8f4a" },
  { type: "心理学类", tree: "枫树", color: "#b7cf69" },
  { type: "科技类", tree: "蓝杉", color: "#64c476" },
  { type: "经济管理类", tree: "橡树", color: "#b99735" },
  { type: "玄幻类", tree: "世界树", color: "#4fb86b" },
  { type: "修仙类", tree: "灵树", color: "#98df8d" },
  { type: "武侠类", tree: "竹林", color: "#6fbe68" },
  { type: "科幻类", tree: "星光树", color: "#d7bd55" },
  { type: "悬疑类", tree: "暗影树", color: "#7fae56" },
  { type: "都市类", tree: "凤凰木", color: "#b9cf6c" },
  { type: "言情类", tree: "花树", color: "#a8dd85" },
  { type: "无限流", tree: "时空树", color: "#c9a12f" }
];

const books = [
  { id: 1, title: "《活着》", type: "文学类", progress: 100, leaves: 3, status: "已成熟", note: "完成阅读后，适合沉淀成一棵安静的知识古树。" },
  { id: 2, title: "《人类简史》", type: "历史类", progress: 75, leaves: 2, status: "成长中", note: "历史类阅读正在开花，说明用户已经形成了阶段性理解。" },
  { id: 3, title: "《三体》", type: "科幻类", progress: 60, leaves: 1, status: "成长中", note: "科幻阅读让森林出现星光树，保留想象力的痕迹。" },
  { id: 4, title: "《百年孤独》", type: "文学类", progress: 40, leaves: 0, status: "成长中", note: "小树还在生长，等待用户留下第一片黄金叶。" },
  { id: 5, title: "《置身事内》", type: "经济管理类", progress: 30, leaves: 1, status: "成长中", note: "管理类阅读适合和现实问题连接，想法会让橡树更有层次。" },
  { id: 6, title: "《蛤蟆先生去看心理医生》", type: "心理学类", progress: 90, leaves: 4, status: "成长中", note: "接近成熟的枫树，记录了较多自我观察和阅读想法。" },
  { id: 7, title: "《凡人修仙传》", type: "修仙类", progress: 20, leaves: 0, status: "休眠中", note: "灵树暂时休眠，重新阅读后会恢复生长。" },
  { id: 8, title: "《明朝那些事儿》", type: "历史类", progress: 50, leaves: 2, status: "成长中", note: "读到一半的银杏树，已经有了两次可见的思考记录。" }
];

const overviewBase = {
  planted: 12,
  mature: 5,
  leaves: 18,
  sleeping: 2,
  monthlyProgress: 68
};

const initialVisibleTotals = {
  mature: books.filter(book => book.status === "已成熟").length,
  sleeping: books.filter(book => book.status === "休眠中").length,
  leaves: books.reduce((sum, book) => sum + book.leaves, 0)
};

let activeFilter = "全部";
let selectedBookId = null;

const statsGrid = document.querySelector("#statsGrid");
const forestGrid = document.querySelector("#forestGrid");
const growthTimeline = document.querySelector("#growthTimeline");
const speciesGrid = document.querySelector("#speciesGrid");
const modal = document.querySelector("#bookModal");
const modalTree = document.querySelector("#modalTree");
const modalTitle = document.querySelector("#modalTitle");
const modalType = document.querySelector("#modalType");
const modalMeta = document.querySelector("#modalMeta");
const modalHint = document.querySelector("#modalHint");
const readMoreButton = document.querySelector("#readMoreButton");
const goldLeafButton = document.querySelector("#goldLeafButton");
const filterButtons = document.querySelectorAll(".filter-button");
const hero = document.querySelector(".game-hero");

function getStage(progress) {
  return stages.reduce((current, stage) => progress >= stage.progress ? stage : current, stages[0]);
}

function getSpecies(type) {
  return species.find(item => item.type === type) || { tree: "书树", color: "#9bc69a" };
}

function getTreeClass(type) {
  const classMap = {
    "文学类": "tree-sakura",
    "历史类": "tree-ginkgo",
    "哲学类": "tree-pine",
    "心理学类": "tree-maple",
    "科技类": "tree-spruce",
    "经济管理类": "tree-oak",
    "玄幻类": "tree-world",
    "修仙类": "tree-spirit",
    "武侠类": "tree-bamboo",
    "科幻类": "tree-starlight",
    "悬疑类": "tree-shadow",
    "都市类": "tree-flame",
    "言情类": "tree-flower",
    "无限流": "tree-time"
  };
  return classMap[type] || "tree-generic";
}

function getStatusClass(status) {
  if (status === "已成熟") return "mature";
  if (status === "休眠中") return "sleeping";
  return "";
}

function renderStats() {
  const matureDelta = books.filter(book => book.status === "已成熟").length - initialVisibleTotals.mature;
  const sleepingDelta = books.filter(book => book.status === "休眠中").length - initialVisibleTotals.sleeping;
  const leafDelta = books.reduce((sum, book) => sum + book.leaves, 0) - initialVisibleTotals.leaves;

  const stats = [
    { label: "已种下书树", value: `${overviewBase.planted} 棵` },
    { label: "已成熟书树", value: `${overviewBase.mature + matureDelta} 棵` },
    { label: "黄金叶片", value: `${overviewBase.leaves + leafDelta} 片` },
    { label: "正在休眠", value: `${overviewBase.sleeping + sleepingDelta} 棵` },
    { label: "本月阅读进度", value: `${overviewBase.monthlyProgress}%` }
  ];

  statsGrid.innerHTML = stats.map(stat => `
    <article class="stat-card">
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat.label}</div>
    </article>
  `).join("");
}

function renderGoldLeaves(count) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index * 137.5) % 360;
    const band = index % 6;
    const radiusX = 12 + band * 5;
    const radiusY = 8 + band * 3;
    const left = 50 + Math.cos(angle * Math.PI / 180) * radiusX;
    const top = 40 + Math.sin(angle * Math.PI / 180) * radiusY;
    const rotate = -42 + ((index * 31) % 84);
    const scale = 0.82 + ((index % 4) * 0.08);

    return `<span class="gold-leaf" style="left: ${left.toFixed(1)}%; top: ${top.toFixed(1)}%; --leaf-rotate: ${rotate}deg; --leaf-scale: ${scale.toFixed(2)};"></span>`;
  }).join("");
}

function renderTree(book) {
  const stage = getStage(book.progress);
  const speciesInfo = getSpecies(book.type);
  return `
    <div class="tree-visual ${getTreeClass(book.type)}" style="--species-color: ${speciesInfo.color}" aria-hidden="true">
      <span class="tree-detail detail-a"></span>
      <span class="tree-detail detail-b"></span>
      <span class="tree-detail detail-c"></span>
      <div class="gold-leaves" aria-hidden="true">${renderGoldLeaves(book.leaves)}</div>
    </div>
  `;
}

function renderForest() {
  const visibleBooks = activeFilter === "全部"
    ? books
    : books.filter(book => book.type === activeFilter);

  forestGrid.innerHTML = visibleBooks.map(book => {
    const stage = getStage(book.progress);
    const speciesInfo = getSpecies(book.type);
    const statusClass = getStatusClass(book.status);

    return `
      <article class="book-card ${stage.className} ${statusClass}" tabindex="0" role="button" data-book-id="${book.id}" aria-label="查看${book.title}的书树详情">
        <div class="book-topline">
          <span class="type-pill">${book.type} · ${speciesInfo.tree}</span>
          <span class="status-pill ${statusClass}">${book.status}</span>
        </div>
        <div class="tree-wrap">${renderTree(book)}</div>
        <h3 class="book-title">${book.title}</h3>
        <p class="book-stage">${stage.name} · 黄金叶 ${book.leaves} 片</p>
        <p class="book-note">${book.note}</p>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${book.progress}%"></div>
        </div>
        <div class="book-footer">
          <span>阅读进度 ${book.progress}%</span>
          <span>${book.status === "休眠中" ? "重新阅读后恢复生长" : "持续生长中"}</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderTimeline() {
  growthTimeline.innerHTML = stages.map(stage => `
    <article class="timeline-item">
      <div class="timeline-percent">${stage.progress}%</div>
      <div class="timeline-stage">${stage.name}</div>
    </article>
  `).join("");
}

function renderSpecies() {
  speciesGrid.innerHTML = species.map(item => `
    <article class="species-card">
      <span class="species-icon" style="--species-color: ${item.color}" aria-hidden="true"></span>
      <div class="species-name">${item.tree}</div>
      <div class="species-type">${item.type}</div>
    </article>
  `).join("");
}

function getHint(book) {
  const stage = getStage(book.progress);
  if (book.status === "休眠中") {
    return `${book.title}暂时进入休眠。重新翻开它，树木会慢慢恢复生机。`;
  }
  if (book.status === "已成熟") {
    return `${book.title}已经长成${stage.name}。这棵树会继续记录你的想法和重读时刻。`;
  }
  const distance = 100 - book.progress;
  return `${book.title}正处在${stage.name}阶段，距离成熟还差 ${distance}%。你已经留下 ${book.leaves} 片黄金叶，说明这本书不只是被读过，也被思考过。`;
}

function openModal(bookId) {
  selectedBookId = Number(bookId);
  const book = books.find(item => item.id === selectedBookId);
  if (!book) return;

  const stage = getStage(book.progress);
  const speciesInfo = getSpecies(book.type);
  modalTree.className = `modal-tree ${stage.className} ${getStatusClass(book.status)}`;
  modalTree.innerHTML = `<div class="tree-wrap">${renderTree(book)}</div>`;
  modalType.textContent = `${book.type} · ${speciesInfo.tree}`;
  modalTitle.textContent = book.title;
  modalMeta.innerHTML = `
    <span>阅读进度：${book.progress}%</span>
    <span>成长阶段：${stage.name}</span>
    <span>黄金叶：${book.leaves} 片</span>
    <span>阅读状态：${book.status}</span>
  `;
  modalHint.textContent = `${getHint(book)} ${book.note}`;
  readMoreButton.disabled = book.progress >= 100;
  readMoreButton.textContent = book.progress >= 100 ? "已经成熟" : "继续阅读 5%";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  readMoreButton.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  selectedBookId = null;
}

function updateSelectedBook(updateFn) {
  const book = books.find(item => item.id === selectedBookId);
  if (!book) return;
  updateFn(book);
  renderStats();
  renderForest();
  openModal(book.id);
  const card = document.querySelector(`[data-book-id="${book.id}"]`);
  if (card) {
    card.classList.add("leaf-pop");
    setTimeout(() => card.classList.remove("leaf-pop"), 600);
  }
}

function continueReading() {
  updateSelectedBook(book => {
    book.progress = Math.min(100, book.progress + 5);
    if (book.progress >= 100) {
      book.status = "已成熟";
    } else if (book.status === "休眠中") {
      book.status = "成长中";
    }
  });
}

function addGoldLeaf() {
  updateSelectedBook(book => {
    book.leaves += 1;
  });
}

function bindHeroMotion() {
  if (!hero) return;

  let rafId = null;

  const updatePointer = event => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      hero.style.setProperty("--mx", x.toFixed(3));
      hero.style.setProperty("--my", y.toFixed(3));
      hero.classList.add("is-awake");
    });
  };

  const updateScroll = () => {
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, Math.abs(rect.top) / Math.max(1, rect.height * 0.75)));
    hero.style.setProperty("--hero-scroll", progress.toFixed(3));
  };

  hero.addEventListener("pointermove", updatePointer);
  hero.addEventListener("pointerenter", () => hero.classList.add("is-awake"));
  hero.addEventListener("focusin", () => hero.classList.add("is-awake"));
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  setTimeout(() => hero.classList.add("is-awake"), 1200);
}

function splitTitleText(container, startIndex) {
  const text = container.textContent;
  container.textContent = "";

  return Array.from(text).reduce((index, char) => {
    const charElement = document.createElement("span");
    const isSpace = /\s/.test(char);
    charElement.className = isSpace ? "split-space" : "split-char";
    charElement.style.setProperty("--char-index", index);
    charElement.setAttribute("aria-hidden", "true");
    charElement.textContent = isSpace ? "\u00a0" : char;
    container.appendChild(charElement);
    return isSpace ? index : index + 1;
  }, startIndex);
}

function enhanceAnimatedHeadings() {
  const headings = document.querySelectorAll(".hero h1, .section-heading h2, .mechanic-card h2");

  headings.forEach(heading => {
    if (heading.dataset.animatedTitle === "true") return;

    const originalText = heading.textContent.trim();
    const overlay = document.createElement("span");
    overlay.className = "gradient-overlay";
    overlay.setAttribute("aria-hidden", "true");

    heading.dataset.animatedTitle = "true";
    heading.classList.add("animated-gradient-text", "split-parent");
    heading.setAttribute("aria-label", originalText);

    const directLineSpans = Array.from(heading.children).filter(child => child.tagName === "SPAN");
    if (heading.matches(".hero h1") && directLineSpans.length) {
      heading.prepend(overlay);
      directLineSpans.reduce((index, line) => {
        line.classList.add("text-content");
        line.setAttribute("aria-hidden", "true");
        return splitTitleText(line, index);
      }, 0);
    } else {
      heading.textContent = "";
      const content = document.createElement("span");
      content.className = "text-content";
      content.setAttribute("aria-hidden", "true");
      content.textContent = originalText;
      heading.append(overlay, content);
      splitTitleText(content, 0);
    }
  });

  const reveal = heading => heading.classList.add("is-visible");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    headings.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: "-100px 0px"
  });

  headings.forEach(heading => observer.observe(heading));
}

function bindEvents() {
  bindHeroMotion();

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach(item => item.classList.toggle("active", item === button));
      renderForest();
    });
  });

  forestGrid.addEventListener("click", event => {
    const card = event.target.closest(".book-card");
    if (card) openModal(card.dataset.bookId);
  });

  forestGrid.addEventListener("keydown", event => {
    const card = event.target.closest(".book-card");
    if (!card) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal(card.dataset.bookId);
    }
  });

  document.querySelectorAll("[data-close-modal]").forEach(element => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  readMoreButton.addEventListener("click", continueReading);
  goldLeafButton.addEventListener("click", addGoldLeaf);
}

function init() {
  renderStats();
  renderForest();
  renderTimeline();
  renderSpecies();
  enhanceAnimatedHeadings();
  bindEvents();
}

init();
