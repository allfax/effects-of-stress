const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
// const API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large";
var api_rotation = 0;
huggingface_api_keys = ["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", "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", "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"];
var pastRes = [];
var pastInput = [];
async function reply(message) {
	var headers = {
		Authorization: "Bearer " + huggingface_api_keys[api_rotation]
	};
	const response = await fetch(API_URL, {
		method: "post",
		body: JSON.stringify({
			inputs: {
				past_user_inputs: pastInput,
				generated_responses: pastRes,
				text: message
			}
		}),
		headers: headers
	});
	const data = await response.json();
	let botResponse = "";
	api_rotation = (api_rotation + 1) % huggingface_api_keys.length;
	if (data.hasOwnProperty("conversation")) {
		pastInput = data.conversation.past_user_inputs;
		pastRes = data.conversation.generated_responses;
		if (pastInput.length > 2) pastInput.shift();
		if (pastRes.length > 2) pastRes.shift();
		console.log(pastInput);
		console.log(pastRes);
	}

	if (data.hasOwnProperty("generated_text")) {
		botResponse = data.generated_text
			.replace(/&amp%?;/g, "and")
			.replace(/&gt%?;/g, ">")
			.replace(/&lt%?;/g, "<");
		return botResponse;
	} else if (data.hasOwnProperty("error")) {
		console.log(data.error);
		return "An error occurred";
	}
}

var textbox = document.getElementById("message");
var sendbutton = document.getElementById("send");
var chat = document.getElementById("chat");

sendbutton.addEventListener("click", async () => {
	if (!textbox.value) return;
	chat.scroll(0, 99999999999999999999);

	var user = document.createElement("p");
	user.classList.add("user");
	user.innerText = textbox.value;
	chat.appendChild(user);

	sendbutton.disabled = true;
	textbox.disabled = true;
	var res = await reply(textbox.value);
	textbox.value = "";
	sendbutton.disabled = false;
	textbox.disabled = false;
	textbox.focus();

	var bot = document.createElement("p");
	bot.classList.add("bot");
	bot.innerText = res;
	chat.appendChild(bot);
	chat.scroll(0, 99999999999999999999);
});
textbox.addEventListener("keydown", async (e) => {
	if (e.key.toLowerCase() != "enter") return;
	if (!textbox.value) return;
	chat.scroll(0, 99999999999999999999);

	var user = document.createElement("p");
	user.classList.add("user");
	user.innerText = textbox.value;
	chat.appendChild(user);

	sendbutton.disabled = true;
	textbox.disabled = true;
	var res = await reply(textbox.value);
	textbox.value = "";
	sendbutton.disabled = false;
	textbox.disabled = false;
	textbox.focus();

	var bot = document.createElement("p");
	bot.classList.add("bot");
	bot.innerText = res;
	chat.appendChild(bot);
	chat.scroll(0, 99999999999999999999);
});