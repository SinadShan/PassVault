
// display password
for ( item of document.getElementsByClassName('eye')){
    item.onclick = togglePassword
}
    
document.getElementsByClassName('account-eye')[0].onclick = togglePassword

function togglePassword(){
    if(this.classList.contains('bi-eye')){
        this.classList.remove('bi-eye')
        this.classList.add('bi-eye-slash')
        this.parentElement.children[0].setAttribute('type','text')
    }else{
        this.classList.remove('bi-eye-slash')
        this.classList.add('bi-eye')
        this.parentElement.children[0].setAttribute('type','password')
    }
}

// passwordView
document.querySelectorAll('.nav-link')[0].onclick = () => {

    var passwordsView = document.getElementById("passwords-view");
    for( item of document.getElementsByTagName('view'))
        item.style.display = 'none';
    passwordsView.style.display = 'block';
} 

// accountsView
document.querySelectorAll('.nav-link')[1].onclick = () => {

    var accountsView = document.getElementById("accounts-view");
    for( item of document.getElementsByTagName('view'))
        item.style.display = 'none';
    accountsView.style.display = 'block';
} 

// info-View
document.querySelectorAll('.nav-link')[2].onclick = () => {

    var infoView = document.getElementById("info-view");
    for( item of document.getElementsByTagName('view'))
        item.style.display = 'none';
    infoView.style.display = 'block';
} 

// copy password to clipboard
for (item of document.getElementsByClassName('clipboard')){
    item.onclick = function(event){
        // console.log(event.target.parentElement.children[0].value)
        window.passVaultAPI.copyToClipboard(
            event.target.parentElement.children[0].value
        )
    }
}
  
// display new password form
document.getElementById('new-password').onclick = function(){
    document.getElementById('new-password-form').removeAttribute('hidden')
    document.getElementById('cancel').removeAttribute('hidden')
    document.getElementsByClassName('new-password-req')[0].setAttribute('required','')
    document.getElementsByClassName('new-password-req')[1].setAttribute('required','')
    document.getElementsByClassName('new-password-req')[0].value=''
    document.getElementsByClassName('new-password-req')[1].value=''
    this.hidden = 'true'
}

// cancel new password form
document.getElementById('cancel').onclick = function (){
    document.getElementById('new-password-form').hidden = 'true'
    document.getElementById('new-password').removeAttribute('hidden')
    document.getElementsByClassName('new-password-req')[0].removeAttribute('required')
    document.getElementsByClassName('new-password-req')[1].removeAttribute('required')
    this.hidden = 'true'
}

// submit new password 
document.getElementById('new-password-form').addEventListener('submit', function(event){
    // console.log('Clicked submit in add new password')
    event.preventDefault()
    const form = event.target
    window.passVaultAPI.addPassword(form.website.value,form.password.value)
})

// delete a password
for(item of document.getElementsByClassName('bi-x')){
    item.addEventListener('click',function (){
        // console.log(this.id+' was clicked')
        window.passVaultAPI.deletePassword(this.id.slice(0,-2))
    })
}

// search for password
const searchForm = document.getElementById('search')
searchForm.addEventListener('keyup',search)

function search(e){
    
    const cards = document.querySelectorAll('.card')

    for(i = 0; i < cards.length-1; i++){
        const index = cards[i].classList[1]
        if(document.getElementsByClassName(`card-title ${index}`)[0].textContent.search(new RegExp(e.target.value,'i'))<0){
            cards[i].parentElement.style.display = "none"
        }
        else{
            cards[i].parentElement.style.display = ""
        }
    }
    
}

for (item of document.getElementsByClassName('strength-meter')){
    const itags = item.children
    if(item.classList[2] === 'score-0'){
        itags[0].classList.add('bi-circle-fill')
        itags[1].classList.add('bi-circle')
        itags[2].classList.add('bi-circle')
        itags[3].classList.add('bi-circle')
        itags[4].textContent='Too Weak'
    }
    
    if(item.classList[2] === 'score-1'){
        itags[0].classList.add('bi-circle-fill')
        itags[1].classList.add('bi-circle-fill')
        itags[2].classList.add('bi-circle')
        itags[3].classList.add('bi-circle')
        itags[4].textContent='Weak'   
    }
    
    if(item.classList[2] === 'score-2'){
        itags[0].classList.add('bi-circle-fill')
        itags[1].classList.add('bi-circle-fill')
        itags[2].classList.add('bi-circle-fill')
        itags[3].classList.add('bi-circle')
        itags[4].textContent='Medium'
    }
    
    if(item.classList[2] === 'score-3'){
        itags[0].classList.add('bi-circle-fill')
        itags[1].classList.add('bi-circle-fill')
        itags[2].classList.add('bi-circle-fill')
        itags[3].classList.add('bi-circle-fill')
        itags[4].textContent='Strong'
    }
}

// update password
for( item of document.querySelectorAll('.bi-arrow-counterclockwise')){
    item.addEventListener('click',function (event){
        window.passVaultAPI.openUpdatePasswordWindow(this.id.slice(0,-7))
    })
}

// open issues/bugs page
document.getElementById('bug-button').onclick = () => {
    window.passVaultAPI.openLink('https://github.com/SinadShan/PassVault/issues/new')
}

document.getElementById('download-release-button').onclick = () => {
    window.passVaultAPI.openLink('https://github.com/SinadShan/PassVault/releases')
}

// document.addEventListener('keydown',function (e){
//     if(e.key.length === 1 && e.key.match(/[a-z]/i) || e.key==='Backspace')
//         document.getElementById("search").focus();
//     if(e.key=='Escape'){
//         document.getElementById('search').blur()
//     }
// })