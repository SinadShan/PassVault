// open issues/bugs page
document.getElementById('bug-button').onclick = () => {
    window.passVaultAPI.openLink('https://github.com/SinadShan/PassVault/issues/new')
}

document.getElementById('download-release-button').onclick = () => {
    window.passVaultAPI.openLink('https://github.com/SinadShan/PassVault/releases')
}
