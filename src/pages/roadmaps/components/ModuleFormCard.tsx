import React from "react";
import { useFieldArray } from "react-hook-form";
import { HiTrash, HiPlus } from "react-icons/hi";
import FormDateTimePicker from "../../../components/common/FormDateTimePicker";
import { ModuleFormCardProps } from "../../../types/roadmap";

const ModuleFormCard = ({
  index,
  control,
  register,
  errors,
  onRemove,
  showRemove,
}: ModuleFormCardProps) => {
  const {
    fields: resources,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({
    control,
    name: `modules.${index}.resources` as const,
  });

  const moduleErrors = errors?.modules?.[index];

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-[20px] p-6 relative animate-in fade-in duration-300">
      {/* Remove module */}
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-6 right-6 text-zinc-400 hover:text-rose-500 transition-colors"
        >
          <HiTrash size={18} />
        </button>
      )}

      <h3 className="text-sm font-bold text-accent mb-4">
        Module #{index + 1}
      </h3>

      <div className="space-y-4">
        {/* Module Title */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-500">Module Title</label>
          <input
            type="text"
            placeholder="e.g., Advanced Hook Composition"
            {...register(`modules.${index}.title` as const, { required: "Module title is required" })}
            className={`w-full px-4 py-2.5 rounded-lg bg-white border text-zinc-900 focus:outline-none transition-all text-xs font-medium
              ${moduleErrors?.title ? "border-rose-500" : "border-zinc-200 focus:border-accent"}`}
          />
          {moduleErrors?.title && (
            <span className="text-[11px] text-rose-500 font-semibold pl-1">
              {moduleErrors.title.message}
            </span>
          )}
        </div>

        {/* Module Summary */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-500">Module Summary</label>
          <textarea
            placeholder="Summarize the core learnings and objectives for this step..."
            rows={3}
            {...register(`modules.${index}.summary` as const, { required: "Module summary is required" })}
            className={`w-full px-4 py-2.5 rounded-lg bg-white border text-zinc-900 focus:outline-none transition-all text-xs font-medium leading-relaxed
              ${moduleErrors?.summary ? "border-rose-500" : "border-zinc-200 focus:border-accent"}`}
          />
          {moduleErrors?.summary && (
            <span className="text-[11px] text-rose-500 font-semibold pl-1">
              {moduleErrors.summary.message}
            </span>
          )}
        </div>

        {/* Resources Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-zinc-500">Learning Resources</label>
            <button
              type="button"
              onClick={() => appendResource({ title: "", url: "" })}
              className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
            >
              <HiPlus /> Add Resource
            </button>
          </div>

          {resources.map((res, rIdx) => {
            const resourceErrors = moduleErrors?.resources?.[rIdx];
            return (
              <div key={res.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start bg-white p-3 rounded-lg border border-zinc-100">
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Link Label (e.g. Hooks Docs)"
                    {...register(`modules.${index}.resources.${rIdx}.title` as const, {
                      required: "Label is required",
                    })}
                    className={`w-full px-3 py-2 rounded border text-[11px] font-medium focus:outline-none
                      ${resourceErrors?.title ? "border-rose-500" : "border-zinc-200"}`}
                  />
                  {resourceErrors?.title && (
                    <span className="text-[10px] text-rose-500 font-semibold block pl-1">
                      {resourceErrors.title.message}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <input
                      type="url"
                      placeholder="URL (https://...)"
                      {...register(`modules.${index}.resources.${rIdx}.url` as const, {
                        required: "URL is required",
                      })}
                      className={`w-full px-3 py-2 rounded border text-[11px] font-medium focus:outline-none
                        ${resourceErrors?.url ? "border-rose-500" : "border-zinc-200"}`}
                    />
                    {resourceErrors?.url && (
                      <span className="text-[10px] text-rose-500 font-semibold block pl-1">
                        {resourceErrors.url.message}
                      </span>
                    )}
                  </div>

                  {resources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeResource(rIdx)}
                      className="text-zinc-400 hover:text-rose-500 transition-colors pt-2"
                    >
                      <HiTrash size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Meeting Link & Date/Time Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500">Google Meet Link (Optional)</label>
            <input
              type="url"
              placeholder="https://meet.google.com/abc-defg-hij"
              {...register(`modules.${index}.meetingLink` as const)}
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-zinc-200 text-zinc-900 focus:outline-none focus:border-accent transition-all text-xs font-medium"
            />
          </div>
          <FormDateTimePicker
            name={`modules.${index}.meetingTime`}
            control={control}
            label="Meeting Time (Optional)"
            error={errors?.modules?.[index]?.meetingTime?.message}
          />
        </div>
      </div>
    </div>
  );
};

export default ModuleFormCard;
