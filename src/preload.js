
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
        passwordsView: () =>{
            ipcRenderer.send('passwordsView')
        },
        accountView: () => {
            ipcRenderer.send('accountView')
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
        },
        openReleasesPage: () => {
            ipcRenderer.send('openReleasesPage')
        },
        openUpdatePasswordWindow: (website) => {
            ipcRenderer.send('openUpdatePasswordWindow',website)
        },
        updatePassword: (website,password) => {
            ipcRenderer.send('updatePassword',website,password)
        },
        closeUpdateWindow: () => {
            ipcRenderer.send('closeUpdateWindow')
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

ipcRenderer.on('successfullyAddedPassword',(event) => {
    const title = 'Success'
    const body = 'Password added successfully.'
    new Notification(title, {body: body})
})

ipcRenderer.on('deletedPassword',(event) => {
    const title = 'Success'
    const body = 'Password deleted successfully.'
    new Notification(title, {body: body})
})

ipcRenderer.on('strengthCalculated',(event,elementID,strength) => {
    // console.log(strength.value)
    assignStrengthIcon(elementID,strength)
})

    