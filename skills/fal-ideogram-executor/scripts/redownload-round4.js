#!/usr/bin/env node
/**
 * Re-download Round 4 images from fal.ai using stored request IDs
 */

import { fal } from "@fal-ai/client";
import fs from "fs/promises";
import path from "path";

fal.config({
  credentials: process.env.FAL_API_KEY || process.env.FAL_KEY
});

const METADATA_DIR = "./clients/allura-memory/generated-images/round4";
const OUTPUT_DIR = "./clients/allura-memory/generated-images/round4";

async function reDownloadImage(metadataFile) {
  const metadataPath = path.join(METADATA_DIR, metadataFile);
  const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));

  console.log(`\n📥 Re-downloading: ${metadata.name}`);
  console.log(`   Request ID: ${metadata.requestId}`);

  try {
    // Try to fetch the result again
    const result = await fal.queue.result("fal-ai/ideogram/v3", {
      requestId: metadata.requestId
    });

    const imageUrl = result.data.images[0].url;
    console.log(`   ✓ Fresh URL: ${imageUrl}`);

    // Download the image
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    // Save with proper extension
    const outputFile = path.join(OUTPUT_DIR, `${metadata.id}.png`);
    await fs.writeFile(outputFile, Buffer.from(buffer));

    console.log(`   ✓ Saved: ${outputFile}`);

    // Update metadata with new URL
    metadata.imageUrl = imageUrl;
    metadata.redownloadedAt = new Date().toISOString();
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return { success: true, file: outputFile };

  } catch (error) {
    console.error(`   ✗ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   Re-downloading Round 4 Images from fal.ai              ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  // Read all metadata files
  const files = await fs.readdir(METADATA_DIR);
  const metadataFiles = files.filter(f => f.endsWith('-metadata.json'));

  console.log(`Found ${metadataFiles.length} metadata files\n`);

  const results = [];
  for (const file of metadataFiles) {
    const result = await reDownloadImage(file);
    results.push(result);

    // Brief delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n═════════════════════════════════════════════════════════════");
  console.log("                         SUMMARY                             ");
  console.log("═════════════════════════════════════════════════════════════");

  const successful = results.filter(r => r.success);
  console.log(`\n✓ Downloaded: ${successful.length}/${metadataFiles.length}`);

  if (successful.length > 0) {
    console.log("\nSaved files:");
    successful.forEach(r => console.log(`  - ${r.file}`));
  }
}

main().catch(console.error);
