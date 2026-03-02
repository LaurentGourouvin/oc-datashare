import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10,        // 10 utilisateurs virtuels
    duration: '30s', // pendant 30 secondes
};

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGEwYzNlZC01NTRmLTQwYWYtYjk0OC1lOTE3OGQyYjQ2M2YiLCJlbWFpbCI6ImdvdXJvdXZpbi5sYXVyZW50QGdtYWlsLmNvbSIsImlhdCI6MTc3MjQzNjM4MSwiZXhwIjoxNzczMDQxMTgxfQ.FfRDB9k60IUblKjzkMKEDkDJzmDeCGZEvGk_xhpFiic';
const file = open('./test-file.pdf', 'b');

export default function () {
    const url = 'http://localhost:3000/files/upload';

    const payload = {
        file: http.file(file, 'test.pdf', 'application/pdf'),
    };

    const params = {
        headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 201': (response) => response.status === 201,
        'has token': (response) => JSON.parse(response.body).token !== undefined,
    });

    sleep(1);
}