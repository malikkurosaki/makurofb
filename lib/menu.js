const { Select } = require('enquirer');
const colors = require('colors');
const execSync = require('child_process').execSync;

async function Menu() {
    let menu = await new Select({
        name: 'menu',
        message: "What do you want to do?",
        choices: [
            { name: 'push', message: "git push" },
            { name: 'exit', message: "exit" },
        ]
    }).run();

    switch (menu) {
        case 'push':
            console.log("coba pus".cyan)
            execSync('git add . && git commit -m "update" && git push', { stdio: 'inherit' });
            break;
        case 'exit':
            console.log('bye'.green);
            break;
        default:
            break;
    }

    console.log(menu);

}

module.exports = { Menu }