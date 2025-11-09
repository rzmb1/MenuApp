# Kubernetes

## Befehle

```sh
#check if kubernetes installed
kubectl version
#get available clusters
kubectl config get-contexts
#switch context
kubectl config use-context <context-name>
#get current context
kubectl config current-context
#get nodes in current cluster
kubectl get nodes
#get more infos about the nodes
kubectl get nodes -o wide
#create namespace
kubectl create namespace <namespace-name>
#delete namespace
kubectl delete namespace <namespace-name>
#get namespaces in current cluster
kubectl get ns
#set namespace
kubectl config set-context --current --namespace=<namespace-name>
#add login data for Docker Container registry
kubectl create secret docker-registry htldevzone-credentials --docker-server=htldevzone.azurecr.io  --docker-username=htldevzone --docker-password="Passwort"
#get secrets
kubectl get secrets htldevzone-credentials
#patch service account
kubectl patch serviceaccount default -p "{\"imagePullSecrets\": [{\"name\": \"htldevzone-credentials\"}]}"
#pull image into cluster
kubectl create deployment --image=htldevzone.azurecr.io/nginxdemos/hello hello-app
#get infos about running deployment
kubectl describe deployment hello-app
#delete deployment
kubectl delete deployment hello-app
#create pods from file
kubectl apply -f .\01a-nginx-deployment.yml
#get running pods
kubectl get pods
#get log from pod
kubectl logs nginx-worker-pool-58c95f8669-kczt2
#get informations about pod
kubectl describe pod nginx-worker-pool-58c95f8669-kczt2
#forward port
kubectl port-forward pods/nginx-worker-pool-58c95f8669-kczt2 8080:80
#delete pod
kubectl delete -f .\01b-nginx-ingress.yml
```

## Architektur
1
      ┌─────────┐
TLS   │ INGRESS │
      └─────────┘
           ↓
    ┌───────────────┐
    │ load balancer │
    └───────────────┘
     ↓     ↓      ↓
┌─────────────────┐ ┌─────────┐
│ ┌─────┐ ┌─────┐ │ │ ┌─────┐ │←Node (Kubernetes Node)
│ │┌───┐│ │┌───┐│ │ │ │┌───┐│ │
│ ││ C ││ ││ C ││ │ │ ││ C ││←┼─Pod
│ │└───┘│ │└───┘│ │ │ │└───┘│ │
│ └─────┘ └─────┘ │ │ └─────┘ │
└─────────────────┘ └─────────┘

Ein Pod ist ein Sammlung von Containern, die sich nur gegenseitig sehen können
Ein Node ist eine Physische Maschine
Ein Cluster ist eine Sammlung von Nodes
