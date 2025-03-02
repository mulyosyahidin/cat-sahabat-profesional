export const convertToMinutes = (value) => {
    const timeParts = value.split(":");

    if (timeParts.length === 3) {
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);

        const totalMinutes = (hours * 60) + minutes + (seconds / 60);

        return Math.floor(totalMinutes);
    }

    return 0;
}

export const validateTimeFormat = (value) => {
    const timeRegex = /^([0-9]+):([0-5][0-9]):([0-5][0-9])$/;

    return timeRegex.test(value);
}

export const limitPlainText = (value, max = -1, suffix = '...') => {
    if (max === -1) {
        return value;
    }

    return value.length > max ? value.substring(0, max) + ' ' + suffix : value;
}

export const convertToISO = (datetime) => {
    return datetime.replace(' ', 'T');
}

export const calculateTimeLeft = (endTime) => {
    const now = new Date().getTime();

    return endTime - now;
}

export const formatTime = (milliseconds) => {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const msToMinute = (ms) => {
    return Math.floor(ms / 60000);
}

export const WEIGHTING_TYPES = {
    'FIVE_AND_ZERO': 'Five and Zero',
    'FIVE_TO_ONE': 'Five to One',
}

export const formatDateTime = (datetime) => {
    const date = new Date(datetime);

    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
    };

    return date
            .toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) +
        ' ' +
        date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const formatDate = (datetime) => {
    const date = new Date(datetime);

    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
    };

    return date.toLocaleDateString('id-ID', options);
}

export const timeLeft = (startedAt, maximumDuration) => {
    const now = new Date();
    const startedTime = new Date(startedAt);
    const endTime = new Date(startedTime.getTime() + maximumDuration * 60 * 1000); // Konversi menit ke milidetik
    const timeRemaining = Math.max(0, endTime - now); // Menghindari nilai negatif

    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));

    if (hours > 0) {
        return `${hours} jam ${minutes} menit`;
    } else if (minutes > 0) {
        return `${minutes} menit ${seconds} detik`;
    } else {
        return `${seconds} detik`;
    }
};

export const timeLeftInMinute = (startedAt, maximumDuration) => {
    const now = new Date();
    const startedAtDate = new Date(startedAt);

    // Hitung total waktu tersisa dalam detik
    const elapsedTimeInSeconds = Math.floor((now - startedAtDate) / 1000);
    const totalDurationInSeconds = maximumDuration * 60;
    const remainingTimeInSeconds = totalDurationInSeconds - elapsedTimeInSeconds;

    // Jika waktu habis
    if (remainingTimeInSeconds <= 0) return "Waktu Habis";

    const minutes = Math.floor(remainingTimeInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours} jam ${remainingMinutes > 0 ? remainingMinutes + " menit" : ""}`.trim();
    } else if (minutes > 0) {
        return `${minutes} menit`;
    } else {
        return "< 1 menit";
    }
}

export const removeImagesFromHtml = (html) => {
    if (!html) return '';

    // Buat elemen div untuk memproses HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Hapus semua elemen <img>
    tempDiv.querySelectorAll('img').forEach(img => img.remove());

    return tempDiv.innerHTML;
};

export const limitPlainTextTiny = (html, limit = 100) => {
    if (!html) return '';

    // Buat elemen div untuk memproses HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Ambil teks murni tanpa tag HTML
    let text = tempDiv.textContent || tempDiv.innerText || '';

    // Batasi teks dengan jumlah karakter tertentu, tanpa memotong kata
    if (text.length > limit) {
        let truncated = text.substr(0, limit);
        truncated = truncated.substr(0, Math.min(truncated.length, truncated.lastIndexOf(" "))); // Hindari memotong kata
        return truncated + '...';
    }

    return text;
};
