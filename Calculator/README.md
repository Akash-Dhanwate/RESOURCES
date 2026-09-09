# CodeAlpha Calculator

A professional, responsive calculator built with semantic HTML5, CSS3, and vanilla JavaScript for the CodeAlpha Frontend Development internship.

## Features

- Addition, subtraction, multiplication, and division
- Standard operator precedence
- Decimal validation
- Intelligent consecutive-operator replacement
- Clear and delete controls
- Keyboard support
- Friendly division-by-zero and invalid-result handling
- Result continuation for chained calculations
- Responsive mobile, tablet, laptop, and desktop layout
- Semantic buttons, ARIA labels, live result announcements, and visible focus states
- Reduced-motion support
- No frameworks, libraries, `eval()`, or dynamic code execution

## Project structure

```text
CodeAlpha_Calculator/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## Run locally

No build process is required.

1. Download or clone the repository.
2. Open `index.html` in a modern browser.

For local development, you can also use VS Code Live Server or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Keyboard controls

| Key | Action |
|---|---|
| `0`–`9` | Enter a number |
| `.` | Add a decimal point |
| `+` | Add |
| `-` | Subtract |
| `*` | Multiply |
| `/` | Divide |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete the last digit |
| `Escape` | Clear the calculator |

## Calculation architecture

The application keeps calculation data in a JavaScript state object. Button clicks and keyboard events both call the same action functions, which validate input, update state, and render the display.

The calculation engine does not use `eval()`. It validates an alternating sequence of numbers and operators, reduces multiplication and division first, and then evaluates addition and subtraction. This provides standard arithmetic precedence while keeping execution controlled.

## Expected test cases

| Input | Expected behavior |
|---|---|
| `2 + 3` | `5` |
| `10 - 4` | `6` |
| `5 × 6` | `30` |
| `20 ÷ 4` | `5` |
| `0.5 + 1.2` | `1.7` |
| `2 + 3 × 4` | `14` |
| `10 ÷ 0` | Shows `Cannot divide by zero` |
| `5 + + 3` | Evaluates as `5 + 3` |
| `5 + × 3` | Evaluates as `5 × 3` |
| `12..5` | Ignores the second decimal point |
| `1000000 × 25` | `25000000` |
| Backspace | Removes the final digit of the current number |
| New digit after result | Starts a new calculation |
| Operator after result | Continues from the result |

## GitHub setup

Create an empty GitHub repository named `CodeAlpha_Calculator`, then run:

```bash
git init
git add .
git commit -m "Build responsive CodeAlpha calculator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CodeAlpha_Calculator.git
git push -u origin main
```

## Deployment

### GitHub Pages

1. Push the project to GitHub.
2. Open the repository's **Settings**.
3. Select **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder.
6. Save and wait for the deployment URL.

## Demo video outline

1. Introduce the project and technology stack.
2. Demonstrate all four arithmetic operations.
3. Show standard precedence with `2 + 3 × 4`.
4. Demonstrate decimals and invalid decimal prevention.
5. Demonstrate operator replacement.
6. Show division-by-zero handling.
7. Use keyboard controls.
8. Resize the page to show responsiveness.
9. Briefly explain state management and the safe calculation engine.
10. Show the GitHub repository and deployed application.

## LinkedIn post template

> I’m excited to share my responsive Calculator project, completed as part of my CodeAlpha Frontend Development internship.
>
> I built it using HTML5, CSS3, and vanilla JavaScript. The project includes standard arithmetic precedence, decimal and operator validation, keyboard controls, accessible interactions, responsive design, and a controlled calculation engine without `eval()`.
>
> This project strengthened my understanding of DOM manipulation, event handling, state management, input validation, responsive CSS Grid layouts, and accessible frontend development.
>
> GitHub: [repository link]\
> Live demo: [deployment link]
>
> #CodeAlpha #FrontendDevelopment #JavaScript #HTML #CSS #WebDevelopment

## Submission checklist

- [ ] Test every required calculation
- [ ] Test mouse, touch, and keyboard input
- [ ] Test mobile, tablet, and desktop sizes
- [ ] Check focus styles and keyboard navigation
- [ ] Confirm there are no console errors
- [ ] Replace `YOUR_USERNAME` in the Git commands
- [ ] Push the final source code to GitHub
- [ ] Deploy with GitHub Pages
- [ ] Add repository and live-demo URLs to this README
- [ ] Record the demonstration video
- [ ] Publish the LinkedIn post
- [ ] Submit all required internship links

## Author

Created for the CodeAlpha Frontend Development internship.
