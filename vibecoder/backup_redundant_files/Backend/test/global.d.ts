declare global {
  namespace NodeJS {
    interface Global {
      testUtils: {
        mockUser: any;
        mockSeller: any;
        mockProject: any;
        mockTokens: any;
        createMockRequest: (overrides?: any) => any;
        createMockResponse: () => any;
        createMockNext: () => any;
      };
    }
  }

  var testUtils: {
    mockUser: any;
    mockSeller: any;
    mockProject: any;
    mockTokens: any;
    createMockRequest: (overrides?: any) => any;
    createMockResponse: () => any;
    createMockNext: () => any;
  };
}

export {};
