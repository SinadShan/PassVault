
// display password
for ( item of document.getElementsByClassName('eye')){
    item.onclick = function (){
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
        console.log(this.id+' was clicked')
        window.passVaultAPI.deletePassword(this.id.slice(0,-2))
    })
}

// search for password
const searchForm = document.getElementById('search')
searchForm.addEventListener('keyup',search)

function search(e){
    
    const cards = document.querySelectorAll('.card')
    
    for(i = 0; i < cards.length-1; i++){
        if(cards[i].children[0].children[1].children[1].textContent.search(new RegExp(e.target.value,'i'))<0){
            cards[i].parentElement.style.display = "none"
        }
        else{
            cards[i].parentElement.style.display = ""
        }
    }
    
}
