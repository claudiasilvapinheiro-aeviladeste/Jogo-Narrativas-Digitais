import { describe, expect, it } from "vitest";

import {
  blankParchment,
  checkReady,
  playableQuiz,
  completeActive,
  createInitialQuest,
  isZoneUnlocked,
  scoreFor,
  statusOf,
  updateCheckpoint,
  validateUpload,
} from "@/lib/quest";

function completeN(n: number) {
  let q = createInitialQuest();
  for (let i = 0; i < n; i++) {
    const r = completeActive(q, { quizPassed: true });
    if (!r.ok) throw new Error("expected ok");
    q = r.state;
  }
  return q;
}

describe("quest rules", () => {
  it("has 10 missions per zone, 30 in total, with example tasks filled in", () => {
    const q = createInitialQuest();
    expect(q.checkpoints).toHaveLength(30);
    expect(q.checkpoints.filter((c) => c.zone === "forest")).toHaveLength(10);
    expect(q.checkpoints.filter((c) => c.zone === "caverns")).toHaveLength(10);
    expect(q.checkpoints.filter((c) => c.zone === "citadel")).toHaveLength(10);
    expect(q.checkpoints.every((c) => c.description.trim().length > 0)).toBe(true);
  });

  it("has exactly one active mission and completing it unlocks the next", () => {
    const q = completeN(3);
    const statuses = q.checkpoints.map((_, i) => statusOf(q, i));
    expect(statuses.filter((s) => s === "active")).toHaveLength(1);
    expect(statuses[3]).toBe("active");
    expect(statuses[4]).toBe("locked");
    expect(statuses[2]).toBe("completed");
  });

  it("refuses to complete a mission with no task written", () => {
    const q = blankParchment(createInitialQuest());
    const r = completeActive(q, { quizPassed: true });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("missing-task");
  });

  it("awards 50 points per mission plus 150 when a zone is cleared", () => {
    expect(scoreFor(1)).toBe(50);
    expect(scoreFor(10)).toBe(650);
    const q = completeN(9);
    const r = completeActive(q, { quizPassed: true });
    expect(r.ok && r.pointsEarned).toBe(200);
    expect(r.ok && r.zoneEntered).toBe("caverns");
  });

  it("unlocks the Crystal Caverns only after the forest's 10 missions", () => {
    expect(isZoneUnlocked(completeN(9), "caverns")).toBe(false);
    expect(isZoneUnlocked(completeN(10), "caverns")).toBe(true);
  });

  it("finishes the quest after 30 missions", () => {
    const q = completeN(29);
    const r = completeActive(q, { quizPassed: true });
    expect(r.ok && r.questComplete).toBe(true);
    expect(completeActive(completeN(30), { quizPassed: true }).ok).toBe(false);
  });

  it("rejects worksheet images over 10MB", () => {
    expect(validateUpload({ size: 10 * 1024 * 1024, type: "image/png" })).toBeNull();
    expect(validateUpload({ size: 10 * 1024 * 1024 + 1, type: "image/png" })).toBe("too-large");
    expect(validateUpload({ size: 100, type: "application/pdf" })).toBe("not-image");
  });

  it("editing a mission does not change progress", () => {
    const q = completeN(2);
    const edited = updateCheckpoint(q, q.checkpoints[5]!.id, { title: "Nova" });
    expect(edited.completed).toBe(2);
    expect(edited.checkpoints[5]!.title).toBe("Nova");
  });

  it("cannot complete a mission until the quiz has been passed", () => {
    const r = completeActive(createInitialQuest(), { quizPassed: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("quiz-required");
  });

  it("every example mission comes with a 3-question quiz", () => {
    const q = createInitialQuest();
    expect(q.checkpoints.every((c) => playableQuiz(c).length === 3)).toBe(true);
  });

  it("a mission with no valid quiz question cannot start the quiz", () => {
    const q = createInitialQuest();
    const noQuiz = updateCheckpoint(q, q.checkpoints[0]!.id, {
      quiz: [{ question: "Pergunta?", options: ["", "", ""], answer: 0 }],
    });
    expect(checkReady(noQuiz)).toBe("missing-quiz");
    expect(checkReady(q)).toBeNull();
  });

  it("keeps the right answer when blank options are skipped", () => {
    const [pq] = playableQuiz({ quiz: [{ question: "2+2?", options: ["", "3", "4"], answer: 2 }] });
    expect(pq!.options).toEqual(["3", "4"]);
    expect(pq!.options[pq!.answer]).toBe("4");
  });
});
