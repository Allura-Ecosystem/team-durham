#!/usr/bin/env node
/**
 * MCP Validation Gate Script
 *
 * Validates MCP server connectivity and tool availability
 * for the Team Durham brand production pipeline.
 *
 * Usage:
 *   node validate-mcp.js                    # Validate all required servers
 *   node validate-mcp.js --server fal-ai    # Validate specific server
 *   node validate-mcp.js --verbose          # Detailed output
 *   node validate-mcp.js --json             # JSON output for scripting
 */

const REQUIRED_SERVERS = {
  'fal-ai': {
    description: 'Image generation via fal.ai',
    critical: true,
    requiredTools: ['generate_image', 'get_generation_status']
  },
  'figma': {
    description: 'Figma design system integration',
    critical: true,
    requiredTools: ['use_figma', 'get_design_context', 'search_design_system']
  },
  'notion': {
    description: 'Notion documentation and publishing',
    critical: false,
    requiredTools: ['create_page', 'update_page', 'get_page']
  },
  'mcp-docker': {
    description: 'Database and memory system access',
    critical: true,
    requiredTools: ['query_database', 'execute_sql', 'insert_data']
  },
  'penpot': {
    description: 'Penpot UI/UX design system MCP',
    critical: false,
    requiredTools: ['execute_code', 'export_shape', 'import_image', 'penpot_api_info']
  },
  'allura-brain': {
    description: 'Allura Brain native memory MCP',
    critical: true,
    requiredTools: ['memory_search', 'memory_add', 'memory_get', 'memory_list']
  }
};

const PHASE_REQUIREMENTS = {
  'phase-0-intent': ['mcp-docker'],
  'phase-1-strategy': ['mcp-docker'],
  'phase-2-naming': ['mcp-docker'],
  'phase-3-visual': ['fal-ai', 'mcp-docker', 'penpot'],
  'phase-4-brand-kit': ['figma', 'notion', 'mcp-docker', 'penpot'],
  'phase-5-qa': ['mcp-docker', 'penpot'],
  'phase-6-memory': ['mcp-docker', 'allura-brain'],
  'phase-7-report': ['mcp-docker', 'notion']
};

class MCPValidationError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'MCPValidationError';
  }
}

