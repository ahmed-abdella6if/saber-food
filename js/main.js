/* =================================
   SABER FOOD - MAIN JAVASCRIPT
================================= */


/* ================================
   MOBILE NAVBAR
================================ */


const navbar = document.querySelector(".navbar");

const navLinks = document.querySelector(".nav-links");



if(navbar){


    const menuBtn = document.createElement("div");


    menuBtn.classList.add("menu-btn");


    menuBtn.innerHTML = `
        <i class="fa-solid fa-bars"></i>
    `;


    navbar.appendChild(menuBtn);



    menuBtn.addEventListener("click",()=>{


        navLinks.classList.toggle("show");


        menuBtn.classList.toggle("active");


        if(menuBtn.classList.contains("active")){


            menuBtn.innerHTML = `
            <i class="fa-solid fa-xmark"></i>
            `;


        } else {


            menuBtn.innerHTML = `
            <i class="fa-solid fa-bars"></i>
            `;


        }


    });


}




/* ================================
   CLOSE MENU AFTER CLICK
================================ */


document.querySelectorAll(".nav-links a")
.forEach(link=>{


    link.addEventListener("click",()=>{


        if(navLinks){

            navLinks.classList.remove("show");

        }


    });


});





/* ================================
   SCROLL ANIMATION
================================ */


const observer = new IntersectionObserver((entries)=>{


    entries.forEach(entry=>{


        if(entry.isIntersecting){


            entry.target.classList.add("show");


        }


    });


},{
    threshold:0.15
});





document.querySelectorAll("section, .card, .product-card, .brand-card")
.forEach(element=>{


    element.classList.add("fade-up");


    observer.observe(element);


});





/* ================================
   NAVBAR SHADOW ON SCROLL
================================ */


window.addEventListener("scroll",()=>{


    if(window.scrollY > 50){


        navbar.style.boxShadow =
        "0 5px 25px rgba(0,0,0,.12)";


    }else{


        navbar.style.boxShadow =
        "0 2px 15px rgba(0,0,0,.06)";


    }


});