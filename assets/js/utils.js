/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

import config from './utils/config.js';
import database from './utils/database.js';
import logger from './utils/logger.js';
import slider from './utils/slider.js';

export {
    config as config,
    database as database,
    logger as logger,
    changePanel as changePanel,
    addAccount as addAccount,
    slider as Slider,
    accountSelect as accountSelect
}

function changePanel(id) {
    let panel = document.querySelector(`.${id}`);
    let active = document.querySelector(`.active`)
    if (active) active.classList.toggle("active");
    panel.classList.add("active");
}

function addAccount(data) {
    let div = document.createElement("div");
    div.classList.add("account");
    div.id = data.uuid;
    document.querySelector(".player-name").textContent = data.name;
div.innerHTML = `
        <img class="account-image" src="https://minotar.net/body/${data.name}/100">
        <div class="account-name">${data.name}</div>
        <div class="account-uuid">${data.uuid}</div>
        <div class="account-delete"><div class="icon-account-delete icon-account-delete-btn"></div></div>
    `
    document.querySelector('.accounts').appendChild(div);
}

function accountSelect(uuid) {
    let account = document.getElementById(uuid);
    let pseudo = account.querySelector('.account-name').innerText;
    
    // Remove .active-account class from any account that has it
    let activeAccounts = document.querySelectorAll('.active-account');
    activeAccounts.forEach(acc => acc.classList.remove('active-account'));
    
    // Add .active-account class to the selected account
    account.classList.add('active-account');
    headplayer(pseudo);
}

function headplayer(pseudo) {
    document.querySelector(".player-head").style.backgroundImage = `url(https://minotar.net/helm/${pseudo}/100)`;
}
function getPlayerName(uuid) {
    let account = document.getElementById(uuid);
    if (account) {
        return account.querySelector('.account-name').innerText;
    }
    return null;
}
