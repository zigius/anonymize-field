'use strict';

const Anonymizer = require('../../src/Anonymizer');
const Aerospike  = require('aerospike');
const _          = require('lodash/fp');
const uuidv4     = require('uuid/v4');
jest.mock('uuid/v4');


describe('Anonymizer', function () {
    const mockUuid = '4136281F-324E-4DAF-BDB0-A6E25441E90E';
    uuidv4.mockImplementation(() => mockUuid);
    describe('Test anonymization properly configureds client', () => {

        let defaults    = {
            socketTimeout: 50,
            totalTimeout : 3000
        };
        let writePolicy = new Aerospike.policy.WritePolicy(_.merge(defaults)({
            exists: Aerospike.policy.exists.CREATE,
        }));
        let config      = {
            policies: {
                read : new Aerospike.ReadPolicy(defaults),
                write: writePolicy
            }
        };
        // const config = {
        //     // hosts   : ['localhost:3000'],
        //     policies: {
        //         timeout: 3000,  // milliseconds,
        //         time   : { exists: Aerospike.POLICY_EXISTS_CREATE }
        //     },
        // };

        test('anonymize - id exists in aerospike - should return saved anonymized id', async () => {
            try {

                const aerospikeClient     = await Aerospike.connect(config);
                const anonymizer          = new Anonymizer({ aerospikeClient });
                const anonymizationResult = await anonymizer.anonymize(process.env.NAMESPACE, '123');
                expect(anonymizationResult.anonymizedId).toEqual(mockUuid);
            } catch (error) {
                expect(error.code).toEqual('ERR_INVALID_URL');
            }
        });
    });
});
