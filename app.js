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

// data holder
let data = [];

function displayData (data) {
    outputDiv.innerHTML = "";
    // TODO  refactor table building using divs
    for (let subnet of data) {
        //const binary = subnet.address.hasOwnProperty("binary");
        const binary = binarySw.checked;

        // table has always 3 + 2 columns (2 for the vertical lines)
        let tableTemp = `
        <div class='dataDisplayTable'>
            <div class='tableTitle'>
                <span>
                    CIDR: ${subnet.address["cidr_notation"]};
                </span>
                <span>
                    subnet bits: ${subnet.address["subnet_bits"]};
                </span>
                <span>
                    assignable hosts: ${subnet.address["assignable_hosts"]}
                </span>
            </div>
            <table>
                <tr>
                    <th>DATA</th>
                    <th>DOTTED DECIMAL</th>
                    ${binary ? `<th>BINARY</th>` : ``}
                </tr>
                <tr class="greyRow">
                    <td>network address</td>
                    <td>${subnet.address["network_address"]}</td>
                    ${binary ? `<td>${subnet.address.binary["network_address"]}</td>` : ``}
                </tr>
                <tr>
                    <td>broadcast</td>
                    <td>${subnet.address["broadcast_address"]}</td>
                    ${binary ? `<td>${subnet.address.binary["broadcast_address"]}</td>` : ``}
                </tr>
                <tr class="greyRow">
                    <td>first host</td>
                    <td>${subnet.address["first_assignable_host"]}</td>
                    ${binary ? `<td>${subnet.address.binary["first_assignable_host"]}` : ``}</td>
                </tr>
                <tr>
                    <td>last host</td>
                    <td>${subnet.address["last_assignable_host"]}</td>
                    ${binary ? `<td>${subnet.address.binary["last_assignable_host"]}</td>` : ``}
                </tr>
                <tr class="greyRow">
                    <td>subnet mask</td>
                    <td>${subnet.address["subnet_mask"]}</td>
                    ${binary ? `<td>${subnet.address.binary["subnet_mask"]}</td>` : ``}
                </tr>
                <tr>
                    <td>wildcard mask</td>
                    <td>${subnet.address["wildcard_mask"]}</td>
                    ${binary ? `<td>${subnet.address.binary["wildcard_mask"]}</td>` : ``}
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
                        baseURL + start + "/" + mask + "?binary=true"
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
