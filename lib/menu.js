const { Select } = require('enquirer');
const colors = require('colors');
const { Logout } = require('./logout.js');
const execSync = require('child_process').execSync;
const { CreateUser } = require('../lib/create_user.js');
const { Users } = require('../lib/users.js');
const { DeleteUser } = require('../lib/delete_user.js');
const { UpdateUser } = require('../lib/update_user.js');
const { Login } = require('../lib/login.js');
const { SharePostingan } = require('../lib/share_postingan.js');
const { ShowGroup } = require('../lib/show_group.js');
const { CheckLogin } = require('../lib/check_login.js');
const { Posting } = require('../lib/posting.js');
const { CreateContent } = require('./create_content.js');
const { DeleteContent } = require('./delete_content.js');
const { UpdateContent } = require('./update_content.js');
const Table = require('cli-table');
const tbl = new Table();

async function Menu() {
    tbl.push(['MAKURO FB'.cyan]);
    console.log(tbl.toString());
    let menu = await new Select({
        name: 'menu',
        message: `MENU`.yellow,
        hint: "gunakanpanah naik turun , dan enter untuk memilih",
        choices: [
            { name: 'posting', message: "POSTING", hint: "pilihan menu postingan" },
            { name: 'dev', message: "DEVELOPER", hint: "menu untuk developer" },
            { name: 'users', message: "USERS", hint: "pilihan menu users " },
            { name: 'group', message: "GROUPS", hint: "mendapatkan list group" },
            { name: 'exit', message: "EXIT", hint: "ya .. exit itu untuk keluar" },
        ]
    }).run().catch(e => null);

    switch (menu) {
        case 'posting': postingMenuDetail(); break;
        case 'users': userMenuDetail(); break;
        case 'cContent': contentDetail(); break;
        case 'dev': devDetail(); break;
        case 'group': groupDetail(); break;
        case 'exit': console.log('bye'.green); break;
        default: console.log("menu tidak ditemukan".red); process.exit(1);
    }

}

async function groupDetail() {
    const group = await new Select({
        name: 'group',
        message: "Pilih Menu group",
        hint: "gunakan tanda pana atas dan bawah , dan enter untuk memilih",
        choices: [
            { name: 'showGroup', message: "SHOW GROUP", hint: "mendapatkan list group" },
            { name: 'exit', message: "EXIT", hint: "exit" },
        ]
    }).run().catch(err => null);

    switch (group) {
        case 'group': ShowGroup(); break;
        case 'exit': console.log('bye'.green); break;
        default: console.log("menu tidak ditemukan".red); process.exit(1);
    }
}

async function devDetail() {
    const dev = await new Select({
        name: 'dev',
        message: "What do you want to do?",
        choices: [
            { name: 'push', message: "git push" },
            { name: 'migrate', message: "migrate db" },
            { name: 'exit', message: "exit" },
        ]
    }).run().catch(err => null);

    switch (dev) {
        case 'push': execSync('git add . && git commit -m "update" && git push'); break;
        case 'migrate': execSync('npx prisma migrate dev --name "$(date)"', {stdio: 'inherit'}); break;
        default: console.log("menu tidak ditemukan".red); process.exit(1);
    }
}

async function contentDetail() {
    const content = await new Select({
        name: 'content',
        message: `CONTENT`.yellow,
        hint: "\ngunakanpanah naik turun , dan enter untuk memilih\n",
        choices: [
            { name: 'cContent', message: "NEW CONTENT", hint: "membuat / memasukkan content baru" },
            { name: 'dContent', message: "DELETE CONTENT", hint: "menghapus content" },
            { name: 'uContent', message: "EDIT CONTENT", hint: "mengupdate / eidt content" },
            { name: 'exit', message: "EXIT", hint: "ya .. exit itu untuk keluar" },
        ]
    }).run().catch(e => null);

    switch (content) {
        case 'cContent': CreateContent(); break;
        case 'dContent': DeleteContent(); break;
        case 'uContent': UpdateContent(); break;
        case 'exit': process.exit(1);
        default: console.log("menu tidak ditemukan".red); process.exit(1);
    }
}

async function userMenuDetail() {
    const user = await new Select({
        name: 'user',
        message: "Pilih Menu user",
        hint: "gunakan tanda pana atas dan bawah , dan enter untuk memilih",
        choices: [
            { name: 'create', message: "CREATE USER", hint: "membuat / memasukkan user baru" },
            { name: 'users', message: "SHOW USER", hint: "menampilkan user yang ada dan datanya" },
            { name: 'delete', message: "DELETE USER", hint: "menghapus user" },
            { name: 'update', message: "EDIT USER", hint: "mengupdate user" },
            { name: "login", message: "LOGIN", hint: "login ke dalam facebook" },
            { name: "logout", message: "LOGOUT", hint: "logout from facebook" },
            { name: "checkLogin", message: "CHECK LOGIN", hint: "cek login facebook" },
            { name: 'exit', message: "EXIT", hint: "exit" },
        ]
    }).run().catch(err => null);

    switch (user) {
        case 'create': CreateUser(); break;
        case 'users': Users(); break;
        case 'delete': DeleteUser(); break;
        case 'update': UpdateUser(); break;
        case 'login': Login(); break;
        case 'logout': Logout(); break;
        case 'checkLogin': CheckLogin(); break;
        case 'exit': console.log('bye'.green); break;
        default: break;
    }
}

async function postingMenuDetail() {
    console.log("Pilih Menu Postingan".yellow);
    const posting = await new Select({
        name: 'posting',
        message: "Pilih Menu postingan",
        hint: "gunakan tanda pana atas dan bawah , dan enter untuk memilih",
        choices: [
            { name: 'posting', message: "POSTING", hint: "posting content ke group" },
            { name: "sharePostingan", message: "SHARE KEBANYAK", hint: "share postingan ke banyak group" },
            { name: 'exit', message: "EXIT", hint: "exit" },
        ]
    }).run().catch(err => null);

    switch (posting) {
        case 'posting': Posting(); break;
        case 'sharePostingan': SharePostingan(); break;
        case 'exit': console.log('bye'.green); break;
        default: break;
    }
}



module.exports = { Menu }