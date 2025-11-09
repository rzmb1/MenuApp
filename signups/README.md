# Eigenschaften
## _id
number
automatisch vergebene id
primary key
## _idUser
number
## day
date
required
## dish
objekt mit name und tags
required

# Schnittstellen
## get /
returnt alle Signups
## post /
erstellt eine neues Signup
## get,delete,patch /:id
Greift auf das signup mit der id zu und führt die aktion darauf aus