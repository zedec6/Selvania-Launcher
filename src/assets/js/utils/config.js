/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

const pkg = require('../package.json');
const fetch = require("node-fetch")
let url = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url

let config = `${url}/launcher/config-launcher/config.json`;
let news = `${url}/launcher/news-launcher/assets/php/news/GetNews.php`;

class Config {
    GetConfig() {
        return new Promise((resolve, reject) => {
            fetch(config).then(config => {
                return resolve(config.json());
            }).catch(error => {
                return reject(error);
            })
        })
    }

    async GetNews() {
        let rss = await fetch(news);
        if (rss.status === 200) {
            try {
                let news = await rss.json();
                return news;
            } catch (error) {
                return false;
            }
        } else {
            return false;
        }
    }
}

export default new Config;

const newsData = [
    {
      title: "Nome da notícia 1",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur mollitia eos id vero earum voluptatibus natus officiis! Aperiam earum maiores dignissimos, ullam possimus quisquam perspiciatis consectetur voluptates dolorem cupiditate doloremque.",
      image: "caminho/da/imagem1.jpg",
    },
    {
      title: "Nome da notícia 2",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur mollitia eos id vero earum voluptatibus natus officiis! Aperiam earum maiores dignissimos, ullam possimus quisquam perspiciatis consectetur voluptates dolorem cupiditate doloremque.",
      image: "caminho/da/imagem2.jpg",
    },
    {
      title: "Nome da notícia 3",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur mollitia eos id vero earum voluptatibus natus officiis! Aperiam earum maiores dignissimos, ullam possimus quisquam perspiciatis consectetur voluptates dolorem cupiditate doloremque.",
      image: "caminho/da/imagem3.jpg",
    },
  ];