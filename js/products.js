/* =================================
   SABER FOOD PRODUCTS
================================= */



let allProducts = [];
let quote = JSON.parse(localStorage.getItem("quote")) || [];

/* ================================
   LOAD PRODUCTS FROM SUPABASE
================================ */

async function loadProducts() {

    console.log("Loading products...");

    const { data, error } = await db
        .from("products")
        .select("*")
        .order("id");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) return;

    allProducts = data;

    console.log("Products Loaded:", allProducts);

    renderProducts(allProducts);

}

loadProducts();


/* ================================
   RENDER PRODUCTS
================================ */

function renderProducts(products) {

    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    grid.innerHTML = "";

    products.forEach(product => {

        grid.innerHTML += createProductCard(product);

    });

}


/* ================================
   PRODUCT CARD
================================ */

function createProductCard(product) {

    return `

<div class="product-card" data-category="${product.category}">

    <img src="${product.image}" alt="${product.name}">

    <div class="product-info">

        <span>${capitalize(product.category)}</span>

        <h3>${product.name}</h3>

        <p>${product.description}</p>

        <div class="product-actions">

            

            <button
                class="btn-primary"
                onclick="addToQuote(${product.id})">

                ${window.saberT ? window.saberT("Add To Quote") : "Add To Quote"}

            </button>

        </div>

    </div>

</div>

`;

}


/* ================================
   HELPERS
================================ */

function capitalize(text){

    return text.charAt(0).toUpperCase() + text.slice(1);

}
/* ================================
   SEARCH
================================ */

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const value = searchInput.value.toLowerCase();

        const filtered = allProducts.filter(product =>

            product.name.toLowerCase().includes(value) ||

            product.description.toLowerCase().includes(value) ||

            product.category.toLowerCase().includes(value)

        );

        renderProducts(filtered);

    });

}


/* ================================
   FILTERS
================================ */

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>

            btn.classList.remove("active")
        );

        button.classList.add("active");

        const filter = button.dataset.filter;

        if (filter === "all") {

            renderProducts(allProducts);

            return;

        }

        const filtered = allProducts.filter(product =>

            product.category === filter

        );

        renderProducts(filtered);

    });

});


/* ================================
   PRODUCT DETAILS MODAL
================================ */

function openProduct(id) {

    const product = allProducts.find(p => p.id == id);

    if (!product) return;

    document.getElementById("modalTitle").textContent =
        product.name;

    document.getElementById("modalCategory").textContent =
        capitalize(product.category);

    document.getElementById("modalDescription").textContent =
        product.description;

    document.getElementById("modalImage").src =
        product.image;

    document.getElementById("modalOrigin").textContent =
        product.origin;

    document.getElementById("modalBrand").textContent =
        product.brand;

    document.getElementById("modalAvailability").textContent =
        product.availability;

    document.getElementById("modalAddBtn").onclick = () => {

        addToQuote(id);

        closeModal();

    };

    document
        .getElementById("productModal")
        .classList.add("show");

}


function closeModal() {

    document
        .getElementById("productModal")
        .classList.remove("show");

}


window.addEventListener("click", (e) => {

    const modal = document.getElementById("productModal");

    if (e.target === modal) {

        closeModal();

    }

});
/* ================================
   QUOTE SYSTEM
================================ */

function addToQuote(id) {

    const product = allProducts.find(p => p.id == id);

    if (!product) return;

    const existing = quote.find(item => item.id == id);

    if (existing) {

        existing.qty++;

    } else {

        quote.push({

            id: product.id,
            name: product.name,
            image: product.image,
            qty: 1

        });

    }

    saveQuote();

    openQuoteDrawer();

}

function increaseQty(id) {

    const item = quote.find(p => p.id == id);

    if (!item) return;

    item.qty++;

    saveQuote();

}


function decreaseQty(id) {

    const item = quote.find(p => p.id == id);

    if (!item) return;

    item.qty--;

    if (item.qty <= 0) {

        quote = quote.filter(p => p.id != id);

    }

    saveQuote();

}

