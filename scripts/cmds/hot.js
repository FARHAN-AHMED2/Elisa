module.exports = {
 config: {
	 name: "hot",
	 version: "1.0",
	 author: "AceGun",
	 countDown: 5,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: "no prefix",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "hot") {
 return message.reply({
 body: " 「❥︎----ღ᭄_𝗩𝗲𝗿𝘆 ..\n❥︎----ღ᭄_  𝗗𝗮𝗻𝗴𝗲𝗿𝗼𝘂𝘀 ❞࿐.🌴.\n❥ ɪᴛᴇᴍ ɢɪʀʟ\n\n𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥\n𝐅𝐀𝐑𝐇𝐀𝐍 𝐀𝐇𝐌𝐄𝐃」",
 attachment: await global.utils.getStreamFromURL("https://i.imgur.com/NNjRjCm.mp4")
 });
 }
 }
}
