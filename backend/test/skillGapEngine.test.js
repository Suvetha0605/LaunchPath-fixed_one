const test = require("node:test");
const assert = require("node:assert/strict");
const { analyzeSkillGap } = require("../utils/skillGapEngine");

test("matches skills case-insensitively and reports missing skills", () => {
    const result = analyzeSkillGap([" jAvA ", "SQL"], ["Java", "React", "SQL"]);

    assert.equal(result.totalRequiredSkills, 3);
    assert.equal(result.matchedSkillsCount, 2);
    assert.equal(result.missingSkillsCount, 1);
    assert.deepEqual(result.matchedSkills, ["Java", "SQL"]);
    assert.deepEqual(result.missingSkills, ["React"]);
    assert.equal(result.skillGaps[0].skill, "React");
    assert.ok(result.skillGaps[0].roadmap.length > 0);
    assert.ok(result.skillGaps[0].beginnerTopics.length > 0);
});

test("returns an empty, valid analysis when a drive has no required skills", () => {
    const result = analyzeSkillGap(["Java"], []);

    assert.deepEqual(result, {
        totalRequiredSkills: 0,
        matchedSkillsCount: 0,
        missingSkillsCount: 0,
        matchedSkills: [],
        missingSkills: [],
        skillGaps: []
    });
});

test("provides a learning plan for skills outside the built-in knowledge base", () => {
    const result = analyzeSkillGap([], ["Kubernetes"]);

    assert.equal(result.missingSkillsCount, 1);
    assert.equal(result.skillGaps[0].skill, "Kubernetes");
    assert.match(result.skillGaps[0].reason, /Kubernetes/);
    assert.ok(result.skillGaps[0].roadmap.some((step) => /Kubernetes/.test(step)));
});
