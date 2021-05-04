import BackendService from "/renderer/js/yzu_backend.js";
var backend = new BackendService()

// Landing page cta button 
const cta = document.querySelector(".login-panel .cta")

// Hero text and image
const heroHeader = document.querySelector(".login-panel .hero-text")
const heroContent = document.querySelector(".login-panel .hero-text")
// const heroImage = document.querySelectorAll(".login-panel .hero-image img")


// var heroImageIndex = 0;
// setInterval(() => {
    // heroImage[heroImageIndex].classList.toggle("hidden-onshown")
    // heroImage[heroImageIndex].classList.toggle("hidden-disapear")
    // heroImage[heroImageIndex].classList.add("hidden")
    // setTimeout(() => {
    //     heroImageIndex = (heroImageIndex + 1) % 3;
    //     heroImage[heroImageIndex].classList.toggle("hidden")
    //     heroImage[heroImageIndex].classList.toggle("hidden-onshown")
    // }, 0);
// }, 5000)

// 
const heroImage = document.querySelector(".login-panel .hero-image img")
const heroImageSrc = [
    "/assets/undraw_programming_2svr.svg",
    "/assets/undraw_education_f8ru.svg",
    "/assets/undraw_schedule_pnbk.svg",
]
var heroImageIndex = 0;
setInterval(() => {
    heroImage.classList.toggle("hidden")
    heroImageIndex = (heroImageIndex + 1) % 3;
    heroImage.setAttribute("src", heroImageSrc[heroImageIndex])
    heroImage.classList.toggle("hidden")
}, 3000)



// Login panel
const login_btn = document.querySelector("#login-btn");
const sid_input = document.querySelector("#student_id");
const spwd_input = document.querySelector("#student_pwd");


cta.onclick = function () {
    document.querySelector(".login-panel .hero-image").classList.toggle("move-to-hidden");
    document.querySelector(".login-panel .hero-text").classList.toggle("move-to-hidden");
    document.querySelector(".login-panel .login-block").classList.toggle("move-to-hidden");

    if (cta.querySelector("i").classList.contains("fa-arrow-right")) {
        cta.querySelector("span").textContent = "返回首頁"
    } else {
        cta.querySelector("span").textContent = "開始使用"
    }
    cta.querySelector("i").classList.toggle("fa-arrow-right")
    cta.querySelector("i").classList.toggle("fa-arrow-left")
}


// Login
login_btn.onclick = function () {
    if (backend.loginService(sid_input.value, spwd_input.value)) {
        // 登入成功
        console.log("成功");
    } else {
        // 登入失敗
    }
}