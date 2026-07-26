let quotes = [];
let filteredQuotes = [];
const drawer = document.getElementById("requestDrawer");

const overlay = document.getElementById("drawerOverlay");

const closeDrawer = document.getElementById("closeDrawer");

let currentQuote = null;

const tableBody = document.getElementById("requestsTable");

const searchInput = document.getElementById("searchRequest");

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

            <td colspan="8">

                No Quotes Found

            </td>

        </tr>

        `;

        return;

    }

    list.forEach(q=>{

        tableBody.innerHTML+=`

        <tr>

            <td>#${q.id}</td>

            <td>${q.company_name}</td>

            <td>${q.contact_name || "-"}</td>

            <td>${q.country || "-"}</td>

            <td>${Array.isArray(q.products) ? q.products.length : 0} Products</td>

            <td>

                <span class="status ${(q.status || "Pending").toLowerCase()}">

    ${q.status || "Pending"}

</span>

            </td>

            <td>

                ${new Date(q.created_at).toLocaleDateString()}

            </td>

            <td>

                <div class="table-actions">

                    <button onclick="viewQuote(${q.id})">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button onclick="approveQuote(${q.id})">

                        <i class="fa-solid fa-check"></i>

                    </button>

                    <button onclick="deleteQuote(${q.id})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}
async function approveQuote(id) {

    const { error } = await db
        .from("quotes")
        .update({
            status: "Approved"
        })
        .eq("id", id);

    if (error) {

        console.error(error);

        return;

    }

    loadQuotes();

}

async function deleteQuote(id) {

    if (!confirm("Delete this quote?")) return;

    const { error } = await db
        .from("quotes")
        .delete()
        .eq("id", id);

    if (error) {

        console.error(error);

        return;

    }

    loadQuotes();

}
closeDrawer.addEventListener("click",()=>{

    drawer.classList.remove("open");

    overlay.classList.remove("show");

});

overlay.addEventListener("click",()=>{

    drawer.classList.remove("open");

    overlay.classList.remove("show");

});
function updateStats(){

    document.getElementById("totalRequests").textContent =
        quotes.length;

    document.getElementById("pendingRequests").textContent =
        quotes.filter(q=>q.status==="Pending").length;

    document.getElementById("approvedRequests").textContent =
        quotes.filter(q=>q.status==="Approved").length;

    document.getElementById("rejectedRequests").textContent =
        quotes.filter(q=>q.status==="Rejected").length;

    document.getElementById("requestCount").textContent =
        `${quotes.length} Requests`;

}
function viewQuote(id){

    const quote = quotes.find(q => q.id == id);

    if(!quote) return;

    currentQuote = quote;

    document.getElementById("drawerCompany").textContent =
        quote.company_name;

    document.getElementById("drawerCompany2").textContent =
        quote.company_name;

    document.getElementById("drawerContact").textContent =
        quote.contact_name || "-";

    document.getElementById("drawerEmail").textContent =
        quote.email || "-";

    document.getElementById("drawerPhone").textContent =
        quote.phone || "-";

    document.getElementById("drawerCountry").textContent =
        quote.country || "-";

    document.getElementById("drawerDate").textContent =
        new Date(quote.created_at).toLocaleString();

    document.getElementById("drawerNotes").textContent =
        quote.notes || "No Notes";

    const status = document.getElementById("drawerStatus");

    status.textContent = quote.status || "Pending";

    status.className =
        "status " + (quote.status || "Pending").toLowerCase();

    const productsContainer = document.getElementById("drawerProducts");

    productsContainer.innerHTML = "";

    if (Array.isArray(quote.products)) {

        quote.products.forEach(product => {

            productsContainer.innerHTML += `
                <div class="drawer-product">

                    <strong>${product.name}</strong>

                    <span>Qty: ${product.qty}</span>

                </div>
            `;

        });

    }

    drawer.classList.add("open");

    overlay.classList.add("show");

}
async function updateQuoteStatus(status){

    if(!currentQuote) return;

    const { error } = await db
        .from("quotes")
        .update({
            status: status
        })
        .eq("id", currentQuote.id);

    if(error){

        console.error(error);

        return;

    }

    drawer.classList.remove("open");

    overlay.classList.remove("show");

    loadQuotes();

}
document.getElementById("drawerApprove").onclick = () => {

    updateQuoteStatus("Approved");

};

document.getElementById("drawerReject").onclick = () => {

    updateQuoteStatus("Rejected");

};

document.getElementById("drawerEmailBtn").onclick = () => {

    if(!currentQuote?.email) return;

    window.location.href =
        `mailto:${currentQuote.email}`;

};
document.getElementById("drawerWhatsapp").onclick = () => {

    if(!currentQuote?.phone) return;

    const phone = currentQuote.phone.replace(/\D/g,"");

    window.open(

        `https://wa.me/${phone}`,

        "_blank"

    );

};
searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    filteredQuotes = quotes.filter(q =>

        (q.company_name || "").toLowerCase().includes(value) ||

        (q.contact_name || "").toLowerCase().includes(value) ||

        (q.email || "").toLowerCase().includes(value)

    );

    renderQuotes(filteredQuotes);

});

loadQuotes();
db.channel("quotes-channel")

.on(

    "postgres_changes",

    {

        event: "*",

        schema: "public",

        table: "quotes"

    },

    () => {

    loadQuotes();

    showSuccess("New quote  received");

}

)

.subscribe();