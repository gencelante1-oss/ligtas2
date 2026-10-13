/* ==========================================================
   S.A.A.N. LIGTAS? — preparedness.js
   Interactive checklist:
   - progress bar (% complete)
   - progress saved in localStorage (only checkbox ticks; no personal data)
   - reset button and print button
   ========================================================== */
(function () {
  const STORAGE_KEY = "saan-ligtas-checklist-v1";
  const boxes = Array.from(document.querySelectorAll('.check-item input[type="checkbox"]'));
  const fill = document.getElementById("progress-fill");
  const label = document.getElementById("progress-label");
  const bar = document.getElementById("progress-track");
  if (!boxes.length) return;

  // localStorage can fail (private mode, blocked cookies): wrap in try/catch
  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; }
  }
  function save() {
    const state = {};
    boxes.forEach(function (b) { if (b.checked) state[b.id] = true; });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function updateProgress() {
    const done = boxes.filter(function (b) { return b.checked; }).length;
    const pct = Math.round((done / boxes.length) * 100);
    fill.style.width = pct + "%";
    label.textContent = pct + "% complete (" + done + " of " + boxes.length + " tasks)";
    bar.setAttribute("aria-valuenow", String(pct));
  }

  const saved = load();
  boxes.forEach(function (b) {
    b.checked = !!saved[b.id];
    b.addEventListener("change", function () { save(); updateProgress(); });
  });
  updateProgress();

  document.getElementById("reset-checklist").addEventListener("click", function () {
    if (!window.confirm("Reset the whole checklist? This clears your saved progress on this device.")) return;
    boxes.forEach(function (b) { b.checked = false; });
    save(); updateProgress();
  });

  document.getElementById("print-checklist").addEventListener("click", function () {
    window.print();
  });
})();
