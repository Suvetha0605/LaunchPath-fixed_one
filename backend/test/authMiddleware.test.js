const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const protect = require("../middleware/authMiddleware");

process.env.JWT_SECRET = "test-only-secret-that-is-not-used-outside-tests";

function responseRecorder() {
    return {
        statusCode: 200,
        body: undefined,
        status(code) { this.statusCode = code; return this; },
        json(body) { this.body = body; return this; }
    };
}

test("protect rejects requests without a bearer token", () => {
    const req = { headers: {} };
    const res = responseRecorder();
    let nextCalled = false;
    protect(req, res, () => { nextCalled = true; });
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalled, false);
});

test("protect rejects an invalid token", () => {
    const req = { headers: { authorization: "Bearer not-a-valid-token" } };
    const res = responseRecorder();
    let nextCalled = false;
    protect(req, res, () => { nextCalled = true; });
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalled, false);
});

test("protect accepts a valid token and attaches its claims", () => {
    const token = jwt.sign({ id: "student-1", role: "student" }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = responseRecorder();
    let nextCalled = false;
    protect(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(req.user.id, "student-1");
    assert.equal(req.user.role, "student");
});

test("adminOnly rejects students", () => {
    const req = { user: { id: "student-1", role: "student" } };
    const res = responseRecorder();
    let nextCalled = false;
    protect.adminOnly(req, res, () => { nextCalled = true; });
    assert.equal(res.statusCode, 403);
    assert.equal(nextCalled, false);
});

test("adminOnly accepts admins", () => {
    const req = { user: { id: "admin-1", role: "admin" } };
    const res = responseRecorder();
    let nextCalled = false;
    protect.adminOnly(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
});
