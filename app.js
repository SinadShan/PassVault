const {
    app,
    BrowserWindow,
    ipcMain,
    clipboard,
    } = require('electron')
const Database = require('better-sqlite3')
const bcrypt = require('bcrypt');
const path = require('path')        
const crypto = require('crypto')
const ejse = require('ejs-electron')
 

const db = new Database('pwmanager.db',{verbose: console.log })
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
    win = new BrowserWindow({
        minHeight:600,
        minWidth: 800,
        webPreferences:{
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname,"preload.js")
        },
        autoHideMenuBar: true,
        titleBarStyle:'hidden'
    })
    win.loadFile(__dirname+'/index.html')

    win.on('closed', ()=>{
        win = null
    })
}

function retrievePasswords(){
    // deciphering password
    // let decryptedPasswords = []
    // include error handling!
    details = db.prepare('select s.website,s.password,s.iv from secrets s where s.user = (select id from users where username = ?);').all(currentUser) 
    key = crypto.createHash('sha256').update(globalPassword).digest('hex').slice(0,32)
    details.forEach(item => {
        decipher = crypto.createDecipheriv('aes-256-cbc',key,item.iv)
        decryptedPassword = decipher.update(item.password,'hex','utf-8')
        decryptedPassword += decipher.final('utf-8')
        item.password = decryptedPassword
        // decryptedPasswords.append(decryptedPassword)
        console.log(decryptedPassword)
    });

    // ejs rendering and loading home
    ejse.data('details',details)
    win.loadURL('file://'+__dirname+'/home.ejs')
}


ipcMain.on('login', (event, username, password) => {
    // console.log(`Name passed from the renderer: ${username},${password}`)
    const loginDetails = db.prepare('select username,password from users where username=?').get(username)

    async function login(loginPassword,dbPassword){
        if(await bcrypt.compare(loginPassword,dbPassword)){
            console.log('login success')
            currentUser = username
            globalPassword = password

            retrievePasswords()          
            // let options = {root: __dirname}
            // ejse.renderFile('home.ejs',details,options,function (err,str){
            //     if(err){
            //         console.log(err)
            //     }
            //     else{
            //         win.loadURL('data:text/html;charset=utf-8,' + encodeURI(str)) 
            //     }
            // })
        }
        else{
            console.log("Login Failed")
            event.reply('login-fail')
        }          
    }

    if(typeof loginDetails != 'undefined'){
            login(password,loginDetails.password)
    }else{
        console.log("Login failed")
        event.reply('login-fail')
    }

  })

ipcMain.on('signup', (event,username,password) => {
    bcrypt.hash(password, saltRounds, function(err, hash) { // err on hashing password
        try{
            db.prepare('insert into users (username,password) values (?,?);').run(username,hash)

            // ejs rendering and loading home
            retrievePasswords()
            // let details = {}
            // let options = {root: __dirname}
            // ejs.renderFile('home.ejs',details,options,function (err,str){
            //     if(err){
            //         console.log(err)
            //     }
            //     else{
            //         win.load('data:text/html;charset=utf-8,' + encodeURI(str)) 
            //     }
            // })
        }catch(error){
            event.reply('error-signup',error)
        }
    })
})

ipcMain.on('copy', (event,password)=>{
    clipboard.writeText(password)
    event.reply('copied')
})

// add password to db
ipcMain.on('addPassword', function (event,website,password){
    // encrypt password

    // initialisation vector
    let iv = crypto.randomBytes(16)

    // key for cipher
    key = crypto.createHash('sha256').update(globalPassword).digest('hex').slice(0,32)
    cipher = crypto.createCipheriv('aes-256-cbc',key,iv)
    encryptedPassword = cipher.update(password,'utf-8','hex')
    encryptedPassword += cipher.final('hex')
    console.log(encryptedPassword)

    // add password to db
    try{
        console.log('Inserting into secrets')
        db.prepare(`insert into secrets (user,website,password,iv) values ((select id from users where username = ?),?,?,?);`).run(currentUser,website,encryptedPassword,iv)

        retrievePasswords()
    }catch(err)
    {
        // couldn't add new password
        console.log(err)
    }

})

app.on('ready', createWindow)