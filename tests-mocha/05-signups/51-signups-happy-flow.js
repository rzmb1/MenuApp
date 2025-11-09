const { title, request } = require("../test-helpers.js");
const assert = require("assert");
describe("51-signups-happy-flow", function () {
  const urlSignups = "/api/signups";
  const urlMenuPlans = "/api/menuplans"
  const urlUsers = "/api/users";
  let signupId = null;
  let userId = null;
  let menuplanId = null;
  it(title("GET", urlSignups, null, "check empty signups array"), function () {
    return request
      .get(urlSignups)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert.equal(response.body.length,0);
      });
  });
  it(title("POST", urlUsers, null, "create test user for signups - happy flow"), function () {
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
  it(title("POST", urlMenuPlans, null, "create test menuplan for signups - happy flow"), function () {
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
          ],
          "Dienstag": [
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
              "name": "Frühlingsrollen mit Krautsalat",
              "tags": [
                "Vorspeise",
                "Gemüse",
                "Menü A"
              ],
              "image": "6453e25d265186d68cbd6bec"
            },
            {
              "name": "Karreesteak vom Schwein à la Cordon bleu",
              "tags": [
                "Hauptspeise",
                "Schwein",
                "Steak",
                "Menü B"
              ],
              "image": "6453dcb7265186d68cbd6bca"
            }
          ],
          "Donnerstag": [
            {
              "name": "Salatbuffet",
              "tags": [
                "Salat",
                "Vorspeise"
              ],
              "image": "6453eb746cc5e7c1534445f1"
            },
            {
              "name": "Deftiger Erdäpfeleintopf",
              "tags": [
                "Hauptspeise",
                "Kartoffeln",
                "Vegetarisch",
                "Menü A"
              ],
              "image": "6453e22d265186d68cbd6bea"
            },
            {
              "name": "Frühlingsrollen mit Krautsalat",
              "tags": [
                "Vorspeise",
                "Gemüse",
                "Menü A"
              ],
              "image": "6453e25d265186d68cbd6bec"
            },
            {
              "name": "Erdbeer-Holunderblüten-Schnittenn",
              "tags": [
                "Nachspeise",
                "Erdbeeren",
                "G (Milch)",
                "Vegetarisch",
                "Menü A"
              ],
              "image": "6453dbc7d7155e9950293c34"
            }
          ],
          "Mittwoch": [
            {
              "name": "Salatbuffet",
              "tags": [
                "Salat",
                "Vorspeise"
              ],
              "image": "6453eb746cc5e7c1534445f1"
            },
            {
              "name": "Rahm-Kren-Suppe",
              "tags": [
                "Hauptspeise",
                "Suppe",
                "Kren",
                "Vegetarisch",
                "Menü A"
              ],
              "image": "6453e454265186d68cbd6bf8"
            }
          ]
        },
        "startDate": "2026-07-06",
        "endDate": "2026-07-10"
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body._id);
        assert(response.body.startDate === "2026-07-06");
        menuplanId = response.body._id;
      });
  });
  it(title("GET", `${urlSignups}/average-rating/${"Penne alla Pizza"}`, null, "check average rating before first signup"), function () {
    return request
      .get(`${urlSignups}/average-rating/${"Penne alla Pizza"}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(response => response.body)
      .then((response) => {
        assert(response.dishName==="Penne alla Pizza");
      });
  });
  it(title("GET", `${urlSignups}/number-of-ratings/${"Penne alla Pizza"}`, null, "check number of ratings before first signup"), function () {
    return request
      .get(`${urlSignups}/number-of-ratings/${"Penne alla Pizza"}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(response => response.body)
      .then((response) => {
        assert(response.totalRatings===0);
        assert(response.dishName==="Penne alla Pizza");
      });
  });
  it(title("POST", urlSignups, null, "create first signup"), function () {
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
      day: "2026-07-06",
      rating: 4 ,
      "comment":"eatable"
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body._id);
        assert(response.body.day === '2026-07-06');
        signupId = response.body._id;
      });
  });

  it(title("GET", urlSignups, null, "check persistence first signup"), function () {
    return request
      .get(urlSignups)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.length === 1);
      });
  });
  it(title("GET", `${urlSignups}/average-rating/${"Penne alla Pizza"}`, null, "check average rating after first signup"), function () {
    return request
      .get(`${urlSignups}/average-rating/${"Penne alla Pizza"}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(response => response.body)
      .then((response) => {
        assert(response.averageRating===4);
        assert(response.dishName==="Penne alla Pizza");
      });
  });
  it(title("GET", `${urlSignups}/number-of-ratings/${"Penne alla Pizza"}`, null, "check number of ratings after first signup"), function () {
    return request
      .get(`${urlSignups}/number-of-ratings/${"Penne alla Pizza"}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(response => response.body)
      .then((response) => {
        assert(response.totalRatings===1);
        assert(response.dishName==="Penne alla Pizza");
      });
  });
  it(title("POST", `${urlSignups}/ratings-data`, null, "check multiple ratings after first signup"), function () {
    return request
      .post(`${urlSignups}/ratings-data`)
      .send({dishNames:["Penne alla Pizza","Winterliche Gemüsesuppe"]})
      .expect(200)
      .expect("Content-Type", /json/)
      .then(response => response.body)
      .then((response) => {
        assert(response.length===2);
        assert(response[0].averageRating===4);
        assert(response[0].totalRatings===1);
        assert(response[1].totalRatings===0);
        assert(response[1].totalRatings===0);
      });
  });
  it(title("GET", `${urlSignups}/comments/Penne alla Pizza`, null, "check comment"), function () {
    return request
      .get(`${urlSignups}/comments/Penne alla Pizza`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(response => response.body)
      .then((response) => {
        assert(response.length===1);
        assert(response[0].rating===4);
        assert(response[0].comment==="eatable");
        assert(response[0].user.firstname==="Karl");
        assert(response[0].user.lastname==="Popper");
      });
  });
  it(
    title("PATCH", urlSignups, ":id", "change dish of first signup"),
    function () {
      return request
        .patch(`${urlSignups}/${signupId}`)
        .send({  dish: {
          "name": "Winterliche Gemüsesuppe",
          "tags": [
            "Vorspeise",
            "Suppe",
            "Gemüse",
            "Vegetarisch",
            "Menü A"
          ],
          "image": "6453e3d5265186d68cbd6bf4"
        }})
        .expect(200);
    }
  );
  it(title("GET", urlSignups, ":id", "check persistence updated signup"), function () {
    return request
      .get(`${urlSignups}/${signupId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.dish.name === "Winterliche Gemüsesuppe");
      });
  });
  it(title("DELETE", urlSignups, ":id", "delete first signup"), function () {
    return request.delete(`${urlSignups}/${signupId}`).expect(204);
  });
  it(title("GET", urlSignups, ":id", "check deletion success"), function () {
    return request.get(`${urlSignups}/${signupId}`).expect(404);
  });
  it(title("DELETE", urlUsers, ":id", "delete test user"), function () {
    return request.delete(`${urlUsers}/${userId}`).expect(204);
  });
  it(title("DELETE", urlMenuPlans, ":id", "delete test menuplan"), function () {
    return request.delete(`${urlMenuPlans}/${menuplanId}`).expect(204);
  });
});