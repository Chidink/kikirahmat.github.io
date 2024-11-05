// Simpan state untuk skor, kata, artikel, dan daftar yang telah digunakan
let score = 0;
let words = {};
let currentWord = "";
let articles = {};
let currentArticle = "";
let usedWords = [];   // Array untuk menyimpan kata yang sudah digunakan
let usedArticles = []; // Array untuk menyimpan artikel yang sudah digunakan
let remainingWords = 0;
let remainingArticles = 0;
let totalWordsAvailable = 0; // Variabel untuk menyimpan jumlah kata yang tersedia
let totalArticlesAvailable = 0; //variabel untuk menyimpan jumlah artikel yang tersedia

// Fungsi untuk menampilkan halaman tertentu
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// Fungsi untuk memulai game tebak kata
async function startGuessGame() {
    words = await fetchWords(); // Ambil kata dari Firebase
    console.log("Kata yang diambil: ", words); // Log kata
    usedWords = []; // Reset array usedWords
    score = 0; // Reset skor
    totalWordsAvailable = Object.keys(words).length; // Set jumlah kata yang tersedia
    nextWord();
    remainingWords = Object.keys(words).length; // Jumlah kata yang tersedia
    nextWord();
    showPage('guess-game');
    
}
function speakWord() {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = 'en-US'; // Set bahasa ke bahasa Inggris
    speechSynthesis.speak(utterance);
}
// Fungsi untuk memilih kata acak
function nextWord() {
    const availableWords = Object.keys(words).filter(word => !usedWords.includes(word));
    console.log("Kata yang tersedia: ", availableWords); // Log kata yang tersedia

    if (totalWordsAvailable === 0) {
        endGame(); // Jika tidak ada kata tersisa, akhiri permainan
        return;
    }

    
    if (availableWords.length === 0) {
        endGame(); // Jika tidak ada kata tersisa, akhiri permainan
        return;
    }
    document.getElementById('remaining-attempts').textContent = `Sisa kesempatan menebak: ${totalWordsAvailable}`; // Tampilkan sisa kesempatan
    currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    document.getElementById('random-word').textContent = `Kata: ${currentWord}`;
    document.getElementById('user-input').value = "";
    document.getElementById('feedback').textContent = "";
}

// Fungsi untuk memeriksa terjemahan
function checkTranslation() {
    const userInput = document.getElementById('user-input').value.toLowerCase();

    if (userInput === words[currentWord].toLowerCase()) {
        score += 10; // Tambah skor jika benar
        document.getElementById('feedback').textContent = "Benar!";
        usedWords.push(currentWord); // Tandai kata telah digunakan
        remainingWords--; // Kurangi jumlah kata yang tersisa
    } else {
        document.getElementById('feedback').textContent = "Salah!";
    }
    document.getElementById('score-result').textContent = `Skor: ${score}`;
    // Kurangi jumlah kata yang tersedia
    totalWordsAvailable -= 1; 
    console.log("Jumlah kata yang tersedia: ", totalWordsAvailable); // Log jumlah kata yang tersisa
    
    // Jika kata sudah habis, akhiri permainan
    if (remainingWords <= 0) {
        endGame();
    } else {
        // Tunggu 1,5 detik sebelum berpindah ke kata selanjutnya
        setTimeout(() => {
            nextWord();
        }, 1500);
    }
}

// Fungsi untuk memulai deteksi kesalahan artikel
async function startErrorDetect() {
    articles = await fetchArticles(); // Ambil artikel dari Firebase
    console.log("Artikel yang diambil: ", articles); // Log artikel
    usedArticles = []; // Reset array usedArticles
    score = 0; // Reset skor
    totalArticlesAvailable = Object.keys(articles).length; // Set jumlah artikel yang tersedia
    nextArticle();
    remainingArticles = Object.keys(articles).length; // Jumlah artikel yang tersedia
    nextArticle();
    showPage('error-detect');
}
//fungsi pelafalan artikel
function speakArticle() {
    const utterance = new SpeechSynthesisUtterance(currentArticle);
    utterance.lang = 'en-US'; // Set bahasa ke bahasa Inggris
    speechSynthesis.speak(utterance);
}

// Fungsi untuk memilih artikel acak
function nextArticle() {
    const availableArticles = Object.keys(articles).filter(article => !usedArticles.includes(article));
    console.log("Artikel yang tersedia: ", availableArticles); // Log artikel yang tersedia

    if (totalArticlesAvailable === 0) {
        endGame(); // Jika tidak ada artikel tersisa, akhiri permainan
        return;
    }
    
    if (availableArticles.length === 0) {
        endGame(); // Jika tidak ada artikel tersisa, akhiri permainan
        return;
    }

    currentArticle = availableArticles[Math.floor(Math.random() * availableArticles.length)];
    document.getElementById('remaining-attemptss').textContent = `Sisa kesempatan menebak: ${totalArticlesAvailable}`; // Tampilkan sisa kesempatan
    document.getElementById('article').textContent = articles[currentArticle];
    document.getElementById('correction').value = "";
    document.getElementById('error-feedback').textContent = "";

}

// Fungsi untuk memeriksa kesalahan artikel
function checkError() {
    const correction = document.getElementById('correction').value;

    if (correction.toLowerCase() === "article" || correction.toLowerCase() === "some" || correction.toLowerCase() === "memek") {
        document.getElementById('error-feedback').textContent = "Benar!";
        usedArticles.push(currentArticle); // Tandai artikel telah digunakan
        score += 10; // Tambah skor jika benar
        remainingArticles--; // Kurangi jumlah artikel yang tersisa
    } else {
        document.getElementById('error-feedback').textContent = "Salah!";
    }
    document.getElementById('score-result').textContent = `Skor: ${score}`;

    // Kurangi jumlah kata yang tersedia
    totalArticlesAvailable -= 1; 
    console.log("Jumlah kata yang tersedia: ", totalArticlesAvailable); // Log jumlah kata yang tersisa
    
    // Jika artikel sudah habis, akhiri permainan
    if (remainingArticles <= 0) {
        endGame();
    } else {
        // Tunggu 1,5 detik sebelum berpindah ke artikel selanjutnya
        setTimeout(() => {
            nextArticle();
        }, 1500);
    }
}

// Fungsi untuk mengakhiri permainan
function endGame() {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById('score-page').style.display = 'block'; // Tampilkan halaman skor
    document.getElementById('score-result').textContent = `Skor Akhir: ${score}`;
    document.getElementById('feedback').textContent = "Permainan Selesai!"; // Tampilkan pesan permainan selesai
}

