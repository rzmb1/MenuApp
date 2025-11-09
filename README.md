# MenuApp

## Getting started - Run from Source

1. git clone https://gitlab.com/htl-villach/informatik/2023-5ahif/syp-bsd/TeamA.git
1. cd TeamA
1. npm install
1. cd _clients/react-client
1. npm install
1. npm run build
1. cd ../..
1. npm test
1. npm run fillDemoData
1. npm start
1. open browser - http://localhost:8080

## Install and Run

Requires docker.

```sh
# start db
docker run --name mongo-prod -p 27017:27017 mongo

# login in to container registry via user htldevzone and given passwort
docker login htldevzone.azurecr.io -u htldevzone -p {password}

# optional: to fill database as well use:
# database-address: the ip-address or dns of the device, that is running the database
# for windows a database running on localhost is identified by: host.docker.internal
docker run -it --rm --name=backend-instance -p 8080:8080 --entrypoint=npm -e MONGODB_CONNECTION_STRING=mongodb://{database-address}/kantine2022 htldevzone.azurecr.io/5ahif/team-a/backend:{version} run fill-demo-data

# run backend
# database-address: the ip-address or dns of the device, that is running the database
# for windows a database running on localhost is identified by: host.docker.internal
docker run -it --rm --name=backend-instance -p 8080:8080 -e MONGODB_CONNECTION_STRING=mongodb://{database-address}/kantine2022 htldevzone.azurecr.io/5ahif/team-a/backend:{version}
```

## Build from Source

```sh
# build directly with proper name
docker build -t htldevzone.azurecr.io/5ahif/team-a/backend:{version} .

# login via user htldevzone and given passwort
docker login htldevzone.azurecr.io -u htldevzone -p {password}

# push to registry
docker push htldevzone.azurecr.io/5ahif/team-a/backend:{version}

```

## Deploy to Kubernetes

### Einrichtung Namespace

Achtung: Unter Windows sollten die Kommandos in der Eingabeaufforderung und nicht in der Powershell ausgeführt werden.

```shell
# set context
kubectl config use-context <k8s-aks/docker-desktop>

# create new namespace
kubectl create namespace kantine-a

# set default namespace for subsequent commands
kubectl config set-context --current --namespace=kantine-a

# create secret containing ACR credentials
kubectl create secret docker-registry htldevzone-credentials --docker-server=htldevzone.azurecr.io --docker-username=htldevzone --docker-password="SNIP"

# patch service account to use ACR credentials
kubectl patch serviceaccount default -p "{\"imagePullSecrets\": [{\"name\": \"htldevzone-credentials\"}]}"
```

### Konfiguration Deployment

Anpassung der Version für das Backend in `02a-app-deployment.yml` und  `02b-app-filldemodata.yml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-worker-pool
spec:
...
      containers:
      - name: backend
        image: htldevzone.azurecr.io/5ahif/team-a/backend:main
```

Bei lokalem deployment: Anpassung des `host` in `02a-app-deployment.yml`

```yaml
spec:
  rules:
  # for local deployments use 
  - host: kantine-a.k8s-local.htl-dev.zone
  # for cloud deployments use
  # - host: kantine-a.k8s.htl-dev.zone
```  

### Eigentliches Deployment

```shell
# for local deployment: start nginx
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.6.4/deploy/static/provider/cloud/deploy.yaml

# deploy mongo, backend, service + ingress
kubectl apply -f 02a-app-deployment.yml

# wait until deployment is settled
kubectl get all,ingress

# optionally, run the job to fill demo data
# Attention: image + env needs to be adjusted
kubectl apply -f 02b-app-filldemodata.yml
```

### Cleanup

```shell
kubectl delete all,ingress -n kantine-a --all 
kubectl delete namespace kantine-a
```
