'use strict';

const Aerospike = require('aerospike')

class Anonymizer {
    constructor({ aerospikeClient } = {}) {
        this.aerospikeClient = aerospikeClient;
    }

    async anonymize(field) {
        try {
            const a      = 3;
        } catch (error) {
            throw error;
        }
    }


    async anonymizeMany(fields) {
        try {
            const a      = 3;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = Anonymizer;
