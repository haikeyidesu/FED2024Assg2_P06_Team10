document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "6796eee2f9d2bb4e17181e1e";
    const DATABASE_URL = "https://mokesell-5fa0.restdb.io/rest/member";
    const APIKEY2 = "67aa0329020c063b98e653c6";
    const DATABASE_URL2 = "https://mokesell2-1228.restdb.io/rest/member";

    const togglePassword = document.querySelectorAll('.toggle-loginPassword'); // Select all toggle buttons

    // for login form
    const loginForm = document.querySelector('#loginForm');
    const loginEmail = document.querySelector('#loginEmail');
    const loginPassword = document.querySelector('#loginPassword');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent form from submitting the default way

        const email = loginEmail.value;
        const password = loginPassword.value;

        // Check if email or password is empty
        if (!email || !password) {
            alert("Please enter both email and password!");
            return;
        }

        try {
            // Fetch the members from the API
            const response = await fetch(DATABASE_URL2, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': APIKEY2
                }
            });

            if (!response.ok) {
                alert('Error fetching member data!');
                return;
            }

            const members = await response.json();

            // Check if the email exists in the database
            const member = members.find(member => member.MemberEmail === email);

            if (!member) {
                // If email does not exist, prompt user to create an account
                alert('Email not found. Please create an account.');
                loginEmail.value = ''; // Clear email field
                loginPassword.value = ''; // Clear password field
                return;
            }

            // If email exists, check if the password matches
            if (member.MemberPassword === password) {
                // Store the member's _id in localStorage
                localStorage.setItem('memberId', member._id);
                // Successful login, redirect to index.html
                window.location.href = 'index.html';
            } else {
                // Password mismatch, clear the form and show an alert
                alert('Incorrect password!');
                loginPassword.value = ''; // Clear password field
            }

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while trying to log in. Please try again later.');
        }
    });


    // for create account form
    const createAccountForm = document.querySelector('#createAccountForm');
    const newEmail = document.querySelector('#newEmail');
    const newPassword = document.querySelector('#newPassword');
    const confirmNewPassword = document.querySelector('#confirmNewPassword');

    createAccountForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        console.log(newPassword.value, confirmNewPassword.value);
        // Check if passwords match
        if (newPassword.value !== confirmNewPassword.value) {
            alert("Passwords do not match! Please try again."); // Show error popup
            newPassword.value.value = ""; // Clear input fields
            confirmNewPassword.value = "";
            return; // Stop form submission
        }

        // Create a data object using the values from your input fields
        const data = {
            MemberEmail: newEmail.value.trim(),
            MemberPassword: newPassword.value.trim()
        };

        // Send a POST request to the REST API
        fetch(DATABASE_URL2, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY2,
                "cache-control": "no-cache"
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                console.log("Data posted successfully:", result);
                // Optionally, add further processing such as redirecting the user or displaying a success message
            })
            .catch(error => {
                console.error("Error posting data:", error);
            });
    });

    // Function to toggle loginPassword visibility
    togglePassword.forEach(button => {
        button.addEventListener('click', function () {
            console.log('Toggle loginPassword visibility clicked');
            const passwordField = this.previousElementSibling;
            // if loginPassword field type is loginPassword, change it to text, and vice versa
            // this enables the user to toggle between showing and hiding the loginPassword
            const type = passwordField.getAttribute('type') === 'loginPassword' ? 'text' : 'loginPassword';
            passwordField.setAttribute('type', type);
            // change the button text whenever the user toggles the loginPassword visibility
            // visible loginPassword shows 'Hide Password', while hidden loginPassword shows 'Show Password'
            this.textContent = type === 'loginPassword' ? 'Show Password' : 'Hide Password';
        });
    });
});
