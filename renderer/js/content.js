{
    var start = new Date().getFullYear() - 1911;

    ["#querySelectQueryYear",
    "#querySelectQueryYear_forCourseName",
    "#querySelectQueryYear_forTeacherName",
    "#querySelectQueryYear_forQueryTime"].forEach((n)=>{

        for(var i in [...Array(5).keys()]){
            
            var option = document.createElement("option")
            option.value = start-1 + parseInt(i);
            option.textContent = `${start-1 + parseInt(i)}`;
            
            document.querySelector(n).appendChild(option)
            
        }
        
    })
}
// document.querySelector("#querySelectQueryYear").appendChild(option)
// document.querySelector("#querySelectQueryYear_forCourseName").appendChild(option)
// document.querySelector("#querySelectQueryYear_forTeacherName").appendChild(option)
// document.querySelector("#querySelectQueryYear_forQueryTime").appendChild(option)