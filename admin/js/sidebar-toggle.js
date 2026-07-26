/* ==========================================
   SABER FOOD ADMIN - MOBILE SIDEBAR TOGGLE
========================================== */

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

function openSidebar() {
    sidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
}

function closeSidebar() {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
}

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        if (sidebar.classList.contains("active")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
}

// Close the menu automatically when a nav link is tapped
document.querySelectorAll(".sidebar ul li a").forEach(link => {
    link.addEventListener("click", closeSidebar);
});
