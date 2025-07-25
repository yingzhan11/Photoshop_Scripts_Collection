/**
 * Generate Sprite Sheet from PNG files
 * 
 * Input file: 300dpi PNG files of the SAME SIZE
 * Ouput file: 300dpi PNG, set rows when input files, transparent
 * 
 * File import method: linked smartObject
 * Frame alignment: from left to right, based on original PNG file size, no margins, no spacing
 */

#target photoshop
app.preferences.rulerUnits = Units.PIXELS;

function buildSmartObjectSpriteSheet() {
    // 选择PNG文件
    var files = File.openDialog("请选择多个PNG文件", "*.png", true);
    if (!files || files.length === 0) return;

    // 输入想要的行数
    var rowCount = parseInt(prompt("请输入希望生成的行数：", "1"), 10);
    if (isNaN(rowCount) || rowCount <= 0 || files.length % rowCount !== 0) {
        alert("无效的行数！请确保输入的是正整数，且能整除总图片数。");
        return;
    }

    var colCount = files.length / rowCount; // 每行放几个图

    // 获取所有文件尺寸
    var fileData = [];
    var frameWidth = 0;
    var frameHeight = 0;

    for (var i = 0; i < files.length; i++) {
        var doc = open(files[i]);
        if (i == 0) {
            frameWidth = doc.width.as("px");
            frameHeight = doc.height.as("px");
        }
        fileData.push({
            name: files[i].name,
            width: doc.width.as("px"),
            height: doc.height.as("px"),
        });
        doc.close(SaveOptions.DONOTSAVECHANGES);
    }

    // 新建文档：宽 = colCount * frameWidth， 高 = rowCount * frameHeight
    var sheetWidth = colCount * frameWidth;
    var sheetHeight = rowCount * frameHeight;

    var spriteDoc = app.documents.add(
        sheetWidth,
        sheetHeight,
        300,
        "SpriteSheet",
        NewDocumentMode.RGB,
        DocumentFill.TRANSPARENT
    );

    // 插入智能对象并排列
    var xOffset = -(sheetWidth / 2) + frameWidth / 2;
    var yOffset = -(sheetHeight / 2) + frameHeight / 2;
    for (var i = 0; i < fileData.length; i++) {
        var data = fileData[i];
        var row = Math.floor(i / colCount);
        var col = i % colCount;

        // 放置智能对象
        var desc = new ActionDescriptor();
        desc.putPath(charIDToTypeID("null"), new File(files[i].fsName));
        desc.putBoolean(charIDToTypeID("Lnkd"), true);
        desc.putEnumerated(charIDToTypeID("FTcs"), charIDToTypeID("QCSt"), charIDToTypeID("Qcsa"));
        executeAction(charIDToTypeID("Plc "), desc, DialogModes.NO);

        var smartObj = spriteDoc.activeLayer;
        smartObj.name = data.name.replace(/\.\w+$/, "");

        // 计算偏移量（左上角对齐）
        var xPos = xOffset + col * frameWidth + (data.width - frameWidth) / 2;
        var yPos = yOffset + row * frameHeight + (data.height - frameHeight);
        
        smartObj.translate(
            new UnitValue(xPos, "px"),
            new UnitValue(yPos, "px")
        );
    }

    alert("精灵图生成完成！\n总行数: " + rowCount + "\n每行图片数: " + colCount + "\n最终尺寸: " + sheetWidth + "px × " + sheetHeight + "px");
}

buildSmartObjectSpriteSheet();
