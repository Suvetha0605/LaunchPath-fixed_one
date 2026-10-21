const normalize = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase();
};

const checkEligibility = (student, drive) => {

    const checks = [];
    const missingInformation = [];
    const missingSkills = [];

    // --------------------------------
    // 1. CGPA CHECK
    // --------------------------------

    if (
        student.cgpa === undefined ||
        student.cgpa === null ||
        student.cgpa === ""
    ) {
        missingInformation.push("CGPA");

        checks.push({
            criterion: "CGPA",
            required: drive.minimumCGPA,
            studentValue: "Not Provided",
            status: "missing",
            message: "CGPA is not available in your profile."
        });

    } else {

        const passed =
            Number(student.cgpa) >= Number(drive.minimumCGPA);

        checks.push({
            criterion: "CGPA",
            required: drive.minimumCGPA,
            studentValue: student.cgpa,
            status: passed ? "passed" : "failed",
            message: passed
                ? "Your CGPA meets the company requirement."
                : "Your CGPA is below the required minimum."
        });
    }


    // --------------------------------
    // 2. DEPARTMENT CHECK
    // --------------------------------

    const allowedDepartments =
        drive.allowedDepartments || [];

    if (allowedDepartments.length === 0) {

        checks.push({
            criterion: "Department",
            required: "Any Department",
            studentValue: student.department || "Not Provided",
            status: "passed",
            message: "This drive does not restrict departments."
        });

    } else {

        const studentDepartment =
            normalize(student.department);

        const departmentPassed =
            allowedDepartments.some(
                (department) =>
                    normalize(department) === studentDepartment
            );

        checks.push({
            criterion: "Department",
            required: allowedDepartments.join(", "),
            studentValue:
                student.department || "Not Provided",
            status: departmentPassed
                ? "passed"
                : "failed",
            message: departmentPassed
                ? "Your department is eligible for this drive."
                : "Your department is not included in the eligible departments."
        });
    }


    // --------------------------------
    // 3. GRADUATION YEAR CHECK
    // --------------------------------

    if (!drive.graduationYear) {

        checks.push({
            criterion: "Graduation Year",
            required: "Any Year",
            studentValue:
                student.graduationYear || "Not Provided",
            status: "passed",
            message: "No specific graduation year is required."
        });

    } else if (
        student.graduationYear === undefined ||
        student.graduationYear === null ||
        student.graduationYear === ""
    ) {

        missingInformation.push("Graduation Year");

        checks.push({
            criterion: "Graduation Year",
            required: drive.graduationYear,
            studentValue: "Not Provided",
            status: "missing",
            message: "Graduation year is not available in your profile."
        });

    } else {

        const graduationPassed =
            Number(student.graduationYear) ===
            Number(drive.graduationYear);

        checks.push({
            criterion: "Graduation Year",
            required: drive.graduationYear,
            studentValue: student.graduationYear,
            status: graduationPassed
                ? "passed"
                : "failed",
            message: graduationPassed
                ? "Your graduation year matches the requirement."
                : "Your graduation year does not match the required batch."
        });
    }


    // --------------------------------
    // 4. PERCENTAGE CHECK
    // --------------------------------

    if (
        drive.minimumPercentage &&
        drive.minimumPercentage > 0
    ) {

        if (
            student.percentage === undefined ||
            student.percentage === null ||
            student.percentage === ""
        ) {

            missingInformation.push("Percentage");

            checks.push({
                criterion: "Percentage",
                required: `${drive.minimumPercentage}%`,
                studentValue: "Not Provided",
                status: "missing",
                message: "Percentage is required to complete eligibility analysis."
            });

        } else {

            const percentagePassed =
                Number(student.percentage) >=
                Number(drive.minimumPercentage);

            checks.push({
                criterion: "Percentage",
                required: `${drive.minimumPercentage}%`,
                studentValue: `${student.percentage}%`,
                status: percentagePassed
                    ? "passed"
                    : "failed",
                message: percentagePassed
                    ? "Your percentage meets the requirement."
                    : "Your percentage is below the required minimum."
            });
        }
    }


    // --------------------------------
    // 5. BACKLOG CHECK
    // --------------------------------

    if (
        student.backlogs === undefined ||
        student.backlogs === null ||
        student.backlogs === ""
    ) {

        missingInformation.push("Backlogs");

        checks.push({
            criterion: "Active Backlogs",
            required: `Maximum ${drive.maximumBacklogs}`,
            studentValue: "Not Provided",
            status: "missing",
            message: "Backlog information is required to complete eligibility analysis."
        });

    } else {

        const backlogPassed =
            Number(student.backlogs) <=
            Number(drive.maximumBacklogs);

        checks.push({
            criterion: "Active Backlogs",
            required: `Maximum ${drive.maximumBacklogs}`,
            studentValue: student.backlogs,
            status: backlogPassed
                ? "passed"
                : "failed",
            message: backlogPassed
                ? "Your backlog count meets the requirement."
                : "Your active backlog count exceeds the allowed limit."
        });
    }


    // --------------------------------
    // 6. SKILLS CHECK
    // --------------------------------

    const requiredSkills =
        drive.requiredSkills || [];

    const studentSkills =
        student.skills || [];

    const normalizedStudentSkills =
        studentSkills.map((skill) =>
            normalize(skill)
        );

    requiredSkills.forEach((skill) => {

        if (
            !normalizedStudentSkills.includes(
                normalize(skill)
            )
        ) {
            missingSkills.push(skill);
        }
    });

    const skillsPassed =
        missingSkills.length === 0;

    checks.push({
        criterion: "Required Skills",
        required:
            requiredSkills.length > 0
                ? requiredSkills.join(", ")
                : "No specific skills",
        studentValue:
            studentSkills.length > 0
                ? studentSkills.join(", ")
                : "No Skills Added",
        status: skillsPassed
            ? "passed"
            : "failed",
        message: skillsPassed
            ? "You have all the required skills."
            : `You are missing ${missingSkills.length} required skill(s).`
    });


    // --------------------------------
    // OVERALL RESULT
    // --------------------------------

    const failedChecks =
        checks.filter(
            (check) => check.status === "failed"
        );

    const missingChecks =
        checks.filter(
            (check) => check.status === "missing"
        );

    let overallStatus;

    if (failedChecks.length > 0) {
        overallStatus = "not_eligible";
    } else if (missingChecks.length > 0) {
        overallStatus = "profile_incomplete";
    } else {
        overallStatus = "eligible";
    }


    // --------------------------------
    // READINESS PERCENTAGE
    // --------------------------------

    const availableChecks =
        checks.filter(
            (check) => check.status !== "missing"
        );

    const passedChecks =
        availableChecks.filter(
            (check) => check.status === "passed"
        );

    const readinessPercentage =
        availableChecks.length === 0
            ? 0
            : Math.round(
                (passedChecks.length /
                    availableChecks.length) *
                100
            );


    return {
        overallStatus,

        readinessPercentage,

        totalCriteria: checks.length,

        passedCriteria: passedChecks.length,

        failedCriteria: failedChecks.length,

        missingCriteria: missingChecks.length,

        checks,

        missingInformation,

        missingSkills
    };
};


module.exports = {
    checkEligibility
};