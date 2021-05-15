const {
    contextBridge,
    ipcRenderer
} = require("electron");



contextBridge.exposeInMainWorld(
    "tasks", {


        addTaskList: (channel, data) => {

            console.log(channel, data);

            // whitelist channels
            let validChannels = ["addTaskList:toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },


        // send: (channel, data) => {
        //     // whitelist channels
        //     let validChannels = ["toMain"];
        //     if (validChannels.includes(channel)) {
        //         ipcRenderer.send(channel, data);
        //     }
        // },
        // receive: (channel, func) => {
        //     let validChannels = ["fromMain"];
        //     if (validChannels.includes(channel)) {
        //         // Deliberately strip event as it includes `sender` 
        //         ipcRenderer.on(channel, (event, ...args) => func(...args));
        //     }
        // }
    }
);