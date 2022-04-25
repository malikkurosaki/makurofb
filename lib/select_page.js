const puppeteer = require('puppeteer');
const { PrismaClient } = require('@prisma/client');
const cLog = require('c-log');
const prisma = new PrismaClient();
const { Select } = require('enquirer');
const clog = require('c-log');
const Table = require('cli-table');
const colors = require('colors');

async function Page() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--window-size=500,720',
            '--disable-notifications',
            '--disable-infobars',
            '--disable-web-security',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas']
    });


    const [page] = await browser.pages();

    await page.setViewport({
        width: 500,
        height: 720
    });

    return page;
}

module.exports = { Page }