/* ==========================================
   SABER FOOD ADMIN
   PRODUCTS.JS
========================================== */

const drawer = document.getElementById("productDrawer");
const overlay = document.getElementById("drawerOverlay");

const openDrawerBtn = document.getElementById("openDrawer");
const closeDrawerBtn = document.getElementById("closeDrawer");
const cancelDrawerBtn = document.getElementById("cancelDrawer");

const productForm = document.getElementById("productForm");

const imageInput = document.getElementById("productImages");
const imagePreview = document.getElementById("imagePreview");

const previewImage = document.getElementById("previewImage");
const previewName = document.getElementById("previewName");
const previewCategory = document.getElementById("previewCategory");
const previewDescription = document.getElementById("previewDescription");
const previewPrice = document.getElementById("previewPrice");
const previewStock = document.getElementById("previewStock");

const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const productStock = document.getElementById("productStock");

const loadingScreen = document.getElementById("loadingScreen");
const successToast = document.getElementById("successToast");
const errorToast = document.getElementById("errorToast");

const deleteModal = document.getElementById("deleteModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

let editingProduct = null;

/* ==========================================
   OPEN DRAWER
========================================== */

function openDrawer() {

    drawer.classList.add("open");

    overlay.classList.add("show");

}

/* ==========================================
   CLOSE DRAWER
========================================== */

function closeDrawer() {

    drawer.classList.remove("open");

    overlay.classList.remove("show");

}

if(openDrawerBtn){

    openDrawerBtn.addEventListener("click",openDrawer);

}

if(closeDrawerBtn){

    closeDrawerBtn.addEventListener("click",closeDrawer);

}

if(cancelDrawerBtn){

    cancelDrawerBtn.addEventListener("click",closeDrawer);

}

overlay.addEventListener("click",closeDrawer);
/* ==========================================
   IMAGE PREVIEW
========================================== */

if (imageInput) {

    imageInput.addEventListener("change", function () {

        imagePreview.innerHTML = "";

        const files = Array.from(this.files);

        if (files.length === 0) {

            imagePreview.innerHTML = `
                <div class="preview-placeholder">
                    <i class="fa-regular fa-image"></i>
                    <p>Image Preview</p>
                </div>
            `;

            return;
        }

        files.forEach(file => {

            const reader = new FileReader();

            reader.onload = function (e) {

                const img = document.createElement("img");

                img.src = e.target.result;

                img.className = "preview-image";

                imagePreview.appendChild(img);

                if (previewImage) {

                    previewImage.src = e.target.result;

                }

            };

            reader.readAsDataURL(file);

        });

    });

}

/* ==========================================
   LIVE PREVIEW
========================================== */

function updatePreview() {

    if (previewName) {

        previewName.textContent =
            productName.value || "Product Name";

    }

    if (previewCategory) {

        previewCategory.textContent =
            productCategory.value || "Category";

    }

    if (previewDescription) {

        previewDescription.textContent =
            productDescription.value ||
            "Product description will appear here...";

    }

    if (previewPrice) {

        const price =
            productPrice.value || "0.00";

        previewPrice.textContent =
            "€" + price;

    }

    if (previewStock) {

        previewStock.textContent =
            productStock.value || "0";

    }

}

[
    productName,
    productCategory,
    productDescription,
    productPrice,
    productStock
].forEach(input => {

    if (input) {

        input.addEventListener("input", updatePreview);

    }

});

updatePreview();
/* ==========================================
   LOCAL STORAGE
========================================== */

const STORAGE_KEY = "saber_food_products";

let products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* ==========================================
   SAVE PRODUCTS
========================================== */

function saveProducts() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(products)

    );

}

/* ==========================================
   GENERATE ID
========================================== */

function generateId() {

    return Date.now().toString();

}

/* ==========================================
   CREATE PRODUCT OBJECT
========================================== */

