document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "6796eee2f9d2bb4e17181e1e";
    const DATABASE_URL = "https://mokesell-5fa0.restdb.io/rest/member";

    const togglePassword = document.querySelectorAll('.toggle-password'); // Select all toggle buttons

    // for login
    const loginForm = document.querySelector('#loginForm');
    const loginEmail = document.querySelector('#loginEmail');
    const loginPassword = document.querySelector('#loginPassword');
    const newMemberID = generateMemberID();

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Create a data object using the values from your input fields
        const data = {
            MemberID: newMemberID,
            MemberEmail: loginEmail.value.trim(),
            MemberPassword: loginPassword.value.trim()
        };

        // Send a POST request to the REST API
        fetch("https://mokesell-5fa0.restdb.io/rest/member", {
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

    // generateMemberID function to generate a new MemberID
    async function generateMemberID() {
        try {
            const response = await fetch(DATABASE_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                    "Cache-Control": "no-cache"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Determine the highest numeric part of the MemberID using reduce
            const highestID = data.reduce((max, member) => {
                if (member.MemberID && typeof member.MemberID === 'string' && member.MemberID.startsWith('M')) {
                    const numberPart = parseInt(member.MemberID.substring(1), 10);
                    if (!isNaN(numberPart)) {
                        return Math.max(max, numberPart);
                    }
                }
                return max;
            }, 0);

            // Generate a new MemberID with a leading "M" and a 5-digit number
            return `M${(highestID + 1).toString().padStart(5, '0')}`;
        } catch (error) {
            console.error("Error generating member ID:", error);
            throw error; // rethrow or handle as needed
        }
    }


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
