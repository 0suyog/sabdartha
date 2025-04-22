const URI = "https://api.dictionaryapi.dev/api/v2/entries/en/";

export const getMeaning = async (word) => {
    let requestUrl = `${URI}word`;
    const response = await axios.get(requestUrl);
    const data = await response.json();
    return data;
};
