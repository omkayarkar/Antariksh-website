// =====================================================
// ANTARIKSH WEBSITE - MAIN SCRIPT (All Pages)
// Includes: Auto Slider + Timeline + Discoveries + Modal
// =====================================================


// -------------------
// 1) SLIDER (AUTO + BUTTONS + DOTS + PROGRESS BAR)
// -------------------
function setupSlider(slider) {
  const slides = slider.querySelectorAll(".slide");
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  const dotsContainer = slider.querySelector(".dots");
  const progressBar = slider.querySelector(".progress-bar");

  if (!slides.length) return;

  let current = 0;
  let interval = null;

  const delay = 5000; // ✅ Auto slide time (5 seconds)

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll(".dot") : [];

  function restartProgressBar() {
    // Restart progress bar animation each time slide changes
    if (progressBar) {
      progressBar.style.animation = "none";
      progressBar.offsetHeight; // force reflow
      progressBar.style.animation = `fill ${delay / 1000}s linear infinite`;
    }
  }

  function showSlide(index) {
    slides.forEach((s) => s.classList.remove("active"));
    slides[index].classList.add("active");

    if (dots.length) {
      dots.forEach((d) => d.classList.remove("active"));
      dots[index].classList.add("active");
    }

    current = index;
    restartProgressBar();
  }

  function nextSlide() {
    const nextIndex = (current + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (current - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function stopAutoSlide() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function startAutoSlide() {
    stopAutoSlide(); // ✅ prevents multiple timers
    interval = setInterval(nextSlide, delay);
  }

  function goToSlide(index) {
    showSlide(index);
    startAutoSlide(); // ✅ restart timer after manual click
  }

  // Button events
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoSlide();
    });
  }

  // Pause on hover
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  // Start slider
  showSlide(0);
  startAutoSlide();
}


// -------------------
// 2) MODAL FUNCTIONS (Timeline + Discoveries)
// -------------------
function openModal(title, date, desc) {
  const modal = document.getElementById("modal");
  if (!modal) return;

  const modalTitle = document.getElementById("modalTitle");
  const modalDate = document.getElementById("modalDate");
  const modalDesc = document.getElementById("modalDesc");

  if (modalTitle) modalTitle.innerText = title || "";
  if (modalDate) modalDate.innerText = date ? `Year/Date: ${date}` : "";
  if (modalDesc) modalDesc.innerText = desc || "";

  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (!modal) return;
  modal.style.display = "none";
}

// Close modal when clicking outside content
window.addEventListener("click", (e) => {
  if (e.target && e.target.id === "modal") {
    closeModal();
  }
});


// -------------------
// 3) TIMELINE PAGE DATA + RENDER
// -------------------
const timelineEvents = [
  {
    title: "Sputnik 1 (First Satellite)",
    date: "1957",
    desc: "The first artificial satellite launched by the Soviet Union, starting the Space Age."
  },
  {
    title: "First Human in Space",
    date: "1961",
    desc: "Yuri Gagarin became the first human to travel into space and orbit Earth."
  },
  {
    title: "Apollo 11 Moon Landing",
    date: "1969",
    desc: "Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon."
  },
  {
    title: "Hubble Space Telescope",
    date: "1990",
    desc: "Hubble transformed astronomy by delivering deep space images and studying galaxies."
  },
  {
    title: "First Image of a Black Hole",
    date: "2019",
    desc: "The Event Horizon Telescope captured the first-ever image of a black hole."
  },
  {
    title: "James Webb Space Telescope",
    date: "2021",
    desc: "JWST opened a new era of infrared astronomy and studied early galaxies."
  }
];

function renderTimeline() {
  const timelineList = document.getElementById("timelineList");
  if (!timelineList) return;

  timelineList.innerHTML = "";

  timelineEvents.forEach((ev) => {
    const div = document.createElement("div");
    div.className = "event";

    div.innerHTML = `
      <div class="event-top">
        <h4>${ev.title}</h4>
        <span class="badge">${ev.date}</span>
      </div>
      <p>${ev.desc}</p>
      <span class="readmore">Read More</span>
    `;

    const btn = div.querySelector(".readmore");
    btn.addEventListener("click", () => {
      openModal(ev.title, ev.date, ev.desc);
    });

    timelineList.appendChild(div);
  });
}


// -------------------
// 4) DISCOVERIES PAGE DATA + RENDER
// -------------------
const discoveries = [
  {
    title: "Exoplanets",
    date: "1992 → Present",
    desc: "Planets outside our solar system. Thousands have been discovered using space telescopes."
  },
  {
    title: "Gravitational Waves",
    date: "2015",
    desc: "Detected by LIGO, confirming Einstein’s prediction and opening a new way to observe the universe."
  },
  {
    title: "Cosmic Microwave Background (CMB)",
    date: "1965",
    desc: "The afterglow of the Big Bang, helping scientists understand the early universe."
  },
  {
    title: "Expansion of the Universe",
    date: "1929",
    desc: "Edwin Hubble showed that galaxies are moving away, proving the universe is expanding."
  },
  {
    title: "Black Hole Imaging",
    date: "2019",
    desc: "The first image of a black hole was captured by the Event Horizon Telescope."
  },
  {
    title: "Water on Mars Evidence",
    date: "2000s",
    desc: "Multiple missions found signs of water on Mars, increasing the possibility of past life."
  }
];

