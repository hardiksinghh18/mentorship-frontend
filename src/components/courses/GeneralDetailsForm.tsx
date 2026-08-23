import React from "react";
import { useFormContext } from "react-hook-form";
import { CourseFormInput, GeneralDetailsFormProps } from "../../types/course";

const GeneralDetailsForm = ({ onNext }: GeneralDetailsFormProps) => {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<CourseFormInput>();

  const handleNextClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isValid = await trigger([
      "title",
      "description",
      "skillsTargeted",
      "durationValue",
      "durationUnit",
      "maxStudents",
    ]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-500">Course Title</label>
        <input
          type="text"
          placeholder="e.g., 30 Days of React Specialization"
          {...register("title", { required: "Course title is required" })}
          className={`w-full px-5 py-3 rounded-xl bg-zinc-50 border text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 text-sm font-medium
            ${errors.title ? "border-rose-500 focus:border-rose-500 focus:bg-rose-50/10" : "border-zinc-300 focus:border-accent focus:bg-zinc-100/50"}`}
        />
        {errors.title && (
          <span className="text-xs text-rose-500 font-semibold pl-1">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-500">Description</label>
        <textarea
          placeholder="Summarize the learning track goals, deliverables, and targets..."
          rows={4}
          {...register("description", { required: "Description is required" })}
          className={`w-full px-5 py-3 rounded-xl bg-zinc-50 border text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 text-sm font-medium leading-relaxed
            ${errors.description ? "border-rose-500 focus:border-rose-500 focus:bg-rose-50/10" : "border-zinc-300 focus:border-accent focus:bg-zinc-100/50"}`}
        />
        {errors.description && (
          <span className="text-xs text-rose-500 font-semibold pl-1">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-500">Skills Targeted (Comma separated)</label>
        <input
          type="text"
          placeholder="e.g., React, Redux, Performance, Hooks"
          {...register("skillsTargeted", { required: "Skills are required" })}
          className={`w-full px-5 py-3 rounded-xl bg-zinc-50 border text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 text-sm font-medium
            ${errors.skillsTargeted ? "border-rose-500 focus:border-rose-500 focus:bg-rose-50/10" : "border-zinc-300 focus:border-accent focus:bg-zinc-100/50"}`}
        />
        {errors.skillsTargeted && (
          <span className="text-xs text-rose-500 font-semibold pl-1">
            {errors.skillsTargeted.message}
          </span>
        )}
      </div>

      {/* Duration and Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Value */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-500">Duration Value</label>
          <input
            type="number"
            placeholder="e.g., 30"
            {...register("durationValue", {
              required: "Duration value is required",
              min: { value: 1, message: "Must be at least 1" },
            })}
            className={`w-full px-5 py-3 rounded-xl bg-zinc-50 border text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 text-sm font-medium
              ${errors.durationValue ? "border-rose-500 focus:border-rose-500 focus:bg-rose-50/10" : "border-zinc-300 focus:border-accent focus:bg-zinc-100/50"}`}
          />
          {errors.durationValue && (
            <span className="text-xs text-rose-500 font-semibold pl-1">
              {errors.durationValue.message}
            </span>
          )}
        </div>

        {/* Unit */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-500">Duration Unit</label>
          <select
            {...register("durationUnit")}
            className="w-full px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 focus:outline-none focus:border-accent focus:bg-zinc-100/50 transition-all text-sm font-medium"
          >
            <option value="Days">Days</option>
            <option value="Weeks">Weeks</option>
            <option value="Months">Months</option>
          </select>
        </div>

        {/* Capacity */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-500">Student Capacity</label>
          <input
            type="number"
            placeholder="e.g., 20"
            {...register("maxStudents", {
              required: "Capacity is required",
              min: { value: 1, message: "Must be at least 1" },
            })}
            className={`w-full px-5 py-3 rounded-xl bg-zinc-50 border text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 text-sm font-medium
              ${errors.maxStudents ? "border-rose-500 focus:border-rose-500 focus:bg-rose-50/10" : "border-zinc-300 focus:border-accent focus:bg-zinc-100/50"}`}
          />
          {errors.maxStudents && (
            <span className="text-xs text-rose-500 font-semibold pl-1">
              {errors.maxStudents.message}
            </span>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-100 flex justify-end">
        <button
          type="button"
          onClick={handleNextClick}
          className="px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-bold tracking-tight hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
        >
          <span>Syllabus Editor ›</span>
        </button>
      </div>
    </div>
  );
};

export default GeneralDetailsForm;
