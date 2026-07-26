let quotes = [];
let products = [];

let monthlyChart;
let categoryChart;
let statusChart;
async function loadAnalytics() {
renderTopProducts();
    const [

        productsResponse,

        quotesResponse

    ] = await Promise.all([

        db
            .from("products")
            .select("*"),

        db
            .from("quotes")
            .select("*")

    ]);

    if (productsResponse.error) {

        console.error(productsResponse.error);

    }

    if (quotesResponse.error) {

        console.error(quotesResponse.error);

    }

    products = productsResponse.data || [];

    quotes = quotesResponse.data || [];

    updateCards();

    createMonthlyChart();

    createCategoryChart();

    createStatusChart();

}

loadAnalytics();

function updateCards() {

    document.getElementById("totalQuotes").textContent =
        quotes.length;

    document.getElementById("pendingQuotes").textContent =
        quotes.filter(q => q.status === "Pending").length;

    const approved =
        quotes.filter(q => q.status === "Approved").length;

    const rate =
        quotes.length
        ? Math.round((approved / quotes.length) * 100)
        : 0;

    document.getElementById("approvalRate").textContent =
        rate + "%";

    let totalProducts = 0;

    quotes.forEach(q => {

        if (!Array.isArray(q.products)) return;

        q.products.forEach(p => {

            totalProducts += p.qty;

        });

    });

    document.getElementById("requestedProducts").textContent =
        totalProducts;

}
function createMonthlyChart() {

    const months = Array(12).fill(0);

    quotes.forEach(q => {

        const month = new Date(q.created_at).getMonth();

        months[month]++;

    });

    monthlyChart = new Chart(

        document.getElementById("monthlyQuotesChart"),

        {

            type: "line",

            data: {

                labels: [

                    "Jan","Feb","Mar","Apr","May","Jun",

                    "Jul","Aug","Sep","Oct","Nov","Dec"

                ],

                datasets: [{

                    data: months,

                    borderColor: "#1B5E20",

                    backgroundColor: "rgba(27,94,32,.15)",

                    fill: true,

                    tension: .35

                }]

            },

            options: {

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        }

    );

}
function createCategoryChart() {

    const categories = {};

    products.forEach(product => {

        categories[product.category] =
            (categories[product.category] || 0) + 1;

    });

    categoryChart = new Chart(

        document.getElementById("categoryChart"),

        {

            type: "doughnut",

            data: {

                labels: Object.keys(categories),

                datasets: [{

                    data: Object.values(categories)

                }]

            }

        }

    );

}

function createStatusChart() {

    const pending =
        quotes.filter(q => q.status === "Pending").length;

    const approved =
        quotes.filter(q => q.status === "Approved").length;

    const rejected =
        quotes.filter(q => q.status === "Rejected").length;

    statusChart = new Chart(

        document.getElementById("statusChart"),

        {

            type: "pie",

            data: {

                labels: [

                    "Pending",

                    "Approved",

                    "Rejected"

                ],

                datasets: [{

                    data: [

                        pending,

                        approved,

                        rejected

                    ]

                }]

            }

        }

    );

}
function renderTopProducts() {

    const map = {};

    quotes.forEach(q => {

        if (!Array.isArray(q.products)) return;

        q.products.forEach(product => {

            if (!map[product.name]) {

                map[product.name] = {

                    requests: 0,

                    qty: 0

                };

            }

            map[product.name].requests++;

            map[product.name].qty += product.qty;

        });

    });

    const sorted = Object.entries(map)

        .sort((a,b)=>b[1].qty-a[1].qty);

    const tbody =
        document.getElementById("topProductsTable");

    tbody.innerHTML="";

    sorted.forEach(([name,data])=>{

        tbody.innerHTML+=`

        <tr>

            <td>${name}</td>

            <td>${data.requests}</td>

            <td>${data.qty}</td>

        </tr>

        `;

    });

}
statusChart = new Chart(

    document.getElementById("statusChart"),

    {

        type:"pie",

        data:{

            labels:["Pending","Approved","Rejected"],

            datasets:[{

                data:[pending,approved,rejected]

            }]

        },

        options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
        legend: {
            position: "top"
        }
    }
        }}

);
db
.from("quotes")
.on(
    "postgres_changes",
    {
        event:"*",
        schema:"public",
        table:"quotes"
    },
    ()=>{

        loadAnalytics();

    }

)

.subscribe();