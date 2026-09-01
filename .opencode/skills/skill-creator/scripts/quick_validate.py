#!/usr/bin/env python3
"""
Quick validation for skill packages.
Validates SKILL.md frontmatter and structure.
"""

import re
from pathlib import Path


def validate_skill(skill_path):
    """
    Validate a skill folder structure and SKILL.md content.

    Args:
        skill_path: Path to the skill folder

    Returns:
        Tuple of (is_valid: bool, message: str)
    """
    skill_path = Path(skill_path).resolve()

    # Check folder exists
    if not skill_path.exists():
        return False, f"Skill folder not found: {skill_path}"

    if not skill_path.is_dir():
        return False, f"Path is not a directory: {skill_path}"

    # Check SKILL.md exists
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        return False, f"SKILL.md not found in {skill_path}"

    # Read and validate SKILL.md
    try:
        content = skill_md.read_text(encoding='utf-8')
    except Exception as e:
        return False, f"Error reading SKILL.md: {e}"

    # Check YAML frontmatter
    frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n'
    match = re.match(frontmatter_pattern, content, re.DOTALL)

    if not match:
        return False, "SKILL.md missing YAML frontmatter (must start with '---')"

    frontmatter = match.group(1)

    # Check required fields
    required_fields = ['name:', 'description:']
    for field in required_fields:
        if field not in frontmatter:
            return False, f"SKILL.md frontmatter missing required field: {field}"

    # Extract name and description for validation
    name_match = re.search(r'^name:\s*(.+)$', frontmatter, re.MULTILINE)
    desc_match = re.search(r'^description:\s*(.+)$', frontmatter, re.MULTILINE)

    if not name_match or not name_match.group(1).strip():
        return False, "SKILL.md frontmatter missing or empty 'name' field"

    if not desc_match or not desc_match.group(1).strip():
        return False, "SKILL.md frontmatter missing or empty 'description' field"

    name = name_match.group(1).strip()
    description = desc_match.group(1).strip()

    # Check name matches folder name (optional but recommended)
    if name != skill_path.name:
        return True, f"Skill '{name}' is valid (note: name '{name}' differs from folder '{skill_path.name}')"

    return True, f"Skill '{name}' is valid"


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python quick_validate.py <path/to/skill-folder>")
        sys.exit(1)

    skill_path = sys.argv[1]
    valid, message = validate_skill(skill_path)

    if valid:
        print(f"✅ {message}")
        sys.exit(0)
    else:
        print(f"❌ {message}")
        sys.exit(1)
