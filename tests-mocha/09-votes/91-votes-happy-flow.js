const { title, request } = require("../test-helpers.js");
const assert = require("assert");
const testMenuPlan = require("../testMenuPlan.json");
const testPollData = require("../testPoll.json");
const testVoteData = require("../testVote.json");

describe("Vote Router Tests", function() {
    const menuplanUrl = "/api/menuplans";
    const pollUrl = "/api/polls";
    const voteUrl = "/api/votes";
    let menuplanId = null;
    let pollId = null;
    let voteId = null;
  
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

  it(title("POST", voteUrl, null, "add a vote to the poll"), function() {
    const voteDataWithPoll = { ...testVoteData, poll: pollId };

    return request
        .post(voteUrl)
        .send(voteDataWithPoll)
        .expect(201)
        .expect("Content-Type", /json/)
        .then(response => {
            assert(response.body._id, "Vote should have an _id");
            voteId = response.body._id;
            assert.equal(response.body.poll, pollId, "Poll ID should match");
        });
  });

  it(title("GET", voteUrl, ":pollId", "retrieve aggregated votes for a poll"), function() {
    console.log(pollId);
      return request
      .get(`${voteUrl}/${pollId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(response => {
          assert(response.body.vorspeisen, "Vorspeisen should be present");
          assert(response.body.hauptspeisen, "Hauptspeisen should be present");
          assert(response.body.nachspeisen, "Nachspeisen should be present");
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

  it(title("DELETE", voteUrl, ":id", "delete vote"), function () {
    return request.delete(`${voteUrl}/${voteId}`).expect(204);
  });

  it(title("GET", voteUrl, ":id", "check deletion success vote"), function () {
    return request.get(`${voteUrl}/${pollId}`).expect(404);
  });
});
