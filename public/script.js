window.history.replaceState({}, document.title, window.location.pathname);

const getRandomString = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex);
  }

  return result;
};

const fullUrl = document.getElementById("url-input");
const shortUrl = document.getElementById("custom-input");
const message = document.getElementById("message");
const generatedUrl = document.getElementById("generated-url");

const urlSelected = SHORT;
const receivedMessage = MESSAGE;

if (urlSelected) {
  fullUrl.value = FULL;
}

shortUrl.value = urlSelected || getRandomString();

if (urlSelected && receivedMessage !== "taken") {
  generatedUrl.value = "localhost:3000/" + urlSelected;
} else {
  generatedUrl.value = "Generated URL";
}

if (receivedMessage === "taken") {
  message.innerHTML = "The short URL is already taken. Sorry";
} else if (receivedMessage == "success") {
  message.innerHTML = "Short URL created. Copy it and use.";
}

shortUrl.addEventListener("click", () => {
  shortUrl.select();
});

const copyUrl = () => {
  if (urlSelected) {
    document.getElementById("copy-button").innerHTML = "Copied";
    navigator.clipboard.writeText(generatedUrl.value);
  }
};
