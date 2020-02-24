'use strict';

const retry  = require('async-retry');
const uuidv4 = require('uuid/v4');
const Aerospike = require('aerospike');


class Anonymizer {
    constructor({ aerospikeClient } = {}) {
        this.aerospikeClient = aerospikeClient;
    }

    async anonymize(id) {
        const key = new Aerospike.Key('test', 'demo', 'key1');
        try {
            const anonymizedId = await retry(async bail => {
                const aerospikeValue = await this.aerospikeClient.get(key);
                if (aerospikeValue)
                    return aerospikeValue.new_id;
                const new_id = await this.aerospikeClient.get(key);

            });
            return { anonymizedId, id };
        } catch (error) {
            switch (error.code) {
                case Aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND:
                    console.log('NOT_FOUND -', key);
                    break;
                default:
                    console.log('ERR - ', error, key);
            }
        }
    }


    async anonymizeMany(ids) {
        try {
            const a = 3;
        } catch (error) {
            throw error;
        }
    }


}

//
// await retry(async bail => {
//   // if anything throws, we retry
//   const res = await fetch('https://google.com')
//
//   if (403 === res.status) {
//     // don't retry upon 403
//     bail(new Error('Unauthorized'))
//     return
//   }
//
//   const data = await res.text()
//   return data.substr(0, 500)
// }, {
//   retries: 5
// })

module.exports = Anonymizer;
