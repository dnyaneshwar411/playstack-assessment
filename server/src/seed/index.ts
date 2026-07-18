import mongoose from "mongoose";
import minimist from "minimist";
import fs from "fs"; // 👈 Added standard filesystem module
import path from "path"; // 👈 Added path resolver module
import { fileURLToPath } from "url"; // 👈 Required for module resolution
import { faker } from "@faker-js/faker";
import User from "../models/user.model.js";
import Scope from "../models/scopes.model.js";
import { ROLES, USER_STATUSES, ROLE_SCOPES_MAPPING } from "../config/constants.js";
import { env } from "../config/envVars.js";
import { hashString } from "../utils/hash.js";

// Handle ESM path naming directory indicators
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = minimist(process.argv.slice(2));
const USERS_TO_SEED = parseInt(args.users || args.U, 10) || 20;
const MONGO_URI = env.MONGOOSE_DB_URL || "mongodb://127.0.0.1:27017/company_db";

const DEPARTMENTS = ["Engineering", "Product", "Human Resources", "Marketing", "Sales", "Finance"];
const DESIGNATIONS: Record<string, string[]> = {
  "Super Admin": ["Chief Executive Officer", "Chief Technology Officer", "VP of Operations"],
  "HR": ["HR Director", "Talent Acquisition Lead", "HR Generalist"],
  "Employee": ["Senior Software Engineer", "Backend Developer", "Frontend Engineer", "UI/UX Designer", "Product Manager", "DevOps Engineer"]
};

function buildScopeMap(role: keyof typeof ROLE_SCOPES_MAPPING): Map<string, boolean> {
  const scopeMap = new Map<string, boolean>();
  const allowedScopes = ROLE_SCOPES_MAPPING[role] || [];
  allowedScopes.forEach((scopeName) => {
    scopeMap.set(scopeName, true);
  });
  return scopeMap;
}

async function runSeeder() {
  if (USERS_TO_SEED < 3) {
    console.error("❌ Error: Target population must be at least 3 users to build a reliable hierarchy.");
    process.exit(1);
  }
  try {
    console.log(`📡 Establishing database context linkage...`);
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connection established.");

    console.log("🧹 Purging existing Collections [Users, Scopes]...");
    await User.deleteMany({});
    await Scope.deleteMany({});
    console.log("✅ Databases scrubbed cleanly.");

    const generatedUserDocuments: any[] = [];
    const generatedScopeDocuments: any[] = [];
    
    // This object will accumulate the readable user information mapping layout
    const credentialsBackupOutput: Record<string, { name: string; role: string; password: string, email: string }> = {};

    const level0_SuperAdmins: mongoose.Types.ObjectId[] = [];
    const level1_Managers: mongoose.Types.ObjectId[] = [];

    console.log(`🌱 Generating ${USERS_TO_SEED} synthetic records across structural hierarchy tiers...`);

    for (let index = 0; index < USERS_TO_SEED; index++) {
      const currentUserId = new mongoose.Types.ObjectId();
      let assignedRole: (typeof ROLES)[number] = "Employee";
      let chosenManagerId: mongoose.Types.ObjectId | null = null;

      if (index === 0 || level0_SuperAdmins.length === 0) {
        assignedRole = "Super Admin";
        chosenManagerId = null;
        level0_SuperAdmins.push(currentUserId);
      } else if (index < Math.ceil(USERS_TO_SEED * 0.2) || level1_Managers.length === 0) {
        assignedRole = index % 3 === 0 ? "HR" : "Employee";
        chosenManagerId = faker.helpers.arrayElement(level0_SuperAdmins);
        level1_Managers.push(currentUserId);
      } else {
        assignedRole = index % 8 === 0 ? "HR" : "Employee";
        chosenManagerId = faker.helpers.arrayElement(level1_Managers);
      }

      const assignedDepartment = faker.helpers.arrayElement(DEPARTMENTS);
      const assignedDesignation = faker.helpers.arrayElement(DESIGNATIONS[assignedRole] || []);
      
      // 1. Generate an explicit plain-text random secure password for each user node
      const plainTextPassword = faker.internet.password({ length: 10, memorable: true });
      const userEmail = faker.internet.email().toLowerCase();
      const userName = faker.person.fullName();

      // 2. Map structural values into our plain-text tracker container
      credentialsBackupOutput[userEmail] = {
        name: userName,
        role: assignedRole,
        password: plainTextPassword,
        email: userEmail
      };

      const userPayload = {
        _id: currentUserId,
        name: userName,
        email: userEmail,
        mobileNumber: parseInt(faker.string.numeric(10), 10),
        password: await hashString(plainTextPassword), // 👈 Securely store the hashed version in DB
        employeeId: `EMP-${String(index + 1).padStart(4, "0")}`,
        reportingManager: chosenManagerId,
        role: assignedRole,
        department: assignedDepartment,
        designation: assignedDesignation,
        salary: faker.number.int({ min: 50000, max: 220000 }),
        status: faker.helpers.arrayElement(USER_STATUSES),
        joiningDate: faker.date.past({ years: 4 }),
        avatar: {
          private: false,
          key: `uploads/avatars/${currentUserId}.jpg`
        }
      };

      const scopePayload = {
        user: currentUserId,
        scopeMap: buildScopeMap(assignedRole)
      };

      generatedUserDocuments.push(userPayload);
      generatedScopeDocuments.push(scopePayload);
    }

    console.log("💾 Executing transactional batch creation pipeline queries...");
    const injectedUsers = await User.insertMany(generatedUserDocuments);
    const injectedScopes = await Scope.insertMany(generatedScopeDocuments);

    // 3. Synchronously write the structured object file out to disk inside the same directory script location
    const jsonOutputPath = path.join(__dirname, "users.json");
    fs.writeFileSync(jsonOutputPath, JSON.stringify(credentialsBackupOutput, null, 2), "utf-8");
    console.log(`📝 Local login credentials successfully dumped out -> ${jsonOutputPath}`);

    console.log(`🚀 Database seeding completely verified!`);
    console.log(`   └─ Users Inserted: ${injectedUsers.length}`);
    console.log(`   └─ Scope Profiles Created: ${injectedScopes.length}`);
  } catch (error) {
    console.error("❌ Fatal validation or seeding error caught:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Connection closed safely.");
    process.exit(0);
  }
}

runSeeder();