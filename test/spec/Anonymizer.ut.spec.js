'use strict';

const Anonymizer = require('../../src/Anonymizer');
const aerospike  = require('aerospike');
const _          = require('lodash/fp');
const uuidv4     = require('uuid/v4');
jest.mock('uuid/v4');

const originalUuidv4 = jest.requireActual('uuid/v4');

describe('Anonymizer', function () {
    describe('Test anonymization properly configureds client', () => {
        test('anonymize - id does not exist in aerospike but then another client inserts it - should return saved anonymized id',
            async () => {
                try {

                    const aerospikeGetResult = {
                        bins: { anonymized_id: '1234' }
                    };

                    const aerospikeMock = {
                        get: jest.fn()
                            .mockRejectedValueOnce({ message: 'message bul', name: 'errorrr', code: 2 })
                            .mockResolvedValue(aerospikeGetResult),
                        put: jest.fn().mockRejectedValueOnce(
                            { message: 'message bul', name: 'errorrr', code: aerospike.status.AEROSPIKE_ERR_RECORD_EXISTS }),
                    };

                    const anonymizer          = new Anonymizer(aerospikeMock);
                    const id                  = originalUuidv4();
                    const anonymizationResult = await anonymizer.anonymize('process.env.NAMESPACE', id);
                    expect(anonymizationResult.anonymizedId).toEqual(aerospikeGetResult.bins.anonymized_id);
                } catch (error) {
                    expect(error.code).toEqual('ERR_INVALID_URL');
                }
            });

        test('anonymize - id does not exist in aerospike but then another client inserts it - should return saved anonymized id',
            async () => {
                try {

                    const aerospikeGetResult = {
                        bins: { anonymized_id: '1234' }
                    };

                    const aerospikeMock = {
                        get: jest.fn()
                            .mockRejectedValueOnce({ message: 'message bul', name: 'errorrr', code: 2 })
                            .mockResolvedValue(aerospikeGetResult),
                        put: jest.fn().mockRejectedValueOnce(
                            { message: 'message bul', name: 'errorrr', code: aerospike.status.AEROSPIKE_ERR_RECORD_EXISTS }),
                    };

                    const anonymizer          = new Anonymizer(aerospikeMock);
                    const id                  = originalUuidv4();
                    const anonymizationResult = await anonymizer.anonymize('process.env.NAMESPACE', id);
                    expect(anonymizationResult.anonymizedId).toEqual(aerospikeGetResult.bins.anonymized_id);
                } catch (error) {
                    expect(error.code).toEqual('ERR_INVALID_URL');
                }
            });
    });
});
