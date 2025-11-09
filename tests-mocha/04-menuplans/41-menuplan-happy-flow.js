const { title, request } = require("../test-helpers.js");
const assert = require("assert");
const testMenuPlan=require("../testMenuPlan.json");
describe("41-menuplans-happy-flow", function () {
  const url = "/api/menuplans";
  let menuplanId = null;
  it(title("GET", url, null, "check empty menuplans array"), function () {
    return request
      .get(url)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert.equal(response.body.length, 0);
      });
  });
  it(title("POST", url, null, "create first menuplan - happy flow"), function () {
    return request
      .post(url)
      .send(testMenuPlan)
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body._id);
        assert(response.body.startDate === "2022-11-14");
        menuplanId = response.body._id;
      });
  });

  it(title("GET", url, null, "check persistence first menuplan"), function () {
    return request
      .get(url)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.length === 1);
      });
  });
  it(title("GET", `${url}/dishes`, null, "check dishes of first menuplan"), function () {
    return request
      .get(`${url}/dishes`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.find(entry => entry.name===testMenuPlan.days["Montag"][0].name))
      });
  });
  it(title("GET", `${url}/dishnames`, null, "check dishnames of first menuplan"), function () {
    return request
      .get(`${url}/dishnames`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.length === Object.keys(testMenuPlan.days).reduce((sum,day) => sum+testMenuPlan.days[day].length,0));
        assert(response.body.find(entry => entry.name===testMenuPlan.days["Montag"][0].name))
      });
  });
  it(
    title("PATCH", url, ":id", "change state of first menuplan"),
    function () {
      return request
        .patch(`${url}/${menuplanId}`)
        .send({ state: "in-review" })
        .expect(200);
    }
  );
  it(title("GET", url, ":id", "check persistence updated menuplan"), function () {
    return request
      .get(`${url}/${menuplanId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.state === "in-review");
      });
  });
  it(title("DELETE", url, ":id", "delete first menuplan"), function () {
    return request.delete(`${url}/${menuplanId}`).expect(204);
  });
  it(title("GET", url, ":id", "check deletion success"), function () {
    return request.get(`${url}/${menuplanId}`).expect(404);
  });
});