# Advanced Elicitation

Push the LLM to reconsider, refine, and improve its recent output through structured critique methods.

## When to Use

- User asks for deeper critique or refinement of generated content
- User mentions a specific method: socratic, first principles, pre-mortem, red team, devil's advocate
- A skill invokes elicitation to deepen a section or artifact before finalizing
- Output feels shallow, generic, or insufficiently challenged

## How It Works

1. **Load method registry** from `./methods.csv` (50 methods across 10 categories)
2. **Analyze context**: content type, complexity, stakeholder needs, risk level, creative potential
3. **Smart-select 5 methods** that best match the context — balance foundational and specialized
4. **Present options** and let the user drive

## The Loop

```
Advanced Elicitation Options
Choose (1-5), [r] Reshuffle, [a] List All, or [x] Proceed:

1. [Method Name]
2. [Method Name]
3. [Method Name]
4. [Method Name]
5. [Method Name]
```

### User selects 1-5
- Execute the method against the current content
- Show the enhanced version with what the method revealed
- Ask: apply changes? (y/n)
- If yes, apply. If no, discard. Then re-present options.

### User selects `r` (Reshuffle)
- Pick 5 different methods, prioritizing diversity across categories
- Methods 1-2 should be the most contextually useful

### User selects `a` (List All)
- Show all 50 methods in a compact table with descriptions
- Allow selection by name or number

### User selects `x` (Proceed)
- Finalize the enhanced content
- Return to the invoking skill if called as a sub-process

### Direct feedback
- Apply the user's changes and re-offer choices

### Multiple numbers
- Execute methods in sequence on the content, then re-offer

## Integration Mode

When invoked from another skill:
1. Receive the current section/artifact content
2. Apply elicitation methods iteratively
3. Return enhanced version when user selects `x`
4. Enhanced content replaces the original in the parent skill's output

## Execution Guidelines

- Each method builds on previous enhancements (cumulative)
- Adapt method complexity to content needs
- Stay relevant — tie critique to the specific content being analyzed
- For multi-perspective methods, use Team RAM agents if roundtable is available
- Always re-offer choices after each method until user proceeds
