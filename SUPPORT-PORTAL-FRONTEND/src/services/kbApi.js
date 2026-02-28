// src/services/kbApi.js

const BASE_URL = "http://127.0.0.1:8000";

const kbApi = {
  uploadDocument(formData, token) {
    return fetch(`${BASE_URL}/kb/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },

  fetchDocuments(token) {
    return fetch(`${BASE_URL}/kb/documents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json());
  },

  deleteDocument(id, token) {
    return fetch(`${BASE_URL}/kb/documents/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  ask(question) {
    return fetch(`${BASE_URL}/kb/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    }).then(res => res.json());
  },
};

export default kbApi;
