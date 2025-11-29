export type ClassLevel = 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12' | 'College';

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
}

export interface Curriculum {
  [key: string]: { // ClassLevel
    subjects: Subject[];
    topics: {
      [subjectId: string]: Topic[];
    }
  }
}

export type ContentType = 'notes' | 'pyq' | 'summary' | 'quiz';

export interface GeneratedContent {
  type: ContentType;
  content: string; // Markdown content
  timestamp: number;
}

export type ResourceCategory = 'notes' | 'pyq' | 'video' | 'link' | 'pdf' | 'image';

export interface UploadedResource {
  id: string;
  classLevel: string;
  subjectId: string;
  topicId: string;
  title: string;
  category: ResourceCategory;
  content: string; // Markdown text, URL, or Base64 Data URI
  timestamp: number;
}