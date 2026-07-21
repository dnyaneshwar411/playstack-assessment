export type Employee = {
  _id: string;
  name: string;
  email: string;
  reportingManager: string | null;
  department: string;
  designation: string;
  avatar: { private: boolean; key: string };
  children?: Employee[];
}