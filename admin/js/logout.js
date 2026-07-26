/* =================================
   LOGOUT
================================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        await db.auth.signOut();

        window.location.href = "login.html";

    });

}