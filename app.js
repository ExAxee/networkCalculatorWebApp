// CHOSEN API: https://networkcalc.com/api/docs

const addressInput = document.querySelector("#addressInput");
const submitBtn    = document.querySelector("#submitBtn");
const outputDiv    = document.querySelector("#calculatedData");

submitBtn.addEventListener("click", processData);

function processData (event) {
    event.preventDefault();
    outputDiv.innerHTML = "";
    
    if (addressInput.value.trim() != "") {
        
    } else {
        outputDiv.innerHTML = "<h3>No input data</h3>";
    }
}
