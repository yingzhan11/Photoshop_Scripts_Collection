/**
 * Export psd layers to files
 * Use the layers name as the file name, and automatically generate a serial number suffix
 */

var doc = app.activeDocument;
var outputFolder = Folder.selectDialog("选择输出文件夹");
if (!outputFolder) { alert("未选择文件夹"); exit(); }

for (var i = 0; i < doc.layers.length; i++) {
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

    // 保存为 PNG，保持 300 DPI
    var fileName = layer.name;
    var file = new File(outputFolder + "/" + fileName + ".png");
    var opts = new PNGSaveOptions();
    opts.compression = 9;
    tempDoc.saveAs(file, opts, true, Extension.LOWERCASE);

    tempDoc.close(SaveOptions.DONOTSAVECHANGES);
}
alert("导出完成，已设为300 DPI！");
