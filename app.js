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

        if (subnet.status == "error") {
            outputDiv.innerHTML += 
                `<div class='dataDisplayTable'>
                    <span>${subnet.error}</span>
                </div>`;
        } else if (subnet.status == "line") {
            outputDiv.innerHTML += `<hr>`;
        } else if (subnet.status == "ok") {
            let tableTemp = 
                `<div class='dataDisplayTable'>
                    <div class='tableTitle'>
                        <span>
                            CIDR: ${subnet.data.address["cidr_notation"]};
                        </span>
                        <span>
                            subnet bits: ${subnet.data.address["subnet_bits"]};
                        </span>
                        <span>
                            assignable hosts: ${subnet.data.address["assignable_hosts"]}
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
                            <td>${subnet.data.address["network_address"]}</td>
                            ${binary ? `<td>${subnet.data.address.binary["network_address"]}</td>` : ``}
                        </tr>
                        <tr>
                            <td>broadcast</td>
                            <td>${subnet.data.address["broadcast_address"]}</td>
                            ${binary ? `<td>${subnet.data.address.binary["broadcast_address"]}</td>` : ``}
                        </tr>
                        <tr class="greyRow">
                            <td>first host</td>
                            <td>${subnet.data.address["first_assignable_host"]}</td>
                            ${binary ? `<td>${subnet.data.address.binary["first_assignable_host"]}` : ``}</td>
                        </tr>
                        <tr>
                            <td>last host</td>
                            <td>${subnet.data.address["last_assignable_host"]}</td>
                            ${binary ? `<td>${subnet.data.address.binary["last_assignable_host"]}</td>` : ``}
                        </tr>
                        <tr class="greyRow">
                            <td>subnet mask</td>
                            <td>${subnet.data.address["subnet_mask"]}</td>
                            ${binary ? `<td>${subnet.data.address.binary["subnet_mask"]}</td>` : ``}
                        </tr>
                        <tr>
                            <td>wildcard mask</td>
                            <td>${subnet.data.address["wildcard_mask"]}</td>
                            ${binary ? `<td>${subnet.data.address.binary["wildcard_mask"]}</td>` : ``}
                        </tr>
                    </table>
                </div>`;
            outputDiv.innerHTML += tableTemp;
        } else {
            outputDiv += 
                `<div class='dataDisplayTable'>
                    <span>${subnet}</span>
                </div>`;
        }
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
        for (const line of raw.split("\n")) {
            //split masks
            var [start, ...masks] = line.trim().split("/");
            
            for (var i = 0; i < masks.length; i++) {
                const requestURL = baseURL + start + "/" + masks[i] + "?binary=true";

                var temp = await fetch(requestURL).then(
                    // parse the CORS proxy data
                    response => response.json()
                ).then(
                    // get the data
                    response => response.contents
                ).then(
                    // parse the final useful data
                    response => JSON.parse(response)
                );
                
                if (temp.status == "INVALID_ADDRESS") {
                    data.push({
                        status: "error",
                        error: `invalid address ${start + "/" + masks[i]}`
                    });
                } else if (temp.status == "OK") {
                    try {
                        // calculate the new network address based on the
                        // current broadcast address
                        brd = temp.address.broadcast_address.split(".");
                        brd[3] = Number.parseInt(brd[3]) + 1;

                        if (brd[3] > 255) {
                            brd[3] = 0;
                            brd[2] = Number.parseInt(brd[2]) + 1;

                            if (brd[2] > 255) {
                                brd[2] = 0;
                                brd[1] = Number.parseInt(brd[1]) + 1;

                                if (brd[1] > 255) {
                                    brd[1] = 0;
                                    brd[0] = Number.parseInt(brd[0]) + 1;

                                    if (brd[0] > 255) {
                                        data.push({
                                            status: "error",
                                            error:`invalid next address (${brd.join(".")})`
                                        });
                                    }
                                }
                            }
                        }

                        start = brd.join(".");
                        data.push({
                            status: "ok",
                            data: temp
                        });
                    } catch (ex) {
                        data.push(ex);
                    }
                } else {
                    data.push({
                        status: "error",
                        error: `invalid return code ${temp.toString}`
                    });
                }

                displayData(data);
            }
            data.push({status: "line"});
        }
    } else {
        outputDiv.innerHTML = "<h3>No input data</h3>";
    }
}
