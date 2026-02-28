import axios from "./axios";

const kbApi = {
  uploadDocument: ({ title, category, file }) =>
    axios.post(
      `/kb/documents?title=${title}&category=${category}`,
      file
    ).then(res => res.data),

  getDocuments: () =>
    axios.get("/kb/documents").then(res => res.data),

  askQuestion: question =>
    axios.post("/kb/ask", { question }).then(res => res.data)
};

export default kbApi;
