const { app, BrowserWindow, ipcMain, Main } = require("electron");
const path = require("path");
const fs = require("fs")

const renderer_dirpath = path.join("./", "renderer")

var settingFilePath = "settings.json"

let MainWindow = null
let SelectCourseWorkerWindow = null
var initConfigSettingJson = {"interval":2, "stage": "1"};

function readOrcreateSettingJson() {
    try {
        const content = fs.readFileSync(settingFilePath, "utf-8")
    } catch (error) {
        fs.writeFile(settingFilePath, JSON.stringify(initConfigSettingJson), "utf-8", function (err, data) {})
    }
}


function createWindow() {
    readOrcreateSettingJson()

    
    // 建立 Browser Window
    MainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        winWidth: 1000,
        winHeight: 800,
        transparent: false,

        // Remove the frame of the window
        frame: true, // 控制有沒有外框
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // 預設為 true 必須設為 false
            // preload: path.join(renderer_dirpath, "js", "preload_main.html"),
        }
    })

    MainWindow.setMenuBarVisibility(false)
    MainWindow.loadFile(path.join(renderer_dirpath, "index.html"))
    // MainWindow.webContents.openDevTools();





    // 建立選課worker window
    SelectCourseWorkerWindow = new BrowserWindow({
        width: 0,
        height: 0,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // 預設為 true 必須設為 false
        }
    })
    SelectCourseWorkerWindow.loadFile(path.join(renderer_dirpath, "CourseSelWorker.html"))
    // SelectCourseWorkerWindow.openDevTools()




    // 在主畫面關閉時 關閉 Worker
    MainWindow.on("close", function () {
        SelectCourseWorkerWindow.close()

        // 確保刪除登入 Token 
        var settings = fs.readFileSync(settingFilePath, "utf-8")
        settings["token"] = ""
        fs.writeFile(settingFilePath, JSON.stringify(settings), "utf-8", function (err, data) {})

    })




}




// 有些 API 只能在這個事件發生後才能用。
app.whenReady().then(createWindow)

// 處理離開時的狀態
app.on('window-all-closed', () => {
    // 在 macOS 中，一般會讓應用程式及選單列繼續留著，
    // 除非使用者按了 Cmd + Q 確定終止它們
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在 macOS 中，一般會在使用者按了 Dock 圖示
    // 且沒有其他視窗開啟的情況下，
    // 重新在應用程式裡建立視窗。
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})











// IPC 
ipcMain.on("addTaskCourse", (event, data)=>{
    SelectCourseWorkerWindow.webContents.send("addTaskCourse", data);
})
// IPC 重讀設定檔
ipcMain.on("regetSettings", (event, data)=>{
    SelectCourseWorkerWindow.webContents.send("regetSettings", data);
})