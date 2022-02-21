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
    let output = {
        netId:            null,
        netIdCIDR:        null,
        subnetMask:       null,
        wildcardMask:     null,
        broadcastAddress: null,
        hostBits:         null,
        maxHost:          null,
        hostRange:        null
    }
    data = data.split("\n");

    output.netId            = data[0].split("=")[1].trim();
    output.netIdCIDR        = data[1].split("=")[1].trim();
    output.subnetMask       = data[2].split("=")[1].trim();
    output.broadcastAddress = data[3].split("=")[1].trim();
    output.wildcardMask     = data[4].split("=")[1].trim();
    output.hostBits         = data[5].split("=")[1].trim();
    output.maxHost          = data[6].split("=")[1].trim();
    output.hostRange        = data[7].split("=")[1].trim();

    return output;
}

function displayData (data) {
    for (let subnet of data) {
        let tableTemp = "<table class='dataDisplayTable'>"
        
        for (let key of Object.keys(subnet)) {
            tableTemp += "<tr><th>" + key + "</th><td>" + subnet[key] + "</td></tr>";
        }

        tableTemp += "</table><hr>"

        outputDiv.innerHTML += tableTemp;
    }
}

async function processData (event) {
    event.preventDefault();
    outputDiv.innerHTML = "";
    let data = [];
    
    if (addressInput.value.trim() != "") {
        data = [];

        for (const line of addressInput.value.trim().split("\n")) {
            let [start, ...masks] = line.trim().split("/");

            for (const mask of masks) {
                rawData = await fetch(baseURL + "?q=" + start + "/" + mask).then(res=>res.text());
                data.push(extractData(rawData));
            }
        }

        displayData(data);
    } else {
        outputDiv.innerHTML = "<h3>No input data</h3>";
    }
}
