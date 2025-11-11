export function mockProcessPayment(formData, routine, plan) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: routine.gender,
        frequency: parseInt(routine.frequency, 10),
        objective: routine.objective,
        plan: plan.id,
        createdAt: new Date().toISOString().split("T")[0],
        routines: [routine.id],
      };

      const newSale = {
        id: Date.now(),
        userEmail: formData.email,
        plan: plan.id,
        amount: plan.price,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
        templateId: routine.id,
      };

      resolve({ user: newUser, sale: newSale });
    }, 1500);
  });
}

export function mockSendRoutineEmail(_email, _pdfBlob) {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export function mockGenerateRoutine(data) {
  return Promise.resolve(data);
}
