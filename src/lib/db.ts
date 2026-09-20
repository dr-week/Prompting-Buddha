import { createClient, Client } from "@libsql/client";
import { CINE_COMPOSITIONS_DATABASE } from "./cine-database";
import { PRODUCTION_PRESETS } from "./filmmaker-compiler";

let clientInstance: Client | null = null;

export function getDbClient(): Client {
  if (!clientInstance) {
    // Local SQLite database file stored in project root or in-memory fallback
    const url = process.env.DATABASE_URL || "file:cine_database.db";
    clientInstance = createClient({
      url
    });
  }
  return clientInstance;
}

/**
 * Initializes database schema and seeds initial compositions & presets if empty
 */
export async function initDatabase(): Promise<{ status: string; totalCompositions: number; totalPresets: number }> {
  const db = getDbClient();

  // Create tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS compositions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      category_label TEXT NOT NULL,
      filmmaker_tradition TEXT NOT NULL,
      core_philosophy TEXT NOT NULL,
      framing TEXT NOT NULL,
      camera_angle TEXT NOT NULL,
      camera_movement TEXT NOT NULL,
      lens_recommendation TEXT NOT NULL,
      spatial_blocking_guide TEXT NOT NULL,
      acting_procedure TEXT NOT NULL,
      t0_baseline_rule TEXT NOT NULL,
      anti_complexity_constraint TEXT NOT NULL,
      default_audio_ambience TEXT NOT NULL,
      examples_json TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      scene_beat TEXT NOT NULL,
      aspect_ratio TEXT NOT NULL,
      flow_reference_mode TEXT NOT NULL,
      raw_realism_mode INTEGER NOT NULL DEFAULT 1,
      cast_json TEXT NOT NULL,
      panels_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS studio_settings (
      id TEXT PRIMARY KEY,
      nsfw_mode INTEGER NOT NULL DEFAULT 0,
      negative_guardrails INTEGER NOT NULL DEFAULT 1,
      compact_mode INTEGER NOT NULL DEFAULT 0,
      platform_syntax TEXT NOT NULL DEFAULT 'google_flow',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed Compositions if not present
  for (const comp of CINE_COMPOSITIONS_DATABASE) {
    await db.execute({
      sql: `
        INSERT INTO compositions (
          id, name, category, category_label, filmmaker_tradition,
          core_philosophy, framing, camera_angle, camera_movement,
          lens_recommendation, spatial_blocking_guide, acting_procedure,
          t0_baseline_rule, anti_complexity_constraint, default_audio_ambience, examples_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          category = excluded.category,
          category_label = excluded.category_label,
          filmmaker_tradition = excluded.filmmaker_tradition,
          core_philosophy = excluded.core_philosophy,
          framing = excluded.framing,
          camera_angle = excluded.camera_angle,
          camera_movement = excluded.camera_movement,
          lens_recommendation = excluded.lens_recommendation,
          spatial_blocking_guide = excluded.spatial_blocking_guide,
          acting_procedure = excluded.acting_procedure,
          t0_baseline_rule = excluded.t0_baseline_rule,
          anti_complexity_constraint = excluded.anti_complexity_constraint,
          default_audio_ambience = excluded.default_audio_ambience,
          examples_json = excluded.examples_json
      `,
      args: [
        comp.id,
        comp.name,
        comp.category,
        comp.categoryLabel,
        comp.filmmakerTradition,
        comp.corePhilosophy,
        comp.framing,
        comp.cameraAngle,
        comp.cameraMovement,
        comp.lensRecommendation,
        comp.spatialBlockingGuide,
        comp.actingProcedure,
        comp.t0BaselineRule,
        comp.antiComplexityConstraint,
        comp.defaultAudioAmbience,
        JSON.stringify(comp.examples || [])
      ]
    });
  }

  // Seed Presets into projects table
  const presetKeys = Object.keys(PRODUCTION_PRESETS);
  for (const key of presetKeys) {
    const p = PRODUCTION_PRESETS[key];
    await db.execute({
      sql: `
        INSERT INTO projects (
          id, title, scene_beat, aspect_ratio,
          flow_reference_mode, raw_realism_mode, cast_json, panels_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          scene_beat = excluded.scene_beat,
          aspect_ratio = excluded.aspect_ratio,
          flow_reference_mode = excluded.flow_reference_mode,
          raw_realism_mode = excluded.raw_realism_mode,
          cast_json = excluded.cast_json,
          panels_json = excluded.panels_json,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        key,
        p.projectTitle,
        p.sceneBeat || "",
        p.aspectRatio,
        p.flowReferenceMode,
        p.rawRealismMode ? 1 : 0,
        JSON.stringify(p.cast || []),
        JSON.stringify(p.panels || [])
      ]
    });
  }

  const countRes = await db.execute("SELECT COUNT(*) as cnt FROM compositions;");
  const compCount = Number(countRes.rows[0]?.cnt || 0);

  return {
    status: "connected",
    totalCompositions: compCount,
    totalPresets: presetKeys.length
  };
}

/**
 * Export complete cinematic continuity database as formatted JSON
 */
export async function exportDatabaseDump(): Promise<string> {
  const db = getDbClient();
  const comps = await db.execute("SELECT * FROM compositions;");
  const projs = await db.execute("SELECT * FROM projects;");
  const settings = await db.execute("SELECT * FROM studio_settings;");

  const dump = {
    exportedAt: new Date().toISOString(),
    databaseFramework: "LibSQL / SQLite (file:cine_database.db)",
    compositionsCount: comps.rows.length,
    compositions: comps.rows,
    projectsCount: projs.rows.length,
    projects: projs.rows,
    studioSettings: settings.rows
  };

  return JSON.stringify(dump, null, 2);
}
