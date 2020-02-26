'use strict';

const uuidv4    = require('uuid/v4');
const Aerospike = require('aerospike');
const _         = require('lodash/fp');
const config    = require('config');

class Anonymizer {

    constructor(options) {
        this.options = _.merge(config.aerospike)(options);
    }

    async init(aerospikeClient) {
        if (aerospikeClient) {
            this.aerospikeClient = aerospikeClient;
            return;
        }

        const policyDefaults    = {
            socketTimeout: 50,
            totalTimeout : 3000
        };
        const writePolicy = new Aerospike.policy.WritePolicy(_.merge(policyDefaults)({
            exists: Aerospike.policy.exists.CREATE,
        }));

        const config      = _.merge({
            policies: {
                read : new Aerospike.ReadPolicy(policyDefaults),
                write: writePolicy
            },
        })(this.options);

        this.aerospikeClient = await Aerospike.connect(config);
    }

    async anonymize(namespace, id, set = null, reverseLookupSet = null) {

        const idKey = new Aerospike.Key(namespace, set, id);

        const anonymizedId = uuidv4();
        try {
            const aerospikeValue = await this.aerospikeClient.get(idKey);
            return { anonymizedId: aerospikeValue.bins.anonymized_id, id };
        } catch (error) {
            if (error.code !== Aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
                console.log('Anonymizer#anonymize ERR - ', error);
                throw new Error(error);
            }
        }

        try {
            await this.aerospikeClient.put(idKey, { anonymized_id: anonymizedId });
        } catch (error) {
            if (error.code !== Aerospike.status.AEROSPIKE_ERR_RECORD_EXISTS) {
                console.log('Anonymizer#anonymize ERR - ', error);
                throw new Error(error);
            }
            const aerospikeValue = await this.aerospikeClient.get(idKey);
            return { anonymizedId: aerospikeValue.bins.anonymized_id, id };
        }

        try {
            const reverseLookupKey = new Aerospike.Key(namespace, reverseLookupSet, anonymizedId);
            await this.aerospikeClient.put(reverseLookupKey, { id });
            return { anonymizedId, id };
        } catch (error) {
            console.log('Anonymizer#anonymize ERR - ', error);
            throw new Error(error);
        }
    }

    close() {
        this.aerospikeClient.close();
    }

    async anonymizeMany(namespace, ids, set = null, reverseLookupSet = null) {
        try {
            const a = 3;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Anonymizer;
