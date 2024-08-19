export const ENV = process.env.HOST || "http://localhost:3000";

export const cRestMethods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

/*
  GET request
 */
export const get = async (url: string, cookie?: string, withENV?: boolean) => {
  const response = await fetch(withENV ? `${ENV}${url}` : url, {
    method: "GET",
    headers: cookie
      ? {
          "Content-Type": "application/json",
          cookie: cookie,
        }
      : {
          "Content-Type": "application/json",
        },
  });
  return await checkError(response);
};

/*
  POST request
 */
export const post = async (url: string, body: any = {}, withENV?: boolean) => {
  const response = await fetch(withENV ? `${ENV}${url}` : url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return checkError(response);
};

/*
  PUT request
 */
export const put = async (url: string, body: any = {}, withENV?: boolean) => {
  const response = await fetch(withENV ? `${ENV}${url}` : url, {
    method: "PUT", // or 'PATCH'
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(body),
    credentials: "same-origin",
  });
  return checkError(response);
};

/*
  DELETE request
 */
export const del = async (url: string, body: any = {}, withENV?: boolean) => {
  const response = await fetch(withENV ? `${ENV}${url}` : url, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(body),
    credentials: "same-origin",
  });
  return checkError(response, true);
};

/*
Checking if request failed or not
 */
const checkError = async (response: Response, del: boolean = false) => {
  if (response.status >= 300 && response.status < 600) {
    const customError: CustomError = new Error() as CustomError;
    customError.error = await response.json();
    throw customError;
  }
  if (del) {
    return;
  }
  return await response.json();
};

export type CustomError = Error & {
  error: {
    code: string;
    message: string;
  };
};
