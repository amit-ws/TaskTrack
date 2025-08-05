import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Snowflake Users endpoints
  app.get("/api/snowflake-users", async (req, res) => {
    try {
      const users = await storage.getSnowflakeUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Snowflake users" });
    }
  });

  app.get("/api/snowflake-users/:id", async (req, res) => {
    try {
      const user = await storage.getSnowflakeUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User Analytics endpoints
  app.get("/api/user-analytics", async (req, res) => {
    try {
      const analytics = await storage.getAllUserAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user analytics" });
    }
  });

  app.get("/api/user-analytics/:userId", async (req, res) => {
    try {
      const analytics = await storage.getUserAnalytics(req.params.userId);
      if (!analytics) {
        return res.status(404).json({ message: "User analytics not found" });
      }
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user analytics" });
    }
  });

  // User Activities endpoints
  app.get("/api/user-activities", async (req, res) => {
    try {
      const { userId, sessionType } = req.query;
      let activities;
      
      if (userId) {
        activities = await storage.getUserActivities(userId as string, sessionType as string);
      } else {
        activities = await storage.getAllUserActivities();
      }
      
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user activities" });
    }
  });

  // Expensive Queries endpoints
  app.get("/api/expensive-queries", async (req, res) => {
    try {
      const { groupingType } = req.query;
      const queries = await storage.getExpensiveQueries(groupingType as string);
      res.json(queries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expensive queries" });
    }
  });

  // Object Usage endpoints
  app.get("/api/object-usage", async (req, res) => {
    try {
      const { operationType } = req.query;
      const usage = await storage.getObjectUsage(operationType as string);
      res.json(usage);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch object usage" });
    }
  });

  // Lineage Dependencies endpoints
  app.get("/api/lineage-dependencies/:sourceObject", async (req, res) => {
    try {
      const dependencies = await storage.getLineageDependencies(req.params.sourceObject);
      res.json(dependencies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lineage dependencies" });
    }
  });

  // User Object Access endpoints
  app.get("/api/user-object-access/:objectName", async (req, res) => {
    try {
      const access = await storage.getUserObjectAccess(req.params.objectName);
      res.json(access);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user object access" });
    }
  });

  // Dashboard summary endpoint
  app.get("/api/dashboard-summary", async (req, res) => {
    try {
      const users = await storage.getSnowflakeUsers();
      const activities = await storage.getAllUserActivities();
      
      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.status === "Active").length;
      const totalCredits = activities.reduce((sum, activity) => 
        sum + parseFloat(activity.creditsConsumed || "0"), 0
      );
      const totalQueries = activities.reduce((sum, activity) => 
        sum + (activity.queriesExecuted || 0), 0
      );
      const totalDataScanned = activities.reduce((sum, activity) => 
        sum + parseFloat(activity.dataScanned || "0"), 0
      );

      res.json({
        totalUsers,
        activeUsers,
        totalCredits: totalCredits.toFixed(1),
        totalQueries,
        totalDataScanned: totalDataScanned.toFixed(1),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
