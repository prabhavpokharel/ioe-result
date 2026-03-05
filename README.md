# IOE Result Calculator

> Track semester marks and calculate live aggregate / GPA for **Tribhuvan University — IOE** engineering students.

## File Structure

```
ioe-result-calculator/
├── index.html          ← Development entry point (links source files)
├── build.js            ← Build script → produces dist/index.html
├── package.json
├── .gitignore
├── src/
│   ├── data.js         ← All constants (programs, marks, thresholds)
│   ├── helpers.js      ← Pure utility functions (colours, labels, cells)
│   ├── dial.js         ← Arc gauge component
│   ├── ui.js           ← Mode switch, shared DOM components
│   ├── old-system.js   ← Old % system calculator
│   ├── new-system.js   ← New GPA system calculator
│   └── styles.css      ← All styles
└── dist/
    └── index.html      ← Production build (single file, minified)
```