function createProduct() {

    return {

        id: generateId(),

        name: productName.value.trim(),

        category: productCategory.value,

        description: productDescription.value.trim(),

        price: Number(productPrice.value),

        stock: Number(productStock.value),

        image:

            previewImage.src ||

            "../images/placeholder.jpg"

    };

}

/* ==========================================
   SAVE PRODUCT
========================================== */

productForm.addEventListener("submit", function (e) {

    e.preventDefault();

    if (!productName.value.trim()) {

        showError("Product name is required.");

        return;

    }

    loadingScreen.classList.add("show");

    setTimeout(() => {

        if (editingProduct) {

            const index = products.findIndex(

                p => p.id === editingProduct

            );

            if (index !== -1) {

                products[index] = {

                    ...products[index],

                    ...createProduct(),

                    id: editingProduct

                };

            }

        } else {

            products.push(createProduct());

        }

        saveProducts();

        renderProducts();

        loadingScreen.classList.remove("show");

        showSuccess("Product saved successfully.");

        productForm.reset();

        updatePreview();

        closeDrawer();

        editingProduct = null;

    }, 700);

});

/* ==========================================
   RENDER PRODUCTS
========================================== */

function renderProducts() {

    const tbody = document.querySelector(

        ".products-table tbody"

    );

    if (!tbody) return;

    tbody.innerHTML = "";

    products.forEach(product => {

        tbody.innerHTML += `

<tr data-id="${product.id}">

<td>

<img
src="${product.image}"
class="product-thumb">

</td>

<td>${product.name}</td>

<td>${product.category}</td>

<td>—</td>

<td>€${product.price}</td>

<td>${product.stock}</td>

<td>

<span class="status active">

Active

</span>

</td>

<td>

<div class="table-buttons">

<button
class="edit-btn"
data-id="${product.id}">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="delete-btn"
data-id="${product.id}">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

    });

}

renderProducts();
/* ==========================================
   EDIT PRODUCT
========================================== */

document.addEventListener("click", function (e) {

    const editBtn = e.target.closest(".edit-btn");

    if (!editBtn) return;

    const id = editBtn.dataset.id;

    const product = products.find(p => p.id === id);

    if (!product) return;

    editingProduct = id;

    drawerTitle.textContent = "Edit Product";

    productName.value = product.name;
    productCategory.value = product.category;
    productDescription.value = product.description;
    productPrice.value = product.price;
    productStock.value = product.stock;

    previewImage.src = product.image;

    updatePreview();

    openDrawer();

});

/* ==========================================
   DELETE PRODUCT
========================================== */

document.addEventListener("click", function (e) {

    const deleteBtn = e.target.closest(".delete-btn");

    if (!deleteBtn) return;

    const id = deleteBtn.dataset.id;

    const product = products.find(p => p.id === id);

    if (!product) return;

    deleteProductName.textContent = product.name;

    deleteModal.classList.add("show");

    confirmDelete.onclick = function () {

        products = products.filter(

            p => p.id !== id

        );

        saveProducts();

        renderProducts();

        updateStatistics();

        deleteModal.classList.remove("show");

        showSuccess("Product deleted.");

    };

});

cancelDelete.addEventListener("click", function () {

    deleteModal.classList.remove("show");

});

/* ==========================================
   SUCCESS TOAST
========================================== */

function showSuccess(message) {

    successToast.querySelector("p").textContent = message;

    successToast.classList.add("show");

    setTimeout(function () {

        successToast.classList.remove("show");

    },3000);

}

/* ==========================================
   ERROR TOAST
========================================== */

function showError(message) {

    errorToast.querySelector("p").textContent = message;

    errorToast.classList.add("show");

    setTimeout(function(){

        errorToast.classList.remove("show");

    },3000);

}

/* ==========================================
   UPDATE STATISTICS
========================================== */

function updateStatistics(){

    const statCards = document.querySelectorAll(".stat-card h2");

    if(statCards.length < 4) return;

    statCards[0].textContent = products.length;

    statCards[1].textContent = products.length;

    statCards[2].textContent = 0;

    const categories = new Set(

        products.map(p => p.category)

    );

    statCards[3].textContent = categories.size;

}

updateStatistics();
/* ==========================================
   LIVE SEARCH
========================================== */

const searchInput = document.getElementById("searchProduct");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const keyword = this.value.toLowerCase();

        document.querySelectorAll(".products-table tbody tr").forEach(row => {

            row.style.display =

                row.innerText.toLowerCase().includes(keyword)

                ? ""

                : "none";

        });

    });

}

/* ==========================================
   CATEGORY FILTER
========================================== */

const categoryFilter = document.getElementById("categoryFilter");

if(categoryFilter){

    categoryFilter.addEventListener("change",filterProducts);

}

/* ==========================================
   BRAND FILTER
========================================== */

const brandFilter = document.getElementById("brandFilter");

if(brandFilter){

    brandFilter.addEventListener("change",filterProducts);

}

/* ==========================================
   STATUS FILTER
========================================== */

const statusFilter = document.getElementById("statusFilter");

if(statusFilter){

    statusFilter.addEventListener("change",filterProducts);

}

/* ==========================================
   FILTER PRODUCTS
========================================== */

function filterProducts(){

    const category = categoryFilter.value.toLowerCase();

    const brand = brandFilter.value.toLowerCase();

    const status = statusFilter.value.toLowerCase();

    document.querySelectorAll(".products-table tbody tr").forEach(row=>{

        const rowCategory = row.children[2].textContent.toLowerCase();

        const rowBrand = row.children[3].textContent.toLowerCase();

        const rowStatus = row.children[6].textContent.toLowerCase();

        const categoryMatch =
            category === "all categories" ||
            rowCategory === category;

        const brandMatch =
            brand === "all brands" ||
            rowBrand === brand;

        const statusMatch =
            status === "all status" ||
            rowStatus === status;

        row.style.display =
            categoryMatch &&
            brandMatch &&
            statusMatch
            ? ""
            : "none";

    });

}

/* ==========================================
   RESET FORM
========================================== */

function resetForm(){

    productForm.reset();

    editingProduct = null;

    drawerTitle.textContent = "Add Product";

    previewImage.src="../images/placeholder.jpg";

    imagePreview.innerHTML=`
        <div class="preview-placeholder">
            <i class="fa-regular fa-image"></i>
            <p>Image Preview</p>
        </div>
    `;

    updatePreview();

}

/* ==========================================
   ESC CLOSE DRAWER
========================================== */

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        closeDrawer();

        deleteModal.classList.remove("show");

    }

});

/* ==========================================
   CLOSE DELETE MODAL
========================================== */

deleteModal.addEventListener("click",function(e){

    if(e.target===deleteModal){

        deleteModal.classList.remove("show");

    }

});

/* ==========================================
   RESET WHEN CLOSING DRAWER
========================================== */

overlay.addEventListener("click",function(){

    resetForm();

});

if(cancelDrawerBtn){

    cancelDrawerBtn.addEventListener("click",resetForm);

}

if(closeDrawerBtn){

    closeDrawerBtn.addEventListener("click",resetForm);

}

/* ==========================================
   INITIALIZE
========================================== */

renderProducts();

updateStatistics();

updatePreview();

console.log("Saber Food Products Manager Loaded");
/* ==========================================
   SEARCH
========================================== */

function searchProducts() {

    const keyword = searchInput.value
        .toLowerCase()
        .trim();

    filteredProducts = products.filter(product => {

        return (

            product.name.toLowerCase().includes(keyword)

            ||

            product.category.toLowerCase().includes(keyword)

            ||

            product.brand.toLowerCase().includes(keyword)

            ||

            product.origin.toLowerCase().includes(keyword)

        );

    });

    renderProducts(filteredProducts);

}
searchInput.addEventListener("input", searchProducts);
loadProducts();