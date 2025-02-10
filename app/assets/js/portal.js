document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "6796eee2f9d2bb4e17181e1e";
    const DATABASE_URL = "https://mokesell-5fa0.restdb.io/rest/member";

    const togglePassword = document.querySelectorAll('.toggle-password'); // Select all toggle buttons

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
        fetch(DATABASE_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
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
});
