import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import "./Preparation.css";

// ==========================================
// CODING PRACTICE QUESTION BANK
// ==========================================
const CODING_QUESTIONS = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hash Map",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "nums[1] + nums[2] == 6."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n    // Implement your optimal O(n) solution here\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
      python: `def twoSum(nums, target):\n    # Implement your optimal O(n) solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Implement your optimal O(n) solution here\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`
    },
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      explanation:
        "By utilizing a Hash Map, we check for the required complement (target - current) in O(1) time complexity. This reduces the brute-force O(n²) pair lookup to a single pass through the array.",
      code: `// Optimal One-Pass Hash Map\nfunction twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`
    }
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
    examples: [
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All brackets open and close in matched sequence."
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "Mismatched bracket types."
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    starterCode: {
      javascript: `function isValid(s) {\n    // Use a stack to validate matching pairs\n    const stack = [];\n    const pairs = { ')': '(', '}': '{', ']': '[' };\n    for (const char of s) {\n        if (char === '(' || char === '{' || char === '[') {\n            stack.push(char);\n        } else {\n            if (stack.length === 0 || stack.pop() !== pairs[char]) {\n                return false;\n            }\n        }\n    }\n    return stack.length === 0;\n}`,
      python: `def isValid(s: str) -> bool:\n    # Use a stack to match brackets\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in pairs.values():\n            stack.append(char)\n        elif char in pairs:\n            if not stack or stack.pop() != pairs[char]:\n                return False\n    return len(stack) == 0`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`
    },
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      explanation:
        "A stack operates with Last-In-First-Out (LIFO) semantics, making it ideal for nested parentheses validation. Every closing bracket must correspond to the most recently opened bracket.",
      code: `function isValid(s) {\n    const stack = [];\n    for (const c of s) {\n        if (c === '(') stack.push(')');\n        else if (c === '{') stack.push('}');\n        else if (c === '[') stack.push(']');\n        else if (stack.length === 0 || stack.pop() !== c) return false;\n    }\n    return stack.length === 0;\n}`
    }
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    examples: [
      {
        input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "6",
        explanation: "The subarray [4, -1, 2, 1] has the largest sum = 6."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n    // Implement Kadane's algorithm\n    let currentSum = nums[0];\n    let maxSum = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currentSum = Math.max(nums[i], currentSum + nums[i]);\n        maxSum = Math.max(maxSum, currentSum);\n    }\n    return maxSum;\n}`,
      python: `def maxSubArray(nums: list[int]) -> int:\n    current_sum = max_sum = nums[0]\n    for num in nums[1:]:\n        current_sum = max(num, current_sum + num)\n        max_sum = max(max_sum, current_sum)\n    return max_sum`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        int currentSum = nums[0];\n        int maxSum = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            currentSum = Math.max(nums[i], currentSum + nums[i]);\n            maxSum = Math.max(maxSum, currentSum);\n        }\n        return maxSum;\n    }\n}`
    },
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      explanation:
        "Kadane's algorithm scans the array while maintaining the maximum sum ending at the current position. If currentSum becomes negative, resetting to the current element is preferable to continuing an overall negative prefix.",
      code: `function maxSubArray(nums) {\n    let currentSum = nums[0];\n    let maxSum = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currentSum = Math.max(nums[i], currentSum + nums[i]);\n        maxSum = Math.max(maxSum, currentSum);\n    }\n    return maxSum;\n}`
    }
  },
  {
    id: "binary-search",
    title: "Binary Search in Sorted Array",
    difficulty: "Easy",
    category: "Binary Search",
    description:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    examples: [
      {
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All integers in nums are unique and sorted."
    ],
    starterCode: {
      javascript: `function search(nums, target) {\n    let left = 0;\n    let right = nums.length - 1;\n    while (left <= right) {\n        const mid = Math.floor((left + right) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}`,
      python: `def search(nums: list[int], target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n}`
    },
    solution: {
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      explanation:
        "Binary search halves the search space at each comparison. By comparing the middle element with the target, we discard half the sorted array until the target is located or bounds cross.",
      code: `function search(nums, target) {\n    let left = 0, right = nums.length - 1;\n    while (left <= right) {\n        const mid = Math.floor(left + (right - left) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}`
    }
  }
];

// ==========================================
// TECHNICAL INTERVIEW QUESTION BANK
// ==========================================
const TECHNICAL_QUESTIONS = [
  {
    id: "java-equals",
    category: "Java",
    title: "Difference between '==' and '.equals()' in Java",
    answer:
      "'==' is a binary relational operator that compares memory references (addresses) of two objects in heap memory. In contrast, '.equals()' is a method defined in java.lang.Object that evaluates value/semantic equality when overridden (e.g., in String, Integer, or custom domain models).",
    codeSnippet: `String s1 = new String("hello");\nString s2 = new String("hello");\nSystem.out.println(s1 == s2);      // false (different memory references)\nSystem.out.println(s1.equals(s2));  // true (same character sequence)`,
    tip: "Always remember: Whenever you override .equals(), you must also override .hashCode() to maintain the contract required by hash-based collections (HashMap, HashSet)."
  },
  {
    id: "java-interface-abstract",
    category: "Java",
    title: "Abstract Class vs Interface in Java 8+",
    answer:
      "An abstract class supports instance variables, constructors, and stateful fields, allowing single inheritance ('extends'). An interface supports multiple inheritance ('implements') and, since Java 8, can include 'default' and 'static' methods, plus 'private' helper methods from Java 9 onwards.",
    codeSnippet: `// Interface with default implementation\npublic interface PaymentGateway {\n    void processPayment(double amount);\n    default void logTransaction(String id) {\n        System.out.println("Tx: " + id);\n    }\n}`,
    tip: "Use abstract classes for strong 'is-a' relationships sharing state and lifecycle. Use interfaces for capabilities and contracts ('can-do')."
  },
  {
    id: "java-memory-gc",
    category: "Java",
    title: "Java Memory Architecture & Garbage Collection",
    answer:
      "JVM memory is segregated into Heap (stores objects and instance variables, shared across threads) and Stack (stores method call frames, local variables, thread-specific). Garbage Collection (GC) automatically reclaims heap memory for unreachable objects using generational algorithms (Young Generation: Eden/Survivor, and Tenured/Old Generation).",
    codeSnippet: `// Object created on Heap; reference variable 'user' stored on Stack\nUser user = new User("Alice");`,
    tip: "Be prepared to explain common GC algorithms: G1 GC, ZGC, and mark-and-sweep phases."
  },
  {
    id: "sql-where-having",
    category: "SQL",
    title: "Difference between WHERE and HAVING Clauses in SQL",
    answer:
      "'WHERE' filters individual records BEFORE aggregation operations (GROUP BY) occur. 'HAVING' filters grouped results AFTER aggregation operations and can evaluate aggregate functions (COUNT, SUM, AVG, MAX, MIN).",
    codeSnippet: `SELECT department, AVG(salary) as avg_sal\nFROM employees\nWHERE status = 'Active'         -- Filters rows before grouping\nGROUP BY department\nHAVING AVG(salary) > 50000;     -- Filters grouped aggregates`,
    tip: "You cannot use aggregate functions directly in a WHERE clause (e.g. WHERE AVG(salary) > 50000 is invalid SQL)."
  },
  {
    id: "sql-joins",
    category: "SQL",
    title: "Types of SQL Joins and Their Behaviors",
    answer:
      "1. INNER JOIN: Returns rows with matching values in both tables.\n2. LEFT JOIN: Returns all rows from the left table and matched rows from the right table (NULL when unmatched).\n3. RIGHT JOIN: Returns all rows from the right table and matched rows from the left table.\n4. FULL OUTER JOIN: Returns rows when there is a match in either left or right table.",
    codeSnippet: `SELECT s.name, a.status\nFROM Students s\nLEFT JOIN Applications a ON s.id = a.student_id;`,
    tip: "Clarify with the interviewer how NULL values and duplicates on join keys affect query cardinality."
  },
  {
    id: "sql-acid",
    category: "SQL",
    title: "Explain ACID Properties in Relational Databases",
    answer:
      "Atomicity (all operations complete or entire transaction rolls back), Consistency (database transitions from one valid state to another satisfying all schema constraints), Isolation (concurrent transactions execute independently without interference), Durability (committed changes persist permanently even during system failures).",
    codeSnippet: `BEGIN TRANSACTION;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;`,
    tip: "Be ready to discuss isolation levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable."
  },
  {
    id: "react-virtual-dom",
    category: "React",
    title: "How does the Virtual DOM and Reconciliation Work in React?",
    answer:
      "The Virtual DOM (VDOM) is an in-memory lightweight JavaScript object representation of the real DOM. When state changes, React constructs a new VDOM tree, runs the 'diffing algorithm' (reconciliation) comparing it with the previous snapshot, and performs batched, minimal mutations on the actual browser DOM.",
    codeSnippet: `// React determines only the <h1> text changed, keeping parent elements intact\nreturn <div><h1>Welcome {userName}</h1></div>;`,
    tip: "Mention React Fiber (the re-implemented reconciliation engine that enables interruptible asynchronous rendering)."
  },
  {
    id: "react-hook-rules",
    category: "React",
    title: "Why Must React Hooks Follow Strict Calling Rules?",
    answer:
      "Hooks must be invoked at the top level of function components and cannot be wrapped in loops, conditions, or nested functions. React relies on the exact invocation order of hooks across render cycles to associate local state variables with internal fiber linked lists.",
    codeSnippet: `// ❌ VIOLATION: Hook called inside conditional\nif (isLoaded) { useEffect(() => {}, []); }\n\n// ✅ CORRECT: Condition checked inside effect\nuseEffect(() => {\n    if (isLoaded) { /* logic */ }\n}, [isLoaded]);`,
    tip: "The ESLint plugin 'eslint-plugin-react-hooks' enforces these rules automatically."
  },
  {
    id: "core-process-thread",
    category: "Core CS",
    title: "Process vs Thread: Core Operating System Differences",
    answer:
      "A Process is an executing instance of a program with its own dedicated memory space, registers, and system resources. A Thread is the smallest unit of execution within a process; multiple threads belonging to the same process share code, data, and open files, but possess separate stack spaces and program counters.",
    codeSnippet: `Process: Isolated memory, Heavy context switch, IPC needed (pipes, sockets)\nThread:  Shared memory, Light context switch, Potential race conditions`,
    tip: "Highlight concurrency pitfalls like race conditions, deadlocks, and synchronization mechanisms (mutexes, semaphores)."
  },
  {
    id: "core-url-request",
    category: "Core CS",
    title: "What Happens When You Type a URL in the Browser?",
    answer:
      "1. DNS Lookup: Browser resolves domain to IP via browser cache, OS cache, router cache, and recursive DNS servers.\n2. TCP Handshake: 3-way SYN, SYN-ACK, ACK handshake establishes reliable connection (followed by TLS handshake for HTTPS).\n3. HTTP Request: Browser transmits HTTP GET request.\n4. Server Processing: Web server/application gateway returns HTTP response and assets.\n5. Rendering: Browser parses HTML to construct DOM tree, CSS for CSSOM, combines into Render Tree, performs Layout and Painting.",
    codeSnippet: `Browser -> DNS -> TCP Handshake -> TLS Handshake -> HTTP GET -> Server Response -> DOM/CSSOM -> Render Tree -> Paint`,
    tip: "This is one of the most common placement interview questions; touch upon DNS caching and critical rendering path."
  }
];

// ==========================================
// HR INTERVIEW QUESTION BANK
// ==========================================
const HR_QUESTIONS = [
  {
    id: "hr-intro",
    title: "Tell me about yourself and your background.",
    purpose:
      "Recruiters evaluate communication fluency, structured thinking, self-awareness, and alignment with the job role.",
    strategy:
      "Apply the Present-Past-Future formula: Begin with your current academic/technical standing, highlight key projects or internships (past), and summarize why this campus placement role is your natural next step (future).",
    sampleAnswer:
      "I am a final-year Computer Science student passionate about full-stack web development and clean software engineering. Throughout my coursework, I built projects using React, Node.js, and MongoDB, including a campus portal that streamlined student applications. I enjoy solving real-world challenges, collaborating in team environments, and I am excited about joining your team as an Associate Software Engineer where I can contribute to high-impact products."
  },
  {
    id: "hr-strengths-weakness",
    title: "What are your greatest strengths and an area for improvement?",
    purpose:
      "Tests authentic self-reflection and proactive attitude toward constructive self-improvement.",
    strategy:
      "Highlight a concrete technical or collaborative strength with real evidence. For weakness, choose a genuine, non-critical skill you are actively remediating with measurable steps.",
    sampleAnswer:
      "My greatest strength is structured problem-solving and rapid adaptability; when working on team hackathons, I break complex requirements into manageable sprints. For improvement, I used to hesitate when delegating tasks in group assignments, fearing inconsistent quality. I have addressed this by adopting agile task boards, holding brief daily check-ins, and trusting teammates, which has significantly improved our velocity."
  },
  {
    id: "hr-why-company",
    title: "Why do you want to join our organization?",
    purpose:
      "Confirms whether you researched the company and are genuinely interested rather than applying indiscriminately.",
    strategy:
      "Reference specific aspects of the company: its product engineering culture, tech innovation, scale, or recent achievements that resonate with your goals.",
    sampleAnswer:
      "I have followed your organization's recent advancements in scalable cloud solutions and engineering culture. What stands out to me is your emphasis on mentorship for graduate engineers and encouraging ownership early on. Given my strong foundation in web technologies and eagerness to learn at enterprise scale, I believe your company is the ideal environment for me to grow."
  },
  {
    id: "hr-conflict",
    title: "Describe a challenging situation or project conflict and how you handled it.",
    purpose:
      "Assesses emotional intelligence, teamwork, communication, and resilience under pressure.",
    strategy:
      "Use the STAR Technique: Situation (context), Task (goal), Action (what you did), Result (positive quantifiable outcome).",
    sampleAnswer:
      "During our capstone project, our team disagreed on whether to use SQL or MongoDB. The deadline was approaching, and the disagreement was stalling development. I proposed listing our data model requirements: we had frequently evolving, nested document structures. We conducted a brief 2-hour prototype benchmark together, which proved document storage was 30% faster for our use case. We aligned peacefully and submitted the project on time."
  },
  {
    id: "hr-five-years",
    title: "Where do you see yourself in 3 to 5 years?",
    purpose:
      "Checks long-term ambition, loyalty, and realistic professional career planning.",
    strategy:
      "Focus on mastering core engineering craft, taking on technical mentorship, and expanding domain expertise within the organization.",
    sampleAnswer:
      "In the next 3 to 5 years, my goal is to evolve from an entry-level software engineer into a reliable core contributor who designs modular systems and mentors junior developers. I want to build deep domain expertise in cloud architectures and help lead feature deliverables from design to production."
  },
  {
    id: "hr-questions-for-interviewer",
    title: "Do you have any questions for us?",
    purpose:
      "Demonstrates high engagement, intellectual curiosity, and proactive mindset.",
    strategy:
      "Never say 'No'. Ask about team dynamics, continuous learning, and what excellence looks like in the first 90 days.",
    sampleAnswer:
      "Yes, thank you! I would love to know: 1. What does success look like for a graduate engineer in their first 90 days? 2. How does the engineering team facilitate code reviews and continuous learning for new joiners?"
  }
];

// ==========================================
// APTITUDE QUESTION BANK (10 MCQs)
// ==========================================
const APTITUDE_QUESTIONS = [
  {
    id: "apt-1",
    category: "Quantitative",
    question:
      "A train 150 meters long is travelling at a speed of 54 km/hr. How much time will it take to pass an electric pole?",
    options: ["8 seconds", "10 seconds", "12 seconds", "15 seconds"],
    correctIndex: 1,
    explanation:
      "Speed = 54 km/hr = 54 × (5/18) = 15 m/s. Distance to pass an electric pole = length of the train = 150 m. Time = Distance / Speed = 150 / 15 = 10 seconds."
  },
  {
    id: "apt-2",
    category: "Quantitative",
    question:
      "If the cost price of an article is 80% of its selling price, what is the profit percentage?",
    options: ["20%", "25%", "15%", "30%"],
    correctIndex: 1,
    explanation:
      "Let Selling Price (SP) = ₹100. Then Cost Price (CP) = ₹80. Profit = SP - CP = 100 - 80 = ₹20. Profit % = (Profit / CP) × 100 = (20 / 80) × 100 = 25%."
  },
  {
    id: "apt-3",
    category: "Quantitative",
    question:
      "A can complete a piece of work in 12 days and B can complete the same work in 24 days. Working together, in how many days will they finish the work?",
    options: ["6 days", "8 days", "10 days", "16 days"],
    correctIndex: 1,
    explanation:
      "A's 1-day work = 1/12. B's 1-day work = 1/24. Together in 1 day = 1/12 + 1/24 = 3/24 = 1/8. Therefore, the work will be completed in 8 days."
  },
  {
    id: "apt-4",
    category: "Quantitative",
    question:
      "Two dice are thrown simultaneously. What is the probability of getting two numbers whose sum is 8?",
    options: ["5/36", "1/6", "7/36", "1/9"],
    correctIndex: 0,
    explanation:
      "Total outcomes = 6 × 6 = 36. Favorable outcomes for sum 8: (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 outcomes. Probability = 5/36."
  },
  {
    id: "apt-5",
    category: "Logical",
    question:
      "Find the missing number in the sequence: 4, 9, 25, 49, 121, ?",
    options: ["144", "169", "196", "225"],
    correctIndex: 1,
    explanation:
      "The series consists of squares of consecutive prime numbers: 2² = 4, 3² = 9, 5² = 25, 7² = 49, 11² = 121. The next prime number is 13, and 13² = 169."
  },
  {
    id: "apt-6",
    category: "Logical",
    question:
      "Introducing a man, a woman says: 'His mother is the only daughter of my mother.' How is the woman related to the man?",
    options: ["Sister", "Mother", "Aunt", "Grandmother"],
    correctIndex: 1,
    explanation:
      "'The only daughter of my mother' refers to the woman herself. Since his mother is the woman herself, the woman is the man's Mother."
  },
  {
    id: "apt-7",
    category: "Logical",
    question:
      "Statements: All laptops are devices. Some devices are gadgets. Which conclusion logically follows?",
    options: [
      "All laptops are gadgets",
      "Some gadgets are devices",
      "No laptops are gadgets",
      "All gadgets are laptops"
    ],
    correctIndex: 1,
    explanation:
      "From 'Some devices are gadgets', we can immediately deduce the converse: 'Some gadgets are devices'. The other conclusions cannot be established with certainty."
  },
  {
    id: "apt-8",
    category: "Verbal",
    question:
      "Select the synonym for the word: CANDID",
    options: ["Secretive", "Frank", "Deceptive", "Shy"],
    correctIndex: 1,
    explanation:
      "'Candid' means truthful, straightforward, and frank. Hence, 'Frank' is the exact synonym."
  },
  {
    id: "apt-9",
    category: "Verbal",
    question:
      "Select the antonym for the word: METICULOUS",
    options: ["Careless", "Thorough", "Detailed", "Accurate"],
    correctIndex: 0,
    explanation:
      "'Meticulous' means showing great attention to detail. The opposite is 'Careless'."
  },
  {
    id: "apt-10",
    category: "Verbal",
    question:
      "Identify the grammatical error in the sentence: 'Neither of the two candidates have submitted their resume.'",
    options: [
      "Neither of",
      "the two candidates",
      "have submitted",
      "their resume"
    ],
    correctIndex: 2,
    explanation:
      "'Neither' is a singular indefinite pronoun when referring to two subjects individually. It takes a singular verb: 'has submitted' instead of 'have submitted'."
  }
];

function Preparation() {
  const navigate = useNavigate();
  const [preparationData, setPreparationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Practice section state: null (overview), "coding", "technical", "hr", "aptitude"
  const [activePractice, setActivePractice] = useState(null);

  // Coding Practice States
  const [selectedCodeId, setSelectedCodeId] = useState(CODING_QUESTIONS[0].id);
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [userCode, setUserCode] = useState(
    CODING_QUESTIONS[0].starterCode.javascript
  );
  const [showSolution, setShowSolution] = useState(false);

  // Technical Interview States
  const [techFilter, setTechFilter] = useState("all");
  const [techSearch, setTechSearch] = useState("");
  const [revealedTechIds, setRevealedTechIds] = useState(new Set());
  const [reviewedTechIds, setReviewedTechIds] = useState(new Set());

  // HR Interview States
  const [revealedHrIds, setRevealedHrIds] = useState(new Set());
  const [hrNotes, setHrNotes] = useState({});

  // Aptitude Practice States
  const [currentAptIndex, setCurrentAptIndex] = useState(0);
  const [aptCategory, setAptCategory] = useState("all");
  const [userAptAnswers, setUserAptAnswers] = useState({});
  const [checkedAptQuestions, setCheckedAptQuestions] = useState(new Set());

  useEffect(() => {
    let isMounted = true;
    const fetchPreparationData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/api/placements");
        const drives = response.data.drives || [];

        if (!isMounted) return;

        if (drives.length === 0) {
          setError("No placement drives available.");
          setLoading(false);
          return;
        }

        const selectedDriveId =
          localStorage.getItem("selectedDriveId") || drives[0]._id;

        const selectedDrive =
          drives.find((drive) => drive._id === selectedDriveId) || drives[0];

        const eligibilityResponse = await api.get(
          `/api/placements/${selectedDrive._id}/eligibility`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!isMounted) return;

        setPreparationData({
          drive: selectedDrive,
          skillGap: eligibilityResponse.data.skillGap,
          readiness: eligibilityResponse.data.readiness
        });
        setError("");
      } catch (err) {
        if (!isMounted) return;
        console.error("Preparation Error:", err);
        setError(
          err.response?.data?.message || "Unable to load preparation data."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPreparationData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Coding Handlers
  const currentCodeProblem =
    CODING_QUESTIONS.find((q) => q.id === selectedCodeId) ||
    CODING_QUESTIONS[0];

  const handleSelectCodeProblem = (probId) => {
    setSelectedCodeId(probId);
    setShowSolution(false);
    const target = CODING_QUESTIONS.find((q) => q.id === probId);
    if (target) {
      setUserCode(
        target.starterCode[codeLanguage] || target.starterCode.javascript
      );
    }
  };

  const handleChangeLanguage = (newLang) => {
    setCodeLanguage(newLang);
    setUserCode(
      currentCodeProblem.starterCode[newLang] ||
        currentCodeProblem.starterCode.javascript
    );
  };

  const handleResetCode = () => {
    setUserCode(
      currentCodeProblem.starterCode[codeLanguage] ||
        currentCodeProblem.starterCode.javascript
    );
    setShowSolution(false);
  };

  // Technical Interview Handlers
  const toggleTechAnswer = (id) => {
    setRevealedTechIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTechReviewed = (id) => {
    setReviewedTechIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredTechQuestions = TECHNICAL_QUESTIONS.filter((q) => {
    const matchesFilter =
      techFilter === "all" ||
      q.category.toLowerCase().includes(techFilter.toLowerCase());
    const matchesSearch =
      q.title.toLowerCase().includes(techSearch.toLowerCase()) ||
      q.answer.toLowerCase().includes(techSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // HR Interview Handlers
  const toggleHrAnswer = (id) => {
    setRevealedHrIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleHrNoteChange = (id, text) => {
    setHrNotes((prev) => ({ ...prev, [id]: text }));
  };

  // Aptitude Handlers
  const filteredAptitude = APTITUDE_QUESTIONS.filter(
    (q) => aptCategory === "all" || q.category === aptCategory
  );
  const currentApt = filteredAptitude[currentAptIndex] || filteredAptitude[0];

  const handleSelectAptOption = (qId, optionIdx) => {
    if (checkedAptQuestions.has(qId)) return; // Lock answer after checking
    setUserAptAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleCheckAptAnswer = (qId) => {
    setCheckedAptQuestions((prev) => new Set(prev).add(qId));
  };

  const handleResetAptitude = () => {
    setUserAptAnswers({});
    setCheckedAptQuestions(new Set());
    setCurrentAptIndex(0);
  };

  const correctAptCount = Object.entries(userAptAnswers).filter(
    ([qId, ansIdx]) => {
      const q = APTITUDE_QUESTIONS.find((item) => item.id === qId);
      return q && q.correctIndex === ansIdx;
    }
  ).length;

  return (
    <div className="preparation-layout">
      {/* Sidebar */}
      <aside className="preparation-sidebar">
        <div className="preparation-brand">
          <div className="brand-logo">LP</div>
          <div>
            <h2>LaunchPath</h2>
            <p>Career Platform</p>
          </div>
        </div>

        <nav className="preparation-nav">
          <button
            className="nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/profile")}
          >
            <span>👤</span>
            My Profile
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/companies")}
          >
            <span>🏢</span>
            Companies
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/placements")}
          >
            <span>📢</span>
            Placement Drives
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/skill-gap")}
          >
            <span>🎯</span>
            Skill Gap
          </button>

          <button className="nav-item active">
            <span>📚</span>
            Preparation
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/analytics")}
          >
            <span>📊</span>
            Analytics
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="preparation-main">
        <div className="preparation-header">
          <div>
            <p className="dashboard-label">CAREER DEVELOPMENT</p>
            <h1>Preparation Hub</h1>
            <p>
              Build the skills and confidence you need for your placement journey.
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              margin: "16px 0",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.2)"
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: "#64748b"
            }}
          >
            Loading preparation data...
          </div>
        ) : (
          <>
            {/* VIEW A: ACTIVE PRACTICE MODULE */}
            {activePractice !== null ? (
              <div className="prep-module-container">
                {/* Top Nav: Back button and practice switcher tabs */}
                <div className="prep-top-nav">
                  <button
                    className="prep-back-btn"
                    onClick={() => setActivePractice(null)}
                  >
                    ← Back to Preparation Hub
                  </button>

                  <div className="prep-tab-group">
                    <button
                      className={`prep-tab-btn ${
                        activePractice === "coding" ? "active" : ""
                      }`}
                      onClick={() => setActivePractice("coding")}
                    >
                      💻 Coding Practice
                    </button>
                    <button
                      className={`prep-tab-btn ${
                        activePractice === "technical" ? "active" : ""
                      }`}
                      onClick={() => setActivePractice("technical")}
                    >
                      🧠 Technical Interview
                    </button>
                    <button
                      className={`prep-tab-btn ${
                        activePractice === "hr" ? "active" : ""
                      }`}
                      onClick={() => setActivePractice("hr")}
                    >
                      🤝 HR Interview
                    </button>
                    <button
                      className={`prep-tab-btn ${
                        activePractice === "aptitude" ? "active" : ""
                      }`}
                      onClick={() => setActivePractice("aptitude")}
                    >
                      📝 Aptitude Practice
                    </button>
                  </div>
                </div>

                {/* 1. CODING PRACTICE MODULE */}
                {activePractice === "coding" && (
                  <div className="prep-practice-box">
                    <div className="prep-box-header">
                      <div>
                        <h2>Coding Practice Playground</h2>
                        <p>
                          Practice campus recruitment data structures and algorithm
                          challenges with reference solutions.
                        </p>
                      </div>
                    </div>

                    <div className="coding-layout-split">
                      {/* Question Sidebar */}
                      <div className="coding-questions-sidebar">
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#64748b",
                            marginBottom: "4px"
                          }}
                        >
                          SELECT CHALLENGE
                        </span>
                        {CODING_QUESTIONS.map((q) => (
                          <div
                            key={q.id}
                            className={`coding-question-item ${
                              selectedCodeId === q.id ? "selected" : ""
                            }`}
                            onClick={() => handleSelectCodeProblem(q.id)}
                          >
                            <div className="coding-q-title">{q.title}</div>
                            <div className="coding-q-meta">
                              <span
                                className={`difficulty-badge ${q.difficulty.toLowerCase()}`}
                              >
                                {q.difficulty}
                              </span>
                              <span style={{ color: "#64748b" }}>
                                {q.category}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Main Coding Workspace */}
                      <div className="coding-workspace">
                        <div className="coding-problem-desc">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "8px"
                            }}
                          >
                            <h3>{currentCodeProblem.title}</h3>
                            <span
                              className={`difficulty-badge ${currentCodeProblem.difficulty.toLowerCase()}`}
                            >
                              {currentCodeProblem.difficulty}
                            </span>
                          </div>
                          <p>{currentCodeProblem.description}</p>

                          <div className="coding-examples-box">
                            {currentCodeProblem.examples.map((ex, idx) => (
                              <div key={idx} className="coding-example-card">
                                <div>
                                  <strong>Example {idx + 1}:</strong>{" "}
                                  <code>{ex.input}</code>
                                </div>
                                <div>
                                  <strong>Output:</strong>{" "}
                                  <code>{ex.output}</code>
                                </div>
                                {ex.explanation && (
                                  <div
                                    style={{
                                      color: "#64748b",
                                      marginTop: "4px"
                                    }}
                                  >
                                    {ex.explanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Editor Panel */}
                        <div className="coding-editor-panel">
                          <div className="editor-toolbar">
                            <label
                              style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#475569"
                              }}
                            >
                              Language:{" "}
                              <select
                                value={codeLanguage}
                                onChange={(e) =>
                                  handleChangeLanguage(e.target.value)
                                }
                              >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                              </select>
                            </label>

                            <button
                              className="coding-btn-secondary"
                              onClick={handleResetCode}
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                            >
                              ↺ Reset Code
                            </button>
                          </div>

                          <div className="editor-textarea-wrapper">
                            <div className="editor-textarea-header">
                              <span>solution.{codeLanguage === "javascript" ? "js" : codeLanguage === "python" ? "py" : "java"}</span>
                              <span>UTF-8</span>
                            </div>
                            <textarea
                              className="coding-textarea"
                              value={userCode}
                              onChange={(e) => setUserCode(e.target.value)}
                              spellCheck="false"
                              placeholder="Write your code here..."
                            />
                          </div>

                          <div className="coding-actions-bar">
                            <button
                              className="coding-btn-primary"
                              onClick={() => setShowSolution((prev) => !prev)}
                            >
                              {showSolution
                                ? "Hide Reference Solution"
                                : "Check / View Reference Solution →"}
                            </button>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#64748b",
                                alignSelf: "center"
                              }}
                            >
                              Reference solution provides optimal Time & Space
                              Complexity analysis.
                            </span>
                          </div>

                          {showSolution && (
                            <div className="coding-solution-panel">
                              <h4>
                                💡 Optimal Approach:{" "}
                                {currentCodeProblem.solution.timeComplexity}{" "}
                                Time,{" "}
                                {currentCodeProblem.solution.spaceComplexity}{" "}
                                Space
                              </h4>
                              <p
                                style={{
                                  fontSize: "13px",
                                  color: "#166534",
                                  lineHeight: 1.5
                                }}
                              >
                                {currentCodeProblem.solution.explanation}
                              </p>
                              <pre className="coding-solution-code">
                                {currentCodeProblem.solution.code}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TECHNICAL INTERVIEW MODULE */}
                {activePractice === "technical" && (
                  <div className="prep-practice-box">
                    <div className="prep-box-header">
                      <div>
                        <h2>Technical Interview Preparation</h2>
                        <p>
                          Master frequent placement questions across Java, SQL,
                          React, and core computer science fundamentals.
                        </p>
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#16a34a",
                          background: "#f0fdf4",
                          padding: "6px 14px",
                          borderRadius: "999px",
                          border: "1px solid #bbf7d0"
                        }}
                      >
                        ✓ {reviewedTechIds.size} / {TECHNICAL_QUESTIONS.length}{" "}
                        Reviewed
                      </div>
                    </div>

                    <div className="tech-filter-bar">
                      <div className="tech-filter-chips">
                        {["all", "Java", "SQL", "React", "Core CS"].map(
                          (cat) => (
                            <button
                              key={cat}
                              className={`tech-chip ${
                                techFilter.toLowerCase() === cat.toLowerCase()
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => setTechFilter(cat)}
                            >
                              {cat === "all" ? "All Topics" : cat}
                            </button>
                          )
                        )}
                      </div>

                      <input
                        type="text"
                        className="tech-search-input"
                        placeholder="Search technical questions..."
                        value={techSearch}
                        onChange={(e) => setTechSearch(e.target.value)}
                      />
                    </div>

                    <div className="tech-qa-list">
                      {filteredTechQuestions.map((q) => {
                        const isRevealed = revealedTechIds.has(q.id);
                        const isReviewed = reviewedTechIds.has(q.id);

                        return (
                          <div
                            key={q.id}
                            className={`tech-qa-card ${
                              isReviewed ? "reviewed" : ""
                            }`}
                          >
                            <div
                              className="tech-qa-header"
                              onClick={() => toggleTechAnswer(q.id)}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px"
                                }}
                              >
                                <span style={{ fontSize: "16px" }}>
                                  {isRevealed ? "▼" : "▶"}
                                </span>
                                <h3 className="tech-qa-title">{q.title}</h3>
                              </div>

                              <div className="tech-qa-badges">
                                <span className="tech-category-tag">
                                  {q.category}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTechReviewed(q.id);
                                  }}
                                  style={{
                                    border: "none",
                                    background: isReviewed
                                      ? "#dcfce7"
                                      : "#f1f5f9",
                                    color: isReviewed ? "#15803d" : "#64748b",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    cursor: "pointer"
                                  }}
                                >
                                  {isReviewed ? "✓ Reviewed" : "Mark Reviewed"}
                                </button>
                              </div>
                            </div>

                            {isRevealed && (
                              <div className="tech-qa-content">
                                <p style={{ marginTop: "12px" }}>{q.answer}</p>
                                {q.codeSnippet && (
                                  <pre>{q.codeSnippet}</pre>
                                )}
                                {q.tip && (
                                  <div
                                    style={{
                                      background: "#fefce8",
                                      border: "1px solid #fef08a",
                                      color: "#854d0e",
                                      padding: "8px 12px",
                                      borderRadius: "6px",
                                      fontSize: "12px",
                                      marginTop: "8px"
                                    }}
                                  >
                                    💡 <strong>Interview Tip:</strong> {q.tip}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. HR INTERVIEW MODULE */}
                {activePractice === "hr" && (
                  <div className="prep-practice-box">
                    <div className="prep-box-header">
                      <div>
                        <h2>HR Interview Mastery</h2>
                        <p>
                          Prepare authentic, high-impact responses for behavioral
                          and culture-fit interview rounds.
                        </p>
                      </div>
                    </div>

                    <div className="hr-grid">
                      {HR_QUESTIONS.map((item, idx) => {
                        const isRevealed = revealedHrIds.has(item.id);

                        return (
                          <div key={item.id} className="hr-card">
                            <span className="hr-q-badge">Question {idx + 1}</span>
                            <h3>{item.title}</h3>

                            <div className="hr-tip-box">
                              <strong>🎯 What Interviewers Look For:</strong>
                              <p style={{ margin: "4px 0 0 0" }}>{item.purpose}</p>
                            </div>

                            <div
                              style={{
                                fontSize: "12px",
                                color: "#475569",
                                lineHeight: 1.5
                              }}
                            >
                              <strong>Strategy:</strong> {item.strategy}
                            </div>

                            <button
                              type="button"
                              className="coding-btn-secondary"
                              onClick={() => toggleHrAnswer(item.id)}
                              style={{ width: "100%", fontSize: "12px" }}
                            >
                              {isRevealed
                                ? "Hide Model Response"
                                : "Reveal Suggested Response →"}
                            </button>

                            {isRevealed && (
                              <div className="hr-answer-reveal">
                                <strong>Suggested Sample Response:</strong>
                                <p style={{ margin: "6px 0 0 0" }}>
                                  "{item.sampleAnswer}"
                                </p>
                              </div>
                            )}

                            <div>
                              <label
                                style={{
                                  display: "block",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: "#64748b",
                                  marginBottom: "4px"
                                }}
                              >
                                Practice Your Personal Response:
                              </label>
                              <textarea
                                className="hr-textarea"
                                placeholder="Draft your answer here to build interview muscle memory..."
                                value={hrNotes[item.id] || ""}
                                onChange={(e) =>
                                  handleHrNoteChange(item.id, e.target.value)
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. APTITUDE PRACTICE MODULE */}
                {activePractice === "aptitude" && (
                  <div className="prep-practice-box">
                    <div className="prep-box-header">
                      <div>
                        <h2>Aptitude Assessment Practice</h2>
                        <p>
                          Test your quantitative, logical, and verbal skills with
                          instant scoring and detailed solutions.
                        </p>
                      </div>

                      <div className="aptitude-stats">
                        <div className="aptitude-stat-item">
                          <span>SCORE</span>
                          <strong>
                            {correctAptCount} / {checkedAptQuestions.size}
                          </strong>
                        </div>
                        <div className="aptitude-stat-item">
                          <span>ACCURACY</span>
                          <strong>
                            {checkedAptQuestions.size > 0
                              ? Math.round(
                                  (correctAptCount / checkedAptQuestions.size) *
                                    100
                                )
                              : 0}
                            %
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Filter Category & Reset */}
                    <div className="tech-filter-bar">
                      <div className="tech-filter-chips">
                        {["all", "Quantitative", "Logical", "Verbal"].map(
                          (cat) => (
                            <button
                              key={cat}
                              className={`tech-chip ${
                                aptCategory === cat ? "active" : ""
                              }`}
                              onClick={() => {
                                setAptCategory(cat);
                                setCurrentAptIndex(0);
                              }}
                            >
                              {cat === "all" ? "All Aptitude" : cat}
                            </button>
                          )
                        )}
                      </div>

                      <button
                        className="coding-btn-secondary"
                        onClick={handleResetAptitude}
                        style={{ fontSize: "12px", padding: "6px 12px" }}
                      >
                        ↺ Reset Session
                      </button>
                    </div>

                    {/* Question Card */}
                    {currentApt && (
                      <div className="aptitude-question-card">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <span className="aptitude-q-number">
                            Question {currentAptIndex + 1} of{" "}
                            {filteredAptitude.length} • {currentApt.category}
                          </span>
                        </div>

                        <p className="aptitude-q-text">{currentApt.question}</p>

                        {/* Options */}
                        <div className="aptitude-options-list">
                          {currentApt.options.map((opt, optIdx) => {
                            const isChosen =
                              userAptAnswers[currentApt.id] === optIdx;
                            const isChecked = checkedAptQuestions.has(
                              currentApt.id
                            );
                            const isCorrect = currentApt.correctIndex === optIdx;

                            let optionClass = "";
                            if (isChecked) {
                              if (isCorrect) optionClass = "correct";
                              else if (isChosen && !isCorrect)
                                optionClass = "wrong";
                            } else if (isChosen) {
                              optionClass = "selected";
                            }

                            return (
                              <div
                                key={optIdx}
                                className={`aptitude-option-item ${optionClass}`}
                                onClick={() =>
                                  handleSelectAptOption(currentApt.id, optIdx)
                                }
                              >
                                <span
                                  style={{
                                    fontWeight: 700,
                                    width: "20px"
                                  }}
                                >
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span>{opt}</span>
                                {isChecked && isCorrect && (
                                  <span
                                    style={{
                                      marginLeft: "auto",
                                      color: "#16a34a",
                                      fontWeight: 700
                                    }}
                                  >
                                    ✓ Correct
                                  </span>
                                )}
                                {isChecked && isChosen && !isCorrect && (
                                  <span
                                    style={{
                                      marginLeft: "auto",
                                      color: "#dc2626",
                                      fontWeight: 700
                                    }}
                                  >
                                    ✗ Incorrect
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Action & Explanation */}
                        {checkedAptQuestions.has(currentApt.id) && (
                          <div className="aptitude-explanation-box">
                            <strong>Detailed Solution:</strong>
                            <p style={{ margin: "6px 0 0 0" }}>
                              {currentApt.explanation}
                            </p>
                          </div>
                        )}

                        <div className="aptitude-controls">
                          <button
                            className="coding-btn-secondary"
                            disabled={currentAptIndex === 0}
                            onClick={() =>
                              setCurrentAptIndex((prev) => Math.max(0, prev - 1))
                            }
                            style={{
                              opacity: currentAptIndex === 0 ? 0.5 : 1,
                              cursor:
                                currentAptIndex === 0
                                  ? "not-allowed"
                                  : "pointer"
                            }}
                          >
                            ← Previous
                          </button>

                          <div>
                            {!checkedAptQuestions.has(currentApt.id) ? (
                              <button
                                className="coding-btn-primary"
                                disabled={
                                  userAptAnswers[currentApt.id] === undefined
                                }
                                onClick={() =>
                                  handleCheckAptAnswer(currentApt.id)
                                }
                                style={{
                                  opacity:
                                    userAptAnswers[currentApt.id] === undefined
                                      ? 0.5
                                      : 1,
                                  cursor:
                                    userAptAnswers[currentApt.id] === undefined
                                      ? "not-allowed"
                                      : "pointer"
                                }}
                              >
                                Check Answer
                              </button>
                            ) : (
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: "#15803d"
                                }}
                              >
                                Answer Submitted
                              </span>
                            )}
                          </div>

                          <button
                            className="coding-btn-primary"
                            disabled={
                              currentAptIndex === filteredAptitude.length - 1
                            }
                            onClick={() =>
                              setCurrentAptIndex((prev) =>
                                Math.min(filteredAptitude.length - 1, prev + 1)
                              )
                            }
                            style={{
                              opacity:
                                currentAptIndex === filteredAptitude.length - 1
                                  ? 0.5
                                  : 1,
                              cursor:
                                currentAptIndex === filteredAptitude.length - 1
                                  ? "not-allowed"
                                  : "pointer"
                            }}
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* VIEW B: OVERVIEW (ORIGINAL LEARNING PATH & 4 CARDS) */
              <>
                {/* Target Opportunity */}
                <section className="preparation-target">
                  <div>
                    <p className="section-label">CURRENT TARGET</p>
                    <h2>{preparationData?.drive?.jobRole}</h2>
                    <p>
                      {preparationData?.drive?.companyName} •{" "}
                      {preparationData?.drive?.jobLocation}
                    </p>
                  </div>

                  <div className="target-package">
                    <span>Package</span>
                    <strong>₹{preparationData?.drive?.package} LPA</strong>
                  </div>
                </section>

                {/* Progress */}
                <section className="preparation-progress-card">
                  <div className="progress-header">
                    <div>
                      <p className="section-label">PREPARATION PROGRESS</p>
                      <h2>Placement Readiness</h2>
                      <p>
                        Continue improving your technical and interview skills.
                      </p>
                    </div>

                    <div className="progress-score">
                      <strong>
                        {preparationData?.readiness?.technicalSkillReadiness}%
                      </strong>
                      <span>Ready</span>
                    </div>
                  </div>

                  <div className="preparation-progress-bar">
                    <div
                      style={{
                        width: `${preparationData?.readiness?.technicalSkillReadiness}%`
                      }}
                    ></div>
                  </div>
                </section>

                {/* Preparation Areas */}
                <section className="preparation-section">
                  <div className="section-heading">
                    <div>
                      <p className="section-label">LEARNING PATH</p>
                      <h2>Technical Preparation</h2>
                    </div>

                    <span className="section-count">
                      {preparationData?.skillGap?.matchedSkillsCount} /{" "}
                      {preparationData?.skillGap?.totalRequiredSkills} completed
                    </span>
                  </div>

                  <div className="preparation-grid">
                    <div className="preparation-card completed">
                      <div className="preparation-icon">☕</div>
                      <div>
                        <h3>
                          {preparationData?.skillGap?.matchedSkills?.[0] ||
                            "Skill"}
                        </h3>
                        <p>
                          OOP, classes, inheritance, loops and exception
                          handling.
                        </p>
                      </div>
                      <span className="completion-badge">✓ Completed</span>
                    </div>

                    <div className="preparation-card completed">
                      <div className="preparation-icon">🗄️</div>
                      <div>
                        <h3>
                          {preparationData?.skillGap?.matchedSkills?.[1] ||
                            "Skill"}
                        </h3>
                        <p>
                          Queries, joins, grouping, subqueries and database
                          concepts.
                        </p>
                      </div>
                      <span className="completion-badge">✓ Completed</span>
                    </div>

                    <div className="preparation-card completed">
                      <div className="preparation-icon">⚛️</div>
                      <div>
                        <h3>
                          {preparationData?.skillGap?.matchedSkills?.[2] ||
                            "Skill"}
                        </h3>
                        <p>
                          Components, props, state, hooks and API integration.
                        </p>
                      </div>
                      <span className="completion-badge">✓ Completed</span>
                    </div>

                    <div className="preparation-card pending">
                      <div className="preparation-icon">🌿</div>
                      <div>
                        <h3>
                          {preparationData?.skillGap?.missingSkills?.[0] ||
                            "Skill"}
                        </h3>
                        <p>
                          Learn repositories, branching, commits, pull requests
                          and collaboration.
                        </p>
                      </div>
                      <span className="pending-badge">Start Learning</span>
                    </div>
                  </div>
                </section>

                {/* Interview Preparation - WORKING BUTTONS */}
                <section className="preparation-section">
                  <div className="section-heading">
                    <div>
                      <p className="section-label">INTERVIEW READINESS</p>
                      <h2>Interview Preparation</h2>
                    </div>
                  </div>

                  <div className="interview-grid">
                    <div className="interview-card">
                      <span>💻</span>
                      <h3>Coding Practice</h3>
                      <p>
                        Practice programming problems and improve problem-solving
                        skills.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActivePractice("coding")}
                      >
                        Start Practice →
                      </button>
                    </div>

                    <div className="interview-card">
                      <span>🧠</span>
                      <h3>Technical Interview</h3>
                      <p>
                        Revise Java, SQL, React and core computer science
                        concepts.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActivePractice("technical")}
                      >
                        Prepare Now →
                      </button>
                    </div>

                    <div className="interview-card">
                      <span>🤝</span>
                      <h3>HR Interview</h3>
                      <p>
                        Prepare common HR questions and improve communication
                        confidence.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActivePractice("hr")}
                      >
                        Practice HR →
                      </button>
                    </div>

                    <div className="interview-card">
                      <span>📝</span>
                      <h3>Aptitude</h3>
                      <p>
                        Practice quantitative aptitude, logical reasoning and
                        verbal ability.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActivePractice("aptitude")}
                      >
                        Practice Aptitude →
                      </button>
                    </div>
                  </div>
                </section>

                {/* Recommended Next Step */}
                <section className="recommendation-card">
                  <div className="recommendation-icon">💡</div>
                  <div>
                    <p className="section-label">RECOMMENDED NEXT STEP</p>
                    <h2>Complete Git & GitHub Preparation</h2>
                    <p>
                      Git is currently the main technical skill missing from
                      your target placement requirements.
                    </p>
                  </div>
                  <button onClick={() => navigate("/skill-gap")}>
                    View Skill Gap →
                  </button>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Preparation;