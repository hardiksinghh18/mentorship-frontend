import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { HiPlus, HiSparkles } from "react-icons/hi";
import ModuleFormCard from "./ModuleFormCard";
import { CourseFormInput, SyllabusBuilderProps } from "../../types/course";

const SyllabusBuilder = ({ onBack }: SyllabusBuilderProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CourseFormInput>();

  const {
    fields: modules,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: "modules",
  });

  return (
    <div className="space-y-8">
      {modules.map((module, mIdx) => (
        <ModuleFormCard
          key={module.id}
          index={mIdx}
          control={control}
          register={register}
          errors={errors}
          showRemove={modules.length > 1}
          onRemove={() => removeModule(mIdx)}
        />
      ))}

      {/* Add Module Trigger */}
      <button
        type="button"
        onClick={() =>
          appendModule({
            title: "",
            summary: "",
            resources: [{ title: "", url: "" }],
            meetingLink: "",
          })
        }
        className="w-full py-4 rounded-[20px] border-2 border-dashed border-zinc-300 hover:border-accent text-zinc-500 hover:text-accent font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 bg-zinc-50/50"
      >
        <HiPlus size={16} /> Add Course Module
      </button>

      {/* Step Controls */}
      <div className="pt-6 border-t border-zinc-100 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-full bg-zinc-100 text-zinc-700 text-sm font-bold tracking-tight hover:bg-zinc-200 active:scale-[0.98] transition-all"
        >
          Back to Settings
        </button>
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-bold tracking-tight hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
        >
          <span>Publish Course</span>
          <HiSparkles />
        </button>
      </div>
    </div>
  );
};

export default SyllabusBuilder;
