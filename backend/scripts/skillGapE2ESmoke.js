const assert = require("node:assert/strict");
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");
const PlacementDrive = require("../models/PlacementDrive");

const baseUrl = process.env.API_BASE_URL || "http://localhost:5000";
const suffix = `${Date.now()}-${process.pid}`;
const email = `launchpath-skillgap-e2e-${suffix}@example.invalid`;
let driveId;

async function request(route, options = {}) {
    const response = await fetch(`${baseUrl}${route}`, options);
    const body = await response.json();
    return { status: response.status, body };
}

async function main() {
    await mongoose.connect(process.env.MONGO_URI);

    try {
        const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const driveDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const drive = await PlacementDrive.create({
            companyName: "LaunchPath Temporary E2E Fixture",
            jobRole: "Skill Gap Test Role",
            package: 8,
            driveDate,
            applicationDeadline: deadline,
            minimumCGPA: 7,
            requiredSkills: ["Java", "React", "Kubernetes"],
            status: "open"
        });
        driveId = drive._id;

        const registration = await request("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Temporary Skill Gap E2E",
                email,
                password: "Temporary-E2E-Password-9382",
                department: "Computer Science",
                cgpa: 8.2,
                backlogs: 0,
                graduationYear: new Date().getFullYear() + 2,
                skills: ["Java"]
            })
        });
        assert.equal(registration.status, 201, `Registration failed: ${registration.body.message}`);

        const login = await request("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password: "Temporary-E2E-Password-9382", role: "student" })
        });
        assert.equal(login.status, 200, `Login failed: ${login.body.message}`);
        assert.ok(login.body.token, "Login should return a bearer token");
        const headers = { Authorization: `Bearer ${login.body.token}` };

        const drives = await request("/api/placements");
        assert.equal(drives.status, 200, "Placement drives endpoint should return 200");
        assert.ok(drives.body.drives.some((item) => String(item._id) === String(driveId)), "Temporary drive should appear in the selector data");

        const analysis = await request(`/api/placements/${driveId}/eligibility`, { headers });
        assert.equal(analysis.status, 200, `Eligibility/skill-gap API failed: ${analysis.body.message}`);
        assert.equal(analysis.body.drive.companyName, "LaunchPath Temporary E2E Fixture");
        assert.equal(analysis.body.skillGap.totalRequiredSkills, 3);
        assert.equal(analysis.body.skillGap.matchedSkillsCount, 1);
        assert.deepEqual(analysis.body.skillGap.matchedSkills, ["Java"]);
        assert.deepEqual(analysis.body.skillGap.missingSkills.sort(), ["Kubernetes", "React"]);
        assert.equal(analysis.body.skillGap.skillGaps.length, 2);
        assert.ok(analysis.body.skillGap.skillGaps.every((gap) => gap.roadmap.length && gap.beginnerTopics.length));
        assert.equal(analysis.body.readiness.technicalSkillReadiness, 33);

        const unauthorized = await request(`/api/placements/${driveId}/eligibility`);
        assert.equal(unauthorized.status, 401, "Analysis endpoint should reject unauthenticated requests");

        console.log("PASS: student registration and login");
        console.log("PASS: placement drives selector endpoint");
        console.log("PASS: authenticated eligibility + skill-gap + readiness response");
        console.log("PASS: matched/missing skills and learning roadmap data");
        console.log("PASS: unauthorized analysis request rejected");
    } finally {
        await User.deleteOne({ email });
        if (driveId) await PlacementDrive.deleteOne({ _id: driveId });
        await mongoose.disconnect();
    }
}

main().catch((error) => {
    console.error("Skill Gap E2E smoke test failed:", error.message);
    process.exitCode = 1;
});
