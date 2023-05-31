// k6 run script.js

import http from "k6/http";
import { check, sleep } from "k6";
export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: "constant-arrival-rate",
      rate: 20,
      timeUnit: "1s",
      duration: "5s",
      preAllocatedVUs: 100,
      maxVUs: 200,
    },
  },
};
// test HTTP
export default function () {
  const res = http.get("https://byat75hke5.execute-api.ap-southeast-1.amazonaws.com/prod/dkLs8Ua");
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}
