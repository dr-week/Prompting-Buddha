"use client";

import { useMemo, useState } from "react";
import { AuditorStep } from "@/features/auditor/auditor-step";
import { CharacterStep } from "@/features/character/character-step";
import { StoryboardStep } from "@/features/storyboard/storyboard-step";
import { StoryMapStep } from "@/features/story-map/story-map-step";
import { VideoStep } from "@/features/video/video-step";
import { useWorkspaceStudio } from "@/features/workspaces/use-workspace-studio";
import { createStoryMapFromProject, createStoryMapFromTags } from "@/features/workspaces/defaults";
import { NewWorkspaceDialog } from "@/components/studio/new-workspace-dialog";
import { PromptOutput } from "@/components/studio/prompt-output";
import { StepNavigation } from "@/components/studio/step-navigation";
import { WorkspaceSidebar } from "@/components/studio/workspace-sidebar";
import { BrandMark } from "@/components/studio/brand-mark";
import { SettingsDialog } from "@/components/studio/settings-dialog";
import { compileCharacterSheetPrompt, compileOutfitPosePrompt } from "@/lib/compiler/character";
import { compileStoryboardPrompt } from "@/lib/compiler/storyboard";
import { compileVideoPrompts } from "@/lib/compiler/video";
import { DEFAULT_COMPILER_SETTINGS } from "@/lib/filmmaker-compiler";
import { applyScenePacket, buildScenePacket } from "@/features/story-map/scene-packet";
import { OutfitPoseStep } from "@/features/character/outfit-pose-step";

