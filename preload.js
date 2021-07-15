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
    //     document.getElementById('notification').innerHTML = `
    //     <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    //         <div class="toast-header">
    //             <img src="..." class="rounded mr-2" alt="...">
    //             <strong class="mr-auto">Bootstrap</strong>
    //             <small>11 mins ago</small>
    //             <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
    //                 <span aria-hidden="true">&times;</span>
    //             </button>
    //         </div>
    //     <div class="toast-body">
    //         Hello, world! This is a toast message.
    //     </div>
    // </div>`
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