/* ==========================================================
   S.A.A.N. LIGTAS? — main.js (runs on every page)
   - Mobile navigation menu
   - Back-to-top button
   - Scroll reveal animation
   - Accordions (Safety Protocols page)
   - Search + category filter (Learning Resources page)
   ========================================================== */
document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile navigation ---------- */
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close the menu with the Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Back-to-top button ---------- */
  const topBtn = document.getElementById("back-to-top");
  if (topBtn) {
    window.addEventListener("scroll", function () {
      topBtn.classList.toggle("show", window.scrollY > 400);
    });
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Accordions ---------- */
  document.querySelectorAll(".accordion-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (panel) panel.hidden = open;
    });
  });
  // Open an accordion directly from a link like safety-protocols.html#earthquake
  if (location.hash) {
    const target = document.querySelector(location.hash + " .accordion-btn");
    if (target) target.click();
  }
  const expandAll = document.getElementById("expand-all");
  if (expandAll) {
    expandAll.addEventListener("click", function () {
      const btns = document.querySelectorAll(".accordion-btn");
      const anyClosed = Array.from(btns).some(function (b) { return b.getAttribute("aria-expanded") !== "true"; });
      btns.forEach(function (b) {
        b.setAttribute("aria-expanded", String(anyClosed));
        const p = document.getElementById(b.getAttribute("aria-controls"));
        if (p) p.hidden = !anyClosed;
      });
      expandAll.textContent = anyClosed ? "Collapse all" : "Expand all";
    });
  }

  /* ---------- Learning resources: search + category chips ---------- */
  const searchBox = document.getElementById("resource-search");
  const chips = document.querySelectorAll(".chip[data-category]");
  const cards = document.querySelectorAll(".resource-card");
  const empty = document.getElementById("resource-empty");
  let activeCategory = "all";

  function applyResourceFilter() {
    const q = searchBox ? searchBox.value.trim().toLowerCase() : "";
    let shown = 0;
    cards.forEach(function (card) {
      const matchCat = activeCategory === "all" || card.dataset.category === activeCategory;
      const matchText = card.textContent.toLowerCase().includes(q);
      const visible = matchCat && matchText;
      card.hidden = !visible;
      if (visible) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  }
  if (cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        activeCategory = chip.dataset.category;
        applyResourceFilter();
      });
    });
    if (searchBox) searchBox.addEventListener("input", applyResourceFilter);
  }
});
