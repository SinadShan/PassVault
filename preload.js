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
            console.log('here')
            ipcRenderer.send('deletePassword', website)
        }
    }
)

ipcRenderer.on('copied', (event)=>{
    alert("Password Copied")
})

ipcRenderer.on('login-fail',(event) => {
    console.log(event)
    alert("Wrong login credentials")
})

ipcRenderer.on('error-signup',(event,err) => {
    console.log(err)
    alert('Username already taken')
})