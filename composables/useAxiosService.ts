import axios from 'axios';

// スネークケースをキャメルケースに変換する関数
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelCaseKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

/**
 * キャメルケースをスネークケースに変換する関数
 * @param {string} str - 変換するキャメルケースの文字列
 * @returns {string} - スネークケースに変換された文字列
 */
const toSnakeCase = (str: string): string => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

/**
 * オブジェクトのキーをキャメルケースからスネークケースに変換する関数
 * @param {any} obj - 変換するオブジェクト
 * @returns {any} - キーがスネークケースに変換されたオブジェクト
 */
const convertKeysToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertKeysToSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeCaseKey = toSnakeCase(key);
      result[snakeCaseKey] = convertKeysToSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

const instance = axios.create({
  baseURL: 'http://localhost:8080',
});

/*
 * Axiosインターセプター（リクエスト）の設定
 */
instance.interceptors.request.use(
  (config) => {
    if (config.data) {
      config.data = convertKeysToSnakeCase(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
 * Axiosインターセプター（レスポンス）の設定
 */
instance.interceptors.response.use(
  (response) => {
    response.data = toCamelCase(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useAxiosService = () => ({ axios: instance });
