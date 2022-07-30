// const fs = require('fs');
const muhammara = require("muhammara");
// const path = require('path');
// let hummus = require('hummus');

(function () {
  "use strict";

  console.log("ver1.1");

  // const EVENT = ['app.record.edit.submit.success'];
  const EVENT = ["app.record.detail.show"];
  kintone.events.on(EVENT, async function (event) {
    console.log(event);
    const res = await kintone.api(kintone.api.url("/k/v1/record", true), "GET", {
      app: kintone.app.getId(),
      id: 1,
    });
    console.log(res);
    const rawFile = res.record.before.value[0];
    const processedFile = res.record.after.value;
    const fileKey = rawFile.fileKey;
    return new kintone.Promise(async function (resolve, reject) {
      const resp1 = await getFileObj(fileKey);
      // const resp = await uploadFile();
      // console.log(resp);
      // const record = {
      //     after: {
      //         value: [
      //             {
      //                 fileKey: resp.fileKey,
      //             },
      //         ],
      //     },
      // };
      // await updateRecord(1, record);
      resolve(event);
    });
  });

  async function updateRecord(recordId, record) {
    const body = {
      app: kintone.app.getId(),
      id: recordId,
      record: record,
    };
    return kintone.api(kintone.api.url("/k/v1/record.json", true), "PUT", body);
  }

  async function getFileObj(fileKey) {
    const subdomain = "worklog-inc";
    const url = "https://" + subdomain + ".cybozu.com/k/v1/file.json?fileKey=" + fileKey;

    return new kintone.Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.responseType = "blob";
      xhr.onload = () => {
        if (xhr.status === 200) {
          // success
          const blob = new Blob([xhr.response]);
          console.log(blob);
          const windowUrl = window.URL || window.webkitURL;
          const blobUrl = windowUrl.createObjectURL(blob);
          console.log(blobUrl);
          console.log(xhr.response);
          resolve(xhr);
        } else {
          // error
          console.log(xhr.responseText);
        }
      };
      xhr.send();
    });
  }

  async function createDownloadLink(xhr) {
    return new kintone.Promise(function (resolve, reject) {
      const blob = new Blob([xhr.response]);
      const url = window.URL || window.webkitURL;

      // BlobURLの取得
      const blobUrl = url.createObjectURL(blob);

      // リンクを作成し、そこにBlobオブジェクトを設定する
      const alink = document.createElement("a");
      alink.textContent = "ダウンロード";
      alink.download = "ダウンロードファイル.txt";
      alink.href = blobUrl;
      alink.target = "_blank";

      // マウスイベントを設定
      const e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });

      // aタグのクリックイベントをディスパッチする
      // alink.dispatchEvent(e);

      resolve();
    });
  }

  async function uploadFile() {
    return new kintone.Promise(function (resolve, reject) {
      const blob = new Blob(["Sample Test File"], { type: "application/pdf" });
      const formData = new FormData();
      formData.append("__REQUEST_TOKEN__", kintone.getRequestToken());
      formData.append("file", blob, "test.txt");

      const subdomain = "worklog-inc";
      const url = "https://" + subdomain + ".cybozu.com/k/v1/file.json";
      const xhr = new XMLHttpRequest();
      // xhr.open('POST', url);
      xhr.open("POST", kintone.api.url("/k/v1/file", true), false);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject();
        }
      };
      xhr.send(formData);
    });
  }
})();

function getRecord(recordId) {
  const body = {
    app: kintone.app.getId(),
    id: recordId,
  };
  return kintone.api(kintone.api.url("/k/v1/record.json", true), "GET", body);
}
