const generateURLbtn = document.getElementById("generateURLbtn");
const originalURLInput = document.getElementById("originalURL");

const displayContainer = document.getElementById("displayContainer");

const deleteURLbtn = document.getElementById("deleteURLbtn");
const deleteShortURL = document.getElementById("deleteURL");

const SERVERLESS_URL =
  "https://h11uvf6tk1.execute-api.ap-northeast-3.amazonaws.com/prod";

function display(text, link) {
  console.log(displayContainer);
  if (link) {
    text += ` <a href="${link}" class="target" >${link}</a>`;
  }
  displayContainer.innerHTML = text;
  displayContainer.style.display = "block";
}

generateURLbtn.addEventListener("click", async function () {
  const originalURL = originalURLInput.value;
  console.log(originalURL);
  const response = await fetch(`${SERVERLESS_URL}/urls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: originalURL }),
  });
  const result = await response.json();
  console.log(result);
  display(`Your short url :`, `${SERVERLESS_URL}/${result.shortURL}`);
});

deleteURLbtn.addEventListener("click", async function () {
  const shortURL = deleteShortURL.value;
  const sevenCode = shortURL.split("/").reverse()[0];

  const response = await fetch(`${SERVERLESS_URL}/${sevenCode}`, {
    method: "DELETE",
  });
  const result = await response.json();
  console.log(result);
  display(result.message);
});
