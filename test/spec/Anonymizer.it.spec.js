'use strict';

const Anonymizer = require('../../src/Anonymizer');
const Aerospike  = require('aerospike');
const _          = require('lodash/fp');
const uuidv4     = require('uuid/v4');
jest.mock('uuid/v4');
const originalUuidv4 = jest.requireActual('uuid/v4');

describe('Anonymizer', function () {
    describe('Test anonymization properly configureds client', () => {

        test('anonymize - id exists in aerospike - should return saved anonymized id',
            async (done) => {

                const aerospikeClient = await Aerospike.connect();
                const id              = originalUuidv4();
                const anonymizedId    = originalUuidv4();
                const idKey           = new Aerospike.Key(process.env.NAMESPACE, null, id);
                await aerospikeClient.put(idKey, { anonymized_id: anonymizedId });

                const anonymizer = new Anonymizer();
                await anonymizer.init();
                const anonymizationResult = await anonymizer.anonymize(process.env.NAMESPACE, id);
                expect(anonymizationResult.anonymizedId).toEqual(anonymizedId);
                anonymizer.close();
                aerospikeClient.close();
                done();
            });

        test('anonymize - id does not exist in aerospike - should return mocked anonymized id and save reverse id in aerospike',
            async (done) => {

                const aerospikeClient = await Aerospike.connect();
                const id              = originalUuidv4();
                await Aerospike.connect();

                const mockUuid = originalUuidv4();
                uuidv4.mockImplementation(() => mockUuid);

                const anonymizer = new Anonymizer();
                await anonymizer.init();
                const anonymizationResult = await anonymizer.anonymize(process.env.NAMESPACE, id);
                expect(anonymizationResult.anonymizedId).toEqual(mockUuid);
                const reverseKey         = new Aerospike.Key(process.env.NAMESPACE, null, mockUuid);
                const aerospikeGetResult = await aerospikeClient.get(reverseKey);
                expect(aerospikeGetResult.bins.id).toEqual(id);
                aerospikeClient.close();
                anonymizer.close();
                done();
            });
    });
});
