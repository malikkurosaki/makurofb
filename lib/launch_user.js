const {MultiSelect} = require('enquirer')
const {PrismaClient} = require('@prisma/client');
const { Launch } = require('./launch');
const prisma = new PrismaClient()
const puppeter = require('puppeteer');

/**@type puppeter.Page[] */
const listLaunch = [];

/**@type puppeter.Page[] */
async function LaunchUser () {
    const user = await prisma.users.findMany();
    const select = await new MultiSelect({
        name: 'user',
        message: 'Select user',
        choices: user.map(u => ({
            name: u.id,
            message: u.name,
        }))
    }).run();

    for (const u of select) {
        listLaunch.push(await Launch())
    }

    return listLaunch
}

module.exports = {LaunchUser}