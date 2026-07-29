const form = document.getElementById("resetForm");

const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const password = document.getElementById("password").value;

    const confirm = document.getElementById("confirmPassword").value;

    if(password !== confirm){

        message.style.color = "#d32f2f";

        message.textContent = window.saberT ? window.saberT("Passwords do not match.") : "Passwords do not match.";

        return;

    }

    const { error } = await db.auth.updateUser({

        password: password

    });

    if(error){

        message.style.color = "#d32f2f";

        message.textContent = error.message;

        return;

    }

    message.style.color = "#1B5E20";

    message.textContent = window.saberT ? window.saberT("Password updated successfully.") : "Password updated successfully.";

    setTimeout(()=>{

        window.location.href = "login.html";

    },1500);

});