export default function Home() {
  const studio = useWorkspaceStudio();
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedShot, setSelectedShot] = useState(0);
  const [activeCharacterId, setActiveCharacterId] = useState<string>();
  const [outputOverride, setOutputOverride] = useState<string>();
  const document = studio.document;
  const project = document?.project;

  const compiled = useMemo(() => {
    if (!project || !document) return { title: "", prompt: "" };
    if (document.activeStep === "character") {
      const character = project.cast.find((item) => item.id === activeCharacterId) || project.cast[0];
      return { title: `${character.name} · character prompt`, prompt: compileCharacterSheetPrompt(character, { ...DEFAULT_COMPILER_SETTINGS, nsfwMode: document.settings.matureContent, negativeGuardrails: document.settings.negativeGuardrails, compactMode: document.settings.compactPrompts, platformSyntax: document.settings.targetAI }) };
    }
    if (document.activeStep === "outfit-pose") {
      const character = project.cast.find((item) => item.id === activeCharacterId) || project.cast[0];
      return { title: `${character.name} · outfit & pose prompt`, prompt: compileOutfitPosePrompt(character, { ...DEFAULT_COMPILER_SETTINGS, nsfwMode: document.settings.matureContent, negativeGuardrails: document.settings.negativeGuardrails, compactMode: document.settings.compactPrompts, platformSyntax: document.settings.targetAI }) };
    }
    if (document.activeStep === "video") {
      const oneShotProject = { ...project, panels: [project.panels[selectedShot]] };
      return { title: `Shot ${selectedShot + 1} · video prompt`, prompt: compileVideoPrompts(oneShotProject, true, { ...DEFAULT_COMPILER_SETTINGS, nsfwMode: document.settings.matureContent, negativeGuardrails: document.settings.negativeGuardrails, compactMode: document.settings.compactPrompts, platformSyntax: document.settings.targetAI }) };
    }
    return { title: document.activeStep === "auditor" ? "Audited storyboard prompt" : "Master storyboard prompt", prompt: compileStoryboardPrompt(project, { ...DEFAULT_COMPILER_SETTINGS, nsfwMode: document.settings.matureContent, negativeGuardrails: document.settings.negativeGuardrails, compactMode: document.settings.compactPrompts, platformSyntax: document.settings.targetAI }) };
  }, [activeCharacterId, document, project, selectedShot]);

  if (studio.error) return <main className="loading-screen"><span className="brand-mark"><BrandMark size={23} /></span><p>Workspace storage error</p><small>{studio.error}</small></main>;
  if (!studio.ready || !document || !project) return <main className="loading-screen"><span className="brand-mark"><BrandMark size={23} /></span><p>Opening your workspace…</p></main>;

  const updateProject = (nextProject: typeof project) => studio.updateProject(() => nextProject);
  const compile = (promptOverride?: string) => { setOutputOverride(promptOverride); setShowOutput((prev) => !prev); };
  const applyStoryMap = () => {
    try {
      const packet = buildScenePacket(document.storyMap.nodes, document.storyMap.edges, document.propLibrary);
      studio.updateProject((current) => applyScenePacket(current, packet));
    } catch {
      // Fallback: keep existing project state
    }
    setShowOutput(false);
    setOutputOverride(undefined);
    studio.setStep("storyboard");
  };
  const changeStep = (step: typeof document.activeStep) => {
    setShowOutput(false);
    setOutputOverride(undefined);
    studio.setStep(step);
  };

  return (
    <main className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <WorkspaceSidebar workspaces={studio.workspaces} activeId={studio.activeWorkspace?.id} onOpen={studio.openWorkspace} onCreate={() => setShowNewWorkspace(true)} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} targetAI={document.settings.targetAI} onTargetChange={(targetAI) => studio.updateSettings({ ...document.settings, targetAI })} onSave={() => void studio.save()} onSettings={() => setShowSettings(true)} workflowNavigation={<StepNavigation active={document.activeStep} onChange={changeStep} />} storyboards={document.storyboards} activeStoryboardId={document.activeStoryboardId} onAddStoryboard={studio.addStoryboard} onOpenStoryboard={studio.openStoryboard} />
      <section className="studio-shell">
        <div className={`work-area ${showOutput ? "with-output" : ""}`}>
          <div className="editor-column">
            {document.activeStep === "character" ? <CharacterStep project={project} matureContent={document.settings.matureContent} activeCharacterId={activeCharacterId} onActiveCharacterChange={setActiveCharacterId} onChange={updateProject} onCompile={() => compile()} isOutputOpen={showOutput} onNext={() => changeStep("outfit-pose")} /> : null}
            {document.activeStep === "outfit-pose" ? <OutfitPoseStep project={project} activeCharacterId={activeCharacterId} onActiveCharacterChange={setActiveCharacterId} onChange={updateProject} onCompile={() => compile()} onNext={() => changeStep("storymap")} /> : null}
            {document.activeStep === "storymap" ? <StoryMapStep key={`${document.workspaceId}:${document.activeStoryboardId}`} scopeId={`${document.workspaceId}:${document.activeStoryboardId}`} nodes={document.storyMap.nodes} edges={document.storyMap.edges} propLibrary={document.propLibrary} characters={project.cast} storyboardId={document.activeStoryboardId} onSaveProp={studio.upsertProp} onChange={(storyMap) => studio.updateStoryMap(storyMap)} onAutoBuild={(tags = []) => studio.updateStoryMap(tags.length ? createStoryMapFromTags(project, tags) : createStoryMapFromProject(project))} onNext={applyStoryMap} /> : null}
            {document.activeStep === "storyboard" ? <StoryboardStep project={project} onChange={updateProject} onCompile={() => compile()} onNext={() => changeStep("video")} /> : null}
            {document.activeStep === "video" ? <VideoStep project={project} selectedShot={selectedShot} onSelectShot={setSelectedShot} onChange={updateProject} onCompile={() => compile()} /> : null}
            {document.activeStep === "auditor" ? <AuditorStep project={project} prompt={compiled.prompt} platform={document.settings.targetAI} onCompile={compile} /> : null}
          </div>
          {showOutput ? <PromptOutput title={compiled.title} prompt={outputOverride ?? compiled.prompt} onClose={() => setShowOutput(false)} /> : null}
        </div>
      </section>
      {showNewWorkspace ? <NewWorkspaceDialog onClose={() => setShowNewWorkspace(false)} onCreate={studio.createWorkspace} /> : null}
      {showSettings ? <SettingsDialog settings={document.settings} onChange={studio.updateSettings} onClose={() => setShowSettings(false)} /> : null}
    </main>
  );
}
