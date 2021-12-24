const sumbitBtn = document.querySelector('#submit');

//checking price
const priceInput = document.querySelector('#price')
priceInput.addEventListener("keydown", (e) => {
    let charValue= String.fromCharCode(e.keyCode);
    if((isNaN(charValue)) && (e.which != 8 )){ // BSP KB code is 8
        e.preventDefault();
    }
    return true;
});



// checking location
const locationInput = document.querySelector('#location');
const locErrMsg = document.querySelector('#loc-err-msg')
const locLabel = document.querySelector('#loc-label')


function locationCheck(value) {
    if (value.split(',').length <= 1) return false;
    if (!/[a-z]/i.test(value)) return false;
    return true;
}

function locInvalidCheck(e) {
    if (!locationCheck(locationInput.value)) {
        locErrMsg.classList.add('show')
        locErrMsg.innerHTML = "Warning: we may not be able to parse this location. If you encounter an error, try reformatting your location input into 'City, State' or 'City, Country.'";
        locLabel.style.borderColor = '#dc3545';
    } else {
        locErrMsg.classList.remove('show')
        locErrMsg.innerHTML = "Looks good!";
        locLabel.style.borderColor = '#28a745';
    }
}
locationInput.addEventListener("change", (e) => locInvalidCheck(e));





//checking image
let isValidImage = true;
const imgLabel = document.querySelector('#img-file-label');
const imageUpload = document.querySelector("#image")
const imgErrMsg = document.querySelector("#img-err-msg");

function imageCheck(files) {
    for (let file of files) {
        if (file.type.indexOf("image") == -1) {
            imgErrMsg.innerHTML = "One or more files is not a supported type.";
            imgLabel.style.borderColor = '#dc3545';
            imgErrMsg.classList.add('show')
            isValidImage = false;
            return;
        }
        if (file.size > 250000) {
            imgErrMsg.innerHTML = "One or more images too big (max 250kb)";
            imgLabel.style.borderColor = '#dc3545';
            imgErrMsg.classList.add('show')
            isValidImage = false;
            return;
        }
    }
    imgLabel.style.borderColor = '#28a745';
    imgErrMsg.innerHTML = "Looks good!";
    imgErrMsg.classList.remove('show')
    isValidImage = true;
    return true;
}

imageUpload.addEventListener("change", (e) => imageCheck(e.target.files));

function imgInvalidCheck(e) {
    if (!isValidImage) {
        e.preventDefault();    //stop form from submitting
        imgLabel.style.borderColor = '#dc3545';
    }
}

sumbitBtn.addEventListener("click", (e) => {
    locInvalidCheck(e);
    imgInvalidCheck(e);

})

sumbitBtn.addEventListener("sumbit", (e) => {
    locInvalidCheck(e);
    imgInvalidCheck(e);

})