
// display password
for ( item of document.getElementsByClassName('eye')){
    item.onclick = togglePassword
}

for ( item of document.getElementsByClassName('list-eye')){
    item.onclick = toggleListPassword
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

function toggleListPassword(){
    let website = this.id.slice(5,-4)
    if(this.classList.contains('bi-eye')){
        this.classList.remove('bi-eye')
        this.classList.add('bi-eye-slash')
        document.getElementById(`list-${website}-form`).setAttribute('type','text')
    }else{
        this.classList.remove('bi-eye-slash')
        this.classList.add('bi-eye')
        document.getElementById(`list-${website}-form`).setAttribute('type','password')
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
// document.querySelectorAll('.nav-link')[2].onclick = () => {

//     var infoView = document.getElementById("info-view");
//     for( item of document.getElementsByTagName('view'))
//         item.style.display = 'none';
//     infoView.style.display = 'block';
// } 

// copy password to clipboard
for (item of document.getElementsByClassName('clipboard')){
    item.onclick = function(event){
        // console.log(event.target.parentElement.children[0].value)
        let notification = document.getElementsByClassName("notification")[0]
        notification.style.display='flex'
        setTimeout(() => notification.style.display = 'none', 2250)
        notification.style.opacity = '1';
        notification.style.display='flex'
        setTimeout(() => notification.style.display = 'none', 2250)
        document.getElementsByClassName("notif-content")[0].innerText = "Copied password to clipboard"
        setTimeout(() => notification.style.opacity = '0',2000)
        window.passVaultAPI.copyToClipboard(
            event.target.parentElement.children[0].value
        )
    }
}

for (item of document.getElementsByClassName('list-clipboard')){
    item.onclick = function(event){
        let website = event.target.id.slice(5,-10)
        let password = document.getElementById(`list-${website}-form`).value
        let notification = document.getElementsByClassName("notification")[0]
        notification.style.opacity = '1';
        notification.style.display='flex'
        setTimeout(() => notification.style.display = 'none', 2250)
        document.getElementsByClassName("notif-content")[0].innerText = "Copied password to clipboard"
        setTimeout(() => notification.style.opacity = '0',2000)
        window.passVaultAPI.copyToClipboard(password)
    }
}

document.getElementsByClassName('list-icon-wrapper')[0].onclick = toggleListView
  
function toggleListView(){
    var lists = document.getElementsByClassName("list")
    var cards = document.getElementsByClassName("card")
    if( lists[0].style.display === "none" || lists[0].style.display === ""){
        document.getElementsByClassName("list-icon-wrapper")[0].style.backgroundColor = "#00306f"
        document.getElementsByClassName("bi-list-ul")[0].style.color = "white"
        for (item of lists)
            item.style.display = "block"
        for (item of cards)
            item.style.display = "none"
    }else{
        document.getElementsByClassName("list-icon-wrapper")[0].style.backgroundColor = "white"
        document.getElementsByClassName("bi-list-ul")[0].style.color = "black"
        for(item of lists)
            item.style.display = "none"
        for (item of cards)
            item.style.display = "flex"
    }
}

// toggle info window
document.getElementsByClassName('info-icon-wrapper')[0].onclick = function () {
    window.passVaultAPI.toggleInfo()
}


// display new password window
document.getElementsByClassName('add-password-button')[0].onclick= function(){
    window.passVaultAPI.displayNewPasswordWindow()
}

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


// document.getElementsByClassName('bmc-button')[0].onclick = () => {
//     window.passVaultAPI.openLink('https://buymeacoff.ee/sinadshan')
// }

// document.addEventListener('keydown',function (e){
//     if(e.key.length === 1 && e.key.match(/[a-z]/i) || e.key==='Backspace')
//         document.getElementById("search").focus();
//     if(e.key=='Escape'){
//         document.getElementById('search').blur()
//     }
// })