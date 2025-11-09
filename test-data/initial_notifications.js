const notifications = [
    { _id:"64539667bffef8c4aae91461",_idUser:"507f1f77bcf86cd799439011", link: '/statistics', text: 'Lorem settings', title: "Menu plan changed", priority: "LOW", read: true, timeCreated: new Date("2023-04-23") },
    { _id:"64539657bffef8c4aae91461",_idUser:"507f1f77bcf86cd799439011", link: '/statistics', text: 'Lorem settings', title: "Menu plan released", priority: "LOW", read:false,timeCreated: new Date("2023-04-27") },
    { _id:"64539647bffef8c4aae91461",_idUser:"507f1f77bcf86cd799439011", link: '/statistics', text: 'Lorem settings', title: "You have not choosean a meal yet",read: false,priority: "HIGH",timeCreated: new Date("2023-04-29") },
    {_id:"64539663bffef8c4aae91461", _idUser:"507f1f77bcf86cd799439011", text: 'Lorem settings', title: "Menu plan changed", priority: "LOW", read: true, timeCreated: new Date("2023-04-24") },
    { _id:"64539627bffef8c4aae91461",_idUser:"507f1f77bcf86cd799439011", link: '/statistics', text: 'Lorem settings', title: "Menu plan released", priority: "LOW", read: false,timeCreated: new Date("2023-05-02") },
    { _id:"64539617bffef8c4aae91461",_idUser:"507f1f77bcf86cd799439011", link: '/menu-plan', text: 'Lorem creation', title: "You have not choosean a meal yet", priority: "HIGH",read:false,timeCreated: new Date("2023-05-03") },
    { _id:"64539607bffef8c4aae91461",_idUser:"507f1f77bcf86cd799439011", link: '/statistics', text: 'Lorem statistics', title: "Menu plan changed", priority: "LOW", read: true, timeCreated: new Date("2023-05-01") },
    { _id:"64535667bffef8c4aae91461",_idUser:"507f1f77bcf86cd799439011", link: '/notifications', text: 'Lorem notifications', title: "Menu plan released", priority: "LOW", read: false,timeCreated: Date.now() },
    { _id:"64534667bffef8c4aae91461",_idUser:"51711f77bcf86cd799439018", link: '/menu-plan', text: 'Du hast dich noch nicht für das Essen am 22.06. angemeldet', title: "Noch nicht für essen angemeldet", priority: "HIGH",read:false,timeCreated: new Date("2023-05-02") },
    { _id:"64533667bffef8c4aae91461",_idUser:"51711f77bcf86cd799439018", link: '/menu-plan', text: 'Bitte erneuere deine Anmeldung', title: "Menüplan verändert", priority: "LOW", read: true, timeCreated: new Date("2023-05-04") },
    { _id:"64532667bffef8c4aae91461",_idUser:"51711f77bcf86cd799439018", link: '/menu-plan', text: 'Der Menüplan von 19.06. bis 23.06. wurde veröffentlicht', title: "Menüplan veröffentlicht", priority: "LOW", read: true,timeCreated: new Date("2023-06-15") },
    {_id:"64539167bffef8c4aae91461", _idUser:"51711f77bcf86cd799439018", link: '/menu-plan', text: 'Du hast dich noch nicht für das Essen am 22.06. angemeldet', title: "Noch nicht für essen angemeldet", priority: "HIGH",read:false,timeCreated: new Date("2023-06-19") },
]

module.exports = notifications;