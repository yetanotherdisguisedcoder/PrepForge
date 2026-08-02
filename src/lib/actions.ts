"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as progress from "./progress.server";
import * as notes from "./notes.server";
import * as interviews from "./interviews.server";
import * as designs from "./designs.server";
import * as mockInterview from "./mock-interview.server";
import { requireUserId } from "./auth.server";
import type { TopicStatus } from "./types";
import type { InterviewLogInput } from "./interviews.server";
import type { FlashcardRating } from "./progress.server";
import type { Node, Edge } from "reactflow";
import type { MockAttemptInput } from "./mock-interview.server";

// Every action derives the current user's id from the (server-verified)
// session cookie via requireUserId() — never accept a userId as an argument
// from the client, or any caller could mutate another user's data.

export async function setStatusAction(topicId: string, status: TopicStatus) {
  const userId = await requireUserId();
  const entry = await progress.setStatus(userId, topicId, status);
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/roadmap");
  revalidatePath("/");
  return entry;
}

export async function setConfidenceAction(topicId: string, confidence: number) {
  const userId = await requireUserId();
  const entry = await progress.setConfidence(userId, topicId, confidence);
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/");
  return entry;
}

export async function toggleChecklistAction(topicId: string, index: number) {
  const userId = await requireUserId();
  const entry = await progress.toggleChecklistItem(userId, topicId, index);
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/roadmap");
  revalidatePath("/");
  return entry;
}

export async function saveNoteAction(slug: string, title: string, body: string) {
  const userId = await requireUserId();
  await notes.saveNote(userId, slug, title, body);
  revalidatePath("/notes");
  revalidatePath(`/notes/${slug}`);
}

export async function createNoteAction(title: string) {
  const userId = await requireUserId();
  const slug = await notes.createNote(userId, title);
  revalidatePath("/notes");
  return slug;
}

export async function deleteNoteAction(slug: string) {
  const userId = await requireUserId();
  await notes.deleteNote(userId, slug);
  revalidatePath("/notes");
}

export async function createInterviewLogAction(input: InterviewLogInput) {
  const userId = await requireUserId();
  const id = await interviews.createInterviewLog(userId, input);
  revalidatePath("/interviews");
  redirect(`/interviews/${id}`);
}

export async function updateInterviewLogAction(id: string, input: InterviewLogInput) {
  const userId = await requireUserId();
  await interviews.updateInterviewLog(userId, id, input);
  revalidatePath("/interviews");
  revalidatePath(`/interviews/${id}`);
}

export async function deleteInterviewLogAction(id: string) {
  const userId = await requireUserId();
  await interviews.deleteInterviewLog(userId, id);
  revalidatePath("/interviews");
  redirect("/interviews");
}

export async function rateFlashcardAction(topicId: string, rating: FlashcardRating) {
  const userId = await requireUserId();
  const entry = await progress.rateFlashcard(userId, topicId, rating);
  revalidatePath("/today");
  revalidatePath("/");
  revalidatePath(`/topics/${topicId}`);
  return entry;
}

export async function createDesignAction(title: string) {
  const userId = await requireUserId();
  const id = await designs.createDesign(userId, title);
  revalidatePath("/workspace");
  redirect(`/workspace/${id}`);
}

export async function saveDesignAction(id: string, title: string, nodes: Node[], edges: Edge[]) {
  const userId = await requireUserId();
  await designs.saveDesign(userId, id, title, nodes, edges);
  revalidatePath("/workspace");
  revalidatePath(`/workspace/${id}`);
}

export async function saveDesignVersionAction(
  designId: string,
  label: string,
  nodes: Node[],
  edges: Edge[],
) {
  const userId = await requireUserId();
  await designs.saveVersion(userId, designId, label, nodes, edges);
  revalidatePath(`/workspace/${designId}`);
}

export async function deleteDesignAction(id: string) {
  const userId = await requireUserId();
  await designs.deleteDesign(userId, id);
  revalidatePath("/workspace");
  redirect("/workspace");
}

export async function saveMockAttemptAction(input: MockAttemptInput) {
  const userId = await requireUserId();
  await mockInterview.saveMockAttempt(userId, input);
  revalidatePath("/mock-interview");
}
