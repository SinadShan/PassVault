window.passVaultAPI.checkPlatform()

document.querySelector('p span').addEventListener('click',(e) => {
    window.passVaultAPI.openReleasesPage();
})

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

document.getElementById('signup-link').onclick = function (){ 
    if(this.innerText == 'Signup'){
        document.getElementById('signup-password').removeAttribute('hidden')
        document.getElementsByClassName('text-muted')[0].setAttribute('hidden','true')
        document.getElementById('login-password').setAttribute('minlength','8');
        
        document.getElementById('signup-password').children[0].setAttribute('required','true')
        document.getElementById('heading').innerText = 'Signup'
        document.getElementById('signup-link').innerText = 'Login'
    }
    else{
        document.getElementById('signup-password').setAttribute('hidden','true')
        document.getElementsByClassName('text-muted')[0].removeAttribute('hidden')
        document.getElementById('login-password').removeAttribute('minlength');

        // document.getElementById('signup-password-label').setAttribute('hidden','true')
        document.getElementById('signup-password').children[0].removeAttribute('required')
        // console.log(this.attributes)
        document.getElementById('heading').innerText = 'Login'
        document.getElementById('signup-link').innerText = 'Signup'
    }
}

document.getElementsByTagName('form')[0].addEventListener('submit', (event) => {
    event.preventDefault()
    const form = event.target
    if(document.getElementById('heading').innerText == 'Login'){
        window.passVaultAPI.login(form.username.value,form.password.value)
    }
    else{
        const password = form.querySelectorAll(".password")[0]
        const confirm_password = form.querySelectorAll(".password")[1]

        if(password.value != confirm_password.value){
            window.passVaultAPI.displayDialog("Passwords do not match")
        }
        else{
            window.passVaultAPI.signup(form.username.value,form.password.value)
        }
    }
})


