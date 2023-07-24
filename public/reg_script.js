function submitNickname() {
    const nickname = document.getElementById('username').value;
    if (nickname.trim() !== '') {
        window.location.href = `/map.html?nickname=${encodeURIComponent(nickname)}`;
    }
}
