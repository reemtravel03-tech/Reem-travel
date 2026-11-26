# Makes an upload-ready copy of the site:
#   build\            the files to upload to public_html/
#   reem-travel.zip   the same files zipped, for uploading in one go
#
# Run from this folder:  powershell -ExecutionPolicy Bypass -File build.ps1

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$out  = Join-Path $root 'build'
$zip  = Join-Path $root 'reem-travel.zip'

# Everything the live site needs (README.md and this script are left out)
$include = @('index.html', 'about.html', 'videos.html', 'contact.php', 'config.php', 'assets')

if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Path $out | Out-Null
foreach ($item in $include) {
    Copy-Item -Path (Join-Path $root $item) -Destination $out -Recurse
}

# Zip with forward-slash paths so it unzips correctly on Linux hosts
# (Compress-Archive in Windows PowerShell 5.1 writes backslashes).
if (Test-Path $zip) { Remove-Item $zip -Force }
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$outFull = (Resolve-Path $out).Path.TrimEnd('\')
$archive = [System.IO.Compression.ZipFile]::Open($zip, 'Create')
try {
    Get-ChildItem -Path $outFull -Recurse -File | ForEach-Object {
        $entry = $_.FullName.Substring($outFull.Length + 1).Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $entry) | Out-Null
    }
} finally {
    $archive.Dispose()
}

$count = (Get-ChildItem -Path $outFull -Recurse -File).Count
$size  = [math]::Round((Get-Item $zip).Length / 1MB, 1)
Write-Host "Built $count files into build\ and reem-travel.zip ($size MB)"

# config.php is copied as-is: check the SMTP password before uploading
if ((Get-Content (Join-Path $root 'config.php') -Raw) -match "'password'\s*=>\s*''") {
    Write-Host "Note: SMTP password in config.php is empty (fine if the host's PHP mail() is used)."
}
