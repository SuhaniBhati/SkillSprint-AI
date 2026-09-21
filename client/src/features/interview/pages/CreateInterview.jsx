import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useGenerateReport from "../hooks/useGenerateReport";
import GenerateReportForm from "../components/GenerateReportForm";
import LoadingScreen from "../components/LoadingScreen";

export default function CreateInterview() {
  const navigate = useNavigate();
  const { generate, isGenerating, uploadProgress, error } = useGenerateReport();

  if (isGenerating) {
    return <LoadingScreen progress={uploadProgress} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8FB] pb-20">
      <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#666666] transition hover:text-[#970747]"
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-[#1F1F1F] sm:text-3xl">
          Generate Interview Report
        </h1>
        <p className="mt-2 text-sm text-[#666666]">
          Upload your resume and the job description to get a personalized match score,
          interview questions, and a preparation plan.
        </p>

        <div className="mt-8">
          <GenerateReportForm
            onSubmit={generate}
            isGenerating={isGenerating}
            uploadProgress={uploadProgress}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}