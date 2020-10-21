function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const haveJson =
    contentType && contentType.indexOf('application/json') !== -1;

  if (!response.ok && response.status !== 422) {
    throw Error(response.statusText);
  }

  if (haveJson) {
    return response
      .json()
      .then(data => {
        return {
          ok: response.ok,
          data,
        };
      })
      .catch(e => {
        console.dir(e);
        return {
          ok: false,
          data: {
            message: 'unknown error',
          },
        };
      });
  }

  return response;
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function fetchAndHandle(url, options) {
  if (!options) {
    options = {};
  }
  return fetchWithAuth(url, options);
}

function fetchWithAuth(url, options) {
  if (!options) {
    options = {};
  }

  const pms = defaults.beforeFetch
    ? defaults.beforeFetch({ url, options })
    : Promise.resolve();

  return pms.then(() => {
    if (!options.headers) {
      options.headers = new Headers();
    }

    // merge header if available
    [...Object.entries(defaults.headers.common)].forEach(
      ([key, value]) =>
        !options.headers.has(key) && options.headers.set(key, value),
    );
    return fetch(url, options).then(handleResponse);
  });
}

function fetchJSON(url, options) {
  return fetchWithAuth(url, options)
    .then(handleErrors)
    .then(response => response.json());
}

function fetchPostJSON(url, data) {
  return fetchJSON(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
}

const defaults = {
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*',
    },
  },
  beforeFetch: null,
};

const http = {
  fetchPostJSON,
  fetchAndHandle,
  defaults,
};

export { http };

export default { fetchPostJSON, fetchAndHandle };
