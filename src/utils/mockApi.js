import { mockStore } from "@/mock/mockData.js";

export function mockProcessPayment(formData, routine, plan) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const planType = plan?.type || formData.planType || "essential";
      const planLabel = plan?.label || plan?.name || routine.plan || "Plan Essential";
      const today = new Date().toISOString().split("T")[0];
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const newUser = {
        id: Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        gender: routine.gender,
        frequency: Number.parseInt(routine.frequency, 10) || 0,
        objective: routine.objective,
        plan: planLabel,
        planType,
        createdAt: today,
        routines: [routine.id],
      };

      const newSale = {
        id: Date.now(),
        userEmail: formData.email,
        clientName: fullName,
        plan: planLabel,
        planType,
        amount: plan.price,
        date: today,
        status: "completed",
        routineId: routine.id,
      };

      if (planType === "premium") {
        mockStore.communityMembers = mockStore.communityMembers || [];
        mockStore.communityMembers.push({
          nombre: fullName || formData.firstName || "Cliente Premium",
          email: formData.email,
          telefono: formData.phone,
        });
      }

      resolve({ user: newUser, sale: newSale });
    }, 1500);
  });
}

export function mockSendRoutineEmail() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export function mockGenerateRoutine(data) {
  return Promise.resolve(data);
}
