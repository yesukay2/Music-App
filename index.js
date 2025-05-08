// Mobile Menu
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".sidebar-overlay");
const closeBtn = document.querySelector(".close-sidebar-btn");

let isMobileMenuOpen = false;

mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
  overlay.classList.add("active");

  isMobileMenuOpen = true;

  mobileMenuBtn.style.display = "none";
});

[closeBtn, overlay].forEach((el) => {
  el.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");

    isMobileMenuOpen = false;
    mobileMenuBtn.style.display = "block";
  });
});

// Volume Control Interaction
const volumeIcon = document.querySelector(".volume-control i");
const volumeSlider = document.querySelector(".volume-slider");

volumeIcon.addEventListener("click", (e) => {
  if (window.innerWidth <= 1024) {
    e.stopPropagation();
    document.querySelector(".volume-control").classList.toggle("active");
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".volume-control") && window.innerWidth <= 1024) {
    document.querySelector(".volume-control").classList.remove("active");
  }
});

// Dark Mode
const themeToggle = document.querySelector(".theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    body.classList.contains("dark-mode") ? "dark" : "light"
  );
  themeToggle.querySelector("i").classList.toggle("fa-moon");
  themeToggle.querySelector("i").classList.toggle("fa-sun");
});

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeToggle.querySelector("i").classList.replace("fa-moon", "fa-sun");
}

// Fetch music from Jamendo API
const fetchMusic = async () => {
  const clientSecret = "fc3fbfcd";
  const clientId = "157d24d89f3ee2ce868f1e6729d0c802";
  const response = await fetch(
    "https://api.jamendo.com/v3.1/tracks/?client_id=fc3fbfcd&format=json",
    {
      method: "GET",
      credentials: `include, client_secret=${clientSecret}`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${clientSecret}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

fetchMusic();

console.log(fetchMusic());
