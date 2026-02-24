$shell = New-Object -ComObject Shell.Application
$recycleBin = $shell.Namespace(10)

foreach ($item in $recycleBin.Items()) {
    if ($item.Path -match "Islamic Website of Tariq Masood Scholor" -or $item.Name -match ".tsx" -or $item.Name -match ".css") {
        Write-Output ($item.Name + " -> " + $item.Path)
    }
}
