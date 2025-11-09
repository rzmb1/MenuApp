const { title, request } = require("../test-helpers.js");
describe('00-app-healthy-checks', function () {
  const readyZ_Url = '/api/readyz';
  const liveZ_Url = '/api/livez';
  it(title('GET', liveZ_Url, null, 'liveness check'), function () {
    return request
      .get(readyZ_Url)
      .expect(200)
  });
  it(title('GET', readyZ_Url, null, 'readyness check'), function () {
    return request
      .get(readyZ_Url)
      .expect(200)
  });

  /*const homepage_Url = '/';
  it(title('GET', homepage_Url, null, 'homepage check'), function () {
    return request(app)
      .get(homepage_Url)
      .expect(200)
      .expect('Content-Type', /html/)
  });*/
});
