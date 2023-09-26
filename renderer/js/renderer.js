// Each value inside the paranthesis is the name of the ID defined in the corresponding HTML file.
const form = document.querySelector('#img-form')
const img = document.querySelector('#img')
const outputPath = document.querySelector('#output-path')
const filename = document.querySelector('#filename')
const heightInput = document.querySelector('#height')
const widthInput = document.querySelector('#width')

function loadImage(event) {
    const fName = event.target.files[0];

    if (!isFileImage(fName)) {
        alertOnScreen('failure', 'Please select an image');
        return;
    }

    // Get the current image resolution
    const image = new Image();
    image.src = URL.createObjectURL(fName);
    image.onload = function () {
        widthInput.value = this.width;
        heightInput.value = this.height;
    }

    form.style.display = 'block';
    filename.innerText = fName.name;
    outputPath.innerText = path.join(os.homedir(), 'ImageResizer');
}

// Send image data to the main process
function sendImage(event) {
    event.preventDefault();

    const width = widthInput.value;
    const height = heightInput.value;
    const imagePath = img.files[0].path;

    if (!img.files[0]) {
        alertOnScreen('failure', 'Please upload an image');
        return;
    }

    if (width === '' || height === '') {
        alertOnScreen('failure', 'Please fill in a height and width')
        return;
    }

    // Send data to main using ipcRenderer
    ipcRenderer.send('image:resize', {imagePath, width, height});
}

// Catch the image:done event
ipcRenderer.on('image:done', () => {
    alertOnScreen('success', `Image resized to ${widthInput.value} x ${heightInput.value}`);
})

// Check if file is an image
function isFileImage(fName) {
    const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg'];
    return fName && acceptedImageTypes.includes(fName['type']);
}

function alertOnScreen(result, message) {
    const bgColor = result === 'success' ? 'green' : 'red'
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: bgColor,
            color: 'white',
            textAlign: 'center'
        }
    })
}

img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage)
