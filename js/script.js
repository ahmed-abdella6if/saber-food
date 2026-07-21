// ===============================
// SABER FOOD
// Main JavaScript
// ===============================

// Navbar Shadow On Scroll
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        navbar.style.background = "rgba(255,255,255,.98)";
        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,.08)";

    }

    else{

        navbar.style.background = "rgba(255,255,255,.95)";
        navbar.style.boxShadow = "0 3px 15px rgba(0,0,0,.05)";

    }

});


// =====================================
// Fade Animation On Scroll
// =====================================

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:.15
});

document.querySelectorAll(".card,.product-card,.about-text,.about-image,.stat")
.forEach(el=>{

    el.classList.add("hidden");

    observer.observe(el);

});


// =====================================
// Back To Top Button
// =====================================

const btn = document.createElement("button");

btn.innerHTML = "↑";

btn.id="topBtn";

document.body.appendChild(btn);

btn.style.position="fixed";
btn.style.right="25px";
btn.style.bottom="25px";
btn.style.width="55px";
btn.style.height="55px";
btn.style.borderRadius="50%";
btn.style.border="none";
btn.style.cursor="pointer";
btn.style.fontSize="22px";
btn.style.background="#1B5E20";
btn.style.color="#fff";
btn.style.display="none";
btn.style.zIndex="999";
btn.style.boxShadow="0 15px 25px rgba(0,0,0,.2)";

window.addEventListener("scroll",()=>{

    if(window.scrollY>500){

        btn.style.display="block";

    }

    else{

        btn.style.display="none";

    }

});

btn.onclick=()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};


// =====================================
// Product Hover Effect
// =====================================

document.querySelectorAll(".product-card").forEach(card=>{

    card.addEventListener("mousemove",(e)=>{

        const x=e.offsetX;
        const y=e.offsetY;

        card.style.transform=`rotateX(${(y-120)/25}deg) rotateY(${-(x-120)/25}deg)`;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="rotateX(0) rotateY(0)";

    });

});


// =====================================
// Current Year
// =====================================

const year=document.querySelector(".copyright");

if(year){

    year.innerHTML=`© ${new Date().getFullYear()} Saber Food. All Rights Reserved.`;

}


// =====================================
// Smooth Anchor Links
// =====================================

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});


// =====================================
// Hidden Animation Classes
// =====================================

const style=document.createElement("style");

style.innerHTML=`

.hidden{

opacity:0;

transform:translateY(60px);

transition:1s;

}

.show{

opacity:1;

transform:translateY(0);

}

`;

document.head.appendChild(style);


// =====================================
// Loading Finished
// =====================================

window.addEventListener("load",()=>{

document.body.style.opacity="1";

});

console.log("Saber Food Website Loaded Successfully.");