const { title, request } = require("../test-helpers.js");
const assert = require("assert");

describe("11-users-happy-flow", function () {
  const url = "/api/users";
  let userId = null;
  it(title("GET", url, null, "check empty users array"), function () {
    return request
      .get(url)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert.equal(response.body.length,0);
      });
  });
  it(title("POST", url, null, "create first user - happy flow"), function () {
    return request
      .post(url)
      .send({
        firstname: "Karl",
        lastname: "Popper",
        email: "reimuelf@edu.htl-villach.at",
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body._id);
        assert(response.body.email === "reimuelf@edu.htl-villach.at");
        userId = response.body._id;
      });
  });

  it(title("GET", url, null, "check persistence first user"), function () {
    return request
      .get(url)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.length === 1);
      });
  });
  it(
    title("PATCH", url, ":id", "change lastname of first user"),
    function () {
      return request
        .patch(`${url}/${userId}`)
        .send({ lastname: "POPPER"})
        .expect(200);
    }
  );
  it(title("GET", url, ":id", "check persistence updated user"), function () {
    return request
      .get(`${url}/${userId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.lastname === "POPPER");
      });
  });
  it(title("DELETE", url, ":id", "delete first user"), function () {
    return request.delete(`${url}/${userId}`).expect(204);
  });
  it(title("GET", url, ":id", "check deletion success"), function () {
    return request.get(`${url}/${userId}`).expect(404);
  });
  it(title("GET", url + "/byAuthenticationHeader", null, "get own user data"), function () {
    return request
      .get(url + "/byAuthenticationHeader")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.firstname === "Felix Manuel");
        assert(response.body.lastname === "REIMÜLLER");
        assert(response.body.email === "reimuelf@edu.htl-villach.at");
      });
  });
});