# Docker MCP Catalog Reference

## Popular MCP Servers by Category

### Databases & Storage

#### Neo4j (neo4j-cypher)
- **Publisher**: neo4j
- **Description**: Official Neo4j MCP server for graph database operations using Cypher queries
- **Tools**: read_neo4j_cypher, write_neo4j_cypher, get_neo4j_schema
- **Config**: url, username, password
- **Docker**: mcp/neo4j

#### PostgreSQL (postgres)
- **Publisher**: Various
- **Description**: PostgreSQL database connector with SQL query support
- **Tools**: query, execute
- **Config**: connection string or individual: host, port, database, user, password
- **Docker**: mcp/postgres

#### MongoDB (mongodb)
- **Publisher**: mongodb-js
- **Description**: MongoDB and MongoDB Atlas connector
- **Tools**: find, insert, update, delete, aggregate
- **Config**: connection_string
- **Docker**: mcp/mongodb

#### Redis (redis)
- **Publisher**: redis
- **Description**: Redis key-value store operations
- **Tools**: get, set, delete, list_keys
- **Config**: host, port, password
- **Docker**: mcp/redis

#### Elasticsearch (elasticsearch)
- **Publisher**: elastic
- **Description**: Elasticsearch search and indexing
- **Tools**: search, index, get_mapping
- **Config**: host, port, username, password
- **Docker**: mcp/elasticsearch

#### Couchbase (couchbase)
- **Publisher**: Couchbase-Ecosystem
- **Description**: Distributed document database with search engine
- **Tools**: query, insert, update, delete
- **Config**: connection_string

### Web & Search

#### Tavily (tavily)
- **Publisher**: tavily
- **Description**: Web search and content extraction
- **Tools**: search, extract
- **Config**: api_token
- **Docker**: mcp/tavily

#### Brave Search (brave)
- **Publisher**: brave
- **Description**: Brave Search API for web pages, images, news, videos
- **Tools**: search, news_search, image_search
- **Config**: api_key

#### Playwright (playwright)
- **Publisher**: microsoft
- **Description**: Browser automation and testing
- **Tools**: navigate, click, fill, screenshot, evaluate
- **Config**: None required
- **Docker**: mcp/playwright

#### Firecrawl (firecrawl)
- **Publisher**: mendableai
- **Description**: Web scraping and crawling
- **Tools**: crawl, scrape, map
- **Config**: api_key

#### Bright Data (bright-data)
- **Publisher**: docker
- **Description**: Web scraping without getting blocked
- **Tools**: scrape, crawl, extract
- **Config**: api_key

### Developer Tools

#### GitHub Official (github-official)
- **Publisher**: github
- **Description**: Official GitHub API integration
- **Tools**: create_issue, list_issues, search_code, create_pull_request
- **Config**: personal_access_token
- **Docker**: mcp/github

#### Filesystem (filesystem)
- **Publisher**: Various
- **Description**: Local file system access
- **Tools**: read_file, write_file, list_directory, search_files
- **Config**: paths (array of allowed directories)
- **Docker**: mcp/filesystem

#### Docker (docker)
- **Publisher**: docker
- **Description**: Docker Hub and container operations
- **Tools**: list_containers, list_images, search_images
- **Config**: None (uses Docker socket)
- **Docker**: mcp/docker

#### Context7 (context7)
- **Publisher**: upstash
- **Description**: Code documentation for LLMs
- **Tools**: search_docs, get_doc
- **Config**: None

#### Desktop Commander (desktop-commander)
- **Publisher**: wonderwhy-er
- **Description**: File and terminal management
- **Tools**: list_files, read_file, run_command
- **Config**: allowed_paths

### Cloud & Infrastructure

#### AWS Core (aws-core)
- **Publisher**: awslabs
- **Description**: AWS services starting point
- **Tools**: Various by service
- **Config**: aws_access_key_id, aws_secret_access_key, region

#### Azure (azure)
- **Publisher**: microsoft
- **Description**: Microsoft Azure services
- **Tools**: List blobs, manage resources
- **Config**: subscription_id, client_id, client_secret, tenant_id

#### Heroku (heroku)
- **Publisher**: heroku
- **Description**: Heroku platform deployment
- **Tools**: list_apps, create_app, deploy
- **Config**: api_key

### Productivity & Collaboration

#### Notion (notion)
- **Publisher**: makenotion
- **Description**: Notion workspace management
- **Tools**: query_database, create_page, update_page
- **Config**: integration_token
- **Docker**: mcp/notion

#### Slack (slack)
- **Publisher**: slack
- **Description**: Slack workspace operations
- **Tools**: post_message, list_channels, get_user_info
- **Config**: bot_token

#### Miro (miro)
- **Publisher**: miro
- **Description**: Miro board management
- **Tools**: create_board, add_widget, get_board_content
- **Config**: access_token

#### Excalidraw (excalidraw)
- **Publisher**: excalidraw
- **Description**: Hand-drawn style diagrams
- **Tools**: create_diagram, export_svg
- **Config**: None

#### Granola (granola)
- **Publisher**: granola
- **Description**: Meeting notes and conversations
- **Tools**: get_notes, search_notes
- **Config**: api_key

### Monitoring & Observability

#### Grafana (grafana)
- **Publisher**: grafana
- **Description**: Grafana dashboards and incidents
- **Tools**: create_incident, search_loki, get_dashboard
- **Config**: url, api_key

### Finance & Payments

#### Stripe (stripe)
- **Publisher**: stripe
- **Description**: Stripe payment operations
- **Tools**: create_customer, create_charge, list_subscriptions
- **Config**: api_key

#### Morningstar (morningstar)
- **Publisher**: docker
- **Description**: Investment research and market analysis
- **Tools**: get_research, search_securities
- **Config**: api_key

### Search & AI

#### Perplexity (perplexity)
- **Publisher**: perplexityai
- **Description**: Real-time web research
- **Tools**: search, ask
- **Config**: api_key

## Search Tips

### Finding Servers by Use Case

**Database Operations:**
```
mcp_find(query="neo4j postgres mysql mongodb redis elasticsearch")
```

**Web Scraping:**
```
mcp_find(query="playwright firecrawl bright-data browser puppeteer")
```

**Code Repositories:**
```
mcp_find(query="github gitlab bitbucket code repository")
```

**Productivity:**
```
mcp_find(query="notion slack teams miro excalidraw")
```

**Search APIs:**
```
mcp_find(query="tavily brave perplexity google search")
```

**Cloud Providers:**
```
mcp_find(query="aws azure gcp heroku vercel")
```

### Checking Server Capabilities

After finding a server, examine its details:
- **Tool count**: More tools = more capabilities
- **Publisher**: Official publishers (github, microsoft) are more reliable
- **Pull count**: Higher numbers indicate more usage/testing

## Docker Hub MCP Catalog URL

https://hub.docker.com/mcp/explore
