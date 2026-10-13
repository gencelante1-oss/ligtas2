/* ==========================================================
   S.A.A.N. LIGTAS? — evacuation-map.js
   Interactive map using Leaflet.js (loaded from a CDN in the HTML).

   HOW IT WORKS
   - The map shows an IMAGE (assets/images/campus-evacuation-plan.jpg) using
     Leaflet's "simple" pixel coordinate system, so no GPS coordinates are needed.
   - Buildings, hazards, assembly areas, emergency points and routes are in the
     DATA section below. Coordinates are [x, y] in pixels from the TOP-LEFT of the image.
   - The building markers come from the school's evacuation plan. Hazard-prone
     areas, assembly areas and emergency points were NOT on the plan, so none are
     listed yet. To add one, copy a line in LOCATIONS and change type to
     "hazard", "assembly" or "emergency". Its layer checkbox appears automatically.
   - Only add locations that the school administration has verified.

   IF YOU REPLACE THE IMAGE with one of a different size, update
   IMAGE_WIDTH and IMAGE_HEIGHT.

   FALLBACK: if Leaflet cannot load (e.g. no internet), the static image and a
   plain list are shown instead (see #map-fallback in evacuation-map.html).
   ========================================================== */

/* ---------------- DATA (edit me) ---------------- */
const IMAGE_URL = "assets/images/campus-evacuation-plan.jpg";
const IMAGE_WIDTH = 752;
const IMAGE_HEIGHT = 984;

// type: hazard | assembly | emergency | info
const LOCATIONS = [
  { id: "b2", type: "info", name: "DepEd Building 2", x: 90, y: 58,
    desc: "Four floors. Grade 11 route colors per the school's floor plan: 1st floor blue (Advocate, Ambassador, Analysts); 2nd floor green (Aspirers, Builders, Catalysts); 3rd floor red (Conquerors, Deciders, Voyagers); 4th floor purple (Diplomats, Empiricists, Strategists). Confirm with the school." },
  { id: "b1", type: "info", name: "DepEd Building 1", x: 225, y: 310,
    desc: "The plan shows Ground Floor, 2nd, 3rd and 4th floor sections with colored exit arrows. See the plan image for each floor's route color." },
  { id: "ebd", type: "info", name: "EBD Building", x: 620, y: 240,
    desc: "The plan shows Ground Floor, 2nd Floor and 3rd Floor sections with an orange exit route. See the plan image for details." },
  { id: "stage", type: "info", name: "Stage", x: 375, y: 265,
    desc: "Stage, as labeled on the school's plan." },
  { id: "canteen", type: "info", name: "Canteen", x: 520, y: 58,
    desc: "Canteen, as labeled on the school's plan." },
  { id: "flag", type: "info", name: "Flag area", x: 415, y: 634,
    desc: "Marked \"Flag\" on the school's plan." }
];

// Evacuation routes drawn on the map: lists of [x, y] points. None yet: the school's
// routes are shown in the plan images. Example:
//   { name: "Route name", color: "#1f2fa8", points: [[100, 100], [200, 150]] }
const ROUTES = [];

const TYPE_INFO = {
  hazard:    { label: "Hazard-prone area",  icon: "fa-triangle-exclamation" },
  assembly:  { label: "Safe assembly area", icon: "fa-people-group" },
  emergency: { label: "Emergency point",    icon: "fa-circle-exclamation" },
  info:      { label: "Information point",  icon: "fa-circle-info" }
};

/* ---------------- Directory list + search (works with or without Leaflet) ---------------- */
const listEl = document.getElementById("directory-list");
const searchEl = document.getElementById("map-search");
const emptyEl = document.getElementById("directory-empty");
let focusLocation = function () {};   // replaced once the map exists

function renderDirectory() {
  const q = searchEl ? searchEl.value.trim().toLowerCase() : "";
  listEl.innerHTML = "";
  let count = 0;
  LOCATIONS.forEach(function (loc) {
    const text = (loc.name + " " + TYPE_INFO[loc.type].label).toLowerCase();
    if (!text.includes(q)) return;
    count++;
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = '<span class="sw ' + loc.type + '" style="width:22px;height:22px;"><i class="fa-solid ' +
      TYPE_INFO[loc.type].icon + '" aria-hidden="true"></i></span><span></span>';
    btn.lastChild.textContent = loc.name;   // textContent keeps data safe from HTML injection
    btn.addEventListener("click", function () { focusLocation(loc.id); });
    li.appendChild(btn);
    listEl.appendChild(li);
  });
  if (emptyEl) emptyEl.hidden = count !== 0;
}
if (listEl) {
  renderDirectory();
  if (searchEl) searchEl.addEventListener("input", renderDirectory);
}

