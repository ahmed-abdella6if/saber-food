/* =================================
   SABER FOOD ADMIN LOGIN
================================= */

const form = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const message = document.getElementById("loginMessage");


form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.textContent = "";
    message.style.color = "#d32f2f";

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const { error } = await db.auth.signInWithPassword({

        email,
        password

    });

    if (error) {

        message.textContent = error.message;

        return;

    }

    message.style.color = "#1b5e20";
    message.textContent = window.saberT ? window.saberT("Login successful...") : "Login successful...";

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 700);

});

document.getElementById("forgotPassword").addEventListener("click", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {

        alert("Please enter your email first.");

        return;

    }

    const { error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/admin/reset-password.html"
    });

    if (error) {

        alert(error.message);

    } else {

        alert("Password reset email has been sent.");

    }

});