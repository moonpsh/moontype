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

            // 중앙 영역 (10x10 = 100픽셀)의 평균 피부톤 계산 // 피부톤 색상 추출
            const regionSize = 10;
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

            // HEX 변환
            const hexColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

            // 웜톤/쿨톤 판별
            const warmIndex = (r + g) / 2 - b;
            const isWarmTone = warmIndex > 0;
            const tone = isWarmTone ? "웜톤 🧡" : "쿨톤 💙";

            // 추천 컬러 리스트
            const warmColors = ["#FF6F61", "#D2691E", "#FFD700", "#FF8C00", "#DAA520"];
            const coolColors = ["#FF69B4", "#6A5ACD", "#4682B4", "#00CED1", "#87CEEB"];
            const recommendedColors = isWarmTone ? warmColors : coolColors;

            // 추천 컬러 HTML 생성
            let colorHtml = "";
            recommendedColors.forEach(color => {
                colorHtml += `<span style="display:inline-block; width:30px; height:30px; background-color:${color}; margin: 5px; border-radius:50%;"></span>`;
            });

            document.getElementById("result").innerHTML = `
                피부톤 판별: <span style="color:${hexColor}; font-weight: bold;">${hexColor}</span><br>
                퍼스널 컬러 판별 결과: <strong>${tone}</strong><br>
                추천 컬러: ${colorHtml}
            `;
        };
    }
});
