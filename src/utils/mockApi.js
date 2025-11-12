export function mockProcessPayment(formData, routine, plan) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: routine.gender,
        frequency: Number.parseInt(routine.frequency, 10) || 0,
        objective: routine.objective,
        plan: routine.plan || plan.name,
        createdAt: new Date().toISOString().split("T")[0],
        routines: [routine.id],
      };

      const newSale = {
        id: Date.now(),
        userEmail: formData.email,
        plan: routine.plan || plan.name,
        amount: plan.price,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
        routineId: routine.id,
      };

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
