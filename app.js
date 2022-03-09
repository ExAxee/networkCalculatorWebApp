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
    outputDiv.innerHTML = "";
    // TODO  refactor table building using divs
    for (let subnet of data) {
        const binary = subnet.address.hasOwnProperty("binary");

        // table has always 3 + 2 columns (2 for the vertical lines)
        let tableTemp = `
        <div class='dataDisplayTable'>
            <div class='tableTitle'>
                <span>
                    CIDR: ${subnet.address["cidr_notation"]};
                    subnet bits: ${subnet.address["subnet_bits"]};
                    assignable hosts: ${subnet.address["assignable_hosts"]}
                </span>
            </div>
            <table>
                <tr>
                    <th>DATA</th>
                    <th>DOTTED DECIMAL</th>
                    <th>${binary ? `BINARY` : ``}</th>
                </tr>
                <tr class="greyRow">
                    <td>network address</td>
                    <td>${subnet.address["network_address"]}</td>
                    <td>${binary ? subnet.address.binary["network_address"] : ``}</td>
                </tr>
                <tr>
                    <td>broadcast</td>
                    <td>${subnet.address["broadcast_address"]}</td>
                    <td>${binary ? subnet.address.binary["broadcast_address"] : ``}</td>
                </tr>
                <tr class="greyRow">
                    <td>first host</td>
                    <td>${subnet.address["first_assignable_host"]}</td>
                    <td>${binary ? subnet.address.binary["first_assignable_host"] : ``}</td>
                </tr>
                <tr>
                    <td>last host</td>
                    <td>${subnet.address["last_assignable_host"]}</td>
                    <td>${binary ? subnet.address.binary["last_assignable_host"] : ``}</td>
                </tr>
                <tr class="greyRow">
                    <td>subnet mask</td>
                    <td>${subnet.address["subnet_mask"]}</td>
                    <td>${binary ? subnet.address.binary["subnet_mask"] : ``}</td>
                </tr>
                <tr>
                    <td>wildcard mask</td>
                    <td>${subnet.address["wildcard_mask"]}</td>
                    <td>${binary ? subnet.address.binary["wildcard_mask"] : ``}</td>
                </tr>
            </table>
        </div>`;
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
