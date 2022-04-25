const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const { Select } = require('enquirer');
const { Page } = require('./select_page');

async function SelectUser() {
    const users = await prisma.users.findMany({
        include: {
            Cookies: true,
            Groups: true,
            Shares: true
        }
    })

    if (users.length == 0) {
        console.log("Tidak Ada User, buat terlebi dahulu".red)
        return;
    }

    const userCek = users.filter(e => e.Cookies != null)

    const selectUser = await new Select({
        name: "user",
        message: "Pilih User Yang Ingin Di Lihat",
        choices: [...userCek.map((e) => ({
            name: e.id,
            message: e.name
        }))]
    }).run().catch(e => null)

    if (selectUser == null) {
        console.log('byee .. '.green)
        process.exit(1);
    }

    const targetUser = userCek.find(user => user.id === selectUser);

    const page = await Page();

    await page.setCookie(...JSON.parse(targetUser.Cookies.value));
    await page.goto('https://mobile.facebook.com/home.php');
    await page.waitForTimeout(2000);

    const url = page.url();
    if (url.includes('login.php')) {
        console.log("belum login".red);
        process.exit(1);
    }

    return {
        user: targetUser,
        page: page
    }
}

module.exports = { SelectUser }