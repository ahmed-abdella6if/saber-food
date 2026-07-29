/* =====================================
   LOAD WEBSITE SETTINGS
===================================== */

async function loadWebsiteSettings() {

    const { data, error } = await db
        .from("settings")
        .select("*");

    if (error) {

        console.error(error);

        return;

    }

    const settings = {};

    data.forEach(item => {

        settings[item.key] = item.value;

    });

    /* Company Name */

    document.querySelectorAll(".company-name").forEach(el => {

        el.textContent = settings.company_name || "Saber Food";

    });

    /* Website Title */

    if (settings.website_title) {

        document.title = settings.website_title;

    }

    /* Website Description */

    const description = document.querySelector(".website-description");

    if (description) {

        description.textContent = settings.website_description || "";

    }

    /* Logo */

    document.querySelectorAll(".company-logo").forEach(img => {

        if (settings.logo) {

            img.src = settings.logo;

        }

    });

    /* Email */

    document.querySelectorAll(".company-email").forEach(el => {

        el.textContent = settings.email || "";

        el.href = `mailto:${settings.email}`;

    });

    /* Phone */

    document.querySelectorAll(".company-phone").forEach(el => {

        el.textContent = settings.phone || "";

        el.href = `tel:${settings.phone}`;

    });

    /* WhatsApp */

    document.querySelectorAll(".company-whatsapp").forEach(el => {

        const phone = (settings.whatsapp || "").replace(/\D/g, "");

        el.href = `https://wa.me/${phone}`;

    });

    /* Address */

    document.querySelectorAll(".company-address").forEach(el => {

        el.textContent = settings.address || "";

    });

}

loadWebsiteSettings();