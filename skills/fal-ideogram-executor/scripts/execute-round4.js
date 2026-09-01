#!/usr/bin/env node
/**
 * fal-ai Ideogram V3 Prompt Executor
 * For Allura Memory Round 4 Visual Generation
 * Strategy: Sage60/Lover25/Ruler15
 */

import { fal } from "@fal-ai/client";
import fs from "fs/promises";
import path from "path";

// Configure fal client with API key from environment
fal.config({
  credentials: process.env.FAL_API_KEY || process.env.FAL_KEY
});

// Configuration
const CONFIG = {
  model: "fal-ai/ideogram/v3",
  outputDir: "./clients/allura-memory/generated-images/round4",
  renderingSpeed: "QUALITY", // or "BALANCED" for faster iteration
  expandPrompt: true,
  numImages: 1,
  defaultSize: "square_hd"
};

// Round 4 Prompts - Sage60/Lover25/Ruler15 Tuned
const PROMPTS = [
  {
    id: "r4-logo-primary",
    name: "Logo Primary Horizontal",
    prompt: `A sophisticated logo design for "Allura Memory" featuring a wordmark partially enclosed by an architectural frame with intentional openings. The frame has softened corners with gentle curves where geometry meets open space — the Lover's touch. Deep graphite (#1C232B) and slate (#405261) color palette with subtle warmth. The design balances Sage clarity (structured, inspectable) with Lover grace (sensory elegance, magnetic refinement). The frame is incomplete, suggesting memory with visible boundaries and review. Typography is refined and precise, with optical kerning that feels crafted. No neon, no glowing effects, no cyberpunk, no decorative swirls. The mark should feel like knowledge under control made with enough care that you're drawn toward it — the thin magic of exceptional craft. Minimal, architectural, graceful curves within geometric containment.`,
    stylePreset: "MINIMAL_ILLUSTRATION",
    size: "square_hd"
  },
  {
    id: "r4-logo-compact",
    name: "Logo Compact Variant",
    prompt: `A refined compact logo design for "Allura" featuring a minimal wordmark with subtle architectural containment. The mark shows graceful curves at geometric intersections — softened edges that signal warmth without sacrificing structure. Deep graphite (#1C232B) on clean white, with Steel Blue (#4E6E8A) accents for measured emphasis. The typography feels precise yet inviting, with proportions that make you want to look closer. The design embodies the "thin magic" — craft so refined it borders on enchanting. No princess-soft femininity, no pastel washes, no decorative ornamentation. This is architectural grace: beauty born from structure, not decoration. Sage clarity meets Lover elegance meets Ruler containment.`,
    stylePreset: "MINIMAL_ILLUSTRATION",
    size: "square_hd"
  },
  {
    id: "r4-logo-mark",
    name: "Logo Mark-Only Icon",
    prompt: `A minimalist icon design for "Allura Memory" — a simplified partial frame mark that suggests memory with visible boundaries. The geometric form features softened corners and graceful curves where lines meet open space. Deep graphite (#1C232B) with subtle warmth. The mark should feel architectural yet inviting — precise enough to signal structure, graceful enough to feel magnetic. No literal memory cliches (no brains, no nodes, no circuits). No decorative flourishes. The Lover archetype enters through refined proportions and sensory elegance — the thin magic of exceptional craft. Icon should work at small sizes (16px to 512px) while maintaining clarity and grace.`,
    stylePreset: "GEO_MINIMALIST",
    size: "square_hd"
  },
  {
    id: "r4-app-business-card",
    name: "Business Card Mockup",
    prompt: `A premium business card mockup for "Allura Memory" featuring the Trace Frame logo system. Front: primary horizontal logo with partial frame at top left, generous negative space, contact details aligned to strict left edge. Deep graphite (#1C232B) on white with subtle Steel Blue (#4E6E8A) accent rule line. Typography: IBM Plex Sans, Medium for name, Regular for details. The design feels architectural, not crowded — graceful curves within the frame corners, refined restraint. Back: restrained brand field with mark-only icon or lead tagline "Memory That Shows Its Work." The overall feel is precise, calm, credibly magnetic — the thin magic of craft so refined it invites inspection. Clean product photography, studio lighting, professional mockup presentation. No decorative pattern noise, no busy textures.`,
    stylePreset: "EDITORIAL",
    size: "landscape_4_3"
  },
  {
    id: "r4-app-website-hero",
    name: "Website Hero Header",
    prompt: `A website hero header design for "Allura Memory" featuring the compact horizontal Trace Frame logo in Deep Graphite (#1C232B) on a clean white background. The header includes the tagline "Memory That Shows Its Work" in refined IBM Plex Sans typography. Navigation elements are minimal and calm. The design incorporates subtle geometric elements suggesting traceability and review — audit-trail lines, modular panels with softened corners, checkpoint markers. Color palette: Deep Graphite, Slate (#405261), Mist (#E9EEF2) backgrounds, with measured Steel Blue (#4E6E8A) accents. The overall aesthetic is sophisticated infrastructure software — precise, calm, credibly magnetic. Graceful curves within geometric containment. No cyberpunk, no neon, no glowing brains, no chaos. The thin magic: visual craft so refined it invites understanding. Professional UI mockup, clean presentation.`,
    stylePreset: "MINIMAL_ILLUSTRATION",
    size: "landscape_16_9"
  },
  {
    id: "r4-app-social-media",
    name: "Social Media Assets",
    prompt: `Social media profile assets for "Allura Memory" featuring a structured, minimal aesthetic. Profile image: mark-only Trace Frame icon in Deep Graphite (#1C232B) on white, designed at 512x512px scale with graceful proportions that feel magnetic. Header/banner: structured composition with strong alignment, generous negative space, the tagline "Memory That Shows Its Work" in IBM Plex Sans Bold. Background incorporates subtle modular panels, audit-trail lines, and checkpoint markers with softened geometric corners. Color palette: Deep Graphite, Slate, Steel Blue accent, all on clean white. The design feels like knowledge under control — precise, calm, inviting. No decorative chaos, no cyberpunk, no lifestyle imagery. The Lover archetype enters through refined proportions and sensory elegance — craft so well-resolved it invites closer inspection. Professional social media asset mockup.`,
    stylePreset: "MINIMAL_ILLUSTRATION",
    size: "landscape_16_9"
  },
  {
    id: "r4-app-presentation",
    name: "Presentation Template",
    prompt: `A presentation template design for "Allura Memory" featuring the primary horizontal logo on a clean title slide. The design incorporates the brand's geometric system — modular panels, audit-trail lines, checkpoint markers with softened corners suggesting the Lover's graceful touch. Color palette: Deep Graphite (#1C232B), Slate (#405261), Steel Blue (#4E6E8A) for structure, Amber Ochre (#B8893C) for decision points only. Typography: IBM Plex Sans Bold for headlines, Medium for subheads. The overall feel is architectural, teachable, controlled — the thin magic of craft that invites understanding. Multiple slide layouts shown: title slide, content slide with panel system, section divider with reversed colors. Professional presentation mockup, clean and minimal.`,
    stylePreset: "EDITORIAL",
    size: "landscape_16_9"
  },
  {
    id: "r4-system-patterns",
    name: "Pattern Library",
    prompt: `A pattern library exploration for "Allura Memory" featuring the brand's geometric vocabulary. Modular cards with softened corners, audit-trail line systems, checkpoint markers, decision-state highlights using Amber Ochre (#B8893C). The patterns show subtle layering suggesting memory states — raw records, promoted knowledge, reviewed context. Color palette: Deep Graphite (#1C232B), Slate (#405261), Mist (#E9EEF2), Steel Blue (#4E6E8A). The design feels structured yet graceful — the Lover's touch visible in curved intersections and refined proportions. No decorative chaos, no neon effects, no cyberpunk. The thin magic: visual craft so well-resolved it borders on enchanting. Grid-aligned, clean, architectural. Pattern swatches arranged in a professional design system presentation.`,
    stylePreset: "GEO_MINIMALIST",
    size: "square_hd"
  }
];

