// CHOSEN API: https://networkcalc.com/api/docs

const addressInput = document.querySelector("#addressInput");
const submitBtn    = document.querySelector("#submitBtn");
const outputDiv    = document.querySelector("#calculatedData");

submitBtn.addEventListener("click", processData);

function processData (event) {
    event.preventDefault();
    console.log("ciao");
}
