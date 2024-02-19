// PIN setting property for online purpose(using Advanced Encryption Standard(AES) using CryptoJS is here
function maskPassword(pass) {
    let str = "";
    for (let index = 0; index < pass.length; index++) {
        str += "*";
    }
    return str;
}

// Encryption algorithm
function encrypt(text, password) {
    let encryptedText = CryptoJS.AES.encrypt(text, password).toString();
    return encryptedText;
}

// Decryption algorithm
function decrypt(encryptedText, password) {
    let decryptedText = CryptoJS.AES.decrypt(encryptedText, password).toString(CryptoJS.enc.Utf8);
    return decryptedText;
}

function setPasswordDialog() {
    let dialogHTML = `
    <div id="passwordDialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 12px; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); z-index: 999;">
        <h2 style="margin-left: 45px; margin-top: 0;">Set Your PIN</h2>
        <label for="pinInput" style="margin-right: 10px;">PIN:</label>
        <input type="password" id="pinInput" name="pinInput" autofocus>
        <br><br>
        <button id="setPinBtn" onclick="setPin()" onmouseover="this.style.color='green'; this.style.backgroundColor='black'" onmouseout="this.style.color='white'; this.style.backgroundColor='black'" style="margin-left: 47px; margin-right: 10px; padding: 5px 10px; background-color: black; color: white; font-weight: bold; border: none; border-radius: 5px; cursor: pointer;">Set PIN</button>
        <button id="cancelBtn" onclick="cancelPasswordDialog()" onmouseover="this.style.color='green'; this.style.backgroundColor='black'" onmouseout="this.style.color='white'; this.style.backgroundColor='black'" style="padding: 5px 10px; background-color: black; color: white; font-weight: bold; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
    </div>`;

    document.body.innerHTML += dialogHTML;
}


function setPin() {
    let pin = document.getElementById("pinInput").value;
    if (pin !== "") {
        let encryptedPin = encrypt(pin, "encryptionPassword");
        localStorage.setItem("pin", encryptedPin);
        document.getElementById("passwordDialog").remove();
        alert("PIN set successfully!");
    }
}

function showPasswordDialog(txt) {
    let pinSet = localStorage.getItem("pin") !== null; // Check if PIN is set in local storage

    if (!pinSet) {
        setPasswordDialog(); // Prompt user to set PIN if not already set
        return;
    }

    let dialogHTML = `
    <div id="passwordDialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 15px; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); z-index: 999;">
        <h2 style="margin-top: 0; margin-left: 45px;">Enter Your PIN</h2>
        <label for="pinInput" style="margin-right: 10px;">PIN:</label>
        <input type="password" id="pinInput" name="pinInput" autofocus>
        <br><br>
        <button id="copyBtn" onclick="copyPassword('${txt}')" onmouseover="this.style.color='green'; this.style.backgroundColor='black'" onmouseout="this.style.color='white'; this.style.backgroundColor='black'" style="margin-left: 19px; margin-right: 10px; padding: 5px 10px; background-color: black; color: white; font-weight: bold; border: none; border-radius: 5px; cursor: pointer;">Copy Password</button>
        <button id="cancelBtn" onclick="cancelPasswordDialog()" onmouseover="this.style.color='green'; this.style.backgroundColor='black'" onmouseout="this.style.color='white'; this.style.backgroundColor='black'" style="padding: 5px 10px; background-color: black; color: white; font-weight: bold; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
    </div>`;

    document.body.innerHTML += dialogHTML;
}

// Function to copy the password
function copyPassword(txt) {
    let password = document.getElementById("pinInput").value;
    let pinSet = localStorage.getItem("pin") !== null; // Check if PIN is set in local storage

    if (!pinSet) {
        setPasswordDialog(); // Prompt user to set PIN if not already set
        return;
    }

    // Retrieve the actual password entered by the user before encryption
    let decryptedPassword = decrypt(txt, "encryptionPassword");

    if (password === decrypt(localStorage.getItem("pin"), "encryptionPassword")) {
        alert("Password copied successfully!");

        // Copy the actual password instead of the encrypted one
        let tempInput = document.createElement("input");
        tempInput.value = decryptedPassword; // Use the decrypted password here
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    } else {
        alert("Incorrect PIN. Copying text denied.");
    }

    // Remove the password dialog
    document.getElementById("passwordDialog").remove();
}

function cancelPasswordDialog() {
    // Remove the password dialog
    document.getElementById("passwordDialog").remove();
}

const deletePassword = (website) => {
    let data = localStorage.getItem("passwords");
    let arr = JSON.parse(data);
    let index = arr.findIndex((e) => e.website === website);

    if (index !== -1) {
        arr.splice(index, 1);
        localStorage.setItem("passwords", JSON.stringify(arr));
        alert(`Successfully deleted ${website}'s password`);
        showPasswords();
    } else {
        alert(`Password for ${website} not found`);
    }
};



const showPasswords = () => {
    let tb = document.querySelector("table");
    let data = localStorage.getItem("passwords");

    if (data == null || JSON.parse(data).length == 0) {
        tb.innerHTML = " ";
        // IN JUST ABOVE LINE , TYPE ANYTHING U WANT TO TYPE IN " " WHICH WILL BE SEEN WHEN NO DATA IS PRESENT IN THE TABLE
    } else {
        tb.innerHTML = ` 
            <tr>
                <th>Website</th>
                <th>Username</th>
                <th>Password</th>
                <th>Delete</th>
            </tr>`;

        let arr = JSON.parse(data);
        let str = "";

        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];

            str += `<tr>
                        <td>${element.website}</td>
                        <td>${element.username}</td>
                        <td>${maskPassword(element.password)} 
                            <img onclick="showPasswordDialog('${element.password}')" 
                                src="copy.svg" alt="Copy Button" width="10" height="10">
                        </td>
                        <td>
                            <button class="btnsm" 
                                onclick="deletePassword('${element.website}')">Delete
                            </button>
                        </td>
                    </tr>`;
        }

        tb.innerHTML += str;
    }

    // Reset input fields
    document.getElementById("website").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
};

console.log("working");
showPasswords();

document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Clicked....");
    console.log(document.getElementById("username").value, document.getElementById("password").value);
    let passwords = localStorage.getItem("passwords");
    console.log(passwords);
    if (passwords == null) {
        let json = [];
        json.push({ website: document.getElementById("website").value, username: document.getElementById("username").value, password: encrypt(document.getElementById("password").value, "encryptionPassword") });
        setPasswordDialog(); // Prompt user to set PIN when saving password for the first time
        alert("password saved");
        localStorage.setItem("passwords", JSON.stringify(json));
    } else {
        let json = JSON.parse(localStorage.getItem("passwords"));
        json.push({ website: document.getElementById("website").value, username: document.getElementById("username").value, password: encrypt(document.getElementById("password").value, "encryptionPassword") });
        alert("password saved");
        localStorage.setItem("passwords", JSON.stringify(json));
    }
    showPasswords();
});