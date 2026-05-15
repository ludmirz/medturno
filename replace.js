const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'App.css');
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/--green/g, '--primary');

fs.writeFileSync(cssPath, css);
console.log('Done replacing colors.');

