// This file is kept for reference but won't be used since we're using the backend storage
export const mockUsers = [
  { id: "1", userName: "AMITP", isNHI: false },
  { id: "2", userName: "API_USER", isNHI: false },
  { id: "3", userName: "DEV_USER", isNHI: false },
  { id: "4", userName: "VMAMIDI", isNHI: false },
  { id: "5", userName: "SB_INTEGRATION", isNHI: true },
  { id: "6", userName: "DEV_TESTING", isNHI: true },
  { id: "7", userName: "APP_INTEGRATION", isNHI: true },
];

export const mockAnalytics = {
  totalQueries: 3247,
  avgQueryDuration: "2.4",
  mostUsedQueryType: "SELECT",
  distinctDatabases: 7,
  frequentTables: "USERS",
  creditsUsed: "847.5",
  warehouseUsage: "COMPUTE_WH",
  uniqueRoles: 4,
  uniquePrivileges: 15,
  dataScanned: "234.8",
};
