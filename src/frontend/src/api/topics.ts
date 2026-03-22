import apiClient from './client';

export interface Course {
  id: number;
  course_program: string;
  course_code: number;
  title: string;
  description: string;
  url: string;
}

export interface Club {
  id: number;
  name: string;
  mission: string;
  url: string;
}

export interface Professor {
  id: number;
  full_name: string;
  bio: string;
  area_of_focus: string;
  url: string;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  off_campus: {
    certifications?: { name: string; url: string }[];
    online_learning?: { name: string; url: string }[];
    blogs?: { name: string; url: string }[];
  };
  courses: Course[];
  clubs: Club[];
  professors: Professor[];
  misc: Record<string, unknown>;
}

export const getTopics = (category?: string) =>
  apiClient.get<Topic[]>('/topics', { params: category ? { category } : undefined });

export const getTopic = (id: number) =>
  apiClient.get<Topic>(`/topics/${id}`);
