const loginForm = document.querySelector('form');
const signupBtn = document.querySelector('#signup-btn');

const host = 'localhost';
const port = '3000';

loginForm.addEventListener('submit', async (event) =>{
    event.preventDefault();
    
    
    
    try{
        const email = event.target.email.value;
        const password = event.target.password.value;
        // const token = localStorage.getItem('token');
        const data = await axios.post(`http://${host}:${port}/user/login`, {
            email: email,
            password: password
        });
    
        console.log(data);
        localStorage.setItem('token', data.data.token);
        window.location.href = '../dashboard/dashboard.html';
        
        alert(data.data.message);
    }
    catch(error){
        console.log(error);

    }

});

signupBtn.addEventListener('click',()=>{
    window.location.href = '../signup/signup.html'
})
