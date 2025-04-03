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

            // 중앙 100픽셀 평균값 계산
            let totalR = 0, totalG = 0, totalB = 0, count = 0;
            for (let x = canvas.width / 2 - 5; x < canvas.width / 2 + 5; x++) {
                for (let y = canvas.height / 2 - 5; y < canvas.height / 2 + 5; y++) {
                    const pixelData = ctx.getImageData(x, y, 1, 1).data;
                    totalR += pixelData[0];
                    totalG += pixelData[1];
                    totalB += pixelData[2];
                    count++;
                }
            }

            const r = Math.round(totalR / count);
            const g = Math.round(totalG / count);
            const b = Math.round(totalB / count);
            const brightness = (r + g + b) / 3;
            const warmIndex = (r + g) / 2 - b;

            // HEX 변환
            const hexColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

            let seasonTone = "";
            let recommendedColors = [];

            if (warmIndex > 0) { // 웜톤
                if (brightness > 200) { 
                    seasonTone = "🌸 봄 라이트 (Light Spring)";
                    recommendedColors = ["#FFDAB9", "#FFB6C1", "#FFD700", "#FFA07A", "#F4A460", "#DAA520", "#E9967A", "#FF8C00", "#CD853F", "#F5DEB3", "#F08080", "#FF69B4"];
                } else if (brightness > 150) {
                    seasonTone = "🌸 봄 브라이트 (Bright Spring)";
                    recommendedColors = ["#FF7F50", "#FFA500", "#FF6347", "#F28500", "#FF4500", "#E67E22", "#D2691E", "#C04000", "#CD5C5C", "#DC143C", "#E9967A", "#F4A460"];
                } else {
                    seasonTone = "🍁 가을 딥 (Deep Autumn)";
                    recommendedColors = ["#8B4513", "#A0522D", "#B22222", "#8B0000", "#6B4226", "#4B382A", "#5E2612", "#7F5217", "#6F4E37", "#8B5A2B", "#DAA520", "#D2691E"];
                }
            } else { // 쿨톤
                if (brightness > 200) {
                    seasonTone = "🌞 여름 라이트 (Light Summer)";
                    recommendedColors = ["#87CEFA", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#DB7093", "#DA70D6", "#9370DB", "#BA55D3", "#4682B4", "#6A5ACD", "#7B68EE", "#5F9EA0"];
                } else if (brightness > 150) {
                    seasonTone = "❄ 겨울 브라이트 (Bright Winter)";
                    recommendedColors = ["#00008B", "#191970", "#8A2BE2", "#4B0082", "#000080", "#2F4F4F", "#DC143C", "#800080", "#B22222", "#9932CC", "#9400D3", "#FF1493"];
                } else {
                    seasonTone = "❄ 겨울 딥 (Deep Winter)";
                    recommendedColors = ["#4B0082", "#2F4F4F", "#191970", "#000000", "#1C1C1C", "#282828", "#3C3C3C", "#5D5D5D", "#708090", "#808080", "#A9A9A9", "#C0C0C0"];
                }
            }

            let colorHtml = "";
            recommendedColors.forEach(color => {
                colorHtml += `<span style="display:inline-block; width:30px; height:30px; background-color:${color}; margin: 5px; border-radius:50%;"></span>`;
            });

            document.getElementById("result").innerHTML = `
                추출된 피부톤: <span style="color:${hexColor}; font-weight: bold;">${hexColor}</span><br>
                퍼스널 컬러 계절 유형: <strong>${seasonTone}</strong><br>
                추천 컬러: ${colorHtml}
            `;
        };
    }
});