/* ---------------- Leaflet map ---------------- */
function showFallback() {
  const fb = document.getElementById("map-fallback");
  const map = document.getElementById("map");
  if (fb) fb.classList.add("show");
  if (map) map.style.display = "none";
  document.querySelectorAll(".layer-toggle input, #reset-map").forEach(function (el) { el.disabled = true; });
}

if (typeof L === "undefined") {
  showFallback();
} else {
  // Image bounds: Leaflet's simple CRS uses [y, x] with y going UP, so flip y.
  const bounds = [[0, 0], [IMAGE_HEIGHT, IMAGE_WIDTH]];
  const toLatLng = function (x, y) { return [IMAGE_HEIGHT - y, x]; };

  const map = L.map("map", {
    crs: L.CRS.Simple, minZoom: -1.5, maxZoom: 2, zoomSnap: 0.25,
    maxBounds: [[-200, -200], [IMAGE_HEIGHT + 200, IMAGE_WIDTH + 200]]
  });
  L.imageOverlay(IMAGE_URL, bounds, { alt: "School campus evacuation plan" }).addTo(map);
  function resetView() { map.fitBounds(bounds); }
  resetView();

  // One layer group per toggle
  const layers = {
    hazard: L.layerGroup(), assembly: L.layerGroup(), emergency: L.layerGroup(),
    info: L.layerGroup(), route: L.layerGroup()
  };
  const markers = {};

  LOCATIONS.forEach(function (loc) {
    const icon = L.divIcon({
      className: "leaflet-div-icon-custom",
      html: '<div class="mk ' + loc.type + '"><i class="fa-solid ' + TYPE_INFO[loc.type].icon + '" aria-hidden="true"></i></div>',
      iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -16]
    });
    const m = L.marker(toLatLng(loc.x, loc.y), { icon: icon, title: loc.name, keyboard: true });
    // Build popup with DOM nodes (not innerHTML) so edited data can't inject HTML
    const box = document.createElement("div");
    const h = document.createElement("strong"); h.textContent = loc.name;
    const t = document.createElement("div"); t.textContent = TYPE_INFO[loc.type].label; t.style.cssText = "font-size:.8rem;color:#777;margin:.2rem 0";
    const p = document.createElement("div"); p.textContent = loc.desc;
    box.append(h, t, p);
    m.bindPopup(box);
    m.addTo(layers[loc.type]);
    markers[loc.id] = m;
  });

  ROUTES.forEach(function (r) {
    const pts = r.points.map(function (p) { return toLatLng(p[0], p[1]); });
    L.polyline(pts, { color: r.color || "#C51F27", weight: 5, opacity: .9 }).bindTooltip(r.name).addTo(layers.route);
  });

  Object.keys(layers).forEach(function (k) { layers[k].addTo(map); });


  // Hide layer checkboxes for kinds of locations the school has not provided yet
  document.querySelectorAll(".layer-toggle input").forEach(function (cb) {
    const k = cb.dataset.layer;
    const has = k === "route" ? ROUTES.length > 0 : LOCATIONS.some(function (l) { return l.type === k; });
    if (!has) cb.closest(".layer-toggle").hidden = true;
  });

  // Layer checkboxes
  document.querySelectorAll(".layer-toggle input").forEach(function (cb) {
    cb.addEventListener("change", function () {
      const layer = layers[cb.dataset.layer];
      if (!layer) return;
      if (cb.checked) layer.addTo(map); else map.removeLayer(layer);
    });
  });

  // Reset button
  const reset = document.getElementById("reset-map");
  if (reset) reset.addEventListener("click", function () {
    map.closePopup();
    resetView();
  });

  // Directory click -> zoom to the marker and open its popup (turn its layer back on if hidden)
  focusLocation = function (id) {
    const loc = LOCATIONS.find(function (l) { return l.id === id; });
    if (!loc) return;
    const layer = layers[loc.type];
    if (!map.hasLayer(layer)) {
      layer.addTo(map);
      const cb = document.querySelector('.layer-toggle input[data-layer="' + loc.type + '"]');
      if (cb) cb.checked = true;
    }
    map.setView(toLatLng(loc.x, loc.y), 0.5);
    markers[id].openPopup();
  };
}
