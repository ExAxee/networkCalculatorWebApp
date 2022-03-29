import { OverflowError } from './exceptions.js';

export class Address {
    static addressMatcher = /^(\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.){3}\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])$/;

    static isValid (addr) {
        return Address.addressMatcher.test(addr);
    }

    static isNetID (addr, mask) {
        if (!Address.isValid(addr)) throw new Error(`invalid address input: ${addr} is not a valid dotted-decimal address`);
        if (!mask | isNaN(mask) | mask > 32 | mask <= 0) throw new Error(`invalid mask input: ${mask}`);

        return 0 == (Address.dtob(addr) & BigInt(Math.pow(2, 32 - mask) - 1));
    }

    static calculateNextNetID (addr, mask, getInBigInt = false) {
        if (!Address.isNetID(addr, mask)) throw new Error(`invalid address input: ${addr}/${mask} is not a valid netID`);

        var baddr = Address.dtob(addr);
        var nextID = baddr + BigInt( Math.pow(2, 32 - mask) );

        console.log(baddr);
        console.log(nextID);

        // overflow has occurred
        if (nextID > Address.dtob("255.255.255.255")) throw new OverflowError("next network ID has overflowed");

        return getInBigInt ? nextID : Address.btod(nextID);
    }

    // Dotted TO BigInt
    static dtob (addr) {
        if (!Address.isValid(addr)) throw new Error(`invalid address input: ${addr} is not a valid dotted-decimal address`);
        var addr = addr.split(".");

        for (var i = 0; i < addr.length; i++) {
            addr[i] = parseInt(addr[i]);
        }

        return (BigInt(addr[0]) << 24n) + (BigInt(addr[1]) << 16n) + (BigInt(addr[2]) << 8n) + BigInt(addr[3]);
    }

    // BigInt TO Dotted
    static btod (addr) {
        if (!(typeof addr === "bigint")) throw new Error(`invalid input ${addr.toString()}`);

        return `${(addr >> 24n) & 0xffn}.${(addr >> 16n) & 0xffn}.${(addr >> 8n) & 0xffn}.${(addr) & 0xffn}`;
    }
}