---
name: figma-devtools-vision
description: 'Use Figma MCP to upload images and Chrome DevTools MCP to enable AI vision for design review. Trigger when uploading images to Figma for visual analysis, reviewing designs with AI vision, comparing screenshots against Figma designs, or validating visual implementations against design specs.'
argument-hint: 'What design or image do you want to upload and review?'
user-invocable: true
disable-model-invocation: false
---

# Figma + DevTools AI Vision Workflow

Combine Figma MCP for image upload/storage with Chrome DevTools MCP to give AI vision capabilities for comprehensive design review and validation.

## When to Use

- Upload local images to Figma for centralized design review
- Compare implemented UI against Figma design specs using AI vision
- Validate visual designs with screenshot analysis
- Review brand assets for consistency and quality
- Audit web pages against Figma design references
- Generate design feedback using AI-powered visual analysis

## Prerequisites

1. **Figma MCP Server** configured and connected
2. **Chrome DevTools MCP Server** configured and connected
3. Valid Figma file key and node ID (for design comparison)
4. Local image files or running web server for screenshots

## Workflow

### Phase 1: Prepare the Target

**Option A: Upload Local Image to Figma**
1. Identify the local image file path
2. Use Figma MCP to upload the image to a designated Figma file
3. Note the returned node ID for the uploaded image

**Option B: Capture Web Page Screenshot**
1. Ensure the web server is running (e.g., `localhost:3000`)
2. Use Chrome DevTools MCP to navigate to the page
3. Take a screenshot using DevTools MCP

### Phase 2: AI Vision Review

1. **Activate Chrome DevTools MCP** for vision capabilities
2. **Navigate** to the Figma design URL or captured screenshot
3. **Analyze** using AI vision:
   - Visual hierarchy and layout
   - Color accuracy and consistency
   - Typography and spacing
   - Component alignment
   - Brand guideline adherence

### Phase 3: Generate Review Report

Document findings including:
- Matches: Elements that align with design specs
- Deviations: Differences from the reference design
- Recommendations: Specific fixes needed
- Confidence Score: Overall alignment rating

## Tool Reference

### Figma MCP Tools
- `mcp_com_figma_mcp_use_figma` - Execute Figma Plugin API operations
- `mcp_com_figma_mcp_get_design_context` - Read design context from Figma
- `mcp_com_figma_mcp_get_screenshot` - Capture Figma node screenshots

### Chrome DevTools MCP Tools
- `mcp_chrome-devtoo_navigate_page` - Navigate to URLs
- `mcp_chrome-devtoo_take_screenshot` - Capture page screenshots
- `mcp_chrome-devtoo_emulate` - Emulate devices/viewports
- `mcp_chrome-devtoo_evaluate_script` - Execute JavaScript for interaction

## Example Usage

### Example 1: Upload and Review Brand Logo

```
User: "Review our new logo against brand guidelines"

1. Upload logo to Figma:
   - Use mcp_com_figma_mcp_use_figma to create image node
   - Upload ./assets/logos/new-logo.png

2. AI Vision Analysis:
   - Use mcp_chrome-devtoo_navigate_page to open Figma URL
   - Analyze visual properties (colors, proportions, clarity)

3. Generate report comparing against brand guidelines
```

### Example 2: Validate Web Implementation

```
User: "Check if my landing page matches the Figma design"

1. Capture implementation:
   - mcp_chrome-devtoo_navigate_page to localhost:3000
   - mcp_chrome-devtoo_take_screenshot (full page)

2. Get Figma reference:
   - mcp_com_figma_mcp_get_screenshot of design node

3. Side-by-side AI vision comparison
   - Layout alignment
   - Color accuracy
   - Typography matching
   - Spacing consistency
```

## Decision Flow

```
What do you want to review?
├── Local image file → Upload to Figma first → Then AI vision review
├── Web page → Screenshot via DevTools → Compare to Figma design
└── Figma design → Screenshot via Figma MCP → AI vision analysis
```

## Quality Criteria

- [ ] Image uploaded successfully to Figma (if applicable)
- [ ] Screenshot captured at correct viewport size
- [ ] AI vision analysis covers all key visual elements
- [ ] Comparison report identifies specific deviations
- [ ] Recommendations are actionable and specific

## Common Patterns

### Pattern: Design QA Workflow
1. Get Figma design screenshot (`mcp_com_figma_mcp_get_screenshot`)
2. Capture implemented page (`mcp_chrome-devtoo_take_screenshot`)
3. Compare using AI vision analysis
4. Document discrepancies with specific coordinates/sizes

### Pattern: Asset Upload and Review
1. Upload image to Figma (`mcp_com_figma_mcp_use_figma`)
2. Organize in appropriate frame/page
3. Use DevTools to view and analyze
4. Provide feedback on visual quality

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Figma upload fails | Check file permissions and Figma MCP connection |
| Screenshot blank | Ensure page is fully loaded before capture |
| DevTools navigation error | Verify URL is accessible and server is running |
| Vision analysis incomplete | Increase viewport size or take multiple screenshots |

## Related Skills

- `figma-use` - For direct Figma manipulation
- `figma-implement-design` - For translating Figma to code
- `figma-generate-design` - For creating designs from code
