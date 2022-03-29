export class Address {
    static addressMatcher = /^(\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.){3}\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])$/;

    static isValid (addr) {
        return Address.addressMatcher.test(addr);
    }

    // Dotted TO Binary
    static dtob (addr) {
        if (!Address.isValid(addr)) throw new Error(`invalid address input: ${addr} is not a valid dotted-decimal address`);
        var addr = addr.split(".");

        for (var i = 0; i < addr.length; i++) {
            addr[i] = parseInt(addr[i]);
        }

        return (BigInt(addr[0]) << 24n) + (BigInt(addr[1]) << 16n) + (BigInt(addr[2]) << 8n) + BigInt(addr[3]);
    }

    // Binary TO Dotted
    static btod (addr) {
        if (!(typeof addr === "bigint")) throw new Error(`invalid input ${addr.toString()}`);

        return `${(addr >> 24n) & 0xffn}.${(addr >> 16n) & 0xffn}.${(addr >> 8n) & 0xffn}.${(addr) & 0xffn}`;
    }
}