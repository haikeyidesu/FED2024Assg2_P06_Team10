const apiUrl = "https://wk13ca-169e.restdb.io/rest/profile";
const apiKey = "67a83f8e4dfa0cb11731a3ed"; // Replace with your actual API Key

document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveProfileBtn");
    if (saveButton) {
        saveButton.addEventListener("click", saveProfile);
    }
});

async function saveProfile() {
    // Ensure elements are found before accessing their values
    const firstName = document.getElementById("exampleInput1");
    const company = document.getElementById("exampleInput3");
    const street = document.getElementById("exampleInput4");
    const zip = document.getElementById("exampleInput5");
    const telephone = document.getElementById("exampleInput6");
    const email = document.getElementById("exampleInput7");

    // Check if all fields are available
    if (!firstName || !company || !street || !zip || !telephone || !email) {
        alert("One or more input fields are missing. Please check the form.");
        return;
    }

    const userData = {
        username: firstName.value, // Using first name as username
        company: company.value,
        street: street.value,
        zip: zip.value,
        telephone: telephone.value,
        email: email.value
    };

    if (!userData.email) {
        alert("Email is required!");
        return;
    }

    console.log("Saving user:", userData);

    try {
        // Check if user already exists
        const existingUser = await checkIfUserExists(userData.email);

        let method = "POST"; // Default to creating a new user
        let url = apiUrl;

        if (existingUser) {
            method = "PATCH"; // Update existing user
            url = `${apiUrl}/${existingUser._id}`; // Use user ID for updating
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey,
                "Cache-Control": "no-cache"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Profile saved successfully:", result);
        alert("Profile saved successfully!");

    } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save profile!");
    }
}

async function checkIfUserExists(email) {
    try {
        const response = await fetch(`${apiUrl}?q={"email":"${email}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey
            }
        });

        if (!response.ok) return null; // Return null if there's an error

        const users = await response.json();
        return users.length > 0 ? users[0] : null; // Return first user if exists

    } catch (error) {
        console.error("Error checking user:", error);
        return null;
    }
}