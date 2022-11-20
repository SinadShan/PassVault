const {
    app,
    BrowserWindow,
    ipcMain,
    clipboard,
    dialog
    } = require('electron')
const Database = require('better-sqlite3')
const bcrypt = require('bcrypt');
const path = require('path')        
const crypto = require('crypto')
const ejse = require('ejs-electron')
const passwordStrength = require('./pwdstrength.js');
const { exec } = require('child_process');
const { electron } = require('process');

require('electron-reload')(__dirname+'/../', {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/../node_modules/electron`)
});

if(process.platform == 'win32'){
    var db = new Database('pwmanager.db')
}
else if(process.platform == 'linux'){
    const user = process.env.USER
    var db = new Database(`/home/${user}/pwmanager.db`)
}else{
    const user = process.env.USER
    var db = new Database(`/Users/${user}/pwmanager.db`)
}
const saltRounds = 10;

const createUsersTableQuery = db.prepare('create table if not exists users (id integer primary key not null, username text unique not null, password text not null)')
createUsersTableQuery.run()

// will need a constraint for single website per user
const createPasswordsTableQuery = db.prepare('create table if not exists secrets (user foriegn key references users(id), website text, password text, iv text )')
createPasswordsTableQuery.run()

let win
let currentUser
let globalPassword

function createWindow(){
    splash = new BrowserWindow({
        height:300,
        width: 400,
        transparent: true,
        backgroundColor: 'antiquewhite', // temporary
        show: false,
        frame: false,
        alwaysOnTop: true
    })

    splash.loadURL(`file://${__dirname}/windows/splash.html`);
    splash.once('ready-to-show',() => {
        splash.show()
    })

    
    win = new BrowserWindow({
        minHeight:700,
        minWidth: 900,
        backgroundColor: '#404eed',
        webPreferences:{
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname,"preload.js")
        },
        show:false,
        autoHideMenuBar: true,
        // titleBarStyle:'hidden'
    })
    win.loadFile(__dirname+'/windows/index.html')
    win.once('ready-to-show',() =>{
        setTimeout(()=>{
            splash.destroy()
            win.show()   
        },2500)
    })

    win.on('closed', ()=>{
        win = null
        db.close()
    })

}


app.on('ready', createWindow)

async function retrievePasswords(){
    // deciphering password
    // include error handling!
    let passwordCount = 0;
    let averagePasswordStrength = 0

    const details = db.prepare('select s.website,s.password,s.iv from secrets s where s.user = (select id from users where username = ?);').all(currentUser) 
    let key = crypto.createHash('sha256').update(globalPassword).digest('hex').slice(0,32)
    details.forEach(item => {
        decipher = crypto.createDecipheriv('aes-256-cbc',key,item.iv)
        decryptedPassword = decipher.update(item.password,'hex','utf-8')
        decryptedPassword += decipher.final('utf-8')
        item.password = decryptedPassword
        item.score = passwordStrength(item.password).score
        averagePasswordStrength += item.score
        passwordCount++
    });

    averagePasswordStrength /= passwordCount
    // averagePasswordStrength = Math.floor(averagePasswordStrength)
    averagePasswordStrength = averagePasswordStrength>2.5?'Strong':
    averagePasswordStrength>1.5?'Medium':
    averagePasswordStrength>.5?'Weak':'Too Weak';

    // ejs rendering and loading home
    ejse.data('details',details)
    ejse.data('username',currentUser)
    ejse.data('globalPassword',globalPassword)
    ejse.data('passwordCount',passwordCount)
    ejse.data('averagePasswordStrength',averagePasswordStrength)
    await win.loadURL('file://'+__dirname+'/windows/home.ejs')
}

ipcMain.on('login', (event, username, password) => {
    const loginDetails = db.prepare('select username,password from users where username=?').get(username)

    let options = {
        type: "error",
        title: "Login failed",
        message: "Invalid login credentials",
        buttons: ['ok']
    }

    async function login(loginPassword,dbPassword){
        if(await bcrypt.compare(loginPassword,dbPassword)){
            // console.log('login success')
            currentUser = username
            globalPassword = password

            await retrievePasswords()
        }
        else{
            dialog.showMessageBox(win,options).then()
            // console.log("Login Failed")
            event.reply('login-fail')
        }          
    }

    if(typeof loginDetails != 'undefined'){
            login(password,loginDetails.password)
    }else{
        dialog.showMessageBox(win,options).then()
        // console.log("Login failed")
        event.reply('login-fail')
    }

  })

ipcMain.on('signup', (event,username,password) => {
    bcrypt.hash(password, saltRounds, function(err, hash) { // err on hashing password
        try{        
            db.prepare('insert into users (username,password) values (?,?);').run(username,hash)

            currentUser = username
            globalPassword = password
            retrievePasswords().then()
        }catch(error){
            console.log(error)
            let options = {
                type: "error",
                title: "Signup Failed",
                message: "Username already taken",
                buttons: ['ok']
            }
            dialog.showMessageBox(win,options).then()
            event.reply('error-signup',error)
        }
    })
})

