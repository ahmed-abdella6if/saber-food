/* ==========================================
   SABER FOOD ADMIN PRODUCTS
========================================== */
let currentImage = "";
let editingProductId = null;
let products = [];
let filteredProducts = [];

const tableBody = document.getElementById("productsTableBody");

const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll(".filter-btn");



/* ==========================================
   CATEGORY FILTER
========================================== */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const category = button.dataset.filter;

        if (category === "all") {

            filteredProducts = [...products];

        } else {

            filteredProducts = products.filter(product =>

                (product.category || "")
                    .toLowerCase() === category.toLowerCase()

            );

        }

        renderProducts(filteredProducts);

    });

}); 
/* ==========================================
   LOAD PRODUCTS
========================================== */

async function loadProducts() {

    const { data, error } = await db
        .from("products")
        .select("*")
        .order("id", { ascending: true });

    if (error) {

        console.error("Supabase Error:", error);

        return;

    }

    products = data || [];

    filteredProducts = [...products];

    renderProducts(filteredProducts);

    updateStatistics();

}

/* ==========================================
   RENDER TABLE
========================================== */

function renderProducts(list) {

    tableBody.innerHTML = "";

    if (list.length === 0) {

        tableBody.innerHTML = `

        <tr>

            <td colspan="8" style="text-align:center;padding:40px;">

                No Products Found

            </td>

        </tr>

        `;

        return;

    }

    list.forEach(product => {

        tableBody.innerHTML += `

        <tr>

            <td>

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    width="65"
                    style="border-radius:10px">

            </td>

            <td>

                ${product.name}

            </td>

            <td>

                ${product.category}

            </td>

            <td>

                ${product.origin}

            </td>

            <td>

                ${product.brand}

            </td>

            <td>

                <span class="status">

                    ${product.availability}

                </span>

            </td>

            <td>

                ${product.featured ? "⭐" : "-"}

            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editProduct(${product.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteProduct(${product.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

async function editProduct(id) {

    const { data, error } = await db
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

        console.error(error);

        return;

    }

    editingProductId = id;

    currentImage = data.image;

    document.getElementById("productName").value =
        data.name || "";

    document.getElementById("productBrand").value =
        data.brand || "";

    document.getElementById("productCategory").value =
        data.category || "";

    document.getElementById("productOrigin").value =
        data.origin || "";

    document.getElementById("productDescription").value =
        data.description || "";

    document.getElementById("productAvailability").value =
        data.availability || "Available";

    document.getElementById("productFeatured").checked =
        data.featured || false;

        document.querySelector(".drawer-header h2").textContent = "Edit Product";

document.getElementById("saveProduct").innerHTML = `
<i class="fa-solid fa-floppy-disk"></i>
Update Product
`;

    openDrawer();

}

async function deleteProduct(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    // Get product first
    const { data, error } = await db
        .from("products")
        .select("image")
        .eq("id", id)
        .single();

    if (error) {

        console.error(error);

        return;

    }

    // Delete image from Storage
    if (data.image) {

        const fileName = data.image.split("/").pop();

        const { error: storageError } =
            await db.storage
                .from("products")
                .remove([fileName]);

        if (storageError) {

            console.error(storageError);

        }

    }

    // Delete product row
    const { error: deleteError } =
        await db
            .from("products")
            .delete()
            .eq("id", id);

    if (deleteError) {

        console.error(deleteError);

        alert("Failed to delete product.");

        return;

    }

    alert("Product Deleted Successfully!");

    loadProducts();

}
/* ==========================================
   STATISTICS
========================================== */

function updateStatistics() {

    const totalProducts =
        products.length;

    const activeProducts =
        products.filter(p => p.availability === "Available").length;

    const hiddenProducts =
        products.filter(p => p.availability !== "Available").length;

    const categories =
        new Set(products.map(p => p.category)).size;

    document.getElementById("totalProducts").textContent =
        totalProducts;

    document.getElementById("activeProducts").textContent =
        activeProducts;

    document.getElementById("hiddenProducts").textContent =
        hiddenProducts;

    document.getElementById("totalCategories").textContent =
        categories;

}
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

            (product.category || "").toLowerCase().includes(keyword)

            ||

            (product.brand || "").toLowerCase().includes(keyword)

            ||

            (product.origin || "").toLowerCase().includes(keyword)

        );

    });

    renderProducts(filteredProducts);

}
/* ==========================================
   DRAWER
========================================== */

const drawer = document.getElementById("productDrawer");

const drawerOverlay = document.getElementById("drawerOverlay");

const openDrawerBtn = document.getElementById("openDrawer");

const closeDrawerBtn = document.getElementById("closeDrawer");

const cancelDrawerBtn = document.getElementById("cancelDrawer");

function newProduct() {

    editingProductId = null;

    document.getElementById("productForm").reset();

    document.querySelector(".drawer-header h2").textContent = "Add Product";

    document.getElementById("saveProduct").innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Save Product
    `;

    openDrawer();

}

function openDrawer() {

    drawer.classList.add("open");

    drawerOverlay.classList.add("show");

}

function closeDrawer() {

    drawer.classList.remove("open");

    drawerOverlay.classList.remove("show");

}
/* ==========================================
   UPLOAD IMAGE
========================================== */

async function uploadImage(file) {

    if (!file) return null;

    const fileName =
        Date.now() + "-" + file.name.replace(/\s+/g, "-");

    const { error } = await db.storage
        .from("products")
        .upload(fileName, file);

    if (error) {

        console.error(error);

        alert("Image upload failed.");

        return null;

    }

    const { data } = db.storage
        .from("products")
        .getPublicUrl(fileName);

    return data.publicUrl;

}
/* ==========================================
   SAVE PRODUCT
========================================== */

async function saveProduct() {

    const imageFile =
    document.getElementById("productImage").files[0];

let imageUrl = currentImage;

if (imageFile) {

    imageUrl = await uploadImage(imageFile);

}

    const product = {

        name:
            document.getElementById("productName").value,

        brand:
            document.getElementById("productBrand").value,

        category:
            document.getElementById("productCategory").value,

        origin:
            document.getElementById("productOrigin").value,

        description:
            document.getElementById("productDescription").value,

        availability:
            document.getElementById("productAvailability").value,

        featured:
            document.getElementById("productFeatured").checked,

        active: true,

        image: imageUrl

    };

let data;
let error;

if (editingProductId) {

    ({ data, error } = await db
        .from("products")
        .update(product)
        .eq("id", editingProductId)
        .select());

} else {

    ({ data, error } = await db
        .from("products")
        .insert(product)
        .select());

}



    if (error) {

        console.error(error);

        alert("Failed to save product.");

        return;

    }

if (editingProductId) {

    alert("Product Updated Successfully!");

} else {

    alert("Product Added Successfully!");

}
    closeDrawer();
    editingProductId = null;

document.getElementById("productForm").reset();

    loadProducts();

}

openDrawerBtn.addEventListener("click", newProduct);
closeDrawerBtn.addEventListener("click", closeDrawer);

cancelDrawerBtn.addEventListener("click", closeDrawer);

drawerOverlay.addEventListener("click", closeDrawer);
/* ==========================================
   INITIALIZE
========================================== */

searchInput.addEventListener("input", searchProducts);

document
    .getElementById("productForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        await saveProduct();

    });

loadProducts();