import { InterviewForm } from "@/components/interview-form";

export default function NewInterviewPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Log a new interview</h1>
      <InterviewForm />
    </div>
  );
}
