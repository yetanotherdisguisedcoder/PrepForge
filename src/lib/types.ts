export type Priority = "P0" | "P1" | "P2" | "P3";

export type TopicStatus =
  | "not-started"
  | "learning"
  | "needs-revision"
  | "mastered"
  | "expert";

export interface TopicFrontmatter {
  title: string;
  category: string;
  part?: string;
  number?: string;
  order: number;
  priority: Priority;
  status: TopicStatus;
  source: string;
  note?: string;
}

export interface Topic extends TopicFrontmatter {
  id: string; // `${category}/${slug}`
  slug: string;
  body: string;
  checklistTotal: number;
}

export interface ProgressEntry {
  status: TopicStatus;
  confidence: number; // 0-5
  reviewCount: number;
  lastReviewed: string | null; // ISO date
  nextReview: string | null; // ISO date
  quizScore: number | null;
  checkedItems: number[]; // indices of checked checklist lines
}

export type ProgressMap = Record<string, ProgressEntry>;

export interface CategoryGroup {
  category: string;
  label: string;
  topics: Topic[];
}

export type InterviewType =
  | "technical"
  | "system_design"
  | "behavioral"
  | "hr"
  | "take_home"
  | "other";

export type InterviewOutcome = "pending" | "passed" | "rejected" | "no_response" | "withdrew";

export interface InterviewLog {
  id: string;
  company: string;
  role: string;
  round: string;
  interviewDate: string | null; // ISO date
  interviewType: InterviewType;
  outcome: InterviewOutcome;
  rating: number | null; // 1-5, self-assessed "how it went"
  questions: string; // free text / markdown — questions asked
  notes: string; // free text / markdown — detailed notes
  createdAt: string;
  updatedAt: string;
}
