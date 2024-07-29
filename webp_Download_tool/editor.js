const dropArea = document.getElementById('drop-area');
const fileList = document.getElementById('file-list');
const fileCount = document.getElementById('file-count');
const downloadAllButton = document.getElementById('downloadAll');
const zip = new JSZip();
let imageCount = 0;

dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.style.borderColor = '#000';
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.borderColor = '#ccc';
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.style.borderColor = '#ccc';
    const files = event.dataTransfer.files;
    handleImageUploads(files);
});

function handleImageUploads(files) {
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const fileName = file.name.replace(/\.[^/.]+$/, "");  // Remove file extension for the WebP file name
        addFileToList(file.name);
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    zip.file(`${fileName}.webp`, blob);
                }, 'image/webp');
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

function addFileToList(fileName) {
    const listItem = document.createElement('div');
    listItem.textContent = fileName;
    fileList.appendChild(listItem);
    updateFileCount();
}

function updateFileCount() {
    const fileCountNum = fileList.childElementCount;
    fileCount.textContent = `Total Images: ${fileCountNum}`;
}

downloadAllButton.addEventListener('click', () => {
    zip.generateAsync({ type: 'blob' }).then((content) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'webp_images.zip';
        link.click();
    });
});
