import { Address } from "./structs/address.js";
import { AddressField, EntryList, Subnet } from "./structs/entries.js";

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

// pattern for cidr + number of nets matcher
const inputMatcher = /^((?:\b(?:[01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.){3}\b(?:[01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5]))\/([0-2][0-9]?|3[0-2])(?:\*([0-9]+))?$/;

// after initializing attach used functions to main window
window.displayData     = displayData;
window.expandAllData   = expandAllData;
window.collapseAllData = collapseAllData;
window.addDataInput    = addDataInput;
window.processData     = processData;

/**
 * Displays the data entered into the main output container
 * @param {EntryList[]} data The data to display
 */
function displayData (data) {
    outputDiv.innerHTML = "";

    if (!(data instanceof Array)) throw new Error(`invalid data structure: ${data}`);
    
    // make expand/collapse button appear
    document.querySelector("#dataControl").classList = [];
    for (const entryGroup of data) {
        for (const subnet of entryGroup.subnets) {
            outputDiv.appendChild(subnet.HTMLDataStructure);
        }
        outputDiv.appendChild(document.createElement('hr'));
    }
}

/**
 * Expands all subnets tables
 */
function expandAllData () {
    const switches = document.querySelectorAll('input[name=dataSw]')
    for (var i = 0; i < switches.length; i++) {
        switches[i].checked = true;
        switches[i].dispatchEvent(new Event('change'));
    }
}

/**
 * Collapses all subnets tables
 */
function collapseAllData () {
    const switches = document.querySelectorAll('input[name=dataSw]')
    for (var i = 0; i < switches.length; i++) {
        switches[i].checked = false;
        switches[i].dispatchEvent(new Event('change'));
    }
}

/**
 * Checks and adds the inserted guided input values
 * @param {*} event 
 */
function addDataInput (event) {
    event.preventDefault();
    let valid = true;

    // retrieve data
    const numberOfNets = guidedInput.numberOfNets.value.trim();
    const startingNet  = guidedInput.startAddr.value.trim();
    const mask         = guidedInput.mask.value.trim();

    // check mask bit number input
    if (
        isNaN(mask) || !mask || mask <= 0 || mask > 32
    ) {
        guidedInput.mask.classList.add("inputError");
        valid = false;
    } else {
        guidedInput.mask.classList.remove("inputError");
    }

    // check starting network input
    if (
        !Address.isNetID(startingNet, mask) // don't check if address is valid because Address.isNetID checks it
    ) {
        valid = false;
        guidedInput.startAddr.classList.add("inputError");
    } else {
        guidedInput.startAddr.classList.remove("inputError");
    }

    // check number of requested networks input
    if (
        isNaN(numberOfNets) || !numberOfNets
    ) {
        valid = false;
        guidedInput.numberOfNets.classList.add("inputError");
    } else {
        guidedInput.numberOfNets.classList.remove("inputError");
    }

    if (valid) addressInput.value += `${startingNet}/${mask}*${numberOfNets}\n`;
} 

/**
 * Generate a list of addresses to be put into the URL
 * @param {String} start Starting net ID
 * @param {Number} mask Mask of the starting net ID
 * @param {Number} desiredNets Number of desired networks
 * @returns A string with all the networks concatenated
 */
function generateURL(start, mask, desiredNets) {
    let next = Address.calculateNextNetID(start, mask);
    if (desiredNets > 1) {
        return `${start}/${mask},${generateURL(next, mask, desiredNets - 1)}`;
    } else {
        return `${start}/${mask}`;
    }
}

/**
 * Checks, processes and fetches the data from the API 
 * @param {*} event 
 */
async function processData (event) {
    event.preventDefault();
    outputDiv.innerHTML = "";

    if (addressInput.value.trim() != "") {
        let data = [];

        // cycle through subnet entries
        for (const line of addressInput.value.trim().split("\n")) {

            if (!(inputMatcher.test(line))) {
                outputDiv.innerHTML = `<h3>invalid input: '${line}'</h3>`;
                return;
            }

            let [_, start, mask, num] = inputMatcher.exec(line);
            let response;
            try {
                response = await fetch(`${baseURL}${generateURL(start, mask, num)}?binary=true`).then(res => res.json());
            } catch (ex) {
                outputDiv.innerHTML = ex;
                return;
            }

            let entryList = new EntryList();
            if (response.address instanceof Array) {
                for (const subnet of response.address) {
                    entryList.addEntry(
                        new Subnet(
                            new AddressField(
                                subnet.wildcard_mask,
                                subnet.subnet_mask,
                                subnet.first_assignable_host,
                                subnet.last_assignable_host,
                                subnet.broadcast_address,
                                subnet.network_address,
                                subnet.cidr_notation 
                            ),
                            new AddressField(
                                subnet.binary.wildcard_mask,
                                subnet.binary.subnet_mask,
                                subnet.binary.first_assignable_host,
                                subnet.binary.last_assignable_host,
                                subnet.binary.broadcast_address,
                                subnet.binary.network_address,
                                null
                            ),
                            subnet.subnet_bits
                        )
                    );
                }
            } else {
                entryList.addEntry(
                    new Subnet(
                        new AddressField(
                            response.address.wildcard_mask,
                            response.address.subnet_mask,
                            response.address.first_assignable_host,
                            response.address.last_assignable_host,
                            response.address.broadcast_address,
                            response.address.network_address,
                            response.address.cidr_notation 
                        ),
                        new AddressField(
                            response.address.binary.wildcard_mask,
                            response.address.binary.subnet_mask,
                            response.address.binary.first_assignable_host,
                            response.address.binary.last_assignable_host,
                            response.address.binary.broadcast_address,
                            response.address.binary.network_address,
                            null
                        ),
                        response.address.subnet_bits
                    )
                );
            }
            data.push(entryList);
        }

        displayData(data);
    } else {
        outputDiv.innerHTML = "<h3>No input data</h3>";
    }
}
