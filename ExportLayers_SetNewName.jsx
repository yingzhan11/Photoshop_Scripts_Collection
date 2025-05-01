/**
 * Export psd layers to files
 * Set a new name and automatically generate a serial number suffix
 */

var doc = app.activeDocument;
var outputFolder = Folder.selectDialog("选择输出文件夹");
if (!outputFolder) { alert("未选择文件夹"); exit(); }

var baseName = prompt("请输入导出文件的基础名称：", "MyLayer");
if (!baseName) { alert("未输入名称"); exit(); }

// 图层从下往上导出（即 index 从大到小）
for (var i = doc.layers.length - 1, count = 1; i >= 0; i--) {
    var layer = doc.layers[i];
    if (!layer.visible) continue;

    // 新建 300 DPI 文档
    var tempDoc = app.documents.add(doc.width, doc.height, 300, "Temp", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    app.activeDocument = doc;
    layer.duplicate(tempDoc, ElementPlacement.PLACEATBEGINNING);

    // 删除多余图层
    app.activeDocument = tempDoc;
    for (var j = tempDoc.layers.length - 1; j > 0; j--) {
        tempDoc.layers[j].remove();
    }

    // 生成文件名，例如 MyLayer_001.png
    var paddedNum = ("00" + count).slice(-2);
    var fileName = baseName + "_" + paddedNum;
    var file = new File(outputFolder + "/" + fileName + ".png");

    // 保存为 PNG，保持 300 DPI
    var opts = new PNGSaveOptions();
    opts.compression = 9;
    tempDoc.saveAs(file, opts, true, Extension.LOWERCASE);

    tempDoc.close(SaveOptions.DONOTSAVECHANGES);
    count++;
}

alert("导出完成，已设为300 DPI！");
