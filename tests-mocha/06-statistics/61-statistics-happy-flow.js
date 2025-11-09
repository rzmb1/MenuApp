const { title, request } = require("../test-helpers.js");
const assert = require("assert");
describe("61-statistis-happy-flow", function () {
  const urlSignups = "/api/signups";
  const urlMenuPlans = "/api/menuplans";
  const urlStatistics = "/api/menuplans/statistics";
  const urlUsers = "/api/users";
  const startDate="2026-07-06";
  const endDate="2026-07-10";
  let signupId = null;
  let userId = null;
  let menuplanId = null;
  it(title("POST", urlUsers, null, "create test user for statistics - happy flow"), function () {
    return request
      .post(urlUsers)
      .send({
        firstname: "Karl",
        lastname: "Popper",
        email: "felix.reimueller@edu.htl-villach.at",
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body._id);
        assert(response.body.email === "felix.reimueller@edu.htl-villach.at");
        userId = response.body._id;
      });
  });
  it(title("POST", urlMenuPlans, null, "create test menuplan for statistics - happy flow"), function () {
    return request
      .post(urlMenuPlans)
      .send({
        "createdBy": "6453ebfe8f6dce826c40fdcb",
        "approvedBy": "6453ebfee9454a9b295063fd",
        "state": "published",
        "days": {
          "Montag": [
            {
              "name": "Salatbuffet",
              "tags": [
                "Salat",
                "Vorspeise"
              ],
              "image": "6453eb746cc5e7c1534445f1"
            },
            {
              "name": "Penne alla Pizza",
              "tags": [
                "Hauptspeise",
                "Pizza",
                "A (Glutenhaltiges Getreide)",
                "Vegetarisch",
                "Menü A"
              ],
              "image": "6453df88265186d68cbd6bda"
            },
            {
              "name": "Winterliche Gemüsesuppe",
              "tags": [
                "Vorspeise",
                "Suppe",
                "Gemüse",
                "Vegetarisch",
                "Menü A"
              ],
              "image": "6453e3d5265186d68cbd6bf4"
            },
            {
              "name": "Maiwipferparfait auf Erdberrragout",
              "tags": [
                "Nachspeise",
                "Erdbeeren",
                "Vegetarisch",
                "Menü A"
              ],
              "image": "6453d9c2d7155e9950293c2b"
            },
            {
              "name": "Lachsforellenfilet in Honig-Senf-Sauce",
              "tags": [
                "Hauptspeise",
                "Lachs",
                "Honig",
                "M (Senf)",
                "Menü B"
              ],
              "image": "6453e36e265186d68cbd6bf2"
            },
            {
              "name": "Rote-Rüben-Suppe",
              "tags": [
                "Vorspeise",
                "Rüben",
                "Suppe",
                "G (Milch)",
                "Vegetarisch",
                "Menü B"
              ],
              "image": "6453e09c265186d68cbd6be0"
            },
            {
              "name": "Erdbeer-Holunderblüten-Schnittenn",
              "tags": [
                "Nachspeise",
                "Erdbeeren",
                "G (Milch)",
                "Vegetarisch",
                "Menü B"
              ],
              "image": "6453dbc7d7155e9950293c34"
            }
          ]
        },
        "startDate": startDate,
        "endDate": endDate
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body._id);
        assert(response.body.startDate === startDate);
        menuplanId = response.body._id;
      });
  });
  it(title("POST", urlSignups, null, "create signup for statistics"), function () {
    return request
      .post(urlSignups)
      .send({
        _idUser:userId,
        dish: {
          "name": "Penne alla Pizza",
              "tags": [
                "Hauptspeise",
                "Pizza",
                "A (Glutenhaltiges Getreide)",
                "Vegetarisch",
                "Menü A"
              ],
              "image": "6453df88265186d68cbd6bda"
      },
      day: startDate
        
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body._id);
        assert(response.body.day === startDate);
        signupId = response.body._id;
      });
  });
  it(title("PATCH", urlStatistics, null, "patch statistics - happy flow"), function () {
    return request
      .patch(urlStatistics)
      .send({
        name:"Penne alla Pizza",
        date:startDate,
        wasted:13,
        served:100,
        ordered:120
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.wasted=== 13);
      });
  });
  it(title("PATCH", urlStatistics+'/updatePredictionModel', null, "update prediction model - happy flow"), function () {
    return request
      .patch(urlStatistics+'/updatePredictionModel')
      .send()
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.message === "prediction model updated");
      });
  });

  it(title("GET", `${urlStatistics}?from=${startDate}&to=${endDate}`, null, "check statistics - happy flow"), function () {
    return request
      .get(`${urlStatistics}?from=${startDate}&to=${endDate}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        let entry=response.body.find(entry =>entry.name=="Penne alla Pizza"&&entry.date==startDate);
        assert(entry!=undefined);
        assert(entry.wasted==13);
        assert(entry.registered==1);
      });
  });
  it(title("DELETE", urlSignups, ":id", "delete test signup"), function () {
    return request.delete(`${urlSignups}/${signupId}`).expect(204);
  });
  it(title("DELETE", urlUsers, ":id", "delete test user"), function () {
    return request.delete(`${urlUsers}/${userId}`).expect(204);
  });
  it(title("DELETE", urlMenuPlans, ":id", "delete test menuplan"), function () {
    return request.delete(`${urlMenuPlans}/${menuplanId}`).expect(204);
  });
});