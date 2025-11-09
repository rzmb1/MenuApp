# Eigenschaften
## _id
number
automatisch vergebene id
primary key
## _idUser
number
## text
string
## read
boolean
says whether the notification has alreay been read
optional
default:false
## timeCreated
date
optional
default:now
## priority
string
optional
default:LOW

# Schnittstellen
## get /
returned alle Notification
## post /
erstellt eine neue Notification
## get,delete,patch /:id
Wie bereits aus NVS