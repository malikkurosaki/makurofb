const fs = require('fs');
const execSync = require('child_process').execSync;

const root = execSync('npm root -g').toString().trim();
const deps = fs.readFileSync(`deps.json`).toString();

let listDept = "";
for(let d of JSON.parse(deps)) {
    listDept += `const ${d} = require('${root}/${d}');\n`;
}

listDept += `module.exports = {${JSON.parse(deps).join(',')}};`;
fs.writeFileSync(`./deps.js`, listDept);