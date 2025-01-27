//[STEP 0]: Make sure our document is A-OK
document.addEventListener("DOMContentLoaded", function () {
  // What kind of interface we want at the start 
  const APIKEY = "6796eee2f9d2bb4e17181e1e";
  getContacts();
  document.getElementById("update-member-container").style.display = "none";
  document.getElementById("add-update-msg").style.display = "none";

  //[STEP 1]: Create our submit form listener
  document.getElementById("member-submit").addEventListener("click", function (e) {
    // Prevent default action of the button 
    e.preventDefault();

    //[STEP 2]: Let's retrieve form data
    // For now, we assume all information is valMemberID
    // You are to do your own data valMemberIDation
    let MemberName = document.getElementById("member-name").value;
    let MemberEmail = document.getElementById("member-email").value;
    let MemberMobile = document.getElementById("member-mobile").value;

    // Validation checks
    if (!MemberName || !MemberEmail || !MemberMobile) {
      alert("All fields are required.");
      return;
    }

    //[STEP 3]: Get form values when the user clicks on send
    // Adapted from restdb API
    let jsondata = {
      "MemberName": MemberName,
      "MemberEmail": MemberEmail,
      "MemberMobile": MemberMobile
    };

    //[STEP 4]: Create our AJAX settings. Take note of API key
    let settings = {
      method: "POST", //[cher] we will use post to send info
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(jsondata),
      beforeSend: function () {
        //@TODO use loading bar instead
        // Disable our button or show loading bar
        document.getElementById("member-submit").disabled = true;
        // Clear our form using the form ID and triggering its reset feature
        document.getElementById("add-member-form").reset();
      }
    }

    //[STEP 5]: Send our AJAX request over to the DB and print response of the RESTDB storage to console.
    fetch("https://mokesell-5fa0.restdb.io/rest/member", settings)
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw err });
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // The response will include the generated MemberID
        document.getElementById("member-submit").disabled = false;
        //@TODO update frontend UI 
        document.getElementById("add-update-msg").style.display = "block";
        setTimeout(function () {
          document.getElementById("add-update-msg").style.display = "none";
        }, 3000);
        // Update our table 
        getContacts();
      })
      .catch(error => {
        console.error("Error:", error);
        alert(`Error: ${error.message}\nDetails: ${JSON.stringify(error.list)}`);
        document.getElementById("member-submit").disabled = false;
      });
  });//end click 


  //[STEP] 6
  // Let's create a function to allow you to retrieve all the information in your members
  // By default, we only retrieve 10 results
  function getContacts(limit = 10, all = true) {

    //[STEP 7]: Create our AJAX settings
    let settings = {
      method: "GET", //[cher] we will use GET to retrieve info
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
    }

    //[STEP 8]: Make our AJAX calls
    // Once we get the response, we modify our table content by creating the content internally. We run a loop to continuously add on data
    // RESTDb/NoSql always adds in a unique MemberID for each data; we tap on it to have our data and place it into our links 
    fetch("https://mokesell-5fa0.restdb.io/rest/member", settings)
      .then(response => response.json())
      .then(response => {
        let content = "";

        for (var i = 0; i < response.length && i < limit; i++) {
          //console.log(response[i]);
          //[METHOD 1]
          // Let's run our loop and slowly append content
          // We can use the normal string append += method
          /*
          content += "<tr><td>" + response[i].MemberName + "</td>" +
            "<td>" + response[i].MemberEmail + "</td>" +
            "<td>" + response[i].MemberMobile + "</td>
            "<td>Del</td><td>Update</td</tr>";
          */

          //[METHOD 2]
          // Using our template literal method using backticks
          // Take note that we can't use += for template literal strings
          // We use ${content} because -> content += content 
          // We want to add on previous content at the same time
          content = `${content}<tr MemberID='${response[i].MemberID}'><td>${response[i].MemberName}</td>
          <td>${response[i].MemberEmail}</td>
          <td>${response[i].MemberMobile}</td>
          <td><a href='#' class='delete' data-MemberID='${response[i].MemberID}'>Del</a></td><td><a href='#update-member-container' class='update' data-MemberID='${response[i].MemberID}' data-msg='${response[i].MemberMobile}' data-MemberName='${response[i].MemberName}' data-MemberEmail='${response[i].MemberEmail}'>Update</a></td></tr>`;

        }

        //[STEP 9]: Update our HTML content
        // Let's dump the content into our table body
        document.getElementById("member-list").getElementsByTagName("tbody")[0].innerHTML = content;

        document.getElementById("total-members").innerHTML = response.length;
      });
  }

  //[STEP 10]: Create our update listener
  // Here we tap onto our previous table when we click on update
  // This is a delegation feature of jQuery
  // Because our content is dynamic in nature, we listen in on the main container which is "#member-list". For each row, we have a class .update to help us
  document.getElementById("member-list").addEventListener("click", function (e) {
    if (e.target.classList.contains("update")) {
      e.preventDefault();
      // Update our update form values
      let MemberName = e.target.getAttribute("data-MemberName");
      let MemberEmail = e.target.getAttribute("data-MemberEmail");
      let MemberMobile = e.target.getAttribute("data-msg");
      let MemberID = e.target.getAttribute("data-MemberID");
      console.log(e.target.getAttribute("data-msg"));

      //[STEP 11]: Load in our data from the selected row and add it to our update member form 
      document.getElementById("update-member-name").value = MemberName;
      document.getElementById("update-member-email").value = MemberEmail;
      document.getElementById("update-member-mobile").value = MemberMobile;
      document.getElementById("update-member-id").value = MemberID;
      document.getElementById("update-member-container").style.display = "block";
    }
    else if (e.target.classList.contains("delete")) {
      e.preventDefault();

      let MemberID = e.target.dataset.MemberID;
      deleteRecord(MemberID);
    }
  });//end member-list listener for update function

  //[STEP 12]: Here we load in our member form data
  // Update form listener
  document.getElementById("update-member-submit").addEventListener("click", function (e) {
    e.preventDefault();
    // Retrieve all my update form values
    let MemberName = document.getElementById("update-member-name").value;
    let MemberEmail = document.getElementById("update-member-email").value;
    let MemberMobile = document.getElementById("update-member-mobile").value;
    let MemberID = document.getElementById("update-member-id").value;

    console.log(document.getElementById("update-member-mobile").value);
    console.log(MemberMobile);

    //[STEP 12a]: We call our update form function which makes an AJAX call to our RESTDB to update the selected information
    updateForm(MemberID, MemberName, MemberEmail, MemberMobile);
  });//end updatememberform listener

  //[STEP 13]: Function that makes an AJAX call and processes it 
  // UPDATE Based on the ID chosen
  function updateForm(MemberID, MemberName, MemberEmail, MemberMobile) {
    //@TODO create valMemberIDation methods for MemberID etc. 

    var jsondata = { "MemberID": _id, "MemberName": MemberName, "MemberEmail": MemberEmail, "MemberMobile": MemberMobile };
    var settings = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(jsondata)
    }

    //[STEP 13a]: Send our AJAX request and hMemberIDe the update member form
    fetch(`https://mokesell-5fa0.restdb.io/rest/member/${MemberID}`, settings)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        document.getElementById("update-member-container").style.display = "none";
        // Update our members table
        getContacts();
      });
  }//end updateform function

  function deleteRecord(MemberID) {
    var jsondata = { "_id": MemberID };
    var settings = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      }
    };

    fetch(`https://mokesell-5fa0.restdb.io/rest/member/${MemberID}`, settings)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Update our members table
        getContacts();
      })
      .catch(error => console.log(error));
  }

});
