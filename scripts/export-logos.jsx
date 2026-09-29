#target photoshop

app.displayDialogs = DialogModes.NO;

function exportPng(psdPath, outPath) {
  var file = new File(psdPath);
  var doc = app.open(file);

  // Trim transparent pixels so proportions stay exact
  try {
    doc.trim(TrimType.TRANSPARENT, true, true, true, true);
  } catch (e) {}

  var opts = new PNGSaveOptions();
  opts.compression = 6;
  opts.interlaced = false;

  var outFile = new File(outPath);
  doc.saveAs(outFile, opts, true, Extension.LOWERCASE);
  doc.close(SaveOptions.DONOTSAVECHANGES);
}

var whitePsd = "C:/Users/HomePC/OneDrive/Personal Data/The Favorite Cleaner/PNG Files/TFC (White).psd";
var blackPsd = "C:/Users/HomePC/OneDrive/Personal Data/The Favorite Cleaner/PNG Files/TFC (Black).psd";
var outDir = "C:/Users/HomePC/Downloads/Notion Assocciated Websites/thefavoritecleaner/assets/brand/";

exportPng(whitePsd, outDir + "logo-light-full.png");
exportPng(blackPsd, outDir + "logo-dark-full.png");

$.writeln("LOGO_EXPORT_OK");