class MCPValidator {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.jsonOutput = options.json || false;
    this.groupId = 'allura-team-durham';
    this.results = {
      timestamp: new Date().toISOString(),
      group_id: this.groupId,
      servers: {},
      overall: {
        passed: false,
        criticalPassed: false,
        totalChecked: 0,
        totalPassed: 0,
        totalFailed: 0
      }
    };
  }

  log(message, level = 'info') {
    if (this.jsonOutput) return;

    const prefix = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      debug: '🐛'
    }[level] || 'ℹ️';

    if (level === 'debug' && !this.verbose) return;

    console.log(`${prefix} ${message}`);
  }

  async validateServer(serverName) {
    this.log(`Validating server: ${serverName}`, 'debug');

    const result = {
      name: serverName,
      connected: false,
      tools: {},
      errors: [],
      latency_ms: null
    };

    const startTime = Date.now();

    try {
      // Check if server is available by attempting a lightweight operation
      // This uses the MCP_DOCKER server's introspection capability
      const healthCheck = await this.checkServerHealth(serverName);
      result.connected = healthCheck.available;
      result.latency_ms = Date.now() - startTime;

      if (!healthCheck.available) {
        result.errors.push(`Server '${serverName}' is not connected: ${healthCheck.error}`);
        return result;
      }

      this.log(`Server '${serverName}' is connected (${result.latency_ms}ms)`, 'success');

      // Validate required tools
      const serverConfig = REQUIRED_SERVERS[serverName];
      if (serverConfig && serverConfig.requiredTools) {
        for (const toolName of serverConfig.requiredTools) {
          const toolResult = await this.validateTool(serverName, toolName);
          result.tools[toolName] = toolResult;

          if (!toolResult.available) {
            result.errors.push(`Tool '${toolName}' unavailable: ${toolResult.error}`);
          }
        }
      }
    } catch (error) {
      result.errors.push(`Validation failed: ${error.message}`);
      result.latency_ms = Date.now() - startTime;
    }

    return result;
  }

  async checkServerHealth(serverName) {
    // Attempt to discover if the server exists by checking available tools
    // This is a lightweight check that doesn't require actual tool execution
    try {
      // In a real implementation, this would query the MCP session
      // For now, we simulate the check structure
      const availableTools = await this.discoverServerTools(serverName);

      return {
        available: availableTools.length > 0,
        tools: availableTools,
        error: availableTools.length > 0 ? null : 'No tools discovered'
      };
    } catch (error) {
      return {
        available: false,
        tools: [],
        error: error.message
      };
    }
  }

  async discoverServerTools(serverName) {
    // A gate that answers from a fixture is not a gate.
    //
    // This function previously returned a hardcoded manifest, so the validator
    // printed "✅ mcp-docker [CRITICAL]: CONNECTED" and exited 0 regardless of
    // what was actually reachable — including for two Cypher tools that resolved
    // nowhere after the RuVector cutover. phase-6-memory green-lit agents into a
    // tool that did not exist, wearing a passing test as cover.
    //
    // Discovery must now be injected by the caller that actually holds an MCP
    // session. With no channel, this throws and every server reports FAILED —
    // which is the truthful answer, not a convenient one.

    if (typeof this.toolDiscovery === 'function') {
      const tools = await this.toolDiscovery(serverName);
      return Array.isArray(tools) ? tools : [];
    }

    if (process.env.ALLURA_MCP_VALIDATE_ALLOW_FIXTURE === '1') {
      if (!this._fixtureWarned) {
        this._fixtureWarned = true;
        console.warn(
          '⚠️  ALLURA_MCP_VALIDATE_ALLOW_FIXTURE=1 — reporting from a static manifest, ' +
          'NOT from a live MCP session. Results are advisory and MUST NOT gate a phase.'
        );
      }
      return FALLBACK_TOOL_MANIFEST[serverName] || [];
    }

    throw new MCPValidationError(
      `No MCP discovery channel. Cannot verify tools on '${serverName}'. ` +
      'Inject a toolDiscovery(serverName) function from a caller holding a live MCP ' +
      'session, or set ALLURA_MCP_VALIDATE_ALLOW_FIXTURE=1 for advisory-only output.',
      'NO_DISCOVERY_CHANNEL',
      { server: serverName }
    );
  }

  async validateTool(serverName, toolName) {
    this.log(`  Checking tool: ${serverName}.${toolName}`, 'debug');

    const result = {
      name: toolName,
      available: false,
      schema: null,
      error: null
    };

    try {
      const tools = await this.discoverServerTools(serverName);
      result.available = tools.includes(toolName);

      if (result.available) {
        this.log(`  Tool '${toolName}' is available`, 'success');
      } else {
        result.error = `Tool not found in server '${serverName}'`;
        this.log(`  Tool '${toolName}' is NOT available`, 'error');
      }
    } catch (error) {
      result.error = error.message;
      this.log(`  Tool '${toolName}' check failed: ${error.message}`, 'error');
    }

    return result;
  }

  async validateAll() {
    this.log('Starting MCP validation gate...', 'info');
    this.log(`Group ID: ${this.groupId}`, 'debug');
    this.log(`Servers to check: ${Object.keys(REQUIRED_SERVERS).join(', ')}`, 'debug');

    let criticalPassed = true;
    let totalPassed = 0;
    let totalFailed = 0;

    for (const [serverName, config] of Object.entries(REQUIRED_SERVERS)) {
      const serverResult = await this.validateServer(serverName);
      this.results.servers[serverName] = serverResult;

      const serverPassed = serverResult.connected && serverResult.errors.length === 0;

      if (serverPassed) {
        totalPassed++;
      } else {
        totalFailed++;
        if (config.critical) {
          criticalPassed = false;
        }
      }
    }

    this.results.overall = {
      passed: totalFailed === 0,
      criticalPassed,
      totalChecked: Object.keys(REQUIRED_SERVERS).length,
      totalPassed,
      totalFailed
    };

    // Log to PostgreSQL if mcp-docker is available
    await this.logToDatabase();

    return this.results;
  }

  async validatePhase(phaseName) {
    const requiredServers = PHASE_REQUIREMENTS[phaseName];

    if (!requiredServers) {
      throw new MCPValidationError(
        `Unknown phase: ${phaseName}`,
        'UNKNOWN_PHASE',
        { knownPhases: Object.keys(PHASE_REQUIREMENTS) }
      );
    }

    this.log(`Validating phase: ${phaseName}`, 'info');
    this.log(`Required servers: ${requiredServers.join(', ')}`, 'debug');

    const results = {
      phase: phaseName,
      passed: true,
      servers: {},
      errors: []
    };

    for (const serverName of requiredServers) {
      const serverResult = await this.validateServer(serverName);
      results.servers[serverName] = serverResult;

      if (!serverResult.connected || serverResult.errors.length > 0) {
        results.passed = false;
        results.errors.push(...serverResult.errors);
      }
    }

    return results;
  }

  async logToDatabase() {
    try {
      // Check if mcp-docker is available for logging
      const dockerHealth = await this.checkServerHealth('mcp-docker');

      if (!dockerHealth.available) {
        this.log('Cannot log to database: mcp-docker unavailable', 'warning');
        return;
      }

      // In a real implementation, this would call MCP_DOCKER_insert_data
      // For now, we structure the log entry
      const logEntry = {
        event_type: 'MCP_VALIDATION',
        group_id: this.groupId,
        agent_id: 'mcp-validator',
        status: this.results.overall.passed ? 'PASSED' : 'FAILED',
        metadata: JSON.stringify({
          timestamp: this.results.timestamp,
          overall: this.results.overall,
          servers: Object.keys(this.results.servers).reduce((acc, name) => {
            acc[name] = {
              connected: this.results.servers[name].connected,
              errors: this.results.servers[name].errors
            };
            return acc;
          }, {})
        })
      };

      this.log('Validation results logged to PostgreSQL', 'debug');

      // Actual implementation would be:
      // await MCP_DOCKER_insert_data({
      //   table_name: "events",
      //   columns: "event_type, group_id, agent_id, status, metadata",
      //   values: `'${logEntry.event_type}', '${logEntry.group_id}', '${logEntry.agent_id}', '${logEntry.status}', '${logEntry.metadata}'`
      // });
    } catch (error) {
      this.log(`Failed to log to database: ${error.message}`, 'warning');
    }
  }

  printResults() {
    if (this.jsonOutput) {
      console.log(JSON.stringify(this.results, null, 2));
      return;
    }

    console.log('\n' + '='.repeat(60));
    console.log('MCP VALIDATION GATE RESULTS');
    console.log('='.repeat(60));
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log(`Group ID: ${this.results.group_id}`);
    console.log('');

    // Server details
    for (const [serverName, result] of Object.entries(this.results.servers)) {
      const status = result.connected ? '✅ CONNECTED' : '❌ FAILED';
      const config = REQUIRED_SERVERS[serverName];
      const critical = config?.critical ? ' [CRITICAL]' : '';

      console.log(`${serverName}${critical}: ${status}`);

      if (result.latency_ms) {
        console.log(`  Latency: ${result.latency_ms}ms`);
      }

      if (Object.keys(result.tools).length > 0) {
        console.log('  Tools:');
        for (const [toolName, toolResult] of Object.entries(result.tools)) {
          const toolStatus = toolResult.available ? '✅' : '❌';
          console.log(`    ${toolStatus} ${toolName}`);
        }
      }

      if (result.errors.length > 0) {
        console.log('  Errors:');
        result.errors.forEach(err => console.log(`    ❌ ${err}`));
      }
      console.log('');
    }

    // Overall summary
    console.log('-'.repeat(60));
    const overall = this.results.overall;
    const statusEmoji = overall.passed ? '✅' : overall.criticalPassed ? '⚠️' : '❌';
    console.log(`${statusEmoji} Overall: ${overall.passed ? 'PASSED' : overall.criticalPassed ? 'DEGRADED' : 'FAILED'}`);
    console.log(`   Critical services: ${overall.criticalPassed ? 'PASSED' : 'FAILED'}`);
    console.log(`   Servers: ${overall.totalPassed}/${overall.totalChecked} passed`);
    console.log('='.repeat(60) + '\n');
  }

  getExitCode() {
    if (this.results.overall.passed) return 0;
    if (this.results.overall.criticalPassed) return 1; // Degraded
    return 2; // Failed
  }
}

