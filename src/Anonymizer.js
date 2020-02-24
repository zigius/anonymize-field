'use strict';

const uuidv4    = require('uuid/v4');
const Aerospike = require('aerospike');


class Anonymizer {
    constructor({ aerospikeClient } = {}) {
        this.aerospikeClient = aerospikeClient;
    }

    async anonymize(id) {

        const idKey          = new Aerospike.Key('test', 'demo', 'key1');
        const aerospikeValue = await this.aerospikeClient.get(idKey);
        if (aerospikeValue)
            return { anonymizedId: aerospikeValue.anonymized_id, id };
        let anonymizedId = uuidv4();
        try {
            await this.aerospikeClient.put(idKey, { anonymized_id: anonymizedId });
            return { anonymizedId, id };
        } catch (error) {
            if (error.code === Aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
                const aerospikeValue = await this.aerospikeClient.get(key);
                anonymizedId         = aerospikeValue.anonymized_id;
            } else {
                throw new Error(error);
                console.log('ERR - ', error, key);
            }
        }

        try {
            const anonymizedIdKey = new Aerospike.Key('test', 'demo', 'key1');
            await this.aerospikeClient.put(anonymizedIdKey, { id });
        } catch (error) {
            console.log('ERR - ', error, key);
        } finally {
            return { anonymizedId, id };
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

module.exports = Anonymizer;
