import axios from 'axios';
import { rootStore } from '@/stores';
import { getBaseURL } from '@/utils/configUtil';
import { getOption } from '@/utils/storageUtil';
import i18n from 'i18next';

const stringCompiler = (str, params, returnUnmatches = false) => {
  const pattern = /{([\w:]+)}/g;
  const compiledResult = [];
  const matchedResult = [];
  let index = 0;

  let m = pattern.exec(str);

  while (m !== null) {
    compiledResult.push(str.substring(index, m.index));
    index = pattern.lastIndex;

    const [match] = m[1].split(':');
    compiledResult.push(params[match]);
    matchedResult.push(match);

    m = pattern.exec(str);
  }

  compiledResult.push(str.substring(index, str.length));

  if (returnUnmatches) {
    const unmatchedParams = { ...params };
    matchedResult.forEach(match => {
      delete unmatchedParams[match];
    });
    return [compiledResult.join(''), unmatchedParams];
  }

  return compiledResult.join('');
};

const baseUrl = getBaseURL();

axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

if (window.localStorage.getItem('token')) {
  axios.defaults.headers.common['X-AUTH-TOKEN'] = window.localStorage.getItem('token');
}

let isRefreshing = false;
let subscribers = [];

function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}

function onRefreshed(token) {
  subscribers.map(cb => cb(token));
}

const refreshAccessToken = (accessToken, refreshToken) => {
  return axios.get('/api/users/refresh', {
    headers: {
      'X-AUTH-TOKEN': accessToken,
      'X-REFRESH-TOKEN': refreshToken,
    },
  });
};

axios.interceptors.response.use(
  req => req,
  err => {
    const {
      config,
      response: { status },
    } = err;

    if (config.url === '/api/users/refresh' || status !== 401) {
      return Promise.reject(err);
    }

    const originalRequest = config;
    if (window.localStorage.getItem('refreshToken') && status === 401) {
      if (isRefreshing) {
        return new Promise(resolve => {
          subscribeTokenRefresh(token => {
            if (token) {
              axios.defaults.headers.common['X-AUTH-TOKEN'] = token;
              originalRequest.headers['X-AUTH-TOKEN'] = token;
              resolve(axios(originalRequest));
            }
          });
        });
      }
      isRefreshing = true;
      return refreshAccessToken(window.localStorage.getItem('token'), window.localStorage.getItem('refreshToken'))
        .then(response => {
          const { data } = response;
          onRefreshed(data.token);
          window.localStorage.setItem('token', data.token);
          window.localStorage.setItem('refreshToken', data.refreshToken);
          subscribers = [];
          originalRequest.headers['X-AUTH-TOKEN'] = data.token;
          return axios(config);
        })
        .catch(error => {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('refreshToken');
          onRefreshed(null);
          rootStore.controlStore.setError(error.response.status, error.response.data.message || i18n.t('세션이 만료되었거나, 로그인되어 있지 않습니다.'), () => {
            rootStore.userStore.clearUser();
          });
        })
        .finally(() => {
          isRefreshing = false;
        });
    }
    return Promise.reject(err);
  },
);

const processSuccess = (handler, response, ref) => {
  if (typeof handler === 'function') {
    handler(response.data, ref);
  }
};

export const setToken = (token, refreshToken = null) => {
  axios.defaults.headers.common['X-AUTH-TOKEN'] = token;
  window.localStorage.setItem('token', token);
  if (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken);
  }
};

const processError = (handler, error) => {
  let handlerResponse = false;

  if (handler && typeof handler === 'function') {
    handlerResponse = handler(error && error.response && error.response.status, error && error.response && error.response.data);
  }

  if (error && error.response && !handlerResponse) {
    if (error.code === 'ERR_NETWORK') {
      rootStore.controlStore.setError(error.response.status, i18n.t('네트워크에 연결되어 있지 않거나, 서버가 동작 중이지 않습니다.'));
    } else if (error.response.status === 401) {
      rootStore.controlStore.setError(error.response.status, error.response.data.message || i18n.t('세션이 만료되었거나, 로그인되어 있지 않습니다.'), () => {
        rootStore.userStore.clearUser();
      });
    } else if (error.response.status === 403) {
      rootStore.controlStore.setError(error.response.status, error.response.data.message || i18n.t('요청하신 리소스에 접근 권한이 없습니다.'));
    } else if (error.response.status === 404) {
      rootStore.controlStore.setError(error.response.status, error.response.data.message || i18n.t('요청하신 정보를 찾을 수 없습니다.'));
    } else if (handler && typeof handler === 'function') {
      try {
        rootStore.controlStore.setError(error.response.status, `${error.response.data.message}`);
      } catch (data) {
        rootStore.controlStore.setError(error.response.status, error.response.data.message);
      }
    } else if (error.response.data && error.response.data.message) {
      rootStore.controlStore.setError(i18n.t('오류'), error.response.data.message);
    } else {
      rootStore.controlStore.setError(error.response.status, i18n.t('알 수 없는 오류가 발생하였습니다.'));
    }
  }
};

