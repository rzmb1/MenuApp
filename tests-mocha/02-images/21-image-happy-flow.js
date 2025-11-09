const { title, request } = require("../test-helpers.js");
const assert = require("assert");
describe("21-images-happy-flow", function () {
  const url = "/api/images";
  let imageId = null;
  it(title("GET", url, null, "check empty images array"), function () {
    return request
      .get(url)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert.equal(response.body.length,0);
      });
  });
  it(title("POST", url, null, "create first image - happy flow"), function () {
    return request
      .post(url)
      .send({
        image:"123"
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body._id);
        assert(response.body.image === "123");
        imageId = response.body._id;
      });
  });

  it(title("GET", url, null, "check persistence first image"), function () {
    return request
      .get(url)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.length === 1);
      });
  });
  it(
    title("PATCH", url, ":id", "change content of first image"),
    function () {
      return request
        .patch(`${url}/${imageId}`)
        .send({ image: "345"})
        .expect(200);
    }
  );
  it(title("GET", url, ":id", "check persistence updated image"), function () {
    return request
      .get(`${url}/${imageId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        assert(response.body.image === "345");
      });
  });
  it(title("DELETE", url, ":id", "delete first image"), function () {
    return request.delete(`${url}/${imageId}`).expect(204);
  });
  it(title("GET", url, ":id", "check deletion success"), function () {
    return request.get(`${url}/${imageId}`).expect(404);
  });
});