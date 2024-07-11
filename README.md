# AWS Lambda to Save Data on a Postgres Database

## How to run

1. Clone the repository:

```bash
git clone https://github.com/marcosparreiras/lambda-save-data-puc.git
```

2. Rename the `./save-data/.env.sample` file to `./save-data/.env` and fill in the required information.

3. Rename the `template.yaml.sample` file to `template.yaml` and fill in the `parameters defaults`.

4. CD into `save-data` folder and install the dependencies:

```bash
cd ./lambda-save-data-puc/save-date && npm install
```

5. Run the tests with:

```bash
docker compose up -d # To run postgres service

PGPASSWORD=admin psql -h localhost -p 5432 -U admin -d my_db # To conncet on postgres with psql
\i ./midas-ddl.sql # To create the needed tables
exit # To close the psql connection

npm run test # To run the tests
```

6. build and deploy

```bash
sam build
sam deploy --guided
```

## Invoke locally

```bash
sam local invoke NFSaveFunction --event events/event.json
```

## Delete

```bash
sam delete
```
