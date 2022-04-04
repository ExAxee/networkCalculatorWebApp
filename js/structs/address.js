import { OverflowError } from './exceptions.js';

/**
 * Class grouping all useful address-related methods
 */
export class Address {
    // regex pattern to validate ipv4 addresses
    static addressMatcher = /^(\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.){3}\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])$/;

    /**
     * Checks if the given address is a valid IPv4 address
     * @param {String} addr Address to check
     * @returns If the address is valid or not
     */
    static isValid (addr) {
        return Address.addressMatcher.test(addr);
    }

    /**
     * Checks if the given address is a valid IPv4 address AND a valid net-ID for the given mask
     * @param {String} addr Address to check
     * @param {Number} mask The mask of the address
     * @returns If the address is a net-ID or not
     */
    static isNetID (addr, mask) {
        if (!Address.isValid(addr)) throw new Error(`invalid address input: ${addr} is not a valid dotted-decimal address`);
        if (!mask | isNaN(mask) | mask > 32 | mask <= 0) throw new Error(`invalid mask input: ${mask}`);

        return 0 == (Address.dtob(addr) & BigInt(Math.pow(2, 32 - mask) - 1));
    }

    /**
     * Calculates the net ID that contains the given address
     * @param {String} addr The address from where to calculate the net ID
     * @param {Number} mask The mask used to calculate the net ID
     * @returns The net ID in which the given address is
     */
    static getNetID (addr, mask) {
        if (!Address.isValid(addr)) throw new Error(`invalid address input: ${addr} is not a valid dotted-decimal address`);
        if (!mask | isNaN(mask) | mask > 32 | mask <= 0) throw new Error(`invalid mask input: ${mask}`);

        return Address.btod(Address.dtob(addr) & (BigInt(Math.pow(2, mask) - 1) << BigInt(32 - mask)));
    }

    /**
     * Calculates the next net-ID starting from the given address
     * @param {String} addr The starting address
     * @param {Number} mask The mask of the given address
     * @param {Boolean} getInBigInt Get the result as BigInt (if true) or as a String (if false or not passed as an argument)
     * @returns The next net-ID based on the given address
     */
    static calculateNextNetID (addr, mask, getInBigInt = false) {
        if (!Address.isNetID(addr, mask)) throw new Error(`invalid address input: ${addr}/${mask} is not a valid netID`);

        var baddr = Address.dtob(addr);
        var nextID = baddr + BigInt( Math.pow(2, 32 - mask) );

        // overflow has occurred
        if (nextID > Address.dtob("255.255.255.255")) throw new OverflowError("next network ID has overflowed");

        return getInBigInt ? nextID : Address.btod(nextID);
    }

    // Dotted TO BigInt
    /**
     * Converts a dotted-decimal address to a BigInt number
     * @param {String} addr The address to convert
     * @returns The BigInt representation of the address
     */
    static dtob (addr) {
        if (!Address.isValid(addr)) throw new Error(`invalid address input: ${addr} is not a valid dotted-decimal address`);
        var addr = addr.split(".");

        for (var i = 0; i < addr.length; i++) {
            addr[i] = parseInt(addr[i]);
        }

        return (BigInt(addr[0]) << 24n) + (BigInt(addr[1]) << 16n) + (BigInt(addr[2]) << 8n) + BigInt(addr[3]);
    }

    // BigInt TO Dotted
    /**
     * Converts a BigInt number to a String representing the dotted-decimal address
     * @param {BigInt} addr The number representing the address to convert back to String
     * @returns The String representing the given address number
     */
    static btod (addr) {
        if (!(typeof addr === "bigint")) throw new Error(`invalid input ${addr.toString()}`);

        return `${(addr >> 24n) & 0xffn}.${(addr >> 16n) & 0xffn}.${(addr >> 8n) & 0xffn}.${(addr) & 0xffn}`;
    }
}