import { Address } from "/js/structs/address.js";

// CHOSEN API: https://networkcalc.com/api/docs
const baseURL = "https://networkcalc.com/api/ip/";

const addressInput = document.querySelector("#addressInput");
const submitBtn    = document.querySelector("#submitBtn");

const outputDiv    = document.querySelector("#calculatedData");

const guidedInput = {
    numberOfNets: document.querySelector("#guidedInputNumberOfNets"),
    startAddr:    document.querySelector("#guidedInputStartAddress"),
    mask:         document.querySelector("#guidedInputMask"),

    submitBtn: document.querySelector("#guidedInputSubmit"),
    resetBtn:  document.querySelector("#guidedInputReset"),
}

// switches
const binarySw = document.querySelector("#binarySw");

// add event listener
submitBtn.addEventListener("click", processData);
guidedInput.submitBtn.addEventListener("click", addDataInput);

// data holder
let data = [];

function displayData (data) {
    outputDiv.innerHTML = "";
    let swId = 0;
    // TODO  refactor table building using divs
    for (let i = 0; i < data.length; i++) {
        var subnet = data[i];
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
            document.querySelector("#dataControl").classList = [];

            let tableTemp = 
                `<div class='dataDisplayTable' id='data-${swId}'>
                    <div class='titleHolder'>
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
                        <div class='switchOption'>
                            <span>show data</span>
                            <input type='checkbox' name='dataSw' id='dataSw-${swId}' onchange='updateDataView(${swId})'/>
                        </div>
                    </div>
                    <table class='hidden'>
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
            swId++;
        } else {
            outputDiv += 
                `<div class='dataDisplayTable'>
                    <span>${subnet}</span>
                </div>`;
        }
    }
}

function expandAllData () {
    const switches = document.querySelectorAll('input[name=dataSw]')
    for (var i = 0; i < switches.length; i++) {
        switches[i].checked = true;
        updateDataView(i);
    }
}

function collapseAllData () {
    const switches = document.querySelectorAll('input[name=dataSw]')
    for (var i = 0; i < switches.length; i++) {
        switches[i].checked = false;
        updateDataView(i);
    }
}

function updateDataView (id) {
    if (document.querySelector(`#dataSw-${id}`).checked)
        document.querySelector(`#data-${id} table`).classList = [];
    else
        document.querySelector(`#data-${id} table`).classList = ["hidden"];
}

function addDataInput (event) {
    event.preventDefault();

    // retrieve data
    const numberOfNets = guidedInput.numberOfNets.value.trim();
    const startingNet  = guidedInput.startAddr.value.trim();
    const mask         = guidedInput.mask.value.trim();

    // define regex pattern for address checking
    //                  | ------------- byte 0 ------------- |    | ------------- byte 1 ------------- |    | ------------- byte 2 ------------- |    | ------------- byte 3 ------------- |
    const pattern = /^\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])$/;

    // check mask bit number input
    if (
        isNaN(mask) || !mask || mask <= 0 || mask > 32
    ) {
        guidedInput.mask.classList.add("inputError");
    } else {
        guidedInput.mask.classList.remove("inputError");
    }

    // check starting network input
    if (
        !pattern.test(startingNet)
    ) {
        guidedInput.startAddr.classList.add("inputError");
    } else {
        guidedInput.startAddr.classList.remove("inputError");
    }

    // check number of requested networks input
    if (
        isNaN(numberOfNets) || !numberOfNets
    ) {
        guidedInput.numberOfNets.classList.add("inputError");
    } else {
        guidedInput.numberOfNets.classList.remove("inputError");
    }

    var tempval = `${startingNet}/${mask}*${numberOfNets}\n`;
    console.log(startingNet)
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
                    // parse the final useful data
                    response => response.json()
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
