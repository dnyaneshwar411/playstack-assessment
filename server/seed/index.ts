import mongoose from "mongoose";
import User from "../src/models/user.model.js"; // Adjust this path to where your schema file lives
import { ROLES, USER_STATUSES } from "../src/config/constants.js"; // Adjust this path to your constants
import { env } from "../src/config/envVars.js"; // Adjust this path to your constants

// 1. Static 24-character hexadecimal ObjectIds to perfectly establish relationships upfront
const IDs = {
  ceo: "65cb00014f1a2b3c4d5e6f01",
  vpEng: "65cb00024f1a2b3c4d5e6f02",
  vpProd: "65cb00034f1a2b3c4d5e6f03",
  engMgr: "65cb00044f1a2b3c4d5e6f04",
  devops: "65cb00054f1a2b3c4d5e6f05",
  designMgr: "65cb00064f1a2b3c4d5e6f06",
  leadPm: "65cb00074f1a2b3c4d5e6f07",
  frontend: "65cb00084f1a2b3c4d5e6f08",
  backend: "65cb00094f1a2b3c4d5e6f09",
  designer: "65cb00104f1a2b3c4d5e6f10",
  researcher: "65cb00114f1a2b3c4d5e6f11",
  hr: "65cb00124f1a2b3c4d5e6f12"
};

