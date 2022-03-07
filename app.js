// CHOSEN API: https://networkcalc.com/api/docs
// CORS PROXY: allorigins.win
const baseURL = "https://api.allorigins.win/get?url=http://networkcalc.com/api/ip/";

const addressInput = document.querySelector("#addressInput");
const submitBtn    = document.querySelector("#submitBtn");
const outputDiv    = document.querySelector("#calculatedData");

// switches
const binarySw     = document.querySelector("#binarySw");

// add event listener
submitBtn.addEventListener("click", processData);

function displayData (data) {
    console.log(data);
    for (let subnet of data) {
        let rawData = subnet.address;
        let tableTemp = "<table class='dataDisplayTable'>";
        
        for (let key of Object.keys(rawData)) {
            tableTemp += "<tr><th>" + key + "</th><td>" + rawData[key] + "</td></tr>";
        }

        tableTemp += "</table><hr>"

        outputDiv.innerHTML += tableTemp;
    }
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
