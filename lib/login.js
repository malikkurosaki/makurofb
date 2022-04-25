const puppeteer = require('puppeteer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Select } = require('enquirer');
const clog = require('c-log');
const Table = require('cli-table');
const { Page } = require('./select_page');


// https://mbasic.facebook.com/home.php
// https://mbasic.facebook.com/login.php


async function Login() {
    const tab = new Table();
    tab.push(['Login Ke Facebook Menggunakan Email Dan Password'.blue])
    console.log(tab.toString());

    const users = await prisma.users.findMany();
    const selectUser = await new Select({
        name: 'user',
        message: 'Pilih User Yang Ingin Di Loginkan',
        choices: users.map(user => ({
            name: user.name,
            message: user.name
        }))

    }).run().catch(err => console.log("err"));

    if (selectUser == null) {
        console.log('byee ...'.green)
        return;
    }

    const userLogin = users.find(user => user.name === selectUser);
    // clog.table([userLogin]);

    const page = await Page();

    await page.goto('https://mbasic.facebook.com/login');
    await page.waitForTimeout(2000);
    await page.type("input[name=email]", userLogin.email);
    await page.type("input[name=pass]", userLogin.password);
    await page.waitForTimeout(2000);

    await page.click("input[name=login]");
    await page.waitForTimeout(4000);

    let title = await page.title();
    let url =  page.url();

    if (!title.includes('Facebook')) {
       console.log("GAGAL LOGIN CHEK EMAIL ATAU PAWWORD".red)
       console.log(title.yellow)
       process.exit()
    }

    const cookies = await page.cookies();
    await prisma.cookies.upsert({
        create: {
            usersId: userLogin.id,
            value: JSON.stringify(cookies),
        },
        update: {
            usersId: userLogin.id,
            value: JSON.stringify(cookies),
        },
        where: {
            usersId: Number(userLogin.id)
        }
    });

    await page.close();
    console.log("LOGIN SUCCESS !".green)
    process.exit()
}

module.exports = { Login}