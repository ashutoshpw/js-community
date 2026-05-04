/**
 * Discourse Import Pipeline — Checkpoint / State Persistence
 *
 * Writes progress and ID maps to JSON files in the state directory so that
 * a failed run can be resumed without re-importing already-processed rows.
 *
 * File layout:
 *   <stateDir>/checkpoint.json   — last completed stage + per-stage offset
 *   <stateDir>/id-map-users.json — { discourseId -> newId }
 *   <stateDir>/id-map-categories.json
 *   <stateDir>/id-map-topics.json
 *   <stateDir>/id-map-posts.json
 *   <stateDir>/id-map-tags.json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { StageName } from "./config";

export interface StageProgress {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
}

export interface Checkpoint {
  completedStages: StageName[];
  stageOffsets: Partial<Record<StageName, number>>;
  stageProgress: Partial<Record<StageName, StageProgress>>;
  startedAt: string;
  updatedAt: string;
}

export type IdMap = Record<number, number>; // discourse id -> new local id

export class ImportState {
  private stateDir: string;
  private checkpointPath: string;
  private checkpoint: Checkpoint;
  private idMaps: Partial<Record<string, IdMap>> = {};

  constructor(stateDir: string) {
    this.stateDir = stateDir;
    this.checkpointPath = join(stateDir, "checkpoint.json");
    mkdirSync(stateDir, { recursive: true });

    if (existsSync(this.checkpointPath)) {
      this.checkpoint = JSON.parse(readFileSync(this.checkpointPath, "utf-8"));
    } else {
      this.checkpoint = {
        completedStages: [],
        stageOffsets: {},
        stageProgress: {},
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  isStageComplete(stage: StageName): boolean {
    return this.checkpoint.completedStages.includes(stage);
  }

  getOffset(stage: StageName): number {
    return this.checkpoint.stageOffsets[stage] ?? 0;
  }

  saveOffset(stage: StageName, offset: number): void {
    this.checkpoint.stageOffsets[stage] = offset;
    this.checkpoint.updatedAt = new Date().toISOString();
    this.flush();
  }

  markStageComplete(stage: StageName, progress: StageProgress): void {
    if (!this.checkpoint.completedStages.includes(stage)) {
      this.checkpoint.completedStages.push(stage);
    }
    this.checkpoint.stageProgress[stage] = progress;
    this.checkpoint.updatedAt = new Date().toISOString();
    this.flush();
  }

  getProgress(stage: StageName): StageProgress | undefined {
    return this.checkpoint.stageProgress[stage];
  }

  private flush(): void {
    writeFileSync(
      this.checkpointPath,
      JSON.stringify(this.checkpoint, null, 2),
    );
  }

  // --- ID maps ---

  loadIdMap(entity: string): IdMap {
    if (this.idMaps[entity]) return this.idMaps[entity]!;
    const path = join(this.stateDir, `id-map-${entity}.json`);
    if (existsSync(path)) {
      this.idMaps[entity] = JSON.parse(readFileSync(path, "utf-8"));
    } else {
      this.idMaps[entity] = {};
    }
    return this.idMaps[entity]!;
  }

  saveIdMap(entity: string, map: IdMap): void {
    this.idMaps[entity] = map;
    writeFileSync(
      join(this.stateDir, `id-map-${entity}.json`),
      JSON.stringify(map, null, 2),
    );
  }

  setMapping(entity: string, discourseId: number, newId: number): void {
    const map = this.loadIdMap(entity);
    map[discourseId] = newId;
    // Flush incrementally so we don't lose all mappings on crash
    this.saveIdMap(entity, map);
  }

  getMapping(entity: string, discourseId: number): number | undefined {
    return this.loadIdMap(entity)[discourseId];
  }
}
