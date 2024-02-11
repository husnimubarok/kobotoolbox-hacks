// Berikut adalah AppScript untuk Google Sheet untuk mengambil data dari KoboToolbox tanpa perlu sharing ke publik
// Ini digunakan sebagai alternative manual dari add-on seperti https://mixedanalytics.com/knowledge-base/import-kobotoolbox-data-to-google-sheets/ 
// spreadsheet Anda harus memiliki lembar yang bernama "Data"
// namun, Anda dapat mengganti "Data" dengan nama lain
// jangan lupa untuk mengganti "Data" getSheetByName("Data")
// dengan nama lainnya

// Anda harus mengganti xxx dengan token API Anda
// untuk mendapatkan token API Anda, kunjungi https://kf.kobotoolbox.org/#/account/security dan cari API Key
// lalu salin dan tempel token Anda di sini
// juga jangan tunjukkan token Anda kepada orang lain, itu IDE buruk
// kredensial disimpan sebagai properti skrip
// Anda dapat menghapus fungsi saveKeys pertama kali
// kode ini berhasil

function saveKeys() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties({
    "method" : "Get",
    "Authorization": "Token xxx"
  });
}

function getKeys() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var credentials = scriptProperties.getProperties();
  Logger.log(scriptProperties.getProperties()["method"]);
  Logger.log(scriptProperties.getProperties()["Authorization"]);

  return(credentials);
}

// pastikan Kamu generate CSV dari halaman unduhan terlebih dahulu
// urlnya seperti ini
// "https://kf.kobotoolbox.org/api/v2/assets/{uid}/export-settings/{export-settings-id}/data.csv"
// cocokkan uid dan export-settings-id
// yyy -> uid
// zzz -> export-settings-id
// temukan url dari https://kf.kobotoolbox.org/api/v2/assets/{uid}

function getData() {
  getKeys(); // Ini dimaksudkan untuk memuat kunci, tapi tidak perlu dipanggil setiap kali jika kunci sudah diatur.
  var scriptProperties = PropertiesService.getScriptProperties();
  var url = "https://kf.kobotoolbox.org/api/v2/assets/yyy/export-settings/zzz/data.csv";
  var params = {
    "method" : scriptProperties.getProperties()["method"],
    "headers": {"Authorization" : scriptProperties.getProperties()["Authorization"]}
  };
  const response = UrlFetchApp.fetch(url, params); // Cara params dilewati telah diperbaiki
  let csvContent = response.getContentText(); // Dapatkan konten teks dari respons
  csvContent = csvContent.replace(/;/g, ','); // ganti titik koma (;) dengan koma (,)
  const csv = Utilities.parseCsv(csvContent); // Analisis konten CSV
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data").getRange(1, 1, csv.length, csv[0].length).setValues(csv); 
};

// copy script di atas ke Extensions>App Script dan sesuaikan isinya!
// jalankan script untuk memulai mengambil data dari server kobo
