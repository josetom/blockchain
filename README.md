# Blockchain

Dummy block chain

## Creating docker image
```bash
docker build -t blockchain .
```

## Running the blockchain
```bash
docker run --rm -p 8600:8600 blockchain
docker run --rm -p 8601:8600 blockchain
docker run --rm -p 8602:8600 blockchain
```