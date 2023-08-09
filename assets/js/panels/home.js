'use strict';

import { logger, database, changePanel } from '../utils.js';

const { Launch, Status } = require('minecraft-java-core');
const { ipcRenderer } = require('electron');
const launch = new Launch();
const pkg = require('../package.json');

const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? `${process.env.HOME}/Library/Application Support` : process.env.HOME)

class Home {
    static id = "home";
    async init(config, news) {
        this.config = config
        this.news = await news
        this.database = await new database().init();
        this.initNews();
        this.initLaunch();
        this.initStatusServer();
        this.initBtn();
    }

    async initNews() {
        let news = document.querySelector('.news-list');
        if (this.news) {
            if (!this.news.length) {
                let blockNews = document.createElement('div');
                blockNews.classList.add('news-block', 'opacity-1');
                blockNews.innerHTML = `
                    <div class="news-header">
                        <div class="header-text">
                            <div class="title">Aucun news n'ai actuellement disponible.</div>
                        </div>
                    </div>
                    <div class="news-content">
                        <div class="bbWrapper">
                            <p>Vous pourrez suivre ici toutes les news relative au serveur.</p>
                        </div>
                    </div>`
                news.appendChild(blockNews);
            } else {
                // Crie uma div para a linha de notícias
                let newsRow = document.createElement('div');
                newsRow.classList.add('news-row');
    
                for (let i = 0; i < 3 && i < this.news.length; i++) {
                    let News = this.news[i];
                    let date = await this.getdate(News.publish_date);
                    let blockNews = document.createElement('div');
                    blockNews.classList.add('news-block');
                    blockNews.innerHTML = `
                        <div class="news-header">
                            <div class="header-text">
                                <div class="title">${News.title}</div>
                            </div>
                            <div class="date">
                                <div class="day">${date.day}</div>
                                <div class="month">${date.month}</div>
                            </div>
                        </div>
                        <div class="news-content">
                            <div class="news-image" style="background-image: url(${News.image_url});"></div>
                            <div class="bbWrapper">
                                <p>${News.content.replace(/\n/g, '<br>')}</p>
                                <p class="news-author">Auteur,<span> ${News.author}</span></p>
                            </div>
                        </div>`
                    newsRow.appendChild(blockNews);
                }
                
    
                // Adicione a linha de notícias ao elemento "news"
                news.appendChild(newsRow);
            }
        } else {
            let blockNews = document.createElement('div');
            blockNews.classList.add('news-block', 'opacity-1');
            blockNews.innerHTML = `
                <div class="news-header">
                    <div class="header-text">
                        <div class="title">Erro.</div>
                    </div>
                </div>
                <div class="news-content">
                    <div class="bbWrapper">
                        <p>Não foi possível se conectar ao servidor.</br>Verifique a suas configurações.</p>
                    </div>
                </div>`
            // news.appendChild(blockNews);
        }
    }

    async initLaunch() {
        document.querySelector('.play-btn').addEventListener('click', async () => {
            let urlpkg = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url;
            let uuid = (await this.database.get('1234', 'accounts-selected')).value;
            let account = (await this.database.get(uuid.selected, 'accounts')).value;
            let ram = (await this.database.get('1234', 'ram')).value;
            let javaPath = (await this.database.get('1234', 'java-path')).value;
            let javaArgs = (await this.database.get('1234', 'java-args')).value;
            let Resolution = (await this.database.get('1234', 'screen')).value;
            let launcherSettings = (await this.database.get('1234', 'launcher')).value;
            let screen;
    
            let playBtn = document.querySelector('.play-btn');
            let info = document.querySelector(".text-download");
            let progressBar = document.querySelector(".progress-bar");
    
            if (Resolution.screen.width == '<auto>') {
                screen = false;
            } else {
                screen = {
                    width: Resolution.screen.width,
                    height: Resolution.screen.height
                };
            }
    
            let opts = {
                url: this.config.game_url === "" || this.config.game_url === undefined ? `${urlpkg}/files` : this.config.game_url,
                authenticator: account,
                path: `${dataDirectory}/${process.platform == 'darwin' ? this.config.dataDirectory : `.${this.config.dataDirectory}`}`,
                version: this.config.game_version,
                detached: launcherSettings.launcher.close === 'close-all' ? false : true,
                java: this.config.java,
                javapath: javaPath.path,
                args: [...javaArgs.args, ...this.config.game_args],
                screen,
                modde: this.config.modde,
                verify: this.config.verify,
                ignored: this.config.ignored,
                memory: {
                    min: `${ram.ramMin * 1024}M`,
                    max: `${ram.ramMax * 1024}M`
                }
            };
    
            playBtn.disabled = true; // Desabilitar o botão de jogar antes do download
            playBtn.innerText = "Carregando..."; // Adicionar a mensagem de "Carregando..."
            if (info) {
                info.style.display = "block";
            }
            launch.Launch(opts);
    
            launch.on('progress', (DL, totDL) => {
                if (progressBar) {
                    progressBar.style.display = "block";
                    document.querySelector(".text-download").innerHTML = `Download ${((DL / totDL) * 100).toFixed(0)}%`;
                    ipcRenderer.send('main-window-progress', { DL, totDL });
                    progressBar.value = DL;
                    progressBar.max = totDL;
                }
            });
    
            launch.on('data', (e) => {
                new logger('Minecraft', '#36b030');
                if (launcherSettings.launcher.close === 'close-launcher') ipcRenderer.send("main-window-hide");
                if (progressBar) {
                    progressBar.style.display = "none";
                }
                if (info) {
                    info.innerHTML = `Iniciando...`;
                }
                console.log(e);
                playBtn.disabled = false; // Habilitar o botão de jogar após o término do download
                playBtn.innerText = "JOGAR"; // Voltar o texto do botão para "JOGAR"
            });
    
            launch.on('close', () => {
                if (launcherSettings.launcher.close === 'close-launcher') ipcRenderer.send("main-window-show");
                if (progressBar) {
                    progressBar.style.display = "none";
                }
                if (info) {
                    info.style.display = "none";
                    playBtn.style.display = "block";
                    info.innerHTML = `Verificação`;
                }
                new logger('Launcher', '#7289da');
                console.log('Close');
            });
        });
    }

    async initStatusServer() {
        let nameServer = document.querySelector('.server-text .name');
        let serverMs = document.querySelector('.server-text .desc');
        let playersConnected = document.querySelector('.etat-text .text');
        let online = document.querySelector(".etat-text .online");
        let serverPing = await new Status(this.config.status.ip, this.config.status.port).getStatus();

        if (!serverPing.error) {
            nameServer.textContent = this.config.status.nameServer;
            serverMs.innerHTML = `<span class="green">Online</span> - ${serverPing.ms}ms`;
            online.classList.toggle("off");
            playersConnected.textContent = serverPing.playersConnect;
        } else if (serverPing.error) {
            nameServer.textContent = 'Servidor offline';
            serverMs.innerHTML = `<span class="red">Offline</span>`;
        }
    }

    initBtn() {
        document.querySelector('.settings-btn').addEventListener('click', () => {
            changePanel('settings');
        });
    }

    async getdate(e) {
        let date = new Date(e)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let allMonth = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novemboe', 'dezembro']
        return { year: year, month: allMonth[month - 1], day: day }
    }
}
export default Home;