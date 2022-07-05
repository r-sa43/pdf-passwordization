(function () {
    'use strict';

    const EVENT = ['app.record.detail.show'];
    kintone.events.on(EVENT, function (event) {
        console.log(event);
        const rawFile = event.record.before.value[0];
        const processedFile = event.record.after.value;
        const fileKey = rawFile.fileKey;
        return new kintone.Promise(function (resolve, reject) {
            getFileObj(fileKey)
                .then(function (resp) {
                    console.log(resp);
                    return uploadFile();
                })
                .then(function (resp) {
                    console.log(resp);
                    const record = {
                        after: {
                            value: [
                                {
                                    fileKey: resp.fileKey,
                                },
                            ],
                        },
                    };
                    console.log(record);
                    return updateRecord(1, record);
                })
                .then(function (resp) {
                    console.log(resp);
                    return resolve(event);
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    });

    function updateRecord(recordId, record) {
        const body = {
            app: kintone.app.getId(),
            id: recordId,
            record: record,
        };
        return kintone.api(kintone.api.url('/k/v1/record.json', true), 'GET', body);
    }

    function getFileObj(fileKey) {
        const subdomain = 'worklog-inc';
        const url = 'https://' + subdomain + '.cybozu.com/k/v1/file.json?fileKey=' + fileKey;
        // const headers = {
        //     'X-Requested-With': 'XMLHttpRequest',
        //     'Content-Type': 'blob',
        // };
        // const res = await kintone.proxy(url, 'GET', headers, {});
        // console.log(res);
        // const blob = new Blob([xhr.response]);
        // const windowUrl = window.URL || window.webkitURL;
        // const blobUrl = windowUrl.createObjectURL(blob);
        // console.log(blobUrl);

        // const res = await fetch(url, {
        //     method: 'GET',
        //     // mode: 'cors',
        // });
        // console.log(res);

        return new kintone.Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.responseType = 'blob';
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

    function createDownloadLink(xhr) {
        return new kintone.Promise(function (resolve, reject) {
            const blob = new Blob([xhr.response]);
            const url = window.URL || window.webkitURL;

            // BlobURLの取得
            const blobUrl = url.createObjectURL(blob);

            // リンクを作成し、そこにBlobオブジェクトを設定する
            const alink = document.createElement('a');
            alink.textContent = 'ダウンロード';
            alink.download = 'ダウンロードファイル.txt';
            alink.href = blobUrl;
            alink.target = '_blank';

            // マウスイベントを設定
            const e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });

            // aタグのクリックイベントをディスパッチする
            // alink.dispatchEvent(e);

            resolve();
        });
    }

    function uploadFile() {
        return new kintone.Promise(function (resolve, reject) {
            const blob = new Blob(['Sample Test File'], { type: 'text/plain' });
            const formData = new FormData();
            formData.append('__REQUEST_TOKEN__', kintone.getRequestToken());
            formData.append('file', blob, 'test.txt');

            const subdomain = 'worklog-inc';
            const url = 'https://' + subdomain + '.cybozu.com/k/v1/file.json';
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    console.log(JSON.parse(xhr.responseText));
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    console.log(JSON.parse(xhr.responseText));
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
    return kintone.api(kintone.api.url('/k/v1/record.json', true), 'GET', body);
}
