document.getElementsByTagName('form')[0].addEventListener('submit', (event) => {
    event.preventDefault()
    const form = event.target
    const website = document.querySelector('#website_name').innerText
    window.passVaultAPI.updatePassword(website,form.password.value)
})

document.getElementsByClassName('eye')[0].onclick = function () {
        if(this.classList.contains('bi-eye')){
            this.classList.remove('bi-eye')
            this.classList.add('bi-eye-slash')
            document.querySelector('form input').setAttribute('type','text')
        }else{
            this.classList.remove('bi-eye-slash')
            this.classList.add('bi-eye')
            document.querySelector('form input').setAttribute('type','password')
        }
}

document.querySelector('#cancel').onclick = function (){
    window.passVaultAPI.closeUpdateWindow()
}