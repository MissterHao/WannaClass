var currentSectionId = "";

function hideAllSection(){
    document.querySelectorAll(".inner-section").forEach((element)=>{
        element.classList.remove("is-shown");
    })
}

function showSectionById(section) {
    hideAllSection()
    const sectionID = `section-${section}`

    document.getElementById(sectionID).classList.add('is-shown');
    currentSectionId = section;
}
