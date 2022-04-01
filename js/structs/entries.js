import { EntryStructure } from "./entryStructure.js";

export class EntryList {
    subnets = [];

    constructor (subnetList = []) {
        for (let i = 0; i < subnetList.length; i++) {
            if (!(subnetList[i] instanceof Subnet)) throw new Error(`invalid subnet at index ${i}: ${subnetList[i]} in ${subnetList}`);

            this.subnets.push(subnetList[i]);
        }
    }

    addEntry (subnet) {
        if (!(subnet instanceof Subnet)) throw new Error(`invalid subnet: ${subnet}`);

        this.subnets.push(subnet);
    }
}

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

export class Subnet {
    HTMLDataStructure;

    assignableHosts;
    subnetMaskBits;
    
    numerical; // type AddressField
    binary;    // type AddressField

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
