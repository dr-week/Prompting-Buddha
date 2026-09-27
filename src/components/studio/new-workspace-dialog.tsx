"use client";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";

interface FormValues { name: string; logline: string }

export function NewWorkspaceDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, logline: string) => Promise<void> }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <form className="dialog" onMouseDown={(event) => event.stopPropagation()} onSubmit={handleSubmit(async (values) => { await onCreate(values.name, values.logline); onClose(); })}>
        <header><div><span className="eyebrow">Workspace</span><h2>New</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></header>
        <label>Name<input autoFocus placeholder="e.g. Monsoon Courier" {...register("name", { required: true })} /></label>
        <label>Logline<textarea rows={4} placeholder="Describe the scene beat..." {...register("logline")} /></label>
        <footer><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={isSubmitting}>Create</button></footer>
      </form>
    </div>
  );
}
