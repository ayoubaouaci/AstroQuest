const { Body, Observer, Equator, Ecliptic, MakeTime, GeoVector } = require('astronomy-engine');

try {
    const date = new Date();
    const time = MakeTime(date);
    const observer = new Observer(0, 0, 0);
    const body = Body.Mars;

    console.log('Testing Equator...');
    const eq = Equator(body, time, observer, true, true);
    console.log('Equator result keys:', Object.keys(eq));
    console.log('Equator.vec:', eq.vec);

    console.log('Testing Ecliptic with eq.vec...');
    try {
        const ec = Ecliptic(eq.vec);
        console.log('Ecliptic(eq.vec) result:', ec);
    } catch (e) {
        console.error('Ecliptic(eq.vec) failed:', e.message);
    }

    console.log('Testing Ecliptic with eq...');
    try {
        const ec2 = Ecliptic(eq);
        console.log('Ecliptic(eq) result:', ec2);
    } catch (e) {
        console.error('Ecliptic(eq) failed:', e.message);
    }

} catch (e) {
    console.error('General Error:', e);
}