const mockUsers = [
  // --- LEVEL 1: Executive ---
  {
    _id: new mongoose.Types.ObjectId(IDs.ceo),
    name: "Sarah Jenkins",
    email: "sarah.jenkins@company.com",
    mobileNumber: 9876543210,
    password: "hashed_password_secure_123",
    employeeId: "EMP-001",
    reportingManager: null, // Top of the hierarchy
    role: "Super Admin",
    department: "Executive",
    designation: "Chief Executive Officer",
    salary: 250000,
    status: "Active",
    avatar: { private: false, key: "avatars/s-jenkins.jpg" }
  },

  // --- LEVEL 2: VPs (Report to CEO) ---
  {
    _id: new mongoose.Types.ObjectId(IDs.vpEng),
    name: "David Miller",
    email: "david.miller@company.com",
    mobileNumber: 9876543211,
    password: "hashed_password_secure_123",
    employeeId: "EMP-002",
    reportingManager: new mongoose.Types.ObjectId(IDs.ceo),
    role: "Employee",
    department: "Engineering",
    designation: "VP of Engineering",
    salary: 180000,
    status: "Active",
    avatar: { private: false, key: "avatars/d-miller.jpg" }
  },
  {
    _id: new mongoose.Types.ObjectId(IDs.vpProd),
    name: "Elena Rostova",
    email: "elena.rostova@company.com",
    mobileNumber: 9876543212,
    password: "hashed_password_secure_123",
    employeeId: "EMP-003",
    reportingManager: new mongoose.Types.ObjectId(IDs.ceo),
    role: "Employee",
    department: "Product",
    designation: "VP of Product",
    salary: 175000,
    status: "Active",
    avatar: { private: false, key: "avatars/e-rostova.jpg" }
  },

  // --- LEVEL 3: Managers & Leads (Report to VPs) ---
  {
    _id: new mongoose.Types.ObjectId(IDs.engMgr),
    name: "Marcus Vance",
    email: "marcus.vance@company.com",
    mobileNumber: 9876543213,
    password: "hashed_password_secure_123",
    employeeId: "EMP-004",
    reportingManager: new mongoose.Types.ObjectId(IDs.vpEng),
    role: "Employee",
    department: "Engineering",
    designation: "Engineering Manager",
    salary: 140000,
    status: "Active",
    avatar: { private: false, key: "avatars/m-vance.jpg" }
  },
  {
    _id: new mongoose.Types.ObjectId(IDs.devops),
    name: "Tariq Mahmood",
    email: "tariq.mahmood@company.com",
    mobileNumber: 9876543214,
    password: "hashed_password_secure_123",
    employeeId: "EMP-005",
    reportingManager: new mongoose.Types.ObjectId(IDs.vpEng),
    role: "Employee",
    department: "Engineering",
    designation: "DevOps Lead",
    salary: 135000,
    status: "Active",
    avatar: { private: false, key: "avatars/t-mahmood.jpg" }
  },
  {
    _id: new mongoose.Types.ObjectId(IDs.designMgr),
    name: "Chloe Lin",
    email: "chloe.lin@company.com",
    mobileNumber: 9876543215,
    password: "hashed_password_secure_123",
    employeeId: "EMP-006",
    reportingManager: new mongoose.Types.ObjectId(IDs.vpProd),
    role: "Employee",
    department: "Product",
    designation: "Product Design Manager",
    salary: 130000,
    status: "Active",
    avatar: { private: false, key: "avatars/c-lin.jpg" }
  },
  {
    _id: new mongoose.Types.ObjectId(IDs.leadPm),
    name: "Ryan Gallagher",
    email: "ryan.gallagher@company.com",
    mobileNumber: 9876543216,
    password: "hashed_password_secure_123",
    employeeId: "EMP-007",
    reportingManager: new mongoose.Types.ObjectId(IDs.vpProd),
    role: "Employee",
    department: "Product",
    designation: "Lead Product Manager",
    salary: 145000,
    status: "Active",
    avatar: { private: false, key: "avatars/r-gallagher.jpg" }
  },

  // --- LEVEL 4: Individual Contributors (Report to Managers) ---
  {
    _id: new mongoose.Types.ObjectId(IDs.frontend),
    name: "Liam Smyth",
    email: "liam.smyth@company.com",
    mobileNumber: 9876543217,
    password: "hashed_password_secure_123",
    employeeId: "EMP-008",
    reportingManager: new mongoose.Types.ObjectId(IDs.engMgr),
    role: "Employee",
    department: "Engineering",
    designation: "Senior Frontend Engineer",
    salary: 110000,
    status: "Active",
    avatar: { private: false, key: "avatars/l-smyth.jpg" }
  },
  {
    _id: new mongoose.Types.ObjectId(IDs.backend),
    name: "Aisha Kamal",
    email: "aisha.kamal@company.com",
    mobileNumber: 9876543218,
    password: "hashed_password_secure_123",
    employeeId: "EMP-009",
    reportingManager: new mongoose.Types.ObjectId(IDs.engMgr),
    role: "Employee",
    department: "Engineering",
    designation: "Backend Engineer",
    salary: 105000,
    status: "Active",
    avatar: { private: false, key: "avatars/a-kamal.jpg" }
  },
  {
    _id: new mongoose.Types.ObjectId(IDs.designer),
    name: "Yuki Tanaka",
    email: "yuki.tanaka@company.com",
    mobileNumber: 9876543219,
    password: "hashed_password_secure_123",
    employeeId: "EMP-010",
    reportingManager: new mongoose.Types.ObjectId(IDs.designMgr),
    role: "Employee",
    department: "Product",
    designation: "UI/UX Designer",
    salary: 95000,
    status: "Active",
    avatar: { private: false, key: "avatars/y-tanaka.jpg" }
  },
  {
    _id: new mongoose.Types.ObjectId(IDs.researcher),
    name: "Carlos Mendez",
    email: "carlos.mendez@company.com",
    mobileNumber: 9876543220,
    password: "hashed_password_secure_123",
    employeeId: "EMP-011",
    reportingManager: new mongoose.Types.ObjectId(IDs.designMgr),
    role: "Employee",
    department: "Product",
    designation: "Product Researcher",
    salary: 90000,
    status: "Active",
    avatar: { private: false, key: "avatars/c-mendez.jpg" }
  },
  {
    _id: new mongoose.Types.ObjectId(IDs.hr),
    name: "Nina Patel",
    email: "nina.patel@company.com",
    mobileNumber: 9876543221,
    password: "hashed_password_secure_123",
    employeeId: "EMP-012",
    reportingManager: new mongoose.Types.ObjectId(IDs.ceo),
    role: "Employee",
    department: "Human Resources",
    designation: "HR Generalist",
    salary: 85000,
    status: "Active",
    avatar: { private: false, key: "avatars/n-patel.jpg" }
  }
];

async function seedDatabase() {
  const MONGO_URI = env.MONGOOSE_DB_URL || "mongodb://127.0.0.1:27017/company_db";

  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    // Clear existing users to avoid unique email conflict errors
    console.log("Clearing existing users collection...");
    await User.deleteMany({});
    console.log("Collection cleared.");

    // Insert the seed array
    console.log("Inserting hierarchical user records...");
    const createdUsers = await User.insertMany(mockUsers);
    console.log(`Successfully seeded ${createdUsers.length} employees into the database!`);

  } catch (error) {
    console.error("Critical seeding error encountered:", error);
  } finally {
    console.log("Closing database connection...");
    await mongoose.disconnect();
    console.log("Database connection terminated.");
  }
}

seedDatabase();