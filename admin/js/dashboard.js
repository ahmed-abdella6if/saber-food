/* =====================================
   SABER FOOD ADMIN DASHBOARD
===================================== */

/* ---------- CURRENT DATE ---------- */
let products = [];
let quotes = [];

loadDashboard();
db.channel("dashboard-products")

.on(

    "postgres_changes",

    {

        event: "*",

        schema: "public",

        table: "products"

    },

    (payload)=>{

    loadDashboard();

    if(payload.eventType==="INSERT"){

        console.log("New Quote",payload.new);

    }

}

)

.subscribe();


db.channel("dashboard-quotes")

.on(

    "postgres_changes",

    {

        event: "*",

        schema: "public",

        table: "quotes"

    },

    () => {

        loadDashboard();

    }

)

.subscribe();
async function loadDashboard(){

    const [

        productsResponse,

        quotesResponse

    ] = await Promise.all([

        db.from("products").select("*"),

        db.from("quotes").select("*").order("created_at",{ascending:false})

    ]);

    products = productsResponse.data || [];

    quotes = quotesResponse.data || [];

    updateCards();

    renderRecentQuotes();

    renderCategoryChart();

    renderRequestsChart();

}
function updateCards(){

    document.getElementById("totalProducts").textContent =
        products.length;

    document.getElementById("totalCategories").textContent =
        [...new Set(products.map(p => p.category))].length;

    document.getElementById("totalQuotes").textContent =
        quotes.length;

    document.getElementById("pendingQuotes").textContent =
        quotes.filter(q => q.status === "Pending").length;

}

function renderRecentQuotes(){

    const tbody =
        document.getElementById("recentQuotes");

    tbody.innerHTML = "";

    quotes.slice(0,5).forEach(q=>{

        tbody.innerHTML += `

        <tr>

            <td>${q.company_name}</td>

            <td>${Array.isArray(q.products) ? q.products.length : 0} Products</td>

            <td>

                <span class="status ${(q.status || "Pending").toLowerCase()}">

                    ${q.status || "Pending"}

                </span>

            </td>

        </tr>

        `;

    });

}
const today = new Date();

const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
};

const dateElement = document.getElementById("currentDate");

if (dateElement) {
    dateElement.textContent = today.toLocaleDateString("en-US", options);
}


/* ---------- CATEGORY CHART ---------- */

let categoryChart;

function renderCategoryChart() {

    const canvas = document.getElementById("categoryChart");

    if (!canvas) return;

    const counts = {};

    products.forEach(product => {

        const category = product.category || (window.saberT ? window.saberT("Other") : "Other");

        counts[category] = (counts[category] || 0) + 1;

    });

    if (categoryChart) {

        categoryChart.destroy();

    }

    categoryChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: Object.keys(counts),

            datasets: [{

                label: (window.saberT ? window.saberT("Products") : "Products"),

                data: Object.values(counts),

                borderRadius: 8,

                backgroundColor: "#1B5E20"

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            }

        }

    });

}


/* ---------- REQUEST CHART ---------- */

let requestsChart;

function renderRequestsChart() {

    const canvas = document.getElementById("requestsChart");

    if (!canvas) return;

    const months = {};

    quotes.forEach(q => {

        const month = new Date(q.created_at)
            .toLocaleString("en-US", {
                month: "short"
            });

        months[month] = (months[month] || 0) + 1;

    });

    if (requestsChart) {

        requestsChart.destroy();

    }

    requestsChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: Object.keys(months),

            datasets: [{

                label: (window.saberT ? window.saberT("Quote Requests") : "Quote Requests"),

                data: Object.values(months),

                borderColor: "#1B5E20",

                backgroundColor: "rgba(27,94,32,.15)",

                borderWidth: 3,

                fill: true,

                tension: .4

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            }

        }

    });

}

/* ---------- COUNTER ANIMATION ---------- */

const counters = document.querySelectorAll(".stat-card h2");

counters.forEach(counter=>{

const target = Number(counter.innerText);

let count = 0;

const speed = Math.max(1, Math.ceil(target / 40));

const update = ()=>{

count += speed;

if(count >= target){

counter.innerText = target;

}else{

counter.innerText = count;

requestAnimationFrame(update);

}

};

update();

});


/* ---------- TABLE ROW HOVER ---------- */

const rows = document.querySelectorAll("tbody tr");

rows.forEach(row=>{

row.addEventListener("mouseenter",()=>{

row.style.transform="scale(1.01)";

});

row.addEventListener("mouseleave",()=>{

row.style.transform="scale(1)";

});

});


/* ---------- LIVE CLOCK ---------- */

const clock = document.getElementById("liveClock");

if(clock){

setInterval(()=>{

const now = new Date();

clock.textContent = now.toLocaleTimeString();

},1000);

}


/* ---------- NOTIFICATION BADGE ---------- */

const notification = document.querySelector(".notification");

if(notification){

notification.addEventListener("click",()=>{

notification.addEventListener("click",()=>{

    const pending = quotes.filter(

        q=>q.status==="Pending"

    ).length;

    alert(

        `You have ${pending} pending quote requests.`

    );

});

});

}