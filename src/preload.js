
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
        },
        passwordStrength: (elementID,password) => {
            ipcRenderer.send('passwordStrength',elementID,password)
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

function assignStrengthIcon(elementID,strength){
    // console.log(elementID,' : ',strength)
    
    if(strength === 'Too weak'){
        document.getElementsByClassName(elementID)[1].classList.add('bi-circle-fill')
        document.getElementsByClassName(elementID)[2].classList.add('bi-circle')
        document.getElementsByClassName(elementID)[3].classList.add('bi-circle')
        document.getElementsByClassName(elementID)[4].classList.add('bi-circle')
        document.getElementsByClassName(elementID)[5].textContent='Too Weak'
    }

    if(strength === 'Weak'){
        document.getElementsByClassName(elementID)[1].classList.add('bi-circle-fill')
        document.getElementsByClassName(elementID)[2].classList.add('bi-circle-fill')
        document.getElementsByClassName(elementID)[3].classList.add('bi-circle')
        document.getElementsByClassName(elementID)[4].classList.add('bi-circle')
        document.getElementsByClassName(elementID)[5].textContent='Weak'   
    }

    if(strength === 'Medium'){
        document.getElementsByClassName(elementID)[1].classList.add('bi-circle-fill')
        document.getElementsByClassName(elementID)[2].classList.add('bi-circle-fill')
        document.getElementsByClassName(elementID)[3].classList.add('bi-circle-fill')
        document.getElementsByClassName(elementID)[4].classList.add('bi-circle')
        document.getElementsByClassName(elementID)[5].textContent='Medium'
    }

    if(strength === 'Strong'){
        document.getElementsByClassName(elementID)[1].classList.add('bi-circle-fill')
        document.getElementsByClassName(elementID)[2].classList.add('bi-circle-fill')
        document.getElementsByClassName(elementID)[3].classList.add('bi-circle-fill')
        document.getElementsByClassName(elementID)[4].classList.add('bi-circle-fill')
        document.getElementsByClassName(elementID)[5].textContent='Strong'
    }

}