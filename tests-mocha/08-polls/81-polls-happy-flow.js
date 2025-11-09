const { title, request } = require("../test-helpers.js");
const assert = require("assert");
const testMenuPlan = require("../testMenuPlan.json");
const testPollData = require("../testPoll.json");

describe("Poll Router Tests", function() {
    const menuplanUrl = "/api/menuplans";
    const pollUrl = "/api/polls";
    let menuplanId = null;
    let pollId = null;
  
    // create a menuplan first
    it(title("POST", menuplanUrl, null, "create first menuplan - happy flow"), function() {
      return request
        .post(menuplanUrl)
        .send(testMenuPlan)
        .expect(201)
        .expect("Content-Type", /json/)
        .then(response => {
          assert(response.body._id, "Menuplan should have an _id");
          assert.equal(response.body.startDate, testMenuPlan.startDate, "Start date should match");
          menuplanId = response.body._id;
        });
    });
  
    it(title("POST", pollUrl, null, "create first poll - happy flow"), function() {
      const pollDataWithMenuplan = { ...testPollData, menuplan: menuplanId };
      
      return request
        .post(pollUrl)
        .send(pollDataWithMenuplan)
        .expect(201)
        .expect("Content-Type", /json/)
        .then(response => {
          assert(response.body._id, "Poll should have an _id");
          assert.equal(response.body.menuplan, menuplanId, "Menuplan ID should match");
          pollId = response.body._id;
        });
    });

    it(title("GET", pollUrl, null, "retrieve all polls"), function() {
        return request
        .get(pollUrl)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(response => {
            assert(Array.isArray(response.body), "Response should be an array");
        });
    });

    it(title("GET", pollUrl, "voteoptions/:userId", "get vote options for a user"), function() {
      const userId = '65fdfa69753bbadc7ba04979';
  
      return request
      .get(`${pollUrl}/voteoptions/${userId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(response => {
          assert(response.body.userId, "User ID should be present");
          assert(response.body.pollId, "Poll ID should be present");
          assert(response.body.options, "Options should be present");
  
          // Verify that each category contains data
          assert(response.body.options.vorspeisen && response.body.options.vorspeisen.length > 0, "Vorspeisen should not be empty");
          assert(response.body.options.hauptspeisen && response.body.options.hauptspeisen.length > 0, "Hauptspeisen should not be empty");
          assert(response.body.options.nachspeisen && response.body.options.nachspeisen.length > 0, "Nachspeisen should not be empty");
      });
  });  

  it(title("PATCH", pollUrl, ":id", "update a poll"), function() {
    const updateData = { open: false }; 
    return request
    .patch(`${pollUrl}/${pollId}`)
    .send(updateData)
    .expect(200)
    .then(response => {
      assert.equal(response.body.open, false, "Open status should be updated");
    });
  });

  it(title("DELETE", menuplanUrl, ":id", "delete poll menuplan"), function () {
    return request.delete(`${menuplanUrl}/${menuplanId}`).expect(204);
  });

  it(title("GET", menuplanUrl, ":id", "check deletion success poll menuplan"), function () {
    return request.get(`${menuplanUrl}/${menuplanId}`).expect(404);
  });

  it(title("DELETE", pollUrl, ":id", "delete poll"), function () {
    return request.delete(`${pollUrl}/${pollId}`).expect(204);
  });

  it(title("GET", pollUrl, ":id", "check deletion success poll"), function () {
    return request.get(`${pollUrl}/${pollId}`).expect(404);
  });
});
