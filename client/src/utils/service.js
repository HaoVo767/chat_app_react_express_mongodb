export const baseUrl = "https://server-virid-omega-99.vercel.app/api";

export const postRequest = async (url, body) => {
  const response = await fetch(`${baseUrl}` + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await response.json();

  if (!response.ok) {
    let message;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }
    return { error: true, message };
  }

  return data;
};

export const getRequest = async (url) => {
  const response = await fetch(`${baseUrl}` + url);
  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }
    return { error: true, message };
  } else {
    return data;
  }
};
