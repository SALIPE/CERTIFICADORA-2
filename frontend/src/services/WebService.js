
export const baseURL = "http://localhost:8080/furiosos";


function internalGet(url, headers) {
    const requestOptions = {
        method: 'GET',
        headers
    };
    return fetch(getUrl(url), requestOptions)
}

function internalPost(url, body, isJson, headers) {
    var requestOptions = {
        method: 'POST',
        headers: headers
    };
    if (body) {
        requestOptions.body = isJson ? JSON.stringify(body) : body;
    }
    return fetch(getUrl(url), requestOptions)
}

function internalDelete(url, headers) {
    const requestOptions = {
        method: 'DELETE',
        headers
    };
    return fetch(getUrl(url), requestOptions)
}

export async function get(url) {
    return internalGet(url, getHeaders(url))
        .then(handleJsonResponse)
}

export async function post(url, body) {
    return internalPost(url, body, true, getHeaders(url))
        .then(handleJsonResponse)
}

export async function postNoResponse(url, body) {
    return internalPost(url, body, true, getHeaders(url))
        .then(async response => {
            // isAuthenticate(response)
            if (!response.ok) {
                const { error } = await response.json()
                console.error(error)
                throw Error(error.name);
            }
            return response
        })
}

export async function del(url) {
    return internalDelete(url, getHeaders(url))
        .then(handleJsonResponse)
}


async function handleJsonResponse(response) {
    if (!response.ok) {
        const error = await response.json()
        console.error(error)
        throw Error(error.message);
    }
    return await response.json();
}


function getUrl(url) {
    if (url.includes('http')) {
        return url;
    } else {
        return baseURL + url;
    }
}

export function getHeaders(url) {
    return {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem('user'),
    };
}



export function cleanStorage() {
    localStorage.removeItem('user');
}

