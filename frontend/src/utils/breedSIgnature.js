const PURPOSE_HUES = {
    dairy : 168,
    draft : 28,
    dual : 262,
};


function hashString(str) {
    let hash = 0;
    for(let i=0; i<str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }

    return Math.abs(hash);
}

export function getBreedSignature ( {name, type, purpose}) {
    const hash = hashString(name);
    const baseHue = PURPOSE_HUES[purpose] ?? PURPOSE_HUES.dual;

    const hueShift = (hash % 40) -20;
    const hue = (baseHue + hueShift + 360) % 360;

    const saturation = type ==='buffalo' ? 45 : 70;
    const lightness = type === 'buffalo' ? 30 : 45;


    return {
        color : `hsl(${hue} ${saturation}% ${lightness}%)`,
        colorSoft : `hsl(${hue} ${saturation}% ${lightness + 35}%)`,
        pattern: type ==='buffalo' ? 'angular' : 'organic',
        seed : hash,
    };
}