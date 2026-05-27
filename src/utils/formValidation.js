import { z } from "zod";
import dayjs from "dayjs";

// Platform-specific Regex for URL validation
const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?(\?.*)?$/;
const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?(\?.*)?$/;
const twitterRegex = /^(https?:\/\/)?(www\.|mobile\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,}\/?(\?.*)?$/;

const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  startDate: z.any().refine(val => val !== null, "Start date is required"),
  endDate: z.any().nullable(),
  currentlyWorking: z.boolean().optional(),
}).refine(data => {
  if (data.currentlyWorking) return true;
  if (!data.endDate) return true; // Handled by UI if not currently working
  return dayjs(data.startDate).isBefore(dayjs(data.endDate));
}, {
  message: "Start date must be before end date",
  path: ["endDate"]
});

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  college: z.string().min(1, "College is required"),
  field: z.string().optional(),
  startYear: z.any().refine(val => val !== null, "Start date is required"),
  endYear: z.any().nullable(),
}).refine(data => {
  if (!data.endYear) return true;
  return dayjs(data.startYear).isBefore(dayjs(data.endYear));
}, {
  message: "Start year must be before end year",
  path: ["endYear"]
});

export const profileSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name is too long"),

  role: z.enum(["mentor", "mentee"], {
    errorMap: () => ({ message: "Please select your role" })
  }),

  bio: z.string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio is too long"),

  skills: z.union([z.string(), z.array(z.string())])
    .refine(val => val.length > 0, "Please enter at least one skill"),


  socialLinks: z.object({
    linkedin: z.string()
      .regex(linkedinRegex, "Invalid LinkedIn URL")
      .or(z.literal("")),
    github: z.string()
      .regex(githubRegex, "Invalid GitHub URL")
      .or(z.literal("")),
    twitter: z.string()
      .regex(twitterRegex, "Invalid Twitter/X URL")
      .or(z.literal("")),
    portfolio: z.string()
      .url("Invalid portfolio URL")
      .or(z.literal("")),
  }).optional(),

  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
});
