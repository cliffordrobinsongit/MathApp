// Sample problem data for seeding the database
const sampleProblems = [
  // Pre-Algebra - Basic Equations
  {
    title: "Basic One-Step Equation",
    category: "pre-algebra",
    subcategory: "one-step-equations",
    difficulty: "pre-algebra",
    problemText: "Solve for x: x + 7 = 15",
    answerFormat: "number",
    correctAnswer: "8",
    alternateAnswers: ["x = 8", "x=8"]
  },
  {
    title: "One-Step Subtraction",
    category: "pre-algebra",
    subcategory: "one-step-equations",
    difficulty: "pre-algebra",
    problemText: "Solve for x: x - 12 = 5",
    answerFormat: "number",
    correctAnswer: "17",
    alternateAnswers: ["x = 17", "x=17"]
  },
  {
    title: "One-Step Multiplication",
    category: "pre-algebra",
    subcategory: "one-step-equations",
    difficulty: "pre-algebra",
    problemText: "Solve for x: 4x = 28",
    answerFormat: "number",
    correctAnswer: "7",
    alternateAnswers: ["x = 7", "x=7"]
  },
  {
    title: "One-Step Division",
    category: "pre-algebra",
    subcategory: "one-step-equations",
    difficulty: "pre-algebra",
    problemText: "Solve for x: x/3 = 9",
    answerFormat: "number",
    correctAnswer: "27",
    alternateAnswers: ["x = 27", "x=27"]
  },

  // Pre-Algebra - Two-Step Equations
  {
    title: "Two-Step Equation 1",
    category: "pre-algebra",
    subcategory: "two-step-equations",
    difficulty: "pre-algebra",
    problemText: "Solve for x: 2x + 5 = 15",
    answerFormat: "number",
    correctAnswer: "5",
    alternateAnswers: ["x = 5", "x=5"]
  },
  {
    title: "Two-Step Equation 2",
    category: "pre-algebra",
    subcategory: "two-step-equations",
    difficulty: "pre-algebra",
    problemText: "Solve for x: 3x - 7 = 14",
    answerFormat: "number",
    correctAnswer: "7",
    alternateAnswers: ["x = 7", "x=7"]
  },
  {
    title: "Two-Step with Division",
    category: "pre-algebra",
    subcategory: "two-step-equations",
    difficulty: "pre-algebra",
    problemText: "Solve for x: x/4 + 6 = 10",
    answerFormat: "number",
    correctAnswer: "16",
    alternateAnswers: ["x = 16", "x=16"]
  },
  {
    title: "Two-Step Negative Coefficient",
    category: "pre-algebra",
    subcategory: "two-step-equations",
    difficulty: "pre-algebra",
    problemText: "Solve for x: -2x + 8 = 4",
    answerFormat: "number",
    correctAnswer: "2",
    alternateAnswers: ["x = 2", "x=2"]
  },

  // Algebra 1 - Linear Equations
  {
    title: "Multi-Step Linear Equation 1",
    category: "algebra",
    subcategory: "linear-equations",
    difficulty: "algebra-1",
    problemText: "Solve for x: 3(x + 4) = 21",
    answerFormat: "number",
    correctAnswer: "3",
    alternateAnswers: ["x = 3", "x=3"]
  },
  {
    title: "Multi-Step Linear Equation 2",
    category: "algebra",
    subcategory: "linear-equations",
    difficulty: "algebra-1",
    problemText: "Solve for x: 5x - 2(x + 3) = 9",
    answerFormat: "number",
    correctAnswer: "5",
    alternateAnswers: ["x = 5", "x=5"]
  },
  {
    title: "Variables on Both Sides",
    category: "algebra",
    subcategory: "linear-equations",
    difficulty: "algebra-1",
    problemText: "Solve for x: 4x + 7 = 2x + 19",
    answerFormat: "number",
    correctAnswer: "6",
    alternateAnswers: ["x = 6", "x=6"]
  },
  {
    title: "Distributive Property",
    category: "algebra",
    subcategory: "linear-equations",
    difficulty: "algebra-1",
    problemText: "Solve for x: 2(3x - 5) + 4 = 20",
    answerFormat: "number",
    correctAnswer: "4",
    alternateAnswers: ["x = 4", "x=4"]
  },

  // Algebra 1 - Basic Polynomials
  {
    title: "Simplify Expression 1",
    category: "algebra",
    subcategory: "polynomials",
    difficulty: "algebra-1",
    problemText: "Simplify: 3x + 5x - 2x",
    answerFormat: "expression",
    correctAnswer: "6x",
    alternateAnswers: ["6*x", "x*6"]
  },
  {
    title: "Simplify Expression 2",
    category: "algebra",
    subcategory: "polynomials",
    difficulty: "algebra-1",
    problemText: "Simplify: 2x² + 3x + 4x² - x",
    answerFormat: "expression",
    correctAnswer: "6x² + 2x",
    alternateAnswers: ["6x^2 + 2x", "2x + 6x²", "2x + 6x^2"]
  },
  {
    title: "Expand Expression",
    category: "algebra",
    subcategory: "polynomials",
    difficulty: "algebra-1",
    problemText: "Expand: 3(2x + 4)",
    answerFormat: "expression",
    correctAnswer: "6x + 12",
    alternateAnswers: ["12 + 6x", "6*x + 12"]
  },

  // Algebra 2 - Advanced
  {
    title: "Quadratic Equation",
    category: "algebra",
    subcategory: "quadratic-equations",
    difficulty: "algebra-2",
    problemText: "Solve for x: x² - 5x + 6 = 0 (give the smaller solution)",
    answerFormat: "number",
    correctAnswer: "2",
    alternateAnswers: ["x = 2", "x=2"]
  },
  {
    title: "Factoring Quadratic",
    category: "algebra",
    subcategory: "quadratic-equations",
    difficulty: "algebra-2",
    problemText: "Solve for x: x² + 7x + 12 = 0 (give the larger solution)",
    answerFormat: "number",
    correctAnswer: "-3",
    alternateAnswers: ["x = -3", "x=-3", "negative 3"]
  },
  {
    title: "System of Equations",
    category: "algebra",
    subcategory: "systems",
    difficulty: "algebra-2",
    problemText: "Find x: x + y = 10 and x - y = 4",
    answerFormat: "number",
    correctAnswer: "7",
    alternateAnswers: ["x = 7", "x=7"]
  },
  {
    title: "Rational Equation",
    category: "algebra",
    subcategory: "rational-equations",
    difficulty: "algebra-2",
    problemText: "Solve for x: (x + 2)/3 = 4",
    answerFormat: "number",
    correctAnswer: "10",
    alternateAnswers: ["x = 10", "x=10"]
  },
  {
    title: "Exponential Equation",
    category: "algebra",
    subcategory: "exponential-equations",
    difficulty: "algebra-2",
    problemText: "Solve for x: 2^x = 16",
    answerFormat: "number",
    correctAnswer: "4",
    alternateAnswers: ["x = 4", "x=4"]
  }
];

module.exports = sampleProblems;
