# anonymize-field

Use airflow distributed database to anonymize fields

## Running the tests

running unit tests: 
```
npm test
```

running integration tests: 
```
# deploy aerospike docker container

docker run -d --name aerospike -p 3000:3000 -p 3001:3001 -p 3002:3002 -p 3003:3003 aerospike
npm run test-integration
```

