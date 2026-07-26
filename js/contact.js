/* =====================================
   CONTACT / QUOTE REQUEST FORM
===================================== */

const quoteForm = document.getElementById("quoteForm");
const submitBtn = document.getElementById("submitQuote");

quoteForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const company_name = document.getElementById("company_name").value.trim();
    const contact_name = document.getElementById("contact_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const country = document.getElementById("country").value.trim();
    const category = document.getElementById("product_category").value;
    const notes = document.getElementById("notes").value.trim();

    if (!company_name || !contact_name || !email) {
        alert("Please fill in Company Name, Your Name and Email.");
        return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const { data, error } = await db
        .from("quotes")
        .insert({
            company_name,
            contact_name,
            email,
            phone: phone || null,
            country: country || null,
            notes: notes || null,
            products: category ? [category] : null,
            status: "Pending"
        })
        .select();

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    if (error) {
        console.error(error);
        alert("Something went wrong. Please try again or contact us directly.");
        return;
    }


    alert("Your request has been sent! Our team will contact you shortly.");

    quoteForm.reset();

});