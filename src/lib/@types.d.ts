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