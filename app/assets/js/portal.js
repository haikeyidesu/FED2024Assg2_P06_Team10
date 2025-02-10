document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "6796eee2f9d2bb4e17181e1e";
    const DATABASE_URL = "https://mokesell-5fa0.restdb.io/rest/member";

    const togglePassword = document.querySelectorAll('.toggle-password'); // Select all toggle buttons

    // Function to toggle password visibility
    togglePassword.forEach(button => {
        button.addEventListener('click', function () {
            console.log('Toggle password visibility clicked');
            const passwordField = this.previousElementSibling;
            // if password field type is password, change it to text, and vice versa
            // this enables the user to toggle between showing and hiding the password
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            // change the button text whenever the user toggles the password visibility
            // visible password shows 'Hide Password', while hidden password shows 'Show Password'
            this.textContent = type === 'password' ? 'Show Password' : 'Hide Password';
        });
    });

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log('Login form submitted');

            const email = loginForm.querySelector('input[name="email"]').value.trim();
            const password = loginForm.querySelector('input[name="password"]').value.trim();

            fetch(DATABASE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': APIKEY,
                    'cache-control': 'no-cache'
                }
            })
                .then(response => response.json())
                .then(users => {
                    const user = users.find(user => user.MemberEmail === email && user.MemberPassword === password);
                    if (user) {
                        console.log('Login successful');
                        alert('Login Successful!'); // Replace with Lottie animation
                        localStorage.setItem('MemberID', user.MemberID); // Store session info
                        window.location.href = 'index.html';
                    } else {
                        console.error('Invalid email or password');
                        alert('Invalid email or password!'); // Show an actual UI message
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                });
        });
    } else {
        console.error('Login form not found');
    }

    // Handle create account form submission
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log('Create account form submitted');

            const name = createAccountForm.querySelector('input[name="name"]').value.trim();
            const email = createAccountForm.querySelector('input[name="email"]').value.trim();
            const password = createAccountForm.querySelector('input[name="password"]').value.trim();

            // First, check if email already exists
            fetch(DATABASE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': APIKEY,
                    'cache-control': 'no-cache'
                }
            })
                .then(response => response.json())
                .then(users => {
                    const existingUser = users.find(user => user.MemberEmail === email);
                    if (existingUser) {
                        alert('Email is already registered!');
                    } else {
                        // Proceed to create the account
                        const data = {
                            MemberName: name,
                            MemberEmail: email,
                            MemberPassword: password // Consider hashing this before sending
                        };

                        return fetch(DATABASE_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-apikey': APIKEY,
                                'cache-control': 'no-cache'
                            },
                            body: JSON.stringify(data)
                        });
                    }
                })
                .then(response => response.json())
                .then(result => {
                    console.log('Account creation successful:', result);
                    alert('Account created successfully!'); // Replace with Lottie animation
                    createAccountForm.reset(); // Clear form after successful creation
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                });
        });
    } else {
        console.error('Create account form not found');
    }
});
