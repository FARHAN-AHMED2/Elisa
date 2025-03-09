const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const { getStreamFromURL, shortenURL, randomString } = global.utils;


function loadAutoLinkStates() {
  try {
    const data = fs.readFileSync("autolink.json", "utf8");
    return JSON.parse(data);
  } catch (err) {

    return {};
  }
}


function saveAutoLinkStates(states) {
  fs.writeFileSync("autolink.json", JSON.stringify(states, null, 2));
}


let autoLinkStates = loadAutoLinkStates();

module.exports = {
  threadStates: {},
  config: {
    name: 'autolink',
    version: '3.0',
    author: 'Vex_Kshitiz',
    countDown: 5,
    role: 0,
    shortDescription: 'Auto video downloader for Instagram, Facebook, TikTok, Twitter, pinterest and youtube',
    longDescription: '',
    category: 'media',
    guide: {
      en: '{p}{n}',
    }
  },
  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    if (!autoLinkStates[threadID]) {
      autoLinkStates[threadID] = 'on'; 
      saveAutoLinkStates(autoLinkStates);
    }

    if (!this.threadStates[threadID]) {
      this.threadStates[threadID] = {};
    }

    if (event.body.toLowerCase().includes('autolink off')) {
      autoLinkStates[threadID] = 'off';
      saveAutoLinkStates(autoLinkStates);
      api.sendMessage("AutoLink is now turned off for this chat.", event.threadID, event.messageID);
    } else if (event.body.toLowerCase().includes('autolink on')) {
      autoLinkStates[threadID] = 'on';
      saveAutoLinkStates(autoLinkStates);
      api.sendMessage("AutoLink is now turned on for this chat.", event.threadID, event.messageID);
    }
  },
  onChat: async function ({ api, event }) {
    const threadID = event.threadID;

    if (this.checkLink(event.body)) {
      const { url } = this.checkLink(event.body);
      console.log(`Attempting to download from URL: ${url}`);
      if (autoLinkStates[threadID] === 'on' || !autoLinkStates[threadID]) {
        this.downLoad(url, api, event);
      } else {
        api.sendMessage("", event.threadID, event.messageID);
      }
      api.setMessageReaction("🫦", event.messageID, (err) => {}, true);
    }
  },
  downLoad: function (url, api, event) {
    const time = Date.now();
    const path = __dirname + `/cache/${time}.mp4`;

    if (url.includes("instagram")) {
      this.downloadInstagram(url, api, event, path);
    } else if (url.includes("facebook") || url.includes("fb.watch")) {
      this.downloadFacebook(url, api, event, path);
    } else if (url.includes("tiktok")) {
      this.downloadTikTok(url, api, event, path);
    } else if (url.includes("x.com")) {
      this.downloadTwitter(url, api, event, path);
    } else if (url.includes("pin.it")) {
      this.downloadPinterest(url, api, event, path);
    } else if (url.includes("youtu")) {
      this.downloadYouTube(url, api, event, path);
    }
  },
  downloadInstagram: async function (url, api, event, path) {
    try {
      const res = await this.getLink(url, api, event, path);
      const response = await axios({
        method: "GET",
        url: res,
        responseType: "arraybuffer"
      });
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      if (fs.statSync(path).size / 1024 / 1024 > 25) {
        return api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
      }

      const shortUrl = await shortenURL(res);
      const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          BBE  𝗙 𝗔 𝗥 𝗛 𝗔 𝗡\n ╚════ஜ۩۞۩ஜ═══╝\n\n🔗𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝚁𝚄𝙻: ${shortUrl}`;

      api.sendMessage({
        body: messageBody,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    } catch (err) {
      console.error(err);
    }
  },
  downloadFacebook: async function (url, api, event, path) {
    try {
      const res = await fbDownloader(url);
      if (res.success && res.download && res.download.length > 0) {
        const videoUrl = res.download[0].url;
        const response = await axios({
          method: "GET",
          url: videoUrl,
          responseType: "stream"
        });
        if (response.headers['content-length'] > 87031808) {
          return api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
        }
        response.data.pipe(fs.createWriteStream(path));
        response.data.on('end', async () => {
          const shortUrl = await shortenURL(videoUrl);
          const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n           𝗜𝘁𝘇 𝗙𝗔𝗥𝗛𝗔𝗡\n ╚════ஜ۩۞۩ஜ═══╝\n\n🔗𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝚁𝚄𝙻: ${shortUrl}`;

          api.sendMessage({
            body: messageBody,
            attachment: fs.createReadStream(path)
          }, event.threadID, () => fs.unlinkSync(path), event.messageID);
        });
      } else {
        api.sendMessage("", event.threadID, event.messageID);
      }
    } catch (err) {
      conso
