// CHOSEN API: https://networkcalc.com/api/docs
const baseURL = "https://networkcalc.com/api/ip/";
const id      = "hbsKqE4wayhlhgfW";
const secret  = "5QJG9AZJbl9Qcv15BoMWodMvtU34oXB4gy8VtMr1Oh84yEtNTLcNEWvuhcFC2CPy";

const addressInput = document.querySelector("#addressInput");
const submitBtn    = document.querySelector("#submitBtn");
const outputDiv    = document.querySelector("#calculatedData");

// switches
const binarySw     = document.querySelector("#binarySw");

// add event listener
submitBtn.addEventListener("click", processData);



function processData (event) {
    event.preventDefault();
    outputDiv.innerHTML = "";
    
    if (addressInput.value.trim() != "") {
        raw  = addressInput.value.trim();
        data = []
        
        // cycle trhough subnet entries
        for (const entry of raw.split("\n")) {
            //split masks
            const [start, ...masks] = entry.trim().split("/");
            
            for (const mask of masks) {
                data.push(
                    fetch(
                        baseURL + start + "/" + mask + "?" +
                        (binarySw.checked ? "binary=true" : "binary=false")
                    ).then(
                        response => {return response.json()}
                    ).then(
                        x => data.push(x)
                    )
                );
            }
        }

        console.log(data);
    } else {
        outputDiv.innerHTML = "<h3>No input data</h3>";
    }
}
