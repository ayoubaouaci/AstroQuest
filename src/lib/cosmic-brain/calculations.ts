import {
    Body,
    Observer,
    MakeTime,
    Ecliptic,
    GeoVector,
    SiderealTime
} from "astronomy-engine";

export interface NatalChart {
    sunSign: string;
    moonSign: string;
    risingSign: string;
    sunDegree: number;
    moonDegree: number;
    risingDegree: number;
}

const SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

function getSignFromLongitude(longitude: number): { sign: string; degree: number } {
    // Normalize longitude to 0-360
    let lng = longitude % 360;
    if (lng < 0) lng += 360;

    const signIndex = Math.floor(lng / 30);
    const degree = lng % 30;

    return {
        sign: SIGNS[signIndex],
        degree: degree
    };
}

export function calculateNatalChart(
    dateString: string,
    timeString: string,
    latitude: number = 0,
    longitude: number = 0
): NatalChart {
    const date = new Date(`${dateString}T${timeString}:00`);
    const astroTime = MakeTime(date);
    const observer = new Observer(latitude, longitude, 0);

    // 1. Calculate Sun Position (Ecliptic Longitude)
    const sunPos = GeoVector(Body.Sun, astroTime, false);
    const sunEcliptic = Ecliptic(sunPos);
    const sunInfo = getSignFromLongitude(sunEcliptic.elon);

    // 2. Calculate Moon Position
    const moonPos = GeoVector(Body.Moon, astroTime, false);
    const moonEcliptic = Ecliptic(moonPos);
    const moonInfo = getSignFromLongitude(moonEcliptic.elon);

    // 3. Calculate Rising Sign (Ascendant)
    const gst = SiderealTime(astroTime);
    const lstDeg = (gst * 15 + longitude) % 360;
    const lstRad = lstDeg * Math.PI / 180;

    // Mean Obliquity of the Ecliptic (approx 23.439 degrees)
    const oblRad = 23.4392911 * Math.PI / 180;

    const latRad = latitude * Math.PI / 180;

    const y = -Math.cos(lstRad);
    const x = (Math.sin(lstRad) * Math.cos(oblRad)) + (Math.tan(latRad) * Math.sin(oblRad));

    let ascRad = Math.atan2(y, x);
    let ascDeg = ascRad * 180 / Math.PI;
    if (ascDeg < 0) ascDeg += 360;

    const risingInfo = getSignFromLongitude(ascDeg);

    return {
        sunSign: sunInfo.sign,
        moonSign: moonInfo.sign,
        risingSign: risingInfo.sign,
        sunDegree: sunInfo.degree,
        moonDegree: moonInfo.degree,
        risingDegree: risingInfo.degree
    };
}

export function getCosmicReading(chart: NatalChart, location?: string): string {
    const locationText = location ? ` calibrated from ${location}` : '';
    return `Traveler${locationText}... ` +
        `Your Cosmic Signature has been initialized. ` +
        `Primary Sector: ${chart.sunSign}. ` +
        `Emotional Sector: ${chart.moonSign}. ` +
        `Interface Sector: ${chart.risingSign}. ` +
        `Data streams are now accessible through the Archive.`;
}

export function getCurrentMoonPhase(): string {
    const date = new Date();
    const astroTime = MakeTime(date);

    // Moon Position
    const moonPos = GeoVector(Body.Moon, astroTime, false);
    const moonEcliptic = Ecliptic(moonPos);

    // Sun Position
    const sunPos = GeoVector(Body.Sun, astroTime, false);
    const sunEcliptic = Ecliptic(sunPos);

    // Calculate Phase Angle (0-360)
    let phaseAngle = moonEcliptic.elon - sunEcliptic.elon;
    if (phaseAngle < 0) phaseAngle += 360;

    // Map to Name
    if (phaseAngle < 45) return "New Moon 🌑";
    if (phaseAngle < 90) return "Waxing Crescent 🌒";
    if (phaseAngle < 135) return "First Quarter 🌓";
    if (phaseAngle < 180) return "Waxing Gibbous 🌔";
    if (phaseAngle < 225) return "Full Moon 🌕";
    if (phaseAngle < 270) return "Waning Gibbous 🌖";
    if (phaseAngle < 315) return "Last Quarter 🌗";
    return "Waning Crescent 🌘";
}
