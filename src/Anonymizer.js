'use strict';

const Aerospike = require('aerospike');

class Anonymizer {
    constructor({ aerospikeClient } = {}) {
        this.aerospikeClient = aerospikeClient;
    }

    async anonymize(field) {
        try {
            this.aerospikeClient.get(key, function (error, record) {
                if (error) {
                    switch (error.code) {
                        case Aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND:
                            console.log('NOT_FOUND -', key);
                            break;
                        default:
                            console.log('ERR - ', error, key);
                    }
                } else {
                    console.log('OK - ', record);
                }
            }
        } catch (error) {
            throw error;
        }
    }


    async anonymizeMany(fields) {
        try {
            const a = 3;
        } catch (error) {
            throw error;
        }
    }


}

module.exports = Anonymizer;
