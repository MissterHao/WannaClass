document.addEventListener("DOMContentLoaded", (event)=>{
    

    // Landing page cta button 
    const cta = document.querySelector(".login-panel .cta")

    // Hero text and image
    const heroHeader = document.querySelector(".login-panel .hero-text h2")
    const heroDesc = document.querySelector(".login-panel .hero-text .hero-desc")
    const heroContent = document.querySelector(".login-panel .hero-text")

    // 
    const heroImage = document.querySelector(".login-panel .hero-image img")
    const heroImageData = [
        {
            src: "../assets/undraw_programming_2svr.svg",
            header: "半夜依舊在電腦前守著?",
            content: "黑眼圈熬出來也不一定搶得到課R！"
        },
        {
            src: "../assets/undraw_education_f8ru.svg",
            header: "給自己的學分一點機會",
            content: ""
        },
        {
            src: "../assets/undraw_schedule_pnbk.svg",
            header: "還不知道下學期課表?",
            content: "查課表不想再輸入驗證碼?"
        },
        
    ]
    var heroImageIndex = 0;
    setInterval(() => {
        heroImageIndex = (heroImageIndex + 1) % 3;
        heroImage.setAttribute("src", heroImageData[heroImageIndex].src)
        heroHeader.textContent = heroImageData[heroImageIndex].header
        heroDesc.textContent = heroImageData[heroImageIndex].content
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