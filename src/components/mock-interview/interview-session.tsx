"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Mic, Square, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_LABELS_CLIENT } from "@/lib/category-labels";
import { saveMockAttemptAction } from "@/lib/actions";
import type { MockQuestion } from "@/lib/mock-interview.server";

// The Web Speech API has no official TS lib entry; this is the minimal shape we use.
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: { transcript: string };
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function scoreTranscript(transcript: string, concepts: string[]) {
  const lower = transcript.toLowerCase();
  const matched = concepts.filter((c) => lower.includes(c.toLowerCase()));
  const missing = concepts.filter((c) => !matched.includes(c));
  const score = concepts.length > 0 ? Math.round((matched.length / concepts.length) * 100) : 0;
  return { score, matched, missing };
}

type Phase = "idle" | "recording" | "reviewing";

interface Result {
  score: number;
  matched: string[];
  missing: string[];
  transcript: string;
  durationSeconds: number;
}

export function InterviewSession({ questions }: { questions: MockQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [manualAnswer, setManualAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [, startTransition] = useTransition();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<MockQuestion | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    // One-time browser feature detection — SpeechRecognition doesn't exist on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpeechSupported(getSpeechRecognitionCtor() !== null);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recognitionRef.current?.stop();
    };
  }, []);

  if (questions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No question pool available yet — track a few topics on the Roadmap first.
      </p>
    );
  }

  const liveQuestion = questions[index % questions.length];
  // Frozen at the moment recording starts: saving an attempt revalidates this
  // page, which re-fetches a freshly randomized question pool from the server.
  // Without freezing, the question shown during "reviewing" could silently
  // swap out from under the user right after they finish answering.
  const question = activeQuestion ?? liveQuestion;

  function startRecording() {
    setActiveQuestion(liveQuestion);
    setTranscript("");
    setInterim("");
    setResult(null);
    startTimeRef.current = Date.now();
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 250);

    const Ctor = getSpeechRecognitionCtor();
    if (Ctor) {
      const recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        let finalChunk = "";
        let interimChunk = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const r = event.results[i];
          if (r.isFinal) finalChunk += r[0].transcript;
          else interimChunk += r[0].transcript;
        }
        if (finalChunk) setTranscript((prev) => `${prev} ${finalChunk}`.trim());
        setInterim(interimChunk);
      };
      recognition.onerror = () => {
        /* stay in recording state; user can still stop manually */
      };
      recognitionRef.current = recognition;
      recognition.start();
    }

    setPhase("recording");
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    recognitionRef.current?.stop();
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const finalTranscript = speechSupported ? transcript : manualAnswer;
    const { score, matched, missing } = scoreTranscript(finalTranscript, question.concepts);
    const nextResult: Result = { score, matched, missing, transcript: finalTranscript, durationSeconds };
    setResult(nextResult);
    setPhase("reviewing");

    startTransition(() => {
      saveMockAttemptAction({
        topicId: question.topicId,
        question: question.text,
        transcript: finalTranscript,
        durationSeconds,
        score,
        matchedConcepts: matched,
        missingConcepts: missing,
      });
    });
  }

  function nextQuestion() {
    setActiveQuestion(null);
    setIndex((i) => i + 1);
    setPhase("idle");
    setTranscript("");
    setInterim("");
    setManualAnswer("");
    setResult(null);
    setElapsed(0);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {index + 1} · {questions.length} in pool
        </span>
        <Badge variant="outline" className="text-[10px]">
          {CATEGORY_LABELS_CLIENT[question.category] ?? question.category}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <p className="text-lg font-medium">{question.text}</p>

          {phase === "idle" && (
            <div className="space-y-3">
              {speechSupported ? (
                <Button onClick={startRecording}>
                  <Mic className="size-4" /> Start answering
                </Button>
              ) : (
                <>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Live transcription isn&apos;t supported in this browser (try Chrome or Edge).
                    Type your answer instead, then score it.
                  </p>
                  <Textarea
                    value={manualAnswer}
                    onChange={(e) => setManualAnswer(e.target.value)}
                    placeholder="Type what you would say out loud…"
                    className="min-h-32"
                  />
                  <Button onClick={startRecording} disabled={!manualAnswer.trim()}>
                    Start timer
                  </Button>
                </>
              )}
            </div>
          )}

          {phase === "recording" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-red-500">
                <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                Recording
                <span className="ml-auto flex items-center gap-1 text-muted-foreground tabular-nums">
                  <Clock className="size-3.5" /> {elapsed}s
                </span>
              </div>
              {speechSupported ? (
                <p className="text-sm min-h-16 rounded-md border p-3 bg-muted/30">
                  {transcript}
                  <span className="text-muted-foreground"> {interim}</span>
                </p>
              ) : (
                <Textarea value={manualAnswer} readOnly className="min-h-32" />
              )}
              <Button variant="destructive" onClick={stopRecording}>
                <Square className="size-4" /> Stop &amp; score
              </Button>
            </div>
          )}

          {phase === "reviewing" && result && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold tabular-nums">{result.score}%</span>
                <span className="text-sm text-muted-foreground">
                  concept coverage · {result.durationSeconds}s response
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                This is a keyword-coverage heuristic, not an AI judgment of correctness — it
                checks whether key terms from the topic showed up in what you said.
              </p>

              <div>
                <p className="text-sm font-medium mb-1.5">Your answer</p>
                <p className="text-sm rounded-md border p-3 bg-muted/30">
                  {result.transcript || "(nothing captured)"}
                </p>
              </div>

              {result.matched.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1.5">Concepts you covered</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched.map((c) => (
                      <Badge key={c} variant="outline" className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.missing.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1.5">Missing concepts — review these</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing.map((c) => (
                      <Badge key={c} variant="outline" className="border-red-500/50 text-red-600 dark:text-red-400">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={nextQuestion}>
                Next question <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