ipcMain.on('passwordsView',async (event) => {
    await retrievePasswords();
})

ipcMain.on('copy', (event,password)=>{  
    clipboard.writeText(password) 
    let options = {
        type: "info",
        title: "Success",
        message: "Password copied to clipboard",
        buttons: ['ok']
    }
    // dialog.showMessageBox(win,options).then()
    event.reply('copied')
})

// add password to db
ipcMain.on('addPassword', function (event,website,password){
    // encrypt password
    // initialising vector
    let iv = crypto.randomBytes(16)

    // key for cipher
    let key = crypto.createHash('sha256').update(globalPassword).digest('hex').slice(0,32)
    let cipher = crypto.createCipheriv('aes-256-cbc',key,iv)
    let encryptedPassword = cipher.update(password,'utf-8','hex')
    encryptedPassword += cipher.final('hex')

    // add password to db
    try{
        db.prepare(`insert into secrets (user,website,password,iv) values ((select id from users where username = ?),?,?,?);`).run(currentUser,website,encryptedPassword,iv)
        retrievePasswords().then(() => event.reply('successfullyAddedPassword'))
    }catch(err){
        // couldn't add new password
        event.reply('failedToAddPassword')
        console.log(err)
    }

})

ipcMain.on('deletePassword', (event,website) => {
    let options= {
        type: "warning",
        title: "Warning",
        message: "Deleting password. Do you want to continue?",
        buttons: ['Yes','Cancel']
    }
    dialog.showMessageBox(win,options).then(result => {
        if(result.response == 0){
            const s = db.prepare('delete from secrets where user = (select id from users where username=?) and website=?').run(currentUser,website)
            retrievePasswords().then(() => event.reply('deletedPassword'))
            
        }
    })
})

ipcMain.on('displayDialog',(event,message)=>{
    let options= {
        type: "error",
        title: "Error",
        message: message,
        buttons: ['ok']
    }
    dialog.showMessageBox(win,options).then()
})

ipcMain.on('checkPlatform',(event) => {
    event.reply('platform',process.platform)
})


ipcMain.on('openLink',(event,link) => {
    if (process.platform == 'linux')
        exec(`xdg-open ${link}`,(err,stdout,stderr) => {})
        else if(process.platform == 'win32')
            exec(`start ${link}`,(err,stdout,stderr) => {})
        else
            exec(`open ${link}`,(err,stdout,stderr) => {})
        event.reply('openedReleasesPage')
})

ipcMain.on('openUpdatePasswordWindow',(event,website) => {
    // open update password window
    updatePass = new BrowserWindow({
        width: 600,
        height: 250,
        resizable: false,
        parent: win,
        modal: true,
        frame: true,
        center: false,
        backgroundColor: '#36393f',
        webPreferences:{
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname,"preload.js")
        },
        autoHideMenuBar: true,  
        titleBarStyle:'hidden'
    })
    ejse.data('website',website)
    updatePass.loadFile(__dirname+'/windows/updatePassword.ejs')
    updatePass.on('ready-to-show',() => {
        win.blur()
        updatePass.show()
    })

    // updatePass.on('blur',() => updatePass.hide())

})

ipcMain.on('toggleInfo',(event) => {
    // open info window
    infoWindow = new BrowserWindow({
        width: 500,
        height: 500,
        resizable: false,
        parent: win,
        modal: true,
        frame: true,
        center: false,
        backgroundColor: '#ffffff',
        show: false,
        webPreferences:{
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname,"preload.js")
        },
        autoHideMenuBar: true,
        titleBarStyle:'hidden'
    })

    infoWindow.loadFile(__dirname+'/windows/info.html')
    infoWindow.on('ready-to-show',() => {
        infoWindow.show()
    })

    infoWindow.on('blur',() => infoWindow.hide())
})

ipcMain.on('updatePassword',(event,website,password) => {

    // initialising vector
    let iv = crypto.randomBytes(16)

    // key for cipher
    let key = crypto.createHash('sha256').update(globalPassword).digest('hex').slice(0,32)
    let cipher = crypto.createCipheriv('aes-256-cbc',key,iv)
    let encryptedPassword = cipher.update(password,'utf-8','hex')
    encryptedPassword += cipher.final('hex')

    const updatePasswordQuery = db.prepare('update secrets set password = ?,iv = ? where user = (select id from users where username = ?) and website = ? ')
    updatePasswordQuery.run([encryptedPassword,iv,currentUser,website])
    
    // call retrieve passwords
    retrievePasswords().then()

    // close window
    updatePass.destroy()

})

ipcMain.on('closeUpdateWindow',(event)=> {
    updatePass.destroy()
})
