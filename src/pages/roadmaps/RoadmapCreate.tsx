import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, FormProvider } from "react-hook-form";
import GeneralDetailsForm from "./components/GeneralDetailsForm";
import SyllabusBuilder from "./components/SyllabusBuilder";
import { CourseFormInput, AuthState } from "../../types/roadmap";
import { useCreateCourseMutation } from "../../redux/api/apiSlice";

const RoadmapCreate = () => {
  const { isLoggedIn } = useSelector((state: AuthState) => state.auth);
  const navigate = useNavigate();

  const [createCourse, { isLoading: publishing }] = useCreateCourseMutation();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login to create a course.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const [step, setStep] = useState<number>(1);

  const methods = useForm<CourseFormInput>({
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      skillsTargeted: "",
      durationValue: "",
      durationUnit: "Days",
      maxStudents: "20",
      modules: [
        {
          title: "",
          summary: "",
          resources: [{ title: "", url: "" }],
          meetingLink: "",
        },
      ],
    },
  });

  const handlePublish = async (data: CourseFormInput) => {
    try {
      await createCourse(data).unwrap();
      toast.success("Course and roadmap published successfully!");
      navigate("/roadmaps");
    } catch (err: any) {
      console.error("Error creating course:", err);
      toast.error(err.data?.message || "Failed to publish course");
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-white py-12 px-6 md:px-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              Step {step} of 2
            </span>
            <h1 className="text-2xl font-black tracking-tighter text-zinc-900 mt-1">
              {step === 1 ? "Launch a Learning Track" : "Design the Curriculum Roadmap"}
            </h1>
          </div>
          <div className="flex gap-2">
            <div className={`w-8 h-2 rounded-full transition-all duration-300 ${step === 1 ? "bg-accent" : "bg-zinc-200"}`} />
            <div className={`w-8 h-2 rounded-full transition-all duration-300 ${step === 2 ? "bg-accent" : "bg-zinc-200"}`} />
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handlePublish)} className="space-y-6">
            {step === 1 ? (
              <GeneralDetailsForm onNext={() => setStep(2)} />
            ) : (
              <SyllabusBuilder onBack={() => setStep(1)} />
            )}
          </form>
        </FormProvider>

        {publishing && (
          <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xl flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold text-zinc-700">Publishing course roadmap...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapCreate;
