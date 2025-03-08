export const authenticateWithPi = async () => {
  if (!window.Pi) {
    throw new Error("Pi Network SDK not found! Open this app in the Pi Browser.");
  }

  try {
    const scopes = ["username", "payments"];
    const authResult = await window.Pi.authenticate(scopes, "testnet"); // Use Testnet
    console.log("Authenticated User:", authResult.user);
    return authResult.user;
  } catch (error) {
    throw new Error("Authentication failed: " + error.message);
  }
};

export const createTestnetPayment = async (amount, memo) => {
  if (!window.Pi) {
    throw new Error("Pi Network SDK not found! Open this app in the Pi Browser.");
  }

  try {
    const payment = await window.Pi.createPayment({
      amount,
      memo,
      metadata: { purpose: "betting" },
      to_address: null, // Testnet uses app wallet
    }, {
      network: "testnet",
    });

    console.log("Testnet Payment Result:", payment);
    return payment;
  } catch (error) {
    throw new Error("Testnet payment failed: " + error.message);
  }
};
