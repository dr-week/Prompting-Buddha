import { describe, expect, it, vi } from "vitest";
import React from "react";
import { StepNavigation } from "./step-navigation";

describe("StepNavigation UX & Workflow Unlocked Flow", () => {
  it("renders correctly as a React component element", () => {
    const el = React.createElement(StepNavigation, {
      active: "character",
      onChange: vi.fn(),
    });

    expect(el).toBeDefined();
    expect(el.props.active).toBe("character");
  });

  it("handles step click transitions cleanly without artificial locks", () => {
    const handleChange = vi.fn();
    const rendered = StepNavigation({
      active: "character",
      onChange: handleChange,
    });

    const buttons = React.Children.toArray(rendered.props.children);
    expect(buttons.length).toBe(6);

    // Click outfit-pose
    const outfitPoseButton = buttons[1] as React.ReactElement<{ onClick: () => void }>;
    outfitPoseButton.props.onClick();
    expect(handleChange).toHaveBeenCalledWith("outfit-pose");

    // Click mindmap
    const mindmapButton = buttons[2] as React.ReactElement<{ onClick: () => void }>;
    mindmapButton.props.onClick();
    expect(handleChange).toHaveBeenCalledWith("storymap");

    // Click storyboard (now freely accessible)
    const storyboardButton = buttons[3] as React.ReactElement<{ onClick: () => void }>;
    storyboardButton.props.onClick();
    expect(handleChange).toHaveBeenCalledWith("storyboard");

    // Click video
    const videoButton = buttons[4] as React.ReactElement<{ onClick: () => void }>;
    videoButton.props.onClick();
    expect(handleChange).toHaveBeenCalledWith("video");

    // Click auditor
    const auditorButton = buttons[5] as React.ReactElement<{ onClick: () => void }>;
    auditorButton.props.onClick();
    expect(handleChange).toHaveBeenCalledWith("auditor");
  });
});
