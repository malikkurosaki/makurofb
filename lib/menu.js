const { Select } = require('enquirer');
const { Login } = require('./login');
const { ShowUsers, CreateUser, DeleteUser, DeleteMany, UpdateUser } = require('./users');

const listMenu = [
    "show users",
    "create user",
    "delete user",
    "update user",
    "delete many user",
    "launch",
    "login",
    "exit"
]

async function Menu (){
    const select = await new Select({
        name: 'menu',
        message: 'Select menu',
        choices: listMenu
    }).run();

    switch (select) {
        case "show users":
            ShowUsers()
            break;
        case "create user":
            CreateUser()
            break;
        case "delete user":
            DeleteUser()
            break;
        case "update user":
            UpdateUser()
            break;
        case "delete many user":
            DeleteMany()
            break;
        case "launch":
            Launch()
            break;
        case "login":
            Login()
            break;
        case "exit":
            process.exit()
    }
}

module.exports = { Menu }