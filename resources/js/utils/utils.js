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

    return value.length > max ? value.substring(0, max) + ' '+ suffix : value;
}

export const WEIGHTING_TYPES = {
    'FIVE_AND_ZERO': 'Five and Zero',
    'FIVE_TO_ONE': 'Five to One',
}
