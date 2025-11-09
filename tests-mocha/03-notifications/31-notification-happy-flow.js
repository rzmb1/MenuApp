const { title, request } = require("../test-helpers.js");
const assert = require("assert");
describe("31-notifications-happy-flow", function () {
  const urlNotifications = "/api/notifications";
  const urlUsers = "/api/users";
  let notificationId = null;
  let userId = null;
  it(title("GET", urlNotifications, null, "check empty notifications array"), function () {
    return request
      .get(urlNotifications)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert.equal(response.body.length,0);
      });
  });
  it(title("POST", urlUsers, null, "create test user for notification - happy flow"), function () {
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
  it(title("POST", urlNotifications, null, "create first notification"), function () {
    return request
      .post(urlNotifications)
      .send({
        _idUser:userId,
        link: '/settings',
        text: 'Lorem settings',
        title: "Menu plan changed",
        priority: "LOW",
        read: true,
        timeCreated: new Date("2023-04-23")
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body._id);
        assert(response.body.text === 'Lorem settings');
        notificationId = response.body._id;
      });
  });

  it(title("GET", urlNotifications, null, "check persistence first notification"), function () {
    return request
      .get(urlNotifications)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.length === 1);
      });
  });
  it(
    title("PATCH", urlNotifications, ":id", "change link of first notification"),
    function () {
      return request
        .patch(`${urlNotifications}/${notificationId}`)
        .send({  link: '/menu-plan'})
        .expect(200);
    }
  );
  it(title("GET", urlNotifications, ":id", "check persistence updated notification"), function () {
    return request
      .get(`${urlNotifications}/${notificationId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.link === "/menu-plan");
      });
  });
  it(title("DELETE", urlNotifications, ":id", "delete first notification"), function () {
    return request.delete(`${urlNotifications}/${notificationId}`).expect(204);
  });
  it(title("GET", urlNotifications, ":id", "check deletion success"), function () {
    return request.get(`${urlNotifications}/${notificationId}`).expect(404);
  });
  it(title("DELETE", urlUsers, ":id", "delete test user"), function () {
    return request.delete(`${urlUsers}/${userId}`).expect(204);
  });
});