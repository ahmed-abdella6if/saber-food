/* ==========================================================
   Saber Food - i18n engine
   Adds Italian (it) and Arabic (ar) translation support on
   top of the existing English (en) content.
   This file does not change any existing site logic - it only
   swaps visible text based on the selected language and
   persists the choice in localStorage.
   ========================================================== */

(function () {

    var LANG_KEY = "saberfood_lang";
    var LANG_LABELS = { en: "EN", it: "IT", ar: "AR" };
    var ATTRS = ["alt", "placeholder", "title", "aria-label"];

    function getSavedLang() {
        try {
            var saved = localStorage.getItem(LANG_KEY);
            if (saved === "en" || saved === "it" || saved === "ar") return saved;
        } catch (e) {}
        return "en";
    }

    function translateText(key, lang) {
        if (lang === "en") return key;
        var entry = window.SABER_I18N && window.SABER_I18N[key];
        if (entry && entry[lang]) return entry[lang];
        return key;
    }

    function applyLang(lang) {
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            var key = el.getAttribute("data-i18n");
            el.textContent = translateText(key, lang);
        });

        ATTRS.forEach(function (attr) {
            var selector = "[data-i18n-" + attr + "]";
            document.querySelectorAll(selector).forEach(function (el) {
                var key = el.getAttribute("data-i18n-" + attr);
                el.setAttribute(attr, translateText(key, lang));
            });
        });

        document.querySelectorAll(".lang-switcher-current").forEach(function (el) {
            el.textContent = LANG_LABELS[lang] || "EN";
        });

        document.querySelectorAll(".lang-switcher-menu button").forEach(function (btn) {
            btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
        });

        try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    }

    function setupSwitcher() {
        var toggle = document.getElementById("langSwitcherToggle");
        var menu = document.getElementById("langSwitcherMenu");
        if (!toggle || !menu) return;

        toggle.addEventListener("click", function (e) {
            e.stopPropagation();
            menu.classList.toggle("open");
        });

        menu.querySelectorAll("button[data-lang]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                applyLang(btn.getAttribute("data-lang"));
                menu.classList.remove("open");
            });
        });

        document.addEventListener("click", function () {
            menu.classList.remove("open");
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupSwitcher();
        applyLang(getSavedLang());
    });

    // Expose so dynamically-injected content (e.g. after a Supabase fetch,
    // or text built inside other scripts such as products.js) can be
    // translated too, without changing how those scripts otherwise work.
    window.saberApplyLang = applyLang;
    window.saberCurrentLang = getSavedLang;
    window.saberT = function (key) {
        return translateText(key, getSavedLang());
    };

})();
