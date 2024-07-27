document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('form');
    const host = 'localhost';
    const port = '3000';
    const apiUrl = `http://${host}:${port}/user/signup`;

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        const userData = {
            name,
            email,
            phone,
            password
        };

        try {
            const response = await axios.post(apiUrl, userData);

         
            alert('Signup successful!');
            window.location.href = '../login/login.html';
         

        } catch (error) {
            console.error('There was a problem with the signup request:', error);
            
            alert(error.response.data.message);
        }
    });
});
