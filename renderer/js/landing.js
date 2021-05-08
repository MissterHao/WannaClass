document.addEventListener("DOMContentLoaded", (event)=>{
    

    // Landing page cta button 
    const cta = document.querySelector(".login-panel .cta")

    // Hero text and image
    const heroHeader = document.querySelector(".login-panel .hero-text h2")
    const heroContent = document.querySelector(".login-panel .hero-text")

    // 
    const heroImage = document.querySelector(".login-panel .hero-image img")
    const heroImageData = [
        {
            src: "../assets/undraw_programming_2svr.svg",
            header: "半夜還在電腦前守著?"
        },
        {
            src: "../assets/undraw_education_f8ru.svg",
            header: "給自己的學分一點機會"
        },
        {
            src: "../assets/undraw_schedule_pnbk.svg",
            header: "還在上網查下學期課表?"
        },
        
    ]
    var heroImageIndex = 0;
    setInterval(() => {
        heroImageIndex = (heroImageIndex + 1) % 3;
        heroImage.setAttribute("src", heroImageData[heroImageIndex].src)
        heroHeader.textContent = heroImageData[heroImageIndex].header
    }, 4000)



    // Login panel


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
})