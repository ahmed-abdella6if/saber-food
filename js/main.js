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
/* ==================================================
SMOOTH SCROLL
================================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

const target=document.querySelector(this.getAttribute("href"));

if(target){

e.preventDefault();

target.scrollIntoView({

behavior:"smooth",

block:"start"

});

}

});

});


/* ==================================================
ACTIVE NAVBAR LINK ON SCROLL
================================================== */

const sections=document.querySelectorAll("section[id]");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const top=section.offsetTop-120;

const height=section.offsetHeight;

if(scrollY>=top){

current=section.getAttribute("id");

}

});

document.querySelectorAll(".nav-links a").forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href")==="#"+current){

link.classList.add("active");

}

});

});


/* ==================================================
COUNTER ANIMATION
================================================== */

const counters=document.querySelectorAll(".stat h2");

const counterObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(!entry.isIntersecting) return;

const counter=entry.target;

const text=counter.innerText;

const value=parseInt(text.replace(/\D/g,""));

if(isNaN(value)) return;

let start=0;

const step=Math.max(1,Math.ceil(value/80));

const suffix=text.replace(/[0-9]/g,"");

const timer=setInterval(()=>{

start+=step;

if(start>=value){

start=value;

clearInterval(timer);

}

counter.innerText=start+suffix;

},20);

counterObserver.unobserve(counter);

});

});

counters.forEach(counter=>counterObserver.observe(counter));


/* ==================================================
BACK TO TOP BUTTON
================================================== */

const topBtn=document.createElement("button");

topBtn.className="back-to-top";

topBtn.innerHTML='<i class="fa-solid fa-arrow-up"></i>';

document.body.appendChild(topBtn);

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

topBtn.classList.add("show");

}else{

topBtn.classList.remove("show");

}

});

topBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});


/* ==================================================
END
================================================== */