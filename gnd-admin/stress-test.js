import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

let responseTimes = new Trend('response_times');

export let options = {
  stages: [
    { duration: '30s', target: 100 }, // ramp-up to 100 users in 30s
    { duration: '1m', target: 100 },  // stay at 100 users for 1 minute
    { duration: '30s', target: 0 },   // ramp-down to 0 users
  ],
};

export default function () {
  let res = http.get('https://gnd-admin.vercel.app/');
  check(res, {
    'status was 200': (r) => r.status == 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  responseTimes.add(res.timings.duration);
  sleep(1);  // Sleep for 1 second between requests
}