/**
 * Execute a single prompt
 */
async function executePrompt(promptConfig, index) {
  console.log(`\n🎨 Generating [${index + 1}/${PROMPTS.length}]: ${promptConfig.name}`);
  console.log(`   ID: ${promptConfig.id}`);
  console.log(`   Style: ${promptConfig.stylePreset} | Size: ${promptConfig.size}`);

  try {
    const { request_id } = await fal.queue.submit(CONFIG.model, {
      input: {
        prompt: promptConfig.prompt,
        style_preset: promptConfig.stylePreset,
        rendering_speed: CONFIG.renderingSpeed,
        expand_prompt: CONFIG.expandPrompt,
        num_images: CONFIG.numImages,
        image_size: promptConfig.size || CONFIG.defaultSize
      }
    });

    console.log(`   ✓ Submitted (Request ID: ${request_id})`);

    // Poll for completion
    let status;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max at 5-second intervals

    do {
      await new Promise(r => setTimeout(r, 5000));
      status = await fal.queue.status(CONFIG.model, { requestId: request_id });
      attempts++;
      process.stdout.write(`   ⏳ Status: ${status.status} (${attempts}s)\r`);
    } while (status.status !== "COMPLETED" && attempts < maxAttempts);

    if (status.status !== "COMPLETED") {
      throw new Error("Generation timed out");
    }

    // Fetch result
    const result = await fal.queue.result(CONFIG.model, { requestId: request_id });
    const imageUrl = result.data.images[0].url;

    console.log(`   ✓ Complete!`);
    console.log(`   📸 ${imageUrl}`);

    // Save metadata
    const metadata = {
      id: promptConfig.id,
      name: promptConfig.name,
      prompt: promptConfig.prompt,
      requestId: request_id,
      imageUrl: imageUrl,
      seed: result.data.seed,
      timestamp: new Date().toISOString(),
      model: CONFIG.model,
      strategy: "Sage60/Lover25/Ruler15",
      round: 4
    };

    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    await fs.writeFile(
      path.join(CONFIG.outputDir, `${promptConfig.id}-metadata.json`),
      JSON.stringify(metadata, null, 2)
    );

    return { success: true, url: imageUrl, metadata };

  } catch (error) {
    console.error(`   ✗ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   Allura Memory Round 4: Ideogram V3 Generation          ║");
  console.log("║   Strategy: Sage60/Lover25/Ruler15 (Tuned)                 ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log(`\nOutput directory: ${CONFIG.outputDir}`);
  console.log(`Rendering speed: ${CONFIG.renderingSpeed}`);
  console.log(`Total prompts: ${PROMPTS.length}`);

  const results = [];

  for (let i = 0; i < PROMPTS.length; i++) {
    const result = await executePrompt(PROMPTS[i], i);
    results.push(result);

    // Brief pause between requests
    if (i < PROMPTS.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Summary
  console.log("\n═════════════════════════════════════════════════════════════");
  console.log("                         SUMMARY                             ");
  console.log("═════════════════════════════════════════════════════════════");

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\n✓ Successful: ${successful.length}/${PROMPTS.length}`);
  console.log(`✗ Failed: ${failed.length}/${PROMPTS.length}`);

  if (successful.length > 0) {
    console.log("\nGenerated images:");
    successful.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.url}`);
    });
  }

  console.log("\n✨ Round 4 Complete — Review outputs for Lover archetype embodiment");
}

main().catch(console.error);
