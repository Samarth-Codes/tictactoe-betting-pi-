// Mock Pi SDK for local development
window.Pi = {
    init: (config) => {
      console.log('Mock Pi SDK initialized with config:', config);
      return true;
    },
    
    authenticate: async (scopes, onIncompletePaymentFound) => {
      console.log('Mock authentication with scopes:', scopes);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Return mock user data
      return {
        uid: 'mock-user-id-123456',
        username: 'MockPiUser',
        accessToken: 'mock-access-token-xyz',
        roles: ['user']
      };
    },
    
    createPayment: async (paymentData) => {
      console.log('Mock payment created:', paymentData);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        identifier: 'mock-payment-' + Math.random().toString(36).substring(2, 15),
        status: 'COMPLETED',
        amount: paymentData.amount,
        memo: paymentData.memo,
        to_address: paymentData.recipient
      };
    },
    
    openPaymentFlow: async (paymentId) => {
      console.log('Mock payment flow opened for ID:', paymentId);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        status: 'COMPLETED'
      };
    }
  };
  
  console.log('🔧 Mock Pi SDK loaded for local development');