const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "info",
		author: "ArYAN",
		role: 0,
		shortDescription: "info and my owner the cmd",
		longDescription: "",
		category: "INFO",
		guide: "{pn}"
	},

	onStart: async function ({ api, event }) {
		try {
			const ArYanInfo = {
				Botname: '✰→ ғᴀʀʜᴀɴ ʙᴏᴛ ←✰',
				Prefix: '!',
				Owner: 'Fʌʀʜʌŋ Aʜɱɘɗ ',
				Age: '17+',
				Tiktok: 'NONE,
				Whatsapp: '01797281843',
				Facebook: 'https://www.facebook.com/farhan.ahmed2401',
				Relationship: 'SINGLE',
				Messenger: '61570495893273',
				Instagram: 'NONE',
				Nick: 'Fʌʀʜʋʋ '
			};

			const ArYan = 'https://i.imgur.com/BaaotS0.mp4';
			const tmpFolderPath = path.join(__dirname, 'tmp');

			if (!fs.existsSync(tmpFolderPath)) {
				fs.mkdirSync(tmpFolderPath);
			}

			const imgResponse = await axios.get(ArYan, { responseType: 'arraybuffer' });
			const imgPath = path.join(tmpFolderPath, 'ArYan_img.jpeg');

			fs.writeFileSync(imgPath, Buffer.from(imgResponse.data, 'binary'));

			const response = `
• Bot & Owner Info
╰‣ Bot Name: ${ArYanInfo.Botname}
╰‣ Bot Prefix: ${ArYanInfo.Prefix}
╰‣ Owner: ${ArYanInfo.Owner}
╰‣ Age: ${ArYanInfo.Age}
╰‣ Tiktok: ${ArYanInfo.Tiktok}
╰‣ Whatsapp: ${ArYanInfo.Whatsapp}
╰‣ relationship: ${ArYanInfo.Relationship}
╰‣ bio: ${ArYanInfo.Bio}
╰‣ Messenger: ${ArYanInfo.Messenger}
╰‣ Instagram: ${ArYanInfo.Instagram}
╰‣ Grouplink: ${ArYanInfo.Grouplink}`;

			await api.sendMessage({
				body: response,
				attachment: fs.createReadStream(imgPath)
			}, event.threadID, event.messageID);

			fs.unlinkSync(imgPath);

			api.setMessageReaction('🐔', event.messageID, (err) => {}, true);
		} catch (error) {
			console.error('Error in ArYaninfo command:', error);
			return api.sendMessage('An error occurred while processing the command.', event.threadID);
		}
	}
};
