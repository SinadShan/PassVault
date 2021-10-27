
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
    console.log('PasswordsView')
    var passwordsView = document.getElementById("passwords-view");
    for( item of document.getElementsByTagName('view'))
        item.style.display = 'none';
    passwordsView.style.display = 'block';
} 

document.querySelectorAll('.nav-link')[1].onclick = () => {
    console.log('accountView')
    var accountsView = document.getElementById("accounts-view");
    for( item of document.getElementsByTagName('view'))
        item.style.display = 'none';
    accountsView.style.display = 'block';
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

// password strength
const password = document.getElementsByClassName('web-password')
for(item of password){
    window.passVaultAPI.passwordStrength(item.classList[2],item.value)
}

// update password
for( item of document.querySelectorAll('.bi-arrow-counterclockwise')){
    item.addEventListener('click',function (event){
        window.passVaultAPI.openUpdatePasswordWindow(this.id.slice(0,-7))
    })
}

// document.addEventListener('keydown',function (e){
//     if(e.key.length === 1 && e.key.match(/[a-z]/i) || e.key==='Backspace')
//         document.getElementById("search").focus();
//     if(e.key=='Escape'){
//         document.getElementById('search').blur()
//     }
// })