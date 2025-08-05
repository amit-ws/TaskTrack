import { type User, type InsertUser, type SnowflakeUser, type InsertSnowflakeUser, type UserAnalytics, type InsertUserAnalytics, type UserActivities, type InsertUserActivities, type ExpensiveQueries, type InsertExpensiveQueries, type ObjectUsage, type InsertObjectUsage, type LineageDependencies, type InsertLineageDependencies, type UserObjectAccess, type InsertUserObjectAccess } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Snowflake Users
  getSnowflakeUsers(): Promise<SnowflakeUser[]>;
  getSnowflakeUser(id: string): Promise<SnowflakeUser | undefined>;
  getSnowflakeUserByName(userName: string): Promise<SnowflakeUser | undefined>;
  
  // User Analytics
  getUserAnalytics(userId: string): Promise<UserAnalytics | undefined>;
  getAllUserAnalytics(): Promise<UserAnalytics[]>;
  
  // User Activities
  getUserActivities(userId: string, sessionType?: string): Promise<UserActivities[]>;
  getAllUserActivities(): Promise<UserActivities[]>;
  
  // Expensive Queries
  getExpensiveQueries(groupingType?: string): Promise<ExpensiveQueries[]>;
  
  // Object Usage
  getObjectUsage(operationType?: string): Promise<ObjectUsage[]>;
  
  // Lineage Dependencies
  getLineageDependencies(sourceObject: string): Promise<LineageDependencies[]>;
  
  // User Object Access
  getUserObjectAccess(objectName: string): Promise<UserObjectAccess[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private snowflakeUsers: Map<string, SnowflakeUser>;
  private userAnalytics: Map<string, UserAnalytics>;
  private userActivities: UserActivities[];
  private expensiveQueries: ExpensiveQueries[];
  private objectUsage: ObjectUsage[];
  private lineageDependencies: LineageDependencies[];
  private userObjectAccess: UserObjectAccess[];

  constructor() {
    this.users = new Map();
    this.snowflakeUsers = new Map();
    this.userAnalytics = new Map();
    this.userActivities = [];
    this.expensiveQueries = [];
    this.objectUsage = [];
    this.lineageDependencies = [];
    this.userObjectAccess = [];
    
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize Snowflake Users (Human)
    const humanUsers = [
      {
        id: randomUUID(),
        userName: "AMITP",
        userOwner: "ADMIN",
        lastSuccessfulLogin: new Date("2024-01-15T09:32:00Z"),
        status: "Active",
        authenticationMethod: "SSO",
        riskLevel: "Low",
        createdOn: new Date("2024-01-01T00:00:00Z"),
        isNHI: false,
        tokenType: null,
        humanOwner: null,
      },
      {
        id: randomUUID(),
        userName: "API_USER",
        userOwner: "SYSTEM",
        lastSuccessfulLogin: new Date("2024-01-15T11:45:00Z"),
        status: "Active",
        authenticationMethod: "API_KEY",
        riskLevel: "Medium",
        createdOn: new Date("2024-01-01T00:00:00Z"),
        isNHI: false,
        tokenType: null,
        humanOwner: null,
      },
      {
        id: randomUUID(),
        userName: "DEV_USER",
        userOwner: "DEV_ADMIN",
        lastSuccessfulLogin: new Date("2024-01-14T16:22:00Z"),
        status: "Idle",
        authenticationMethod: "PASSWORD",
        riskLevel: "Low",
        createdOn: new Date("2024-01-01T00:00:00Z"),
        isNHI: false,
        tokenType: null,
        humanOwner: null,
      },
      {
        id: randomUUID(),
        userName: "VMAMIDI",
        userOwner: "ADMIN",
        lastSuccessfulLogin: new Date("2024-01-15T08:15:00Z"),
        status: "Active",
        authenticationMethod: "SSO",
        riskLevel: "Low",
        createdOn: new Date("2024-01-01T00:00:00Z"),
        isNHI: false,
        tokenType: null,
        humanOwner: null,
      },
    ];

    // Initialize NHI Users
    const nhiUsers = [
      {
        id: randomUUID(),
        userName: "SB_INTEGRATION",
        userOwner: "AMITP",
        lastSuccessfulLogin: new Date("2024-01-15T10:00:00Z"),
        status: "Active",
        authenticationMethod: "OAUTH",
        riskLevel: "Medium",
        createdOn: new Date("2024-01-01T00:00:00Z"),
        isNHI: true,
        tokenType: "OAUTH_ACCESS_TOKEN",
        humanOwner: "AMITP",
      },
      {
        id: randomUUID(),
        userName: "DEV_TESTING",
        userOwner: "DEV_USER",
        lastSuccessfulLogin: new Date("2024-01-15T09:30:00Z"),
        status: "Active",
        authenticationMethod: "PROGRAMMATIC",
        riskLevel: "High",
        createdOn: new Date("2024-01-01T00:00:00Z"),
        isNHI: true,
        tokenType: "PROGRAMMATIC_ACCESS_TOKEN",
        humanOwner: "DEV_USER",
      },
      {
        id: randomUUID(),
        userName: "APP_INTEGRATION",
        userOwner: "VMAMIDI",
        lastSuccessfulLogin: new Date("2024-01-15T07:45:00Z"),
        status: "Active",
        authenticationMethod: "OAUTH",
        riskLevel: "Medium",
        createdOn: new Date("2024-01-01T00:00:00Z"),
        isNHI: true,
        tokenType: "OAUTH_ACCESS_TOKEN",
        humanOwner: "VMAMIDI",
      },
    ];

    [...humanUsers, ...nhiUsers].forEach(user => {
      this.snowflakeUsers.set(user.id, user);
    });

    // Initialize User Analytics for AMITP
    const amitpUser = humanUsers.find(u => u.userName === "AMITP");
    if (amitpUser) {
      this.userAnalytics.set(amitpUser.id, {
        id: randomUUID(),
        userId: amitpUser.id,
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
      });
    }

    // Initialize User Analytics for SB_INTEGRATION (NHI)
    const sbIntegrationUser = nhiUsers.find(u => u.userName === "SB_INTEGRATION");
    if (sbIntegrationUser) {
      this.userAnalytics.set(sbIntegrationUser.id, {
        id: randomUUID(),
        userId: sbIntegrationUser.id,
        totalQueries: 1847,
        avgQueryDuration: "1.8",
        mostUsedQueryType: "INSERT",
        distinctDatabases: 3,
        frequentTables: "STAGING",
        creditsUsed: "456.2",
        warehouseUsage: "ETL_WH",
        uniqueRoles: 2,
        uniquePrivileges: 8,
        dataScanned: "89.3",
      });
    }

    // Initialize User Activities
    this.userActivities = [
      {
        id: randomUUID(),
        userId: amitpUser?.id || "",
        loginTime: new Date("2024-01-15T09:32:15Z"),
        ipAddress: "192.168.1.105",
        roles: "ADMIN, ANALYST",
        objectsAccessed: "USERS, ORDERS, INVENTORY",
        creditsConsumed: "247.5",
        queriesExecuted: 1832,
        dataScanned: "45.2",
        sessionType: "session",
      },
      {
        id: randomUUID(),
        userId: humanUsers.find(u => u.userName === "API_USER")?.id || "",
        loginTime: new Date("2024-01-15T11:45:22Z"),
        ipAddress: "10.0.0.24",
        roles: "API_ROLE",
        objectsAccessed: "LOGS, METRICS",
        creditsConsumed: "156.8",
        queriesExecuted: 956,
        dataScanned: "28.7",
        sessionType: "session",
      },
      {
        id: randomUUID(),
        userId: sbIntegrationUser?.id || "",
        loginTime: new Date("2024-01-15T10:00:00Z"),
        ipAddress: "10.0.1.45",
        roles: "ETL_ROLE, INTEGRATION",
        objectsAccessed: "STAGING, RAW_DATA, PROCESSED",
        creditsConsumed: "298.7",
        queriesExecuted: 1456,
        dataScanned: "67.8",
        sessionType: "session",
      },
      {
        id: randomUUID(),
        userId: nhiUsers.find(u => u.userName === "DEV_TESTING")?.id || "",
        loginTime: new Date("2024-01-15T09:30:00Z"),
        ipAddress: "10.0.2.33",
        roles: "DEV_ROLE",
        objectsAccessed: "TEST_DATA, SANDBOX",
        creditsConsumed: "89.4",
        queriesExecuted: 567,
        dataScanned: "12.3",
        sessionType: "session",
      },
    ];

    // Initialize Expensive Queries
    this.expensiveQueries = [
      {
        id: randomUUID(),
        queryHash: "abc123def456",
        sampleQueryText: "SELECT * FROM large_table WHERE complex_join...",
        users: "AMITP, API_USER",
        roles: "ADMIN, ANALYST",
        warehouses: "COMPUTE_WH_L",
        totalExecutions: 847,
        totalCreditsUsed: "2456.8",
        totalMbScanned: "156700",
        totalRuntimeSec: "324.2",
        firstSeen: new Date("2024-01-08T00:00:00Z"),
        lastSeen: new Date("2024-01-15T00:00:00Z"),
        groupingType: "query_hash",
        userName: null,
        roleName: null,
      },
      {
        id: randomUUID(),
        queryHash: "def456ghi789",
        sampleQueryText: "CREATE TABLE temp_analytics AS SELECT...",
        users: "DEV_USER",
        roles: "DEVELOPER",
        warehouses: "DEV_WH",
        totalExecutions: 234,
        totalCreditsUsed: "1892.5",
        totalMbScanned: "98300",
        totalRuntimeSec: "245.8",
        firstSeen: new Date("2024-01-09T00:00:00Z"),
        lastSeen: new Date("2024-01-14T00:00:00Z"),
        groupingType: "query_hash",
        userName: null,
        roleName: null,
      },
      {
        id: randomUUID(),
        queryHash: null,
        sampleQueryText: "",
        users: "",
        roles: "",
        warehouses: "",
        totalExecutions: 3247,
        totalCreditsUsed: "4892.7",
        totalMbScanned: "234800",
        totalRuntimeSec: "1245.8",
        firstSeen: new Date("2024-01-08T00:00:00Z"),
        lastSeen: new Date("2024-01-15T00:00:00Z"),
        groupingType: "user_role",
        userName: "AMITP",
        roleName: "ADMIN",
      },
      {
        id: randomUUID(),
        queryHash: null,
        sampleQueryText: "",
        users: "",
        roles: "",
        warehouses: "",
        totalExecutions: 1847,
        totalCreditsUsed: "2134.6",
        totalMbScanned: "89300",
        totalRuntimeSec: "567.3",
        firstSeen: new Date("2024-01-09T00:00:00Z"),
        lastSeen: new Date("2024-01-15T00:00:00Z"),
        groupingType: "user_role",
        userName: "SB_INTEGRATION",
        roleName: "ETL_ROLE",
      },
      {
        id: randomUUID(),
        queryHash: "ghi789jkl012",
        sampleQueryText: "INSERT INTO staging_table SELECT * FROM raw_data WHERE...",
        users: "SB_INTEGRATION",
        roles: "ETL_ROLE",
        warehouses: "ETL_WH",
        totalExecutions: 1456,
        totalCreditsUsed: "1678.9",
        totalMbScanned: "67800",
        totalRuntimeSec: "189.7",
        firstSeen: new Date("2024-01-10T00:00:00Z"),
        lastSeen: new Date("2024-01-15T00:00:00Z"),
        groupingType: "user_query",
        userName: "SB_INTEGRATION",
        roleName: "ETL_ROLE",
      },
      {
        id: randomUUID(),
        queryHash: "mno345pqr678",
        sampleQueryText: "UPDATE analytics_cache SET last_updated = CURRENT_TIMESTAMP...",
        users: "VMAMIDI",
        roles: "ANALYST",
        warehouses: "COMPUTE_WH",
        totalExecutions: 234,
        totalCreditsUsed: "567.8",
        totalMbScanned: "23400",
        totalRuntimeSec: "78.9",
        firstSeen: new Date("2024-01-11T00:00:00Z"),
        lastSeen: new Date("2024-01-15T00:00:00Z"),
        groupingType: "user_query",
        userName: "VMAMIDI",
        roleName: "ANALYST",
      },
    ];

    // Initialize Object Usage
    this.objectUsage = [
      {
        id: randomUUID(),
        objectName: "USERS_FACT_TABLE",
        objectType: "Table",
        operationType: "READ",
        creditsConsumed: "1456.8",
        uniqueUsers: "AMITP, VMAMIDI, DEV_USER",
        accessCount: 2847,
        lastAccessed: new Date("2024-01-15T14:32:00Z"),
        dataScanned: "89.4",
      },
      {
        id: randomUUID(),
        objectName: "ORDERS_ANALYTICS_VIEW",
        objectType: "View",
        operationType: "READ",
        creditsConsumed: "987.3",
        uniqueUsers: "AMITP, VMAMIDI",
        accessCount: 1543,
        lastAccessed: new Date("2024-01-15T13:45:00Z"),
        dataScanned: "67.2",
      },
      {
        id: randomUUID(),
        objectName: "STAGING_TABLE",
        objectType: "Table",
        operationType: "INSERT",
        creditsConsumed: "2134.7",
        uniqueUsers: "VMAMIDI, DEV_USER",
        accessCount: 1234,
        lastAccessed: new Date("2024-01-15T15:22:00Z"),
        dataScanned: "156.7",
      },
      {
        id: randomUUID(),
        objectName: "ETL_PROCESSING_LOG",
        objectType: "Table",
        operationType: "INSERT",
        creditsConsumed: "567.8",
        uniqueUsers: "SB_INTEGRATION, DEV_TESTING",
        accessCount: 2345,
        lastAccessed: new Date("2024-01-15T12:15:00Z"),
        dataScanned: "78.9",
      },
      {
        id: randomUUID(),
        objectName: "CUSTOMER_METRICS",
        objectType: "View",
        operationType: "READ",
        creditsConsumed: "1234.5",
        uniqueUsers: "AMITP, API_USER, VMAMIDI",
        accessCount: 1876,
        lastAccessed: new Date("2024-01-15T11:30:00Z"),
        dataScanned: "98.3",
      },
      {
        id: randomUUID(),
        objectName: "TEMP_CALCULATIONS",
        objectType: "Table",
        operationType: "UPDATE",
        creditsConsumed: "345.2",
        uniqueUsers: "APP_INTEGRATION",
        accessCount: 456,
        lastAccessed: new Date("2024-01-15T10:45:00Z"),
        dataScanned: "34.6",
      },
      {
        id: randomUUID(),
        objectName: "AUDIT_TRAIL",
        objectType: "Table",
        operationType: "DELETE",
        creditsConsumed: "123.4",
        uniqueUsers: "DEV_USER",
        accessCount: 234,
        lastAccessed: new Date("2024-01-15T09:00:00Z"),
        dataScanned: "15.7",
      },
    ];

    // Initialize Lineage Dependencies
    this.lineageDependencies = [
      {
        id: randomUUID(),
        sourceObject: "USERS_FACT_TABLE",
        dependentObject: "USER_ANALYTICS_VIEW",
        dependencyType: "logical",
        constraintName: null,
        externalSystem: null,
        status: "active",
      },
      {
        id: randomUUID(),
        sourceObject: "USERS_FACT_TABLE",
        dependentObject: "USER_ORDERS",
        dependencyType: "fk",
        constraintName: "fk_user_orders_userid",
        externalSystem: null,
        status: "active",
      },
      {
        id: randomUUID(),
        sourceObject: "USERS_FACT_TABLE",
        dependentObject: "Tableau User Analytics Dashboard",
        dependencyType: "external",
        constraintName: null,
        externalSystem: "Tableau",
        status: "active",
      },
    ];

    // Initialize User Object Access
    this.userObjectAccess = [
      {
        id: randomUUID(),
        objectName: "USERS_FACT_TABLE",
        userName: "AMITP",
        roleName: "ADMIN",
        queryType: "SELECT",
        accessCount: 2847,
        creditsUsed: "1456.8",
        lastAccess: new Date("2024-01-15T14:32:00Z"),
        impactLevel: "High",
      },
      {
        id: randomUUID(),
        objectName: "USERS_FACT_TABLE",
        userName: "VMAMIDI",
        roleName: "ANALYST",
        queryType: "SELECT",
        accessCount: 1234,
        creditsUsed: "678.2",
        lastAccess: new Date("2024-01-15T13:15:00Z"),
        impactLevel: "Medium",
      },
      {
        id: randomUUID(),
        objectName: "USERS_FACT_TABLE",
        userName: "API_USER",
        roleName: "API_ROLE",
        queryType: "SELECT",
        accessCount: 892,
        creditsUsed: "445.7",
        lastAccess: new Date("2024-01-15T11:45:00Z"),
        impactLevel: "Low",
      },
    ];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSnowflakeUsers(): Promise<SnowflakeUser[]> {
    return Array.from(this.snowflakeUsers.values());
  }

  async getSnowflakeUser(id: string): Promise<SnowflakeUser | undefined> {
    return this.snowflakeUsers.get(id);
  }

  async getSnowflakeUserByName(userName: string): Promise<SnowflakeUser | undefined> {
    return Array.from(this.snowflakeUsers.values()).find(
      (user) => user.userName === userName,
    );
  }

  async getUserAnalytics(userId: string): Promise<UserAnalytics | undefined> {
    return this.userAnalytics.get(userId);
  }

  async getAllUserAnalytics(): Promise<UserAnalytics[]> {
    return Array.from(this.userAnalytics.values());
  }

  async getUserActivities(userId: string, sessionType?: string): Promise<UserActivities[]> {
    let activities = this.userActivities.filter(activity => activity.userId === userId);
    if (sessionType) {
      activities = activities.filter(activity => activity.sessionType === sessionType);
    }
    return activities;
  }

  async getAllUserActivities(): Promise<UserActivities[]> {
    return this.userActivities;
  }

  async getExpensiveQueries(groupingType?: string): Promise<ExpensiveQueries[]> {
    if (groupingType) {
      return this.expensiveQueries.filter(query => query.groupingType === groupingType);
    }
    return this.expensiveQueries;
  }

  async getObjectUsage(operationType?: string): Promise<ObjectUsage[]> {
    if (operationType) {
      return this.objectUsage.filter(usage => usage.operationType === operationType);
    }
    return this.objectUsage;
  }

  async getLineageDependencies(sourceObject: string): Promise<LineageDependencies[]> {
    return this.lineageDependencies.filter(dep => dep.sourceObject === sourceObject);
  }

  async getUserObjectAccess(objectName: string): Promise<UserObjectAccess[]> {
    return this.userObjectAccess.filter(access => access.objectName === objectName);
  }
}

export const storage = new MemStorage();
