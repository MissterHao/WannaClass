const Enumerable = require("./js/linq")
var jsonArray = [
    { "user": { "id": 100, "screen_name": "d_linq" }, "text": "to objects" },
    { "user": { "id": 130, "screen_name": "c_bill" }, "text": "g" },
    { "user": { "id": 155, "screen_name": "b_mskk" }, "text": "kabushiki kaisha" },
    { "user": { "id": 301, "screen_name": "a_xbox" }, "text": "halo reach" }
]
// ["b_mskk:kabushiki kaisha", "c_bill:g", "d_linq:to objects"]
// var queryResult = Enumerable.from(jsonArray)
//     .where(function (x) { return x.user.id < 200 })
//     .orderBy(function (x) { return x.user.screen_name })
//     .select(function (x) { return x.user.screen_name + ':' + x.text })
//     .toArray();
// console.log(queryResult);
    
// queryResult = Enumerable.range(0, 20)
// .where("x => x % 3 == 0")
// .select("$ * 7")
// console.log(queryResult);
    
    
    
    
    
// function _queryByDept(){

// }






// if(data["type"]=="dept"){
//     courseDB.db.all("SELECT * from courses WHERE year = ? AND smtr = ? AND dept_name = ?", [data["data"]["Year"], data["data"]["Smt"], data["data"]["Dept"], ], (err, table)=>{
//         console.log(table);
//         ipcRenderer.send(CHANNEL_NAME.TELL_MAIN_QUERY_COURSES__COMPLETE, {"result": table})
//     })
// }else if(data["type"]=="courseName"){
//     console.log(data);
//     var cn = "%"+data["data"]["CourseName"]+"%"

//     courseDB.db.all("SELECT * from courses WHERE name LIKE ? AND year = ? AND smtr = ?", [cn, data["data"]["Year"], data["data"]["Smt"]], (err, table)=>{
//         console.log(table);
//         ipcRenderer.send(CHANNEL_NAME.TELL_MAIN_QUERY_COURSES__COMPLETE, {"result": table})
//     })
// }else if(data["type"]=="teacherName"){
//     var tn = "%"+data["data"]["TeacherName"]+"%"

//     courseDB.db.all("SELECT * from courses WHERE teacher_name LIKE ? AND year = ? AND smtr = ?", [tn, data["data"]["Year"], data["data"]["Smt"]], (err, table)=>{
//         console.log(table);
//         ipcRenderer.send(CHANNEL_NAME.TELL_MAIN_QUERY_COURSES__COMPLETE, {"result": table})
//     })
// }else if(data["type"]=="courseTime"){
//     var tn = "%"+data["data"]["time"]+"%"
//     courseDB.db.all("SELECT * from courses WHERE time LIKE ? AND year = ? AND smtr = ?", [tn, data["data"]["Year"], data["data"]["Smt"]], (err, table)=>{
//         console.log(table);
//         ipcRenderer.send(CHANNEL_NAME.TELL_MAIN_QUERY_COURSES__COMPLETE, {"result": table})
//     })
// }
