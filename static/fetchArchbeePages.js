function getArchbeePages() {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "apiKey": "De83jLfQM3AMru4CcdRC0",
        "docSpaceId": "Wu9BHJnacGEY80O_bZ0u_",
        "docId": "kA9c7wW4CYGP7DFUUlPon",
        "format": "markdown"
    });

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://app.archbee.com/api/public-api/doc", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

getArchbeePages();
