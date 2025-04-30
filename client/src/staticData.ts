// This file provides static data for GitHub Pages deployment
// It replaces the backend API calls with static data

export const topics = [
  { id: 4, name: 'Algebra', slug: 'algebra', difficulty: 'medium' },
  { id: 5, name: 'Trigonometry', slug: 'trigonometry', difficulty: 'hard' },
  { id: 6, name: 'Statistics', slug: 'statistics', difficulty: 'medium' },
];

export const flashcards = [
  {
    id: 22,
    question: 'Solve 2x+3=7. x=?',
    answer: '2',
    topicId: 4,
    difficulty: 'easy',
    hint: 'Subtract 3 from both sides, then divide by 2.'
  },
  {
    id: 23,
    question: 'Factor x²-9',
    answer: '(x+3)(x-3)',
    topicId: 4,
    difficulty: 'medium',
    hint: 'This is a difference of squares: a²-b²=(a+b)(a-b)'
  },
  {
    id: 24,
    question: 'Solve x²-5x+6=0',
    answer: 'x=2 or x=3',
    topicId: 4,
    difficulty: 'medium',
    hint: 'Try factoring into (x-a)(x-b)'
  },
  {
    id: 25,
    question: 'What is cos(60°)?',
    answer: '0.5',
    topicId: 5,
    difficulty: 'medium',
    hint: 'Remember the special angles on the unit circle'
  },
  {
    id: 26,
    question: 'What is sin(30°)?',
    answer: '0.5',
    topicId: 5,
    difficulty: 'easy',
    hint: 'Remember the special angles on the unit circle'
  },
  {
    id: 27,
    question: 'What is tan(45°)?',
    answer: '1',
    topicId: 5,
    difficulty: 'easy',
    hint: 'tan(θ) = sin(θ)/cos(θ)'
  },
  {
    id: 28,
    question: 'Mean of [2,4,6,8] is?',
    answer: '5',
    topicId: 6,
    difficulty: 'easy',
    hint: 'Add all numbers and divide by the count'
  },
  {
    id: 29,
    question: 'Median of [3,1,4,5,2] is?',
    answer: '3',
    topicId: 6,
    difficulty: 'easy',
    hint: 'Sort the array first, then find the middle value'
  },
  {
    id: 30,
    question: 'What is the standard deviation formula?',
    answer: 'σ = √(Σ(x-μ)²/N)',
    topicId: 6,
    difficulty: 'hard',
    hint: 'It measures how spread out the values are from the mean'
  }
];

export const quizQuestions = [
  {
    id: 6,
    question: 'What is sin(30°)?',
    correctAnswer: '0.5',
    topicId: 5,
    difficulty: 'easy',
    hint: 'Remember the special angles on the unit circle',
    options: [
      { id: '1', text: '0', correct: false },
      { id: '2', text: '0.5', correct: true },
      { id: '3', text: '1', correct: false },
      { id: '4', text: '√3/2', correct: false }
    ]
  },
  {
    id: 7,
    question: 'Solve for x: 2x+5=13',
    correctAnswer: '4',
    topicId: 4,
    difficulty: 'easy',
    hint: 'Subtract 5 from both sides, then divide by 2',
    options: [
      { id: '1', text: '3', correct: false },
      { id: '2', text: '4', correct: true },
      { id: '3', text: '5', correct: false },
      { id: '4', text: '6', correct: false }
    ]
  },
  {
    id: 8,
    question: 'What is the mean of [1,3,5,7,9]?',
    correctAnswer: '5',
    topicId: 6,
    difficulty: 'easy',
    hint: 'Add all numbers and divide by the count',
    options: [
      { id: '1', text: '3', correct: false },
      { id: '2', text: '4', correct: false },
      { id: '3', text: '5', correct: true },
      { id: '4', text: '6', correct: false }
    ]
  },
  {
    id: 9,
    question: 'Factor: x² - 4',
    correctAnswer: '(x+2)(x-2)',
    topicId: 4,
    difficulty: 'medium',
    hint: 'This is a difference of squares: a²-b²=(a+b)(a-b)',
    options: [
      { id: '1', text: '(x+4)(x-1)', correct: false },
      { id: '2', text: '(x+2)(x-2)', correct: true },
      { id: '3', text: '(x+4)(x-4)', correct: false },
      { id: '4', text: '(x+1)(x-4)', correct: false }
    ]
  },
  {
    id: 10,
    question: 'What is the value of cos(90°)?',
    correctAnswer: '0',
    topicId: 5,
    difficulty: 'easy',
    hint: 'Think about the unit circle',
    options: [
      { id: '1', text: '0', correct: true },
      { id: '2', text: '1', correct: false },
      { id: '3', text: '-1', correct: false },
      { id: '4', text: '0.5', correct: false }
    ]
  },
  {
    id: 11,
    question: 'What is the median of [2,5,1,8,4]?',
    correctAnswer: '4',
    topicId: 6,
    difficulty: 'medium',
    hint: 'Sort the array first, then find the middle value',
    options: [
      { id: '1', text: '2', correct: false },
      { id: '2', text: '4', correct: true },
      { id: '3', text: '5', correct: false },
      { id: '4', text: '3', correct: false }
    ]
  }
];