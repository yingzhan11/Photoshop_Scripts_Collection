/**
 * Generate Sprite Sheet from PNG files
 * 
 * Input file: 300dpi PNG files of the SAME SIZE
 * Ouput file: 300dpi PNG, One-Row, transparent
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

    // 获取所有文件的真实尺寸（包括透明区域）
    var fileData = [];
    var frameWidth = 0;
    var frameHeight = 0;
    var totalWidth = 0;
    
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
        totalWidth += doc.width.as("px");
        doc.close(SaveOptions.DONOTSAVECHANGES);
    }

    // 创建新文档
    var spriteDoc = app.documents.add(
        totalWidth, 
        frameHeight, 
        300, 
        "SpriteSheet", 
        NewDocumentMode.RGB, 
        DocumentFill.TRANSPARENT
    );

    // 置入并严格按文件尺寸排列
    var xOffset = -(totalWidth / 2) + frameWidth / 2;
    for (var i = 0; i < fileData.length; i++) {
        var data = fileData[i];
        
        // 置入智能对象（保持链接）
        var desc = new ActionDescriptor();
        desc.putPath(charIDToTypeID("null"), new File(files[i].fsName));
        desc.putBoolean(charIDToTypeID("Lnkd"), true);
        desc.putEnumerated(charIDToTypeID("FTcs"), charIDToTypeID("QCSt"), charIDToTypeID("Qcsa"));
        executeAction(charIDToTypeID("Plc "), desc, DialogModes.NO);

        var smartObj = spriteDoc.activeLayer;
        smartObj.name = data.name.replace(/\.\w+$/, "");

        // 按文件实际尺寸计算位置
        var yPos = frameHeight - data.height;
        var xPos = xOffset + data.width * i;
        smartObj.translate(
            new UnitValue(xPos, "px"),
            new UnitValue(yPos, "px")
        );
    }

    alert("精灵图完成！(作为链接智能对象）\nframe数量:" + i + "\n总宽度：" + totalWidth + "px\n高度：" + frameHeight + "px");
}

buildSmartObjectSpriteSheet();