Param(
    [Parameter(mandatory = $true)][int]$i,
    [Parameter(mandatory = $true)][String]$p
)

Write-Output "Start Script!"

$ENV = "LINUX"
$APP_ID =
$DOMAIN = ""
$API_KEY = ""
$BEFORE_CODE = "before"
$AFTER_CODE = "after"

$RECORD_ID = $i
$PASSWORD = $p

try {
    # ファイル削除
    Remove-Item -Path ./before -Recurse
}
catch {
    Write-Output "削除対象のディレクトリが存在しません"
}

if ($Env -eq "WINDOWS") {
    # Windows
    Start-Process -FilePath .\cli-kintone -ArgumentList "--export", "-a", "$APP_ID", "-d", "$DOMAIN", 
    "-t", "$API_KEY", "-c", "`$id,$BEFORE_CODE", "-q", "`$id=$RECORD_ID", "-b", "./before" -Wait
}
elseif ($ENV -eq "LINUX") {
    # Linux
    ./cli-kintone --export -a "$APP_ID" -d "$DOMAIN" -t "$API_KEY" -c `$id, "$BEFORE_CODE" -q "`$id=$RECORD_ID" -b ./before
}

$items = @(Get-ChildItem -Name -Path ./before -Recurse -File)
'"$id","{0}"' -f $AFTER_CODE | Out-File -Encoding utf8 ./upload.csv # csvヘッダ書き込み

$idTOname = @{}

foreach ($item in $items) {
    # ex) ./before/before-1/test.pdf -> $UPLOAD_ID=1, $FILE_NAME=test_, $item=before-1/test.pdf
    $UPLOAD_ID = "./before/$item" | Select-String "-\d" | ForEach-Object { $_.Matches.Value }
    $UPLOAD_ID = $UPLOAD_ID.Substring($UPLOAD_ID.IndexOf("-") + 1)
    $EXTENSION_INDEX = $item.LastIndexOf(".pdf")
    $FILE_NAME = $item.Substring(0, $EXTENSION_INDEX) + "_pass"

    # パスワード付与
    
    if ($Env -eq "WINDOWS") {
        # Windows
        pdftk ./before/$item output ./before/$FILE_NAME.pdf user_pw $PASSWORD | Wait-Process
    }
    elseif ($ENV -eq "LINUX") {
        # Linux
        pdftk ./before/$item output ./before/$FILE_NAME.pdf user_pw $PASSWORD
    }

    if ($idTOname[$UPLOAD_ID]) {
        $idTOname[$UPLOAD_ID] += @($FILE_NAME)
    }
    else {
        $idTOname[$UPLOAD_ID] = @()
        $idTOname[$UPLOAD_ID] += @($FILE_NAME)
    }
}

# csv書き込み
foreach ($id in $idTOname.Keys) {
    $filePath = ""
    foreach ($fileName in $idTOname[$id]) {
        $filePath += "./before/{0}.pdf`n" -f $fileName
    }
    '"{0}","{1}"' -f "$id", $filePath | Out-File -Append -Encoding utf8 ./upload.csv
}

# ファイルアップロード

if ($ENV -eq "WINDOWS") {
    # Windows
    Start-Process -FilePath .\cli-kintone -ArgumentList "--import", "-a", "$APP_ID", "-d", "$DOMAIN", "-t", "$API_KEY", "-b", "./", "-f", "./upload.csv" -Wait
}
elseif ($ENV -eq "LINUX") {
    # Linux
    ./cli-kintone --import -a "$APP_ID" -d "$DOMAIN" -t "$API_KEY" -b ./ -f ./upload.csv
}

Write-Output "End Script"