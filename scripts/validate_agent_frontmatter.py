#!/usr/bin/env python3
"""Check Durham's restricted YAML metadata format, not arbitrary YAML.

JSON-quoted descriptions keep examples, colons and quotes in a single YAML scalar.
Native `claude plugin validate .` remains the runtime compatibility check.
"""
import json
import re
from pathlib import Path


def validate_text(text: str) -> list[str]:
    errors = []
    parts = text.split('---\n', 2)
    if len(parts) != 3 or parts[0]:
        return ['missing bounded YAML frontmatter']
    fields = {}
    for line in parts[1].splitlines():
        if not line.strip():
            continue
        key, sep, value = line.partition(': ')
        if not sep or key not in {'name', 'description', 'model', 'color', 'tools'}:
            errors.append('metadata must use one supported key per line')
            continue
        if key in fields:
            errors.append(f'duplicate metadata key: {key}')
        fields[key] = value
    for key in ('name', 'description', 'model', 'color', 'tools'):
        if key not in fields:
            errors.append(f'missing metadata key: {key}')
    for key in ('description', 'tools'):
        try:
            value = json.loads(fields.get(key, ''))
            valid = (isinstance(value, str) and bool(value.strip())) if key == 'description' else (
                isinstance(value, list) and all(isinstance(tool, str) and tool for tool in value))
            if not valid:
                errors.append(f'invalid {key} value')
        except (ValueError, TypeError):
            errors.append(f'{key} must use a JSON value compatible with YAML')
    for key in ('name', 'model', 'color'):
        if not re.fullmatch(r'[a-z][a-z0-9-]*', fields.get(key, '')):
            errors.append(f'invalid plain scalar: {key}')
    return errors


def validate(root: Path) -> list[str]:
    return [f'{path.relative_to(root)}: {error}'
            for path in sorted((root / 'agents').glob('*.md'))
            for error in validate_text(path.read_text(encoding='utf-8'))]
