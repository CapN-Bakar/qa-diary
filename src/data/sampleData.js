import { uid } from '../utils/helpers'

export const SAMPLE_ENTRIES = [
  {
    id: uid(),
    date: '2025-06-02',
    category: 'Learning',
    title: 'Understanding Boundary Value Analysis',
    content: `Boundary Value Analysis (BVA) is a test design technique where test cases are designed to include values at the boundaries of equivalence classes.\n\nKey points:\n- Test at minimum, minimum+1, nominal, maximum-1, and maximum values\n- Defects are more likely to occur at boundaries than at the center of the domain\n- Works well alongside Equivalence Partitioning\n\nExample: For a field accepting ages 18–65:\n- Invalid: 17, 66\n- Valid boundaries: 18, 65\n- Nominal: any middle value like 40`,
    tags: ['BVA', 'test design', 'equivalence partitioning'],
    isPrivate: false,
  },
  {
    id: uid(),
    date: '2025-06-05',
    category: 'Good Practice',
    title: 'Always Write Test Cases Before Coding',
    content: `Writing test cases before you start testing forces you to think about requirements more clearly.\n\nBenefits:\n- Uncovers ambiguous requirements early\n- Serves as living documentation\n- Makes review easier for the team\n- Reduces rework later in the cycle\n\nThis is the essence of Shift-Left Testing — catching issues as early as possible.`,
    tags: ['shift-left', 'test planning', 'documentation'],
    isPrivate: false,
  },
  {
    id: uid(),
    date: '2025-06-08',
    category: 'Bug Analysis',
    title: 'Root Cause: Missing Null Check Caused Login Crash',
    content: `Found a bug today where logging in with an email that has no associated account caused a NullPointerException on the backend, returning a 500 instead of a proper 404.\n\nRoot Cause: The service layer assumed getUser() always returns an object — no null check.\n\nLesson: Always test with empty/null inputs. APIs should never expose raw server errors to clients.`,
    tags: ['null handling', 'API testing', 'error handling'],
    isPrivate: false,
  },
  {
    id: uid(),
    date: '2025-06-10',
    category: 'Tool/Technique',
    title: 'Getting Started with Selenium WebDriver',
    content: `Set up my first Selenium test today using Java + TestNG. Here's what I learned:\n\n1. WebDriver.get(url) — navigate to a URL\n2. findElement(By.id("...")) — locate elements\n3. sendKeys() — type into inputs\n4. click() — trigger button actions\n5. WebDriverWait — explicit waits (preferred over Thread.sleep)\n\nTip: Use Page Object Model (POM) from the start to keep tests maintainable.`,
    tags: ['selenium', 'automation', 'java', 'testng'],
    isPrivate: false,
  },
  {
    id: uid(),
    date: '2025-06-12',
    category: 'Reflection',
    title: 'Week 2 Retrospective',
    content: `Second week of the course done. Feeling more confident about test design techniques now.\n\nWhat went well: Understood BVA and EP clearly. Wrote 12 test cases for the assignment.\n\nWhat to improve: Need to spend more time on API testing tools.\n\nGoal for next week: Complete the Selenium module and write my first automated test suite.`,
    tags: ['retrospective', 'week 2', 'goals'],
    isPrivate: true,
  },
]

export const QUOTES = [
  { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
  { text: 'Testing leads to failure, and failure leads to understanding.', author: 'Burt Rutan' },
  { text: 'The bitterness of poor quality remains long after the sweetness of meeting the schedule has been forgotten.', author: 'Karl Wiegers' },
  { text: "It's not enough to do your best; you must know what to do, and then do your best.", author: 'W. Edwards Deming' },
  { text: 'If debugging is the process of removing software bugs, then programming must be the process of putting them in.', author: 'Edsger W. Dijkstra' },
  { text: 'Program testing can be used to show the presence of bugs, but never to show their absence.', author: 'Edsger W. Dijkstra' },
  { text: 'Beware of bugs in the above code; I have only proved it correct, not tried it.', author: 'Donald Knuth' },
]
