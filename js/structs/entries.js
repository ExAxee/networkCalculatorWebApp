import { EntryStructure } from "./entryStructure.js";

/**
 * Represents a single group of subnets
 */
export class EntryList {
    subnets = [];

    /**
     * Generates a list from the given Subnet(s)
     * @param {Subnet[]} subnetList The elements to add to the list
     */
    constructor (subnetList = []) {
        if (subnetList.length > 0) this.addEntries(subnetList);
    }

    /**
     * Adds a single subnet to the list
     * @param {Subnet} subnet The element to add to the list
     */
    addEntry (subnet) {
        if (!(subnet instanceof Subnet)) throw new Error(`invalid subnet: ${subnet}`);

        this.subnets.push(subnet);
    }

    /**
     * Adds all the given subnets to the list
     * @param {Subnet[]} subnetList The elements to add to the list
     */
    addEntries (subnetList) {
        for (let i = 0; i < subnetList.length; i++) {
            if (!(subnetList[i] instanceof Subnet)) throw new Error(`invalid subnet at index ${i}: ${subnetList[i]} in ${subnetList}`);

            this.subnets.push(subnetList[i]);
        }
    }
}

/**
 * Represents a group of informations in common with dotted decimal and binary
 */
export class AddressField {
    // masks data
    wildcardMask;
    subnetMask;

    // addresses
    firstAssignableHost;
    lastAssignableHost;
    broadcastAddress;
    networkAddress;
    cidr;

    /**
     * Constructs the information object
     * @param {String} wildcardMask The opposite of the subnet mask
     * @param {String} subnetMask The subnet mask of the network
     * @param {String} firstAssignableHost The first valid host address
     * @param {String} lastAssignableHost The last valid host address
     * @param {String} broadcastAddress The broadcast address
     * @param {String} networkAddress The net ID
     * @param {String} cidr The CIDR notation of the subnet e.g. '192.168.0.0/24'
     */
    constructor (
        wildcardMask,
        subnetMask,
        firstAssignableHost,
        lastAssignableHost,
        broadcastAddress,
        networkAddress,
        cidr
    ) {
        this.wildcardMask = wildcardMask;
        this.subnetMask   = subnetMask;
        
        this.firstAssignableHost = firstAssignableHost;
        this.lastAssignableHost  = lastAssignableHost;
        this.broadcastAddress    = broadcastAddress;
        this.networkAddress      = networkAddress;
        this.cidr                = cidr;
    }
}

/**
 * Represents a single subnet with his associated HTML table
 */
export class Subnet {
    HTMLDataStructure;

    assignableHosts;
    subnetMaskBits;
    
    numerical; // type AddressField
    binary;    // type AddressField

    /**
     * Checks and stores the new data, it also creates the associated HTML table
     * @param {AddressField} numericalFields All data related to the network expressed in dotted-decimal notation
     * @param {AddressField} binaryFields All data related to the network expressed in binary
     * @param {Number} mask The mask of the network
     */
    constructor (numericalFields, binaryFields, mask) {
        if (!(numericalFields instanceof AddressField))  throw new Error(`invalid numerical field ${numericalFields}`);
        if (!(binaryFields    instanceof AddressField))  throw new Error(`invalid binary field ${binaryFields}`);
        if (!mask | isNaN(mask) | mask > 32 | mask <= 0) throw new Error(`invalid mask input: ${mask}`);

        this.subnetMaskBits  = mask;
        this.assignableHosts = Math.pow(2, 32 - mask) - 2;
        
        this.numerical = numericalFields;
        this.binary    = binaryFields;

        this.HTMLDataStructure = new EntryStructure(
            this.numerical,
            this.binary,
            mask,
            this.assignableHosts
        );
    }
}
