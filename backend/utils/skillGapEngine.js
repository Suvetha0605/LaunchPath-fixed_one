const normalize = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase();
};

const skillKnowledgeBase = {
    git: {
        importance: "High",
        reason: "Git is commonly used for source code version control and team collaboration.",
        roadmap: [
            "Learn Git basics and repositories",
            "Practice git add, commit and status",
            "Learn branches and merging",
            "Practice resolving merge conflicts",
            "Learn GitHub repository workflow"
        ],
        beginnerTopics: [
            "git init",
            "git clone",
            "git add",
            "git commit",
            "git status",
            "git push",
            "git pull"
        ]
    },

    java: {
        importance: "High",
        reason: "Java is widely used for application development and enterprise software.",
        roadmap: [
            "Learn Java fundamentals",
            "Practice OOP concepts",
            "Learn collections",
            "Practice exception handling",
            "Build small Java applications"
        ],
        beginnerTopics: [
            "Variables",
            "Loops",
            "Methods",
            "Classes and Objects",
            "Inheritance",
            "Arrays"
        ]
    },

    sql: {
        importance: "High",
        reason: "SQL is important for working with relational databases and application data.",
        roadmap: [
            "Learn SELECT queries",
            "Practice filtering and sorting",
            "Learn JOIN operations",
            "Practice GROUP BY and aggregate functions",
            "Learn subqueries and database design"
        ],
        beginnerTopics: [
            "SELECT",
            "WHERE",
            "ORDER BY",
            "GROUP BY",
            "JOIN",
            "INSERT",
            "UPDATE",
            "DELETE"
        ]
    },

    react: {
        importance: "High",
        reason: "React is used to build modern interactive web interfaces.",
        roadmap: [
            "Learn React components",
            "Practice props and state",
            "Learn React hooks",
            "Work with APIs",
            "Build a complete React project"
        ],
        beginnerTopics: [
            "Components",
            "JSX",
            "Props",
            "State",
            "useState",
            "useEffect",
            "React Router"
        ]
    },

    python: {
        importance: "High",
        reason: "Python is widely used in software development, data science and AI applications.",
        roadmap: [
            "Learn Python fundamentals",
            "Practice functions and data structures",
            "Learn object-oriented programming",
            "Work with libraries",
            "Build Python projects"
        ],
        beginnerTopics: [
            "Variables",
            "Conditions",
            "Loops",
            "Functions",
            "Lists",
            "Dictionaries",
            "Classes"
        ]
    }
};

const createDefaultSkillPlan = (skill) => {
    return {
        importance: "Medium",
        reason: `${skill} is listed as a required skill for this placement opportunity.`,
        roadmap: [
            `Understand ${skill} fundamentals`,
            `Practice basic ${skill} concepts`,
            `Build a small project using ${skill}`,
            `Practice interview questions related to ${skill}`,
            `Add ${skill} to your practical project experience`
        ],
        beginnerTopics: [
            `${skill} fundamentals`,
            `${skill} practical concepts`,
            `${skill} project practice`,
            `${skill} interview preparation`
        ]
    };
};

const analyzeSkillGap = (studentSkills = [], requiredSkills = []) => {

    const normalizedStudentSkills = studentSkills.map(
        (skill) => normalize(skill)
    );

    const missingSkills = requiredSkills.filter(
        (skill) =>
            !normalizedStudentSkills.includes(
                normalize(skill)
            )
    );

    const matchedSkills = requiredSkills.filter(
        (skill) =>
            normalizedStudentSkills.includes(
                normalize(skill)
            )
    );

    const skillGaps = missingSkills.map((skill) => {

        const normalizedSkill = normalize(skill);

        const plan =
            skillKnowledgeBase[normalizedSkill] ||
            createDefaultSkillPlan(skill);

        return {
            skill,
            importance: plan.importance,
            reason: plan.reason,
            roadmap: plan.roadmap,
            beginnerTopics: plan.beginnerTopics
        };
    });

    return {
        totalRequiredSkills: requiredSkills.length,

        matchedSkillsCount: matchedSkills.length,

        missingSkillsCount: missingSkills.length,

        matchedSkills,

        missingSkills,

        skillGaps
    };
};

module.exports = {
    analyzeSkillGap
};