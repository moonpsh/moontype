document.getElementById("imageInput").addEventListener("change", function (event) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const file = event.target.files[0];

    if (file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function () {
            canvas.width = img.width / 2;
            canvas.height = img.height / 2;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // 피부톤 추출 (중앙 픽셀 색상)
            const pixelData = ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data;
            const r = pixelData[0];
            const g = pixelData[1];
            const b = pixelData[2];

            // HEX 변환
            const hexColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

            document.getElementById("result").innerHTML = `추출된 피부톤: <span style="color:${hexColor}; font-weight: bold;">${hexColor}</span>`;
        };
    }
});
