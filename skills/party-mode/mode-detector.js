// Party Mode — Mode Detector
// Detects whether user input should trigger Debate (roundtable) or Parallel (dispatch) mode

function detectMode(userInput) {
  const input = userInput.toLowerCase().trim();

  // Roundtable indicators (check first — questions override actions)
  const roundtablePatterns = [
    /\?/,                           // Questions
    /\b(vs|versus|or)\b/,           // Comparisons
    /\b(should|debate|discuss|argue|decide between|which|what about|how about)\b/,
    /\b(compare|difference|better|worse|prefer)\b/,
    /\b(why|when|who)\b/,
    /\bopinion|thoughts?|view|perspective\b/
  ];

  for (const pattern of roundtablePatterns) {
    if (pattern.test(input)) return 'roundtable';
  }

  // Parallel indicators
  const parallelPatterns = [
    /\b(build|create|generate|make|produce|write|edit|update|sync)\b/,
    /\b(audit|validate|check|review|test|verify)\b/,
    /\b(run|execute|perform|do|start|launch|implement)\b/,
    /\b(compile|assemble|construct|develop|deploy)\b/,
    /\band\b.*\b(and)\b/            // Multiple items
  ];

  for (const pattern of parallelPatterns) {
    if (pattern.test(input)) return 'parallel';
  }

  // Default: roundtable (safer for ambiguous input)
  return 'roundtable';
}

function shouldUseParallel(input) {
  return detectMode(input) === 'parallel';
}

function shouldUseRoundtable(input) {
  return detectMode(input) === 'roundtable';
}

module.exports = { detectMode, shouldUseParallel, shouldUseRoundtable };
