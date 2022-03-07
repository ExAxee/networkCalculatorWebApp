// CHOSEN API: https://networkcalc.com/api/docs
// CORS PROXY: allorigins.win
const baseURL = "https://api.allorigins.win/get?url=http://networkcalc.com/api/ip/";

const addressInput = document.querySelector("#addressInput");
const submitBtn    = document.querySelector("#submitBtn");
const outputDiv    = document.querySelector("#calculatedData");

// switches
const binarySw     = document.querySelector("#binarySw");

// html constants
const vl = `<td class='vl'></td>`;

// add event listener
submitBtn.addEventListener("click", processData);

function displayData (data) {
    console.log(data);
    outputDiv.innerHTML = "";
    // TODO  refactor table building using divs
    for (let subnet of data) {
        const binary = subnet.address.hasOwnProperty("binary");
        let tableTemp = `<table class='dataDisplayTable'><tbody>`;

        // add title
        tableTemp += `<tr><th>NUMERICAL ADDRESS</th>`;
        if (binary) tableTemp += `${vl}<th>BINARY ADDRESS</th>`;
        tableTemp += `</tr>`;
            
        // add address
        tableTemp += `<tr><td>address</td><td>${subnet.address["network_address"]}</td>`;
            /*<td>BINARY ADDRESS</td></tr>
            <tr><th>address</th><td>${subnet.address["address"]}</td></tr>
        </table><hr>;*/

        /*let rawData = subnet.address;
        let tableTemp = "<table class='dataDisplayTable'>";
        
        for (let key of Object.keys(rawData)) {
            tableTemp += "<tr><th>" + convertKeyToString(key) + "</th><td>" + rawData[key] + "</td></tr>";
        }

        tableTemp += "</table><hr>"*/

        tableTemp += `</tbody></table>`;
        outputDiv.innerHTML += tableTemp;
    }
}

function convertKeyToString (key) {
    return key.replaceAll("_", " ");
}

async function processData (event) {
    event.preventDefault();
    outputDiv.innerHTML = "";
    
    if (addressInput.value.trim() != "") {
        raw  = addressInput.value.trim();
        data = []
        
        // cycle trhough subnet entries
        for (const entry of raw.split("\n")) {
            //split masks
            const [start, ...masks] = entry.trim().split("/");
            
            for (const mask of masks) {
                data.push(
                    await fetch(
                        baseURL + start + "/" + mask + "?" +
                        (binarySw.checked ? "binary=true" : "binary=false")
                    ).then(
                        // parse the CORS proxy data
                        response => response.json()
                    ).then(
                        // get the data
                        response => response.contents
                    ).then(
                        // parse the final useful data
                        response => JSON.parse(response)
                    )
                )
            }
        }

        displayData(data);
    } else {
        outputDiv.innerHTML = "<h3>No input data</h3>";
    }
}
