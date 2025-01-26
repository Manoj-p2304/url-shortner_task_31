export const getOS = (userAgent) => {
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/macintosh/i.test(userAgent)) return 'macOS';
    if (/linux/i.test(userAgent)) return 'Linux';
    if (/android/i.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
    return 'Unknown';
};

export const getDeviceType = (userAgent) => {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
};
