export type Course = {
  id: number;
  name: string;
  description: string;
  image: string | null;
  background_image: string | null;
  isApproved: number;
  teacher_id: number;
  created_at: string;
  updated_at: string;
  course_modules: Module[];
  requestStatus: RequestStatus | null;
};

export type RequestStatus = {
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Module = {
  id: number;
  course_id: number;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  course_module_lessons: Lesson[];
};

export type Lesson = {
  id: number;
  course_module_id: number;
  name: string;
  description: string;
  video_url: string;
  video_thumb: string;
  created_at: string;
  updated_at: string;
};

export type EnrollmentRequest = {
  id: number;
  teacher_id: number;
  student_id: number;
  course_id: number;
  status: "pending" | "approved" | "rejected",
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  users: {
    id: number;
    name: string;
  },
  courses: {
    id: number;
    name: string;
    description: string;
    image: string;
    background_image: string;
    teacher_id: number;
    created_at: string;
    updated_at: string;
  };
};