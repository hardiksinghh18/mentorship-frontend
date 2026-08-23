import React from "react";
import { Control, UseFormRegister, FieldErrors } from "react-hook-form";

export interface Resource {
  title: string;
  url: string;
}

export interface Module {
  title: string;
  summary: string;
  resources: Resource[];
  meetingLink?: string;
  meetingTime?: string;
  orderIndex?: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  skillsTargeted: string[];
  duration?: string;
  durationValue?: number;
  durationUnit?: string;
  mentor?: string;
  creatorId?: string;
  creator?: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
  capacity: number;
  enrolled: number;
  modules?: Module[];
  userEnrollmentStatus?: 'pending' | 'accepted' | 'declined' | null;
}

export interface AuthState {
  auth: {
    isLoggedIn: boolean;
    user: {
      id?: string;
      role: string;
      username: string;
      email?: string;
    } | null;
  };
}

export interface CourseFormInput {
  title: string;
  description: string;
  skillsTargeted: string;
  durationValue: string;
  durationUnit: string;
  maxStudents: string;
  modules: {
    title: string;
    summary: string;
    resources: { title: string; url: string; }[];
    meetingLink?: string;
    meetingTime?: string;
  }[];
}

export interface GeneralDetailsFormProps {
  onNext: () => void;
}

export interface SyllabusBuilderProps {
  onBack: () => void;
}

export interface ModuleFormCardProps {
  index: number;
  control: Control<CourseFormInput>;
  register: UseFormRegister<CourseFormInput>;
  errors?: FieldErrors<CourseFormInput>;
  onRemove: () => void;
  showRemove: boolean;
}

export interface SyllabusTimelineProps {
  modules: Module[];
  activeIdx: number;
  completedOrderIndexes: number[];
  onSelect: (index: number) => void;
}

export interface ActiveModuleViewerProps {
  module: Module;
}

export interface LiveSessionCardProps {
  meetingLink?: string;
  meetingTime?: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export interface CourseCardProps {
  course: Course;
}
