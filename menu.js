const {Select} = require(`enquirer`);

async function Menu(){
    return await new Select({
        name: `menu`,
        message: `What do you want to do?`,
        choices: [
            {title: `Create a new project`, value: `new`},
            {title: `Create a new component`, value: `component`},
        ]
    }).run()
}

module.exports = {Menu}