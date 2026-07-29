/* ======================================================
   SABER FOOD ADMIN
   REQUESTS.JS
====================================================== */
let quotes = [];
let filteredQuotes = [];

const tableBody = document.getElementById("requestsTable");

const drawer = document.getElementById("requestDrawer");
const overlay = document.getElementById("drawerOverlay");

const searchInput = document.getElementById("searchRequest");

let currentQuote = null;

/* ======================================================
   DRAWER
====================================================== */

async function loadQuotes(){

    const { data, error } = await db
        .from("quotes")
        .select("*")
        .order("created_at",{ascending:false});

    if(error){

        console.error(error);

        return;

    }

    quotes = data || [];

    filteredQuotes = [...quotes];

    renderQuotes(filteredQuotes);

    updateStats();

}

function renderQuotes(list){

    tableBody.innerHTML = "";

    if(list.length===0){

        tableBody.innerHTML=`

        <tr>

            <td colspan="9">

                No Quote Requests

            </td>

        </tr>

        `;

        return;

    }

    list.forEach(q=>{

        tableBody.innerHTML+=`

        <tr>

            <td>

                #${q.id}

            </td>

            <td>

                ${q.company_name}

            </td>

            <td>

                ${q.contact_name || "-"}

            </td>

            <td>

                ${q.email || "-"}

            </td>

            <td>

                ${q.products.length} Products

            </td>

            <td>

                <span class="priority medium">

                    Medium

                </span>

            </td>

            <td>

                <span class="status ${q.status.toLowerCase()}">

                    ${q.status}

                </span>

            </td>

            <td>

                ${new Date(q.created_at).toLocaleDateString()}

            </td>

            <td>

                <div class="table-actions">

                    <button
                        onclick="viewQuote(${q.id})">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                        onclick="approveQuote(${q.id})">

                        <i class="fa-solid fa-check"></i>

                    </button>

                    <button
                        onclick="deleteQuote(${q.id})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}
function openDrawer() {

    drawer.classList.add("open");

    overlay.classList.add("show");

}

function closeDrawerFunction() {

    drawer.classList.remove("open");

    overlay.classList.remove("show");

}



closeDrawer.addEventListener("click", closeDrawerFunction);

overlay.addEventListener("click", closeDrawerFunction);

/* ======================================================
   STATUS MODAL
====================================================== */

approveButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentRow = button.closest("tr");

        statusModal.classList.add("show");

    });

});

cancelStatus.addEventListener("click", () => {

    statusModal.classList.remove("show");

});

approveRequest.addEventListener("click", () => {

    loadingScreen.classList.add("show");

    setTimeout(() => {

        loadingScreen.classList.remove("show");

        statusModal.classList.remove("show");

        if(currentRow){

            const badge = currentRow.querySelector(".status");

            badge.className = "status approved";

            badge.innerHTML = "Approved";

        }

        showSuccess("Request Approved");

    },1000);

});

rejectRequest.addEventListener("click", () => {

    loadingScreen.classList.add("show");

    setTimeout(() => {

        loadingScreen.classList.remove("show");

        statusModal.classList.remove("show");

        if(currentRow){

            const badge = currentRow.querySelector(".status");

            badge.className = "status rejected";

            badge.innerHTML = "Rejected";

        }

        showSuccess("Request Rejected");

    },1000);

});

/* ======================================================
   DELETE
====================================================== */

deleteButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        currentRow = button.closest("tr");

        deleteModal.classList.add("show");

    });

});

cancelDelete.addEventListener("click",()=>{

    deleteModal.classList.remove("show");

});

confirmDelete.addEventListener("click",()=>{

    loadingScreen.classList.add("show");

    setTimeout(()=>{

        loadingScreen.classList.remove("show");

        deleteModal.classList.remove("show");

        if(currentRow){

            currentRow.remove();

        }

        showSuccess("Request Deleted");

    },1000);

});

/* ======================================================
   SEARCH
====================================================== */

searchInput.addEventListener("keyup",()=>{

    const value = searchInput.value.toLowerCase();

    document.querySelectorAll("tbody tr").forEach(row=>{

        row.style.display = row.innerText.toLowerCase().includes(value)

        ? ""

        : "none";

    });

});

/* ======================================================
   FILTERS
====================================================== */

document.querySelectorAll(".filters select").forEach(select=>{

    select.addEventListener("change",()=>{

        console.log(select.value);

        /*

        Supabase filtering later

        */

    });

});

/* ======================================================
   TOASTS
====================================================== */

function showSuccess(message){

    successToast.querySelector("span").innerHTML = message;

    successToast.classList.add("show");

    setTimeout(()=>{

        successToast.classList.remove("show");

    },3000);

}

function showError(message){

    errorToast.querySelector("span").innerHTML = message;

    errorToast.classList.add("show");

    setTimeout(()=>{

        errorToast.classList.remove("show");

    },3000);

}

/* ======================================================
   ESC KEY
====================================================== */

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closeDrawerFunction();

        statusModal.classList.remove("show");

        deleteModal.classList.remove("show");

    }

});

/* ======================================================
   DEMO
====================================================== */

loadQuotes();
/*

Next Version (Supabase)

Load requests

Approve request

Reject request

Delete request

Realtime updates

Email integration

WhatsApp integration

*/