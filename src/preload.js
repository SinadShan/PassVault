const { compareSync } = require('bcrypt')
const {ipcRenderer,contextBridge} = require('electron')

contextBridge.exposeInMainWorld(
    'passVaultAPI',
    {
        login: (username,password) => {
            ipcRenderer.send('login',username,password)
        },
        signup: (username,password) => {
            ipcRenderer.send('signup',username,password)
        },
        copyToClipboard: (password) => {
            ipcRenderer.send('copy',password)
        },
        addPassword: (website,password) => {
            ipcRenderer.send('addPassword',website,password)
        },
        deletePassword: (website) => {
            ipcRenderer.send('deletePassword', website)
        },
        displayDialog: (message) => {
            ipcRenderer.send('displayDialog',message)
        },
        checkPlatform: () => {
            ipcRenderer.send('checkPlatform')
        }
    }
)

ipcRenderer.on('copied', (event)=>{
    console.log(event)
})

ipcRenderer.on('login-fail',(event) => {
    console.log(event)
})

ipcRenderer.on('error-signup',(event,err) => {
    console.log(err)
})

ipcRenderer.on('platform',(event,platform) => {
    if(platform=='linux'){
        document.getElementsByClassName('info')[0].removeAttribute('hidden')
    }
})