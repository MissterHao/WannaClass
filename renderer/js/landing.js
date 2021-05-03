const cta = document.querySelector(".login-panel .cta")

cta.onclick = function(){
    document.querySelector(".login-panel .hero-image").classList.toggle("move-to-hidden")
    document.querySelector(".login-panel .hero-text").classList.toggle("move-to-hidden")
}