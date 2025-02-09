document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const formData = {
      name: document.getElementById("inputName").value,
      email: document.getElementById("inputEmail").value,
      subject: document.getElementById("inputSubject").value,
      message: document.getElementById("inputTextarea").value,
    };
    
    fetch("https://wk13ca-169e.restdb.io/rest/contact-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": "67a83f8e4dfa0cb11731a3ed",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      alert("Message sent successfully!");
      document.getElementById("contactForm").reset();
    })
    .catch(error => console.error("Error:", error));
  });