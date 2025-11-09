const { title, request } = require("../test-helpers.js");
describe("71-authorization-errors", function () {
  it(title("GET", "/api/menuplans", null, "missing auth token"), function () {
    return request
      .get("/api/menuplans")
      .set("Authorization","")
      .expect(401);
  });
  it(title("POST", "/api/users", null, "missing role"), function () {
    return request
      .post("/api/users")
      .auth("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyIsImtpZCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyJ9.eyJhdWQiOiI0ODEwM2U2Ni1kZTk5LTQ4YjUtOWI5Ni02Yjk3YWEyYWVhY2EiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yYjE5N2VmYS04ZTFiLTQ2ODAtYjI2My04ZTIzNzg4OWI1YjMvIiwiaWF0IjoxNzA3MTU1MzA0LCJuYmYiOjE3MDcxNTUzMDQsImV4cCI6MTcwNzE2MDg2MywiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhWQUFBQVEvYlA4bWR0c0pnVjdkeW12Z3NuL0dta2RJMDBLZ3phb0E0SXc2eDgrUnh6aWU5am9vSDdpOHRZUXpkb3NNVXgiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiNDgxMDNlNjYtZGU5OS00OGI1LTliOTYtNmI5N2FhMmFlYWNhIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJSRUlNw5xMTEVSIiwiZ2l2ZW5fbmFtZSI6IkZlbGl4IE1hbnVlbCIsImlwYWRkciI6IjIwMDE6ODcxOjIxYTpkNTc4OmY1Y2I6M2Y1MzpmZWM5OjE0NDAiLCJuYW1lIjoiUkVJTcOcTExFUiBGZWxpeCBNYW51ZWwsIDVBSElGIiwib2lkIjoiZDU5MWRhYmYtNDU5OS00MGNhLWExZDctODQxMGFhODY4MDZkIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTc3NDkxNjEyMS03ODczMjg4MDYtOTExODMxMDM2LTIzOTExIiwicmgiOiIwLkFSQUEtbjRaS3h1T2dFYXlZNDRqZUltMXMyWS1FRWlaM3JWSW01WnJsNm9xNnNxWEFIMC4iLCJyb2xlcyI6WyJjb29rIiwiY3VzdG9tZXIiXSwic2NwIjoiLjczMDMwZDZiLWQ5M2QtNGE0Ny05MjlkLTk3MzRkMTM1YzdkYyIsInN1YiI6IjlvbnZjamszLVdOUGNoR2JUU2czWHd1SWVlWmpNVzVtU09yZmExaVBHTEUiLCJ0aWQiOiIyYjE5N2VmYS04ZTFiLTQ2ODAtYjI2My04ZTIzNzg4OWI1YjMiLCJ1bmlxdWVfbmFtZSI6InJlaW11ZWxmQGVkdS5odGwtdmlsbGFjaC5hdCIsInVwbiI6InJlaW11ZWxmQGVkdS5odGwtdmlsbGFjaC5hdCIsInV0aSI6IjRlcHZaM0JrcjBHa25VUVVyM21BQUEiLCJ2ZXIiOiIxLjAifQ.T79Gi4NhEYOvvnMrx1FxM22lhOtzd__6GJFsH8tk7zYOCZ-cBwoZCCgwIJg_aqNGiccpXobOywOVujwtee8VtNXvVjU3sCaoYIlrwm8Luo7qnOqeokpEA0xSukmD-ujkCRw4EC6wuk-0OZJRDhpAc0G0u1gCQB9SIXIKjS6mTguV8O3HkeA2vDyBlMh796O2kWEuHvkP-YIvE2UhTK2lmckspvhgHJAR3JrUuDNZiyrgQH4-4HDo7XZj9_9mblfnjxNowP52MAmctB8JUVD_kz9YWsuWtu_JQTtvrtHf7AaxpMEDDL8WR-uoWerGTftiyTb2033PabnV1VgK--NguA",
            {type:"bearer"})
      .send({
        firstname: "Karl",
        lastname: "Popper",
        email: "reimuelf@edu.htl-villach.at",
      })
      .expect(403)
  });
});