import BackendService  from "/renderer/js/yzu_backend.js";

const cta = document.querySelector(".login-panel .cta")

cta.onclick = function(){
    document.querySelector(".login-panel .hero-image").classList.toggle("move-to-hidden");
    document.querySelector(".login-panel .hero-text").classList.toggle("move-to-hidden");
    document.querySelector(".login-panel .login-block").classList.toggle("move-to-hidden");

    if(cta.querySelector("i").classList.contains("fa-arrow-right")){
        cta.querySelector("span").textContent = "返回首頁"
    }else {
        cta.querySelector("span").textContent = "開始使用"
    }
    cta.querySelector("i").classList.toggle("fa-arrow-right")
    cta.querySelector("i").classList.toggle("fa-arrow-left")
}


var backend = new BackendService()


const login_btn = document.querySelector("#login-btn");
const sid_input = document.querySelector("#student_id");
const spwd_input = document.querySelector("#student_pwd");

login_btn.onclick = function(){
    if(backend.loginService(sid_input.value, spwd_input.value)){
        // 登入成功
        console.log("成功");
    }else{
        // 登入失敗
    }
}