// Utility functions for integration
async function validateMCPServer(serverName, options = {}) {
  const validator = new MCPValidator(options);
  return await validator.validateServer(serverName);
}

async function validateMCPTool(serverName, toolName, options = {}) {
  const validator = new MCPValidator(options);
  return await validator.validateTool(serverName, toolName);
}

async function runValidationGate(config) {
  const validator = new MCPValidator(config.options || {});

  if (config.phase) {
    return await validator.validatePhase(config.phase);
  }

  return await validator.validateAll();
}

async function quickValidate(serverName, toolName, options = {}) {
  const validator = new MCPValidator({ ...options, verbose: false });
  const serverResult = await validator.validateServer(serverName);

  if (!serverResult.connected) {
    return {
      ready: false,
      error: `Server '${serverName}' not connected: ${serverResult.errors[0]}`,
      server: serverResult
    };
  }

  if (toolName) {
    const toolResult = serverResult.tools[toolName];
    if (!toolResult || !toolResult.available) {
      return {
        ready: false,
        error: `Tool '${toolName}' not available on server '${serverName}'`,
        server: serverResult
      };
    }
  }

  return {
    ready: true,
    error: null,
    server: serverResult
  };
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    json: args.includes('--json') || args.includes('-j')
  };

  const serverIndex = args.findIndex(arg => arg === '--server' || arg === '-s');
  const phaseIndex = args.findIndex(arg => arg === '--phase' || arg === '-p');

  const validator = new MCPValidator(options);
  let results;

  try {
    if (serverIndex !== -1 && args[serverIndex + 1]) {
      // Validate specific server
      const serverName = args[serverIndex + 1];
      results = {
        timestamp: new Date().toISOString(),
        group_id: validator.groupId,
        servers: { [serverName]: await validator.validateServer(serverName) },
        overall: { passed: false, checked: 1 }
      };
      results.overall.passed = results.servers[serverName].connected &&
                               results.servers[serverName].errors.length === 0;
    } else if (phaseIndex !== -1 && args[phaseIndex + 1]) {
      // Validate phase
      results = await validator.validatePhase(args[phaseIndex + 1]);
    } else {
      // Validate all
      results = await validator.validateAll();
    }

    validator.results = results;
    validator.printResults();
    process.exit(validator.getExitCode());
  } catch (error) {
    if (options.json) {
      console.log(JSON.stringify({
        error: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString()
      }, null, 2));
    } else {
      console.error('❌ Validation failed:', error.message);
      if (options.verbose && error.stack) {
        console.error(error.stack);
      }
    }
    process.exit(2);
  }
}

// Export for module usage
module.exports = {
  MCPValidator,
  MCPValidationError,
  validateMCPServer,
  validateMCPTool,
  runValidationGate,
  quickValidate,
  REQUIRED_SERVERS,
  PHASE_REQUIREMENTS
};

// Run if executed directly
if (require.main === module) {
  main();
}