function renderDiscoveries() {
  const discoveryCards = document.getElementById("discoveryCards");
  if (!discoveryCards) return;

  discoveryCards.innerHTML = "";

  discoveries.forEach((d) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <h4>${d.title}</h4>
      <p><b>${d.date}</b></p>
      <p>${d.desc}</p>
    `;

    card.addEventListener("click", () => {
      openModal(d.title, d.date, d.desc);
    });

    discoveryCards.appendChild(card);
  });
}


// -------------------
// 5) CONTACT FORM (Message)
// -------------------
function submitForm(e) {
  e.preventDefault();
  const msg = document.getElementById("formMsg");
  if (msg) msg.innerText = "✅ Message sent successfully! ";
  return false;
}


// -------------------
// 6) INITIALIZE EVERYTHING ON PAGE LOAD
// -------------------
document.addEventListener("DOMContentLoaded", () => {
  // Setup all sliders on current page
  document.querySelectorAll(".slider").forEach(setupSlider);

  // Render timeline if timeline page
  renderTimeline();

  // Render discoveries if discoveries page
  renderDiscoveries();

    // Render discoveries if upcoming page
renderUpcomingFromJSON();

});

// -------------------
// UPCOMING EVENTS (AUTO NEXT 5)
// -------------------

// This list can be expanded anytime, but the "auto update" means:
// it automatically selects the next 5 from today's date (no manual sorting needed).

const upcomingEventsData = [
  // From NASA Watch the Skies 2026 :contentReference[oaicite:1]{index=1}
  { title: "Planetary Parade (6 planets)", date: "2026-02-28", desc: "See Mercury, Venus, Neptune, Saturn, Uranus, and Jupiter shortly after sunset." },
  { title: "Total Lunar Eclipse", date: "2026-03-03", desc: "A total lunar eclipse (Blood Moon) visible in some regions of the world." },
  { title: "Full Blue Moon", date: "2026-05-31", desc: "A rare second full moon in a month — 'once in a blue moon' event." },
  { title: "Venus & Jupiter Conjunction", date: "2026-06-09", desc: "The two brightest planets appear very close together in the sky." },
  { title: "Perseids Meteor Shower Peak", date: "2026-08-13", desc: "One of the best meteor showers of the year, visible under dark skies." },

  // Extra events (optional supporting sources)
  { title: "Lyrids Meteor Shower Peak", date: "2026-04-22", desc: "Lyrids peak with occasional bright meteors and dust trails." },
  { title: "Geminids Meteor Shower Peak", date: "2026-12-14", desc: "One of the most active meteor showers of the year." }
];

function parseDateISO(dateStr) {
  // dateStr is like "2026-02-28"
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getNextFiveUpcomingEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter future (including today)
  const futureEvents = upcomingEventsData
    .map(ev => ({
      ...ev,
      dateObj: parseDateISO(ev.date)
    }))
    .filter(ev => ev.dateObj >= today)
    .sort((a, b) => a.dateObj - b.dateObj);

  return futureEvents.slice(0, 5);
}

function renderUpcomingEvents() {
  const upcomingList = document.getElementById("upcomingList");
  if (!upcomingList) return;

  const list = getNextFiveUpcomingEvents();
  upcomingList.innerHTML = "";

  if (list.length === 0) {
    upcomingList.innerHTML = `<div class="event">
      <div class="event-top">
        <h4>No upcoming events found</h4>
        <span class="badge">Check back later</span>
      </div>
      <p>Add more events in upcomingEventsData to extend the timeline.</p>
    </div>`;
    return;
  }

  list.forEach((ev) => {
    const div = document.createElement("div");
    div.className = "event";

    div.innerHTML = `
      <div class="event-top">
        <h4>${ev.title}</h4>
        <span class="badge">${ev.date}</span>
      </div>
      <p>${ev.desc}</p>
      <span class="readmore">Read More</span>
    `;

    div.querySelector(".readmore").addEventListener("click", () => {
      openModal(ev.title, ev.date, ev.desc);
    });

    upcomingList.appendChild(div);
  });
}

function refreshUpcomingEvents() {
  renderUpcomingEvents();
}

async function renderUpcomingFromJSON() {
  const upcomingList = document.getElementById("upcomingList");
  const lastUpdatedText = document.getElementById("lastUpdatedText");

  if (!upcomingList) return;

  upcomingList.innerHTML = `<div class="event"><p>Loading upcoming events...</p></div>`;

  try {
    const res = await fetch("data/events.json");
    const data = await res.json();

    if (lastUpdatedText) {
      lastUpdatedText.innerText = data.lastUpdated
        ? `Last Auto Updated: ${new Date(data.lastUpdated).toLocaleString()}`
        : "";
    }

    // Show only top 5
    const events = (data.events || []).slice(0, 5);

    upcomingList.innerHTML = "";

    if (events.length === 0) {
      upcomingList.innerHTML = `<div class="event"><p>No events found. Try again later.</p></div>`;
      return;
    }

    events.forEach((ev) => {
      const div = document.createElement("div");
      div.className = "event";

      div.innerHTML = `
        <div class="event-top">
          <h4>${ev.title}</h4>
          <span class="badge">${ev.rawDateText}</span>
        </div>
        <p>${ev.description}</p>
        <a class="readmore" href="${ev.url}" target="_blank">Source</a>
      `;

      upcomingList.appendChild(div);
    });
  } catch (err) {
    upcomingList.innerHTML = `<div class="event"><p>❌ Error loading events.</p></div>`;
  }
}
