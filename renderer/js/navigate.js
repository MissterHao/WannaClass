var currentSectionId = "";

function hideAllSection(){
    document.querySelectorAll(".inner-section").forEach((element)=>{
        element.classList.remove("is-shown");
    })

    document.querySelectorAll(".sidebar-item").forEach((element)=>{
        element.classList.remove("active")
    })
}

function showSectionById(section) {
    hideAllSection()
    const sectionID = `section-${section}`

    document.querySelector(`#${section}-sidebar-item`).classList.add("active")
    document.getElementById(sectionID).classList.add('is-shown');
    currentSectionId = section;
}
