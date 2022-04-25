const { PrismaClient } = require('@prisma/client');
const cLog = require('c-log');
const prisma = new PrismaClient();
const { Select } = require('enquirer');
const { Page } = require('./select_page');

async function CheckLogin() {

    const users = await prisma.users.findMany({
        include: {
            Cookies: true
        }
    });
    const selectUser = await new Select({
        name: 'user',
        message: 'Pilih User Yang Ingin Di Loginkan',
        choices: users.map(user => ({
            name: user.id,
            message: user.name
        }))

    }).run().catch(err => nul);

    if (selectUser == null) {
        console.log('byee ...'.green)
        process.exit(1);
    }

    const userLogin = users.find(user => user.id === selectUser);
    if (userLogin.Cookies == null) {
        console.log('User Belum Login'.toUpperCase().red);
        process.exit(1);
    }

    const page = await Page();
    await page.setCookie(...JSON.parse(userLogin.Cookies.value));
    await page.goto('https://mbasic.facebook.com/home.php');
    await page.waitForTimeout(2000);
    const title = await page.title();

    if (title.includes('Log in to Facebook')) {
        console.log('User Belum Login'.red);
        process.exit(1);
    }

    return {
        success: true,
        page: page
    };
}

module.exports = { CheckLogin };