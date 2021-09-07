
document.getElementById('signup-link').onclick = function (){ 
    if(this.innerText == 'Signup'){
        document.getElementById('signup-password').removeAttribute('hidden')
        document.getElementsByClassName('text-muted')[0].setAttribute('hidden','true')

        
        document.getElementById('signup-password').children[0].setAttribute('required','true')
        document.getElementById('heading').innerText = 'Signup'
        document.getElementById('signup-link').innerText = 'Login'
    }
    else{
        document.getElementById('signup-password').setAttribute('hidden','true')
        document.getElementsByClassName('text-muted')[0].removeAttribute('hidden')
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
        console.log(password.value)
        console.log(confirm_password.value)
        if(password.value != confirm_password.value){
            window.passVaultAPI.unmatchingPasswords()
            // alert("Passwords don't match")
        }
        else{
            window.passVaultAPI.signup(form.username.value,form.password.value)
        }
    }

})


