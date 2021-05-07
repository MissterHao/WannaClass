{
    var start = new Date().getFullYear() - 1911;
    for(var i in [...Array(5).keys()]){
        
        var option = document.createElement("option")
        option.value = start-1 + parseInt(i);
        option.textContent = `${start-1 + parseInt(i)}`;
        
        document.querySelector("#querySelectQueryYear").appendChild(option)

    }
}