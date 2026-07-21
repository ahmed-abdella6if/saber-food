/* =================================
   SABER FOOD - PRODUCTS FILTER
================================= */


const filterButtons = document.querySelectorAll(".filter-btn");

const products = document.querySelectorAll(".product-card");



filterButtons.forEach(button => {


    button.addEventListener("click", () => {


        // Remove active class

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });



        // Add active class

        button.classList.add("active");



        const filter = button.dataset.filter;



        products.forEach(product => {


            const category = product.dataset.category;



            if(filter === "all" || category === filter){


                product.classList.remove("hide");


            }

            else {


                product.classList.add("hide");


            }



        });



    });


});