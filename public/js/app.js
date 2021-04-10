console.log('client side')
const login  = document.querySelector('.login')
const signup = document.querySelector('.signup')
const signupBtn = document.querySelector('.signup-btn')

const me = document.querySelector('.me')

signupBtn.addEventListener('click', (e)=>{
    e.preventDefault()

    login.style.display = "none"
    signup.style.display = "block"
})

