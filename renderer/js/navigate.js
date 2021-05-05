var currentSectionId = "";

function hideAllSection(){
    document.querySelectorAll(".inner-section").forEach((element)=>{
        element.classList.remove("is-shown");
    })
}

function showSectionById(section) {
    hideAllSection()
    const sectionID = `section-${section}`
    console.log(sectionID);

    // if(section=="School-timetable-Query"){
    //     ipcRenderer.send(CHANNEL_NAME.TELL_MAIN_GET_DEPTS, {});
    // }

    document.getElementById(sectionID).classList.add('is-shown');

    currentSectionId = section;
}
