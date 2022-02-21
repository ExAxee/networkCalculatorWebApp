const baseURL = "https://api.hackertarget.com/subnetcalc/";

// selectors
const addressInput = document.querySelector("#addressInput");
const submitBtn    = document.querySelector("#submitBtn");
const outputDiv    = document.querySelector("#calculatedData");
const binarySw     = document.querySelector("#binarySw");

// listeners
submitBtn.addEventListener("click", processData);

/* example response
Address       = 192.168.1.0
Network       = 192.168.1.0 / 24
Netmask       = 255.255.255.0
Broadcast     = 192.168.1.255
Wildcard Mask = 0.0.0.255
Hosts Bits    = 8
Max. Hosts    = 254   (2^8 - 2)
Host Range    = { 192.168.1.1 - 192.168.1.254 }
*/
function extractData (data) {
    
}

async function processData (event) {
    event.preventDefault();
    outputDiv.innerHTML = "";
    
    if (addressInput.value.trim() != "") {
        
        for (const line of addressInput.value.trim().split("\n")) {
            let [start, ...masks] = addressInput.value.trim().split("/");

            for (const mask of masks) {
                rawData = await fetch(baseURL + "?q=" + start + "/" + mask).then(res=>res.text());

                console.log(rawData);
            }
        }
    } else {
        outputDiv.innerHTML = "<h3>No input data</h3>";
    }
}
