/* =================================
   ADMIN AUTH GUARD
================================= */

(async () => {

    const {

        data,

        error

    } = await db.auth.getSession();

    if (error) {

        console.error(error);

        window.location.href = "login.html";

        return;

    }

    if (!data.session) {

        window.location.href = "login.html";

        return;

    }

})();