function removeFromQuote(id) {

    quote = quote.filter(item => item.id != id);

    saveQuote();

}
      function saveQuote() {

         localStorage.setItem(

            "quote",

            JSON.stringify(quote)

         );

         updateQuoteCount();

         renderQuoteDrawer();

      }


function updateQuoteCount() {

    const count = quote.reduce(

        (sum, item) => sum + item.qty,

        0

    );

    document.querySelectorAll(".quote-count").forEach(el => {

        el.textContent = count;

    });

}
/* ================================
   QUOTE DRAWER
================================ */

function renderQuoteDrawer() {

    const list = document.getElementById("quoteItems");

    if (!list) return;

    list.innerHTML = "";

    if (quote.length === 0) {

        list.innerHTML = `

        <div class="empty-quote">

            <i class="fa-solid fa-box-open"></i>

            <h3>${window.saberT ? window.saberT("Your quote is empty") : "Your quote is empty"}</h3>

            <p>${window.saberT ? window.saberT("Start adding products to build your quote.") : "Start adding products to build your quote."}</p>

        </div>

        `;

        return;

    }

    list.innerHTML = `

        <div class="quote-summary">

            <strong>${quote.length}</strong> ${window.saberT ? window.saberT(quote.length > 1 ? "Products Selected" : "Product Selected") : (quote.length > 1 ? "Products Selected" : "Product Selected")}

        </div>

    `;

    quote.forEach(item => {

        list.innerHTML += `

        <div class="quote-item">

            <img
                src="${item.image}"
                alt="${item.name}">

            <div class="quote-info">

                <h4>${item.name}</h4>

                <div class="quote-qty">

                    <button onclick="decreaseQty(${item.id})">
                        −
                    </button>

                    <span>${item.qty}</span>

                    <button onclick="increaseQty(${item.id})">
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-item"
                onclick="removeFromQuote(${item.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

}

/* ================================
   DRAWER
================================ */

function openQuoteDrawer() {

    document
        .getElementById("quoteDrawer")
        .classList.add("show");

}

function closeQuoteDrawer() {

    document
        .getElementById("quoteDrawer")
        .classList.remove("show");

}


/* ================================
   SEND QUOTE
================================ */

function proceedToQuote() {

    if (quote.length === 0) {

        alert(window.saberT ? window.saberT("Please add products first.") : "Please add products first.");

        return;

    }

    localStorage.setItem(

        "quote",

        JSON.stringify(quote)

    );

    window.location.href = "contact.html";

}


/* ================================
   INITIALIZE
================================ */

document.addEventListener("DOMContentLoaded", () => {

    renderQuoteDrawer();

    updateQuoteCount();

});


async function submitQuote() {

    if (quote.length === 0) {

        alert(window.saberT ? window.saberT("Please add at least one product.") : "Please add at least one product.");

        return;

    }

    const company =
        document.getElementById("companyName").value.trim();

    if (!company) {

        alert(window.saberT ? window.saberT("Company name is required.") : "Company name is required.");

        return;

    }

    const contact =
        document.getElementById("contactName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const country =
        document.getElementById("country").value.trim();

    const notes =
        document.getElementById("notes").value.trim();

    const { error } = await db
        .from("quotes")
        .insert({

            company_name: company,

            contact_name: contact,

            email,

            phone,

            country,

            notes,

            products: quote,

            status: "Pending"

        });

    if (error) {

        console.error(error);

        alert(window.saberT ? window.saberT("Failed to submit quote.") : "Failed to submit quote.");

        return;

    }

    alert(window.saberT ? window.saberT("Quote submitted successfully!") : "Quote submitted successfully!");

    quote = [];

    saveQuote();

  document
    .getElementById("quoteForm")
    .reset();

    closeQuoteDrawer();

}
document
    .getElementById("submitQuote")
    .addEventListener("click", submitQuote);

    document
    .getElementById("quoteButton")
    .addEventListener("click", openQuoteDrawer);

document
    .getElementById("closeQuoteDrawer")
    .addEventListener("click", closeQuoteDrawer);

    document
    .getElementById("submitQuote")
    .addEventListener("click", submitQuote);