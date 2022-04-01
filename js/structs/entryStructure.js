import { AddressField } from "./entries.js";

/**
 * Represents the HTML table associated with a Subnet
 */
export class EntryStructure {
    // html structure of the table
    html;
    _table;

    // buttons saved
    _showDataSw;
    _showDataBinSw;
    
    // args
    assignableHosts;
    numericalFields;
    binaryFields;
    mask;

    // data slots saved to be easier to change
    _binaryDataSlots = {
        title: null,
        netID: null,
        brd: null,
        firstH: null,
        lastH: null,
        subnetMask: null,
        wildcardMask: null
    };

    /**
     * 
     * @param {AddressField} numericalFields All data related to the network expressed in dotted-decimal notation
     * @param {AddressField} binaryFields All data related to the network expressed in binary
     * @param {Number} mask The mask of the network
     * @param {Number} assignableHosts The number of hosts that can coexist
     * @returns The HTML table that represents this data
     */
    constructor (numericalFields, binaryFields, mask, assignableHosts) {
        if (!(numericalFields instanceof AddressField))  throw new Error(`invalid numerical field ${numericalFields}`);
        if (!(binaryFields    instanceof AddressField))  throw new Error(`invalid binary field ${binaryFields}`);
        if (!mask | isNaN(mask) | mask > 32 | mask <= 0) throw new Error(`invalid mask input: ${mask}`);

        this.assignableHosts = assignableHosts;
        this.numericalFields = numericalFields;
        this.binaryFields = binaryFields;
        this.mask = mask;

        this.html = document.createElement('div');
        this.html.classList.add('dataDisplayTable');

        // ########## TABLE TITLE BUILDING ##########
        let mainTitleDiv = document.createElement('div');
        mainTitleDiv.classList.add('titleHolder');

        let tableTitle = document.createElement('div');
        tableTitle.classList.add('tableTitle');
        tableTitle.innerHTML = 
            `<span>
                CIDR: ${this.numericalFields.cidr};
            </span>
            <span>
                subnet bits: ${this.mask};
            </span>
            <span>
                assignable hosts: ${this.assignableHosts};
            </span>`;

        // SW BUTTONS HOLDER
        let switchOption = document.createElement('div');
        switchOption.classList.add('switchOption');

        // DATA SW BUTTON
        let dataSwSpan = document.createElement('span');
        dataSwSpan.innerText = 'show data';

        this._showDataSw = document.createElement('input');
        this._showDataSw.type = 'checkbox';
        this._showDataSw.name = 'dataSw';
        this._showDataSw.addEventListener('change', () => {this.switchDataShow()}, );

        // BINARY SW BUTTON
        let binSwSpan = document.createElement('span');
        binSwSpan.innerText = 'show binary';

        this._showDataBinSw = document.createElement('input');
        this._showDataBinSw.type = 'checkbox';
        this._showDataBinSw.name = 'binSw';
        this._showDataBinSw.addEventListener('change', () => {this.switchBinShow()});

        switchOption.appendChild(dataSwSpan);
        switchOption.appendChild(this._showDataSw);

        switchOption.appendChild(binSwSpan);
        switchOption.appendChild(this._showDataBinSw);

        mainTitleDiv.appendChild(tableTitle);
        mainTitleDiv.appendChild(switchOption);

        // ########## TABLE DATA BUILDING ##########
        this._table = document.createElement('table');
        this._table.classList.add('hidden');

        let titleRow = document.createElement('tr');
        let netIDRow = document.createElement('tr');
        netIDRow.classList.add('greyRow');
        let brdRow = document.createElement('tr');
        let firstHRow = document.createElement('tr');
        firstHRow.classList.add('greyRow');
        let lastHRow = document.createElement('tr');
        let subnetMaskRow = document.createElement('tr');
        subnetMaskRow.classList.add('greyRow');
        let wildcardMaskRow = document.createElement('tr');

        titleRow.innerHTML = 
            `<th>DATA</th>
            <th>DOTTED DECIMAL</th>`;
        this._binaryDataSlots.title = document.createElement('th');
        this._binaryDataSlots.title.innerText = `BINARY`;
        this._binaryDataSlots.title.classList.add('hidden');
        titleRow.appendChild(this._binaryDataSlots.title);

        netIDRow.innerHTML =
            `<td>network address</td>
            <td>${this.numericalFields.networkAddress}</td>`;
        this._binaryDataSlots.netID = document.createElement('td');
        this._binaryDataSlots.netID.innerText = `${this.binaryFields.networkAddress}`;
        this._binaryDataSlots.netID.classList.add('hidden');
        netIDRow.appendChild(this._binaryDataSlots.netID);

        brdRow.innerHTML = 
            `<td>broadcast</td>
            <td>${this.numericalFields.broadcastAddress}</td>`;
        this._binaryDataSlots.brd = document.createElement('td');
        this._binaryDataSlots.brd.innerText = `${this.binaryFields.broadcastAddress}`;
        this._binaryDataSlots.brd.classList.add('hidden');
        brdRow.appendChild(this._binaryDataSlots.brd);

        firstHRow.innerHTML =
            `<td>first host</td>
            <td>${this.numericalFields.firstAssignableHost}</td>`;
        this._binaryDataSlots.firstH = document.createElement('td');
        this._binaryDataSlots.firstH.innerText = `${this.binaryFields.firstAssignableHost}`;
        this._binaryDataSlots.firstH.classList.add('hidden');
        firstHRow.appendChild(this._binaryDataSlots.firstH);

        lastHRow.innerHTML =
            `<td>last host</td>
            <td>${this.numericalFields.lastAssignableHost}</td>`;
        this._binaryDataSlots.lastH = document.createElement('td');
        this._binaryDataSlots.lastH.innerText = `${this.binaryFields.lastAssignableHost}`;
        this._binaryDataSlots.lastH.classList.add('hidden');
        lastHRow.appendChild(this._binaryDataSlots.lastH);

        subnetMaskRow.innerHTML =
            `<td>subnet mask</td>
            <td>${this.numericalFields.subnetMask}</td>`;
        this._binaryDataSlots.subnetMask = document.createElement('td');
        this._binaryDataSlots.subnetMask.innerText = `${this.binaryFields.subnetMask}`;
        this._binaryDataSlots.subnetMask.classList.add('hidden');
        subnetMaskRow.appendChild(this._binaryDataSlots.subnetMask);

        wildcardMaskRow.innerHTML =
            `<td>wildcard mask</td>
            <td>${this.numericalFields.wildcardMask}</td>`;
        this._binaryDataSlots.wildcardMask = document.createElement('td');
        this._binaryDataSlots.wildcardMask.innerText = `${this.binaryFields.wildcardMask}`;
        this._binaryDataSlots.wildcardMask.classList.add('hidden');
        wildcardMaskRow.appendChild(this._binaryDataSlots.wildcardMask);

        this._table.appendChild(titleRow);
        this._table.appendChild(netIDRow);
        this._table.appendChild(brdRow);
        this._table.appendChild(firstHRow);
        this._table.appendChild(lastHRow);
        this._table.appendChild(subnetMaskRow);
        this._table.appendChild(wildcardMaskRow);
        
        this.html.appendChild(mainTitleDiv);
        this.html.appendChild(this._table);
        return this.html;
    }

    /**
     * Toggles the visibility of the main table
     */
    switchDataShow () {
        if (this._showDataSw.checked) {
            this._table.classList.remove('hidden');
        } else {
            this._table.classList.add('hidden');
        }
    }
    
    /**
     * Toggles the visibility of binary data
     */
    switchBinShow () {
        if (this._showDataBinSw.checked) {
            for (const item in this._binaryDataSlots) {
                this._binaryDataSlots[item].classList.remove('hidden');
            }
        } else {
            for (const item in this._binaryDataSlots) {
                this._binaryDataSlots[item].classList.add('hidden');
            }
        }
    }
}