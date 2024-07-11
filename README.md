# Lambda Save Data

## Build and deploy

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
