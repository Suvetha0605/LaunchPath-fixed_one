const calculateReadiness = (eligibilityResult, skillGapResult) => {

    // -----------------------------
    // 1. Academic Readiness
    // -----------------------------

    const academicChecks = [
        "CGPA",
        "Percentage",
        "Active Backlogs",
        "Graduation Year"
    ];

    const academicResults = eligibilityResult.checks.filter(
        (check) =>
            academicChecks.includes(check.criterion)
    );

    const academicPassed = academicResults.filter(
        (check) => check.status === "passed"
    ).length;

    const academicReadiness =
        academicResults.length === 0
            ? 0
            : Math.round(
                (academicPassed /
                    academicResults.length) *
                100
            );


    // -----------------------------
    // 2. Eligibility Readiness
    // -----------------------------

    const eligibilityChecks =
        eligibilityResult.checks;

    const eligibilityPassed =
        eligibilityChecks.filter(
            (check) => check.status === "passed"
        ).length;

    const eligibilityReadiness =
        eligibilityChecks.length === 0
            ? 0
            : Math.round(
                (eligibilityPassed /
                    eligibilityChecks.length) *
                100
            );


    // -----------------------------
    // 3. Technical Skill Readiness
    // -----------------------------

    const totalSkills =
        skillGapResult.totalRequiredSkills;

    const matchedSkills =
        skillGapResult.matchedSkillsCount;

    const technicalSkillReadiness =
        totalSkills === 0
            ? 100
            : Math.round(
                (matchedSkills /
                    totalSkills) *
                100
            );


    // -----------------------------
    // 4. Overall Readiness
    // -----------------------------

    const overallReadiness =
        Math.round(
            (
                academicReadiness +
                eligibilityReadiness +
                technicalSkillReadiness
            ) / 3
        );


    // -----------------------------
    // 5. Readiness Level
    // -----------------------------

    let readinessLevel;

    if (overallReadiness >= 85) {
        readinessLevel = "Excellent";
    } else if (overallReadiness >= 70) {
        readinessLevel = "Good";
    } else if (overallReadiness >= 50) {
        readinessLevel = "Needs Improvement";
    } else {
        readinessLevel = "Needs Preparation";
    }


    return {

        overallReadiness,

        readinessLevel,

        academicReadiness,

        eligibilityReadiness,

        technicalSkillReadiness,

        matchedSkills,

        totalSkills,

        missingSkills:
            skillGapResult.missingSkills,

        recommendation:
            skillGapResult.missingSkills.length > 0
                ? `Focus on ${skillGapResult.missingSkills.join(", ")} to improve your placement readiness.`
                : "Your profile matches the required placement criteria."
    };
};


module.exports = {
    calculateReadiness
};