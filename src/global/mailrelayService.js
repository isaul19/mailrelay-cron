const axios = require("axios");

const { URL_MAILRELAY, TOKEN_MAILRELAY } = require("../env/keys");

const mailRelayClient = axios.create({
  baseURL: URL_MAILRELAY,
  headers: {
    "X-AUTH-TOKEN": TOKEN_MAILRELAY,
    accept: "application/json",
  },
});

const getSubscribers = async (params) => {
  const res = await mailRelayClient.get("/subscribers", {
    params: { "q[by_status]": "active", ...params },
  });

  return res.data;
};

const getDeletedSubscribers = async (params) => {
  const res = await mailRelayClient.get("/subscribers/deleted", {
    params,
  });
  return res.data;
};

const restoreSubscriber = async (id) => {
  const res = await mailRelayClient.patch(`/subscribers/${id}/restore`);
  return res.data;
};

const getSubscribersById = async (id, params) => {
  const res = await mailRelayClient.get(`/subscribers/${id}`, {
    params: { "q[by_status]": "active", ...params },
  });
  return res.data;
};

const postSubscriber = async (body) => {
  const res = await mailRelayClient.post("/subscribers", body);
  return res.data;
};

const deleteSubscriber = async (id) => {
  const res = await mailRelayClient.delete(`/subscribers/${id}`);
  return res.data;
};

const patchSubscriber = async (id, body) => {
  const res = await mailRelayClient.patch(`/subscribers/${id}`, body);
  return res.data;
};
const postApiBatches = async (body) => {
  const res = await mailRelayClient.post("/api_batches", body);
  return res.data;
};

module.exports = {
  getSubscribers,
  getSubscribersById,
  postSubscriber,
  deleteSubscriber,
  patchSubscriber,
  getDeletedSubscribers,
  restoreSubscriber,
  postApiBatches,
};
