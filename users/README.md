# Eigenschaften

## _id

number
automatisch vergebene id
primary key

## email

string
email des Benutzers
unique

## firstname,lastname

string
name des Benutzers
optional

## password

string
Passwort

## active

boolean
legt fest ob der Nutzer aktiv ist
optional
default ist false

# Schnittstellen

## get /

returned alle User

## post /

erstellt einen neuen User

## get,delete,patch /:id

Wie bereits aus NVS

## get /trylogin?email=xyz&password=123

Returned einen aktiven User mit dieser email und passwort
404 wenn es diesen nicht gibt