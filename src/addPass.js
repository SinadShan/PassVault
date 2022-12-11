document.getElementById('new-password-form').onsubmit = function (e){
    e.preventDefault()
    const form = e.target
    const website = form.website.value
    const password = form.password.value

    window.passVaultAPI.addPassword(website, password)
}

document.getElementsByClassName('eye')[0].onclick = function () {
    if(this.classList.contains('bi-eye')){
        this.classList.remove('bi-eye')
        this.classList.add('bi-eye-slash')
        document.querySelectorAll('form input')[1].setAttribute('type','text')
    }else{
        this.classList.remove('bi-eye-slash')
        this.classList.add('bi-eye')
        document.querySelectorAll('form input')[1].setAttribute('type','password')
    }
}

document.querySelector('#cancel').onclick = function (){
    window.passVaultAPI.closeWindow()
}