const processStart = () => {};

const processFinally = () => {};

const getAuthHeaders = (noAuth, multipart) => {
  let result = {
    withCredentials: true,
    headers: {},
  };

  if (multipart) {
    result = {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  }

  const uuid = getOption('user', 'info', 'uuid');
  if (!result.headers.uuid && uuid) {
    result.headers.uuid = uuid;
  }

  if (result.headers.uuid && !uuid) {
    delete result.headers.uuid;
  }

  return result;
};

// METHOD: GET
export function get(url, data, successHandler, errorHandler, ref, noAuth, showLoading = true, message) {
  if (showLoading !== false) {
    processStart();
  }

  if (showLoading) {
    rootStore.controlStore.setRequestLoading(true);
  }

  const messageId = (performance && performance.now && performance.now()) || Date.now();
  if (showLoading && message) {
    rootStore.controlStore.addRequestMessage(messageId, message);
  }

  const [uri, unmatchedParams] = stringCompiler(url, data, true);

  const promise = axios.get(uri, { params: unmatchedParams, ...getAuthHeaders(noAuth) });

  promise
    .then(response => {
      processSuccess(successHandler, response, ref);
    })
    .catch(error => {
      processError(errorHandler, error);
    })
    .finally(() => {
      if (showLoading && message) {
        rootStore.controlStore.removeRequestMessage(messageId);
      }
      if (showLoading !== false) {
        processFinally();
      }
      if (showLoading) {
        rootStore.controlStore.setRequestLoading(false);
      }
    });
  return promise;
}

// METHOD: POST
export function post(url, data, successHandler, errorHandler, ref, noAuth, showLoading = true, multipart, message) {
  if (showLoading !== false) {
    processStart();
  }

  if (showLoading) {
    rootStore.controlStore.setRequestLoading(true);
  }

  const messageId = Date.now();
  if (message) {
    rootStore.controlStore.addRequestMessage(messageId, message);
  }

  let promise;
  if (multipart) {
    promise = axios.post(url, data, getAuthHeaders(noAuth, true));
  } else if (Array.isArray(data)) {
    promise = axios.post(url, data, getAuthHeaders(noAuth));
  } else {
    const [uri, unmatchedParams] = stringCompiler(url, data, true);
    promise = axios.post(uri, unmatchedParams, getAuthHeaders(noAuth));
  }

  promise
    .then(response => {
      processSuccess(successHandler, response, ref);
    })
    .catch(error => {
      processError(errorHandler, error);
    })
    .finally(() => {
      if (message) {
        rootStore.controlStore.removeRequestMessage(messageId);
      }
      if (showLoading !== false) {
        processFinally();
      }
      if (showLoading) {
        rootStore.controlStore.setRequestLoading(false);
      }
    });
  return promise;
}

// METHOD: PUT
export function put(url, data, successHandler, errorHandler, ref, noAuth, showLoading = true, multipart, message) {
  if (showLoading !== false) {
    processStart();
  }

  if (showLoading) {
    rootStore.controlStore.setRequestLoading(true);
  }

  const messageId = Date.now();
  if (message) {
    rootStore.controlStore.addRequestMessage(messageId, message);
  }

  const [uri, unmatchedParams] = stringCompiler(url, data, true);

  let promise;
  if (multipart) {
    promise = axios.put(url, data, getAuthHeaders(noAuth, true));
  } else {
    promise = axios.put(uri, unmatchedParams, getAuthHeaders(noAuth));
  }

  promise
    .then(response => {
      processSuccess(successHandler, response, ref);
    })
    .catch(error => {
      processError(errorHandler, error);
    })
    .finally(() => {
      if (message) {
        rootStore.controlStore.removeRequestMessage(messageId);
      }
      if (showLoading !== false) {
        processFinally();
      }
      if (showLoading) {
        rootStore.controlStore.setRequestLoading(false);
      }
    });
  return promise;
}

// METHOD: DELETE
export function del(url, data, successHandler, errorHandler, ref, noAuth, showLoading = true, message) {
  if (showLoading !== false) {
    processStart();
  }

  if (showLoading) {
    rootStore.controlStore.setRequestLoading(true);
  }

  const messageId = Date.now();
  if (message) {
    rootStore.controlStore.addRequestMessage(messageId, message);
  }

  const promise = axios
    .delete(stringCompiler(url, data), Object.assign(getAuthHeaders(noAuth), { data }))
    .then(response => {
      processSuccess(successHandler, response, ref);
    })
    .catch(error => {
      processError(errorHandler, error);
    })
    .finally(() => {
      if (message) {
        rootStore.controlStore.removeRequestMessage(messageId);
      }
      if (showLoading !== false) {
        processFinally();
      }
      if (showLoading) {
        rootStore.controlStore.setRequestLoading(false);
      }
    });

  return promise;
}

export function waitFor(promises, callback) {
  return axios.all(promises).then(callback);
}
