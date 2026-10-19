#!/usr/bin/env python3
import json
import unittest
from validate_agent_frontmatter import validate_text


class AgentFrontmatterTests(unittest.TestCase):
    def valid(self, description='Example: "a quoted task"\n<example>\nuser: request\n</example>'):
        return '\n'.join(['---', 'name: reviewer', 'description: ' + json.dumps(description),
                          'model: inherit', 'color: blue', 'tools: ["Read"]', '---', '# Body'])

    def test_examples_are_a_scalar(self):
        self.assertEqual(validate_text(self.valid()), [])

    def test_rejects_original_unindented_example(self):
        original = self.valid().replace('model: inherit', 'Examples:\n<example>\nuser: request\n</example>\nmodel: inherit')
        self.assertTrue(validate_text(original))

    def test_rejects_plain_description_with_yaml_colon(self):
        self.assertTrue(validate_text(self.valid('x').replace('description: "x"', 'description: task: invalid')))

    def test_rejects_duplicate_metadata(self):
        self.assertTrue(validate_text(self.valid().replace('model: inherit', 'model: inherit\nmodel: override')))

    def test_rejects_wrong_type(self):
        self.assertTrue(validate_text(self.valid().replace('tools: ["Read"]', 'tools: "Read"')))


if __name__ == '__main__':
    unittest.main()
