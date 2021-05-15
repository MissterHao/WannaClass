const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs")

const renderer_dirpath = path.join("./", "renderer")


let MainWindow = null
let SelectCourseWorkerWindow = null
var initConfigSettingJson = {"interval":"2"};

function readOrcreateSettingJson() {
    try {
        const content = fs.readFileSync("config/settings.json", "utf-8")
    } catch (error) {
        
        fs.writeFile("config/settings.json", JSON.stringify(initConfigSettingJson), "utf-8", function (err, data) 
        { 
            
        })

    }

}


function createWindow() {
    readOrcreateSettingJson()

    
    // 建立 Browser Window
    MainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        transparent: false,

        // Remove the frame of the window
        frame: true, // 控制有沒有外框
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    MainWindow.loadFile(path.join(renderer_dirpath, "index.html"))
    MainWindow.webContents.openDevTools();





    // 建立選課worker window
    SelectCourseWorkerWindow = new BrowserWindow({
        width: 0,
        height: 0,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    SelectCourseWorkerWindow.loadFile(path.join(renderer_dirpath, "CourseSelWorker.html"))
    SelectCourseWorkerWindow.openDevTools()




    // 在主畫面關閉時 關閉 Worker
    MainWindow.on("close", function () {
        SelectCourseWorkerWindow.close()
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

