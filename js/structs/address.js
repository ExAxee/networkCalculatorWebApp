export class address {
    addressMatcher = /^(\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.){3}\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])$/;

    static isValid (addr) {
        return address.addressMatcher.test(addr);
    }

    static to32bit (addr) {
        var addr = addr.split(".");

        for (var i = 0; i < addr.length; i++) {
            addr[i] = parseInt(addr[i]);
        }

        return (BigInt(addr[0]) << 24) + (BigInt(addr[1]) << 16) + (BigInt(addr[2]) << 8) + BigInt(addr[3]);
    }

    static from32bit (addr) {

    }
}