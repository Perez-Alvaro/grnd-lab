let apiClient = {
  async post(_url, payload) {
    return { data: { id: Date.now(), ...payload } };
  },
  async put(_url, payload) {
    return { data: payload };
  }
};

export const configurePlanService = client => {
  if (client && typeof client.post === 'function' && typeof client.put === 'function') {
    apiClient = client;
  }
};

export const savePlan = async planData => {
  const response = await apiClient.post('/plans', planData);
  return response.data;
};

export const updatePlan = async (id, planData) => {
  const response = await apiClient.put(`/plans/${id}`, planData);
  return response.data;
};

export default {
  configurePlanService,
  savePlan,
  updatePlan
};
