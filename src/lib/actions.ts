"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as progress from "./progress.server";
import * as notes from "./notes.server";
import * as interviews from "./interviews.server";
import * as designs from "./designs.server";
import * as mockInterview from "./mock-interview.server";
import type { TopicStatus } from "./types";
import type { InterviewLogInput } from "./interviews.server";
import type { FlashcardRating } from "./progress.server";
import type { Node, Edge } from "reactflow";
import type { MockAttemptInput } from "./mock-interview.server";

export async function setStatusAction(topicId: string, status: TopicStatus) {
  const entry = await progress.setStatus(topicId, status);
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/roadmap");
  revalidatePath("/");
  return entry;
}

export async function setConfidenceAction(topicId: string, confidence: number) {
  const entry = await progress.setConfidence(topicId, confidence);
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/");
  return entry;
}

export async function toggleChecklistAction(topicId: string, index: number) {
  const entry = await progress.toggleChecklistItem(topicId, index);
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/roadmap");
  revalidatePath("/");
  return entry;
}

export async function saveNoteAction(slug: string, title: string, body: string) {
  await notes.saveNote(slug, title, body);
  revalidatePath("/notes");
  revalidatePath(`/notes/${slug}`);
}

export async function createNoteAction(title: string) {
  const slug = await notes.createNote(title);
  revalidatePath("/notes");
  return slug;
}

export async function deleteNoteAction(slug: string) {
  await notes.deleteNote(slug);
  revalidatePath("/notes");
}

export async function createInterviewLogAction(input: InterviewLogInput) {
  const id = await interviews.createInterviewLog(input);
  revalidatePath("/interviews");
  redirect(`/interviews/${id}`);
}

export async function updateInterviewLogAction(id: number, input: InterviewLogInput) {
  await interviews.updateInterviewLog(id, input);
  revalidatePath("/interviews");
  revalidatePath(`/interviews/${id}`);
}

export async function deleteInterviewLogAction(id: number) {
  await interviews.deleteInterviewLog(id);
  revalidatePath("/interviews");
  redirect("/interviews");
}

export async function rateFlashcardAction(topicId: string, rating: FlashcardRating) {
  const entry = await progress.rateFlashcard(topicId, rating);
  revalidatePath("/today");
  revalidatePath("/");
  revalidatePath(`/topics/${topicId}`);
  return entry;
}

export async function createDesignAction(title: string) {
  const id = await designs.createDesign(title);
  revalidatePath("/workspace");
  redirect(`/workspace/${id}`);
}

export async function saveDesignAction(id: number, title: string, nodes: Node[], edges: Edge[]) {
  await designs.saveDesign(id, title, nodes, edges);
  revalidatePath("/workspace");
  revalidatePath(`/workspace/${id}`);
}

export async function saveDesignVersionAction(
  designId: number,
  label: string,
  nodes: Node[],
  edges: Edge[],
) {
  await designs.saveVersion(designId, label, nodes, edges);
  revalidatePath(`/workspace/${designId}`);
}

export async function deleteDesignAction(id: number) {
  await designs.deleteDesign(id);
  revalidatePath("/workspace");
  redirect("/workspace");
}

export async function saveMockAttemptAction(input: MockAttemptInput) {
  await mockInterview.saveMockAttempt(input);
  revalidatePath("/mock-interview");
}
