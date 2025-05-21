export function getServiceColor(platform){
    const serviceColor = {
        "Spotify": "lightgreen",
        "Pandora": "deepskyblue",
        "YouTube Music": "salmon",
        "Apple Music": "gainsboro",
        "Other": "gray"
    };
    return serviceColor[platform] || "lightslategray";
}
export function getMusicGenreColor(genre){
    if(typeof genre === "number") genre = numToGenre(genre);

    const musicGenreColor = {
        "Classical": "gray",
        "Country": "orange",
        "EDM": "blue",
        "Folk": "brown",
        "Gospel": "gold",
        "Hip_hop": "mediumvioletred",
        "Jazz": "indigo",
        "K_pop": "green",
        "Latin": "red",
        "Lofi": "hotpink",
        "Metal": "silver",
        "Pop": "magenta",
        "R_and_B": "indianred",
        "Rap": "cyan",
        "Rock": "slategray",
        "VGM": "purple"
    };
    return musicGenreColor[genre] || "white";
}
export function getEffectColor(effect){
    const effectColor = {
        "Improve": "limegreen",
        "No effect": "lightgray",
        "Worsen": "orangered",
        "N/A": "lightslategray"
    };
    return effectColor[effect] || "black";
}

export function genreToNum(genre){
    const genreToNum = {
        "Classical": 1,
        "Country": 2,
        "EDM": 3,
        "Folk": 4,
        "Gospel": 5,
        "Hip_hop": 6,
        "Jazz": 7,
        "K_pop": 8,
        "Latin": 9,
        "Lofi": 10,
        "Metal": 11,
        "Pop": 12,
        "R_and_B": 13,
        "Rap": 14,
        "Rock": 15,
        "VGM": 16
    };
    return genreToNum[genre] || 0;
}
export function numToGenre(genre){
    const numToGenre = {
        1: "Classical",
        2: "Country",
        3: "EDM",
        4: "Folk",
        5: "Gospel",
        6: "Hip_hop",
        7: "Jazz",
        8: "K_pop",
        9: "Latin",
        10: "Lofi",
        11: "Metal",
        12: "Pop",
        13: "R_and_B",
        14: "Rap",
        15: "Rock",
        16: "VGM"
    };
    return numToGenre[genre] || "huh";
}

