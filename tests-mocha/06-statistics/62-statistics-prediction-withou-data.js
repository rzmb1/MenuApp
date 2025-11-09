const { title, request } = require("../test-helpers.js");
describe("62-statistis-prediction-without-data", function () {
  const urlStatistics = "/api/menuplans/statistics";
  it(title("PATCH", urlStatistics+'/updatePredictionModel', null, "update prediction model - happy flow"), function () {
    return request
      .patch(urlStatistics+'/updatePredictionModel')
      .send()
      .expect(400)
      .expect("Content-Type", /json/)
      .then((_response) => {
      });
  });
});