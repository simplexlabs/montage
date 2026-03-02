---
name: simplex-reference
description: "Reference for the Simplex browser automation CLI. Use when the user mentions Simplex, simplex CLI, simplex editor, browser automation workflows, or wants to create/run/stream browser sessions. Also use when you see simplex commands or SIMPLEX_API_KEY."
allowed-tools: Bash, Read, Grep, Glob
---

# Simplex CLI Reference

Simplex is a browser automation platform. Users define workflows (name + URL + optional variables), then run them as browser sessions controlled by an AI agent. The CLI lets you create workflows, start sessions, poll for events, and send messages to the agent.

## Installation

```bash
pip install simplex
```

This installs the `simplex` CLI command.

## Authentication

```bash
# Option 1: Environment variable
export SIMPLEX_API_KEY="your-api-key"

# Option 2: Login command — opens browser (saves to ~/.simplex/credentials)
simplex login

# Option 3: Direct API key (for CI/headless)
simplex login --api-key sk-...
```

To point at a different environment:
```bash
export SIMPLEX_BASE_URL="https://your-custom-api-url.example.com"
```

## CLI Commands

### `simplex editor` — Create a workflow and start an interactive editor session

```bash
simplex editor --name "My Workflow" --url "https://example.com"
simplex editor -n "Test" -u "https://example.com" --vars '{"email":"a@b.com","name":"Test"}'
simplex editor -n "Test" -u "https://example.com" --vars data.json
simplex editor --name "Test" --url "https://example.com" --json
```

| Flag | Short | Required | Description |
|------|-------|----------|-------------|
| `--name` | `-n` | Yes | Workflow name |
| `--url` | `-u` | Yes | Starting URL |
| `--vars` | | No | Variables as inline JSON string or path to a .json file |
| `--json` | | No | Output session info as JSON (for programmatic use) |

Creates a workflow and starts a browser session. Returns immediately with workflow ID, session ID, VNC URL, and logs URL.

### `simplex send` — Send a message to a running session

```bash
simplex send <workflow_id> "Click the login button"
simplex send <workflow_id> "Fill in the email"
```

| Argument | Description |
|----------|-------------|
| `workflow_id` | **Required.** Workflow ID |
| `message` | **Required.** Message to send to the browser agent |

Looks up the active session for the workflow and sends the message to the browser agent.

### `simplex interrupt` — Interrupt a running editor session

```bash
simplex interrupt <workflow_id>
```

Takes a workflow ID, looks up the active session, and sends an interrupt signal to the agent.

### `simplex run` — Run an existing workflow

```bash
simplex run <workflow_id>
simplex run <workflow_id> --vars '{"email":"test@test.com","zip":"91711"}' --watch
simplex run <workflow_id> --vars variables.json --watch
```

| Flag | Short | Description |
|------|-------|-------------|
| `--vars` | | Variables as inline JSON string or path to a .json file |
| `--metadata` | `-m` | Metadata string |
| `--webhook-url` | | Webhook URL for status updates |
| `--watch` | `-w` | Poll until completion |

### `simplex pause` / `simplex resume`

```bash
simplex pause <workflow_id>
simplex resume <workflow_id>
```

### `simplex workflows list`

```bash
simplex workflows list                       # List all workflows
simplex workflows list --name "search term"  # Filter by name
simplex workflows list --metadata "filter"   # Filter by metadata
```

### `simplex workflows vars` — Show variable schema for a workflow

```bash
simplex workflows vars <workflow_id>
simplex workflows vars <workflow_id> --json
```

Displays a table of the workflow's variable definitions including name, type, whether it's required, default value, and allowed enum values.

### `simplex workflows outputs` — View structured output schema

```bash
simplex workflows outputs <workflow_id>
simplex workflows outputs <workflow_id> --json
```

Displays the structured output fields defined for a workflow — name, type, and description.

### `simplex workflows set-outputs` — Set structured output schema

```bash
# Add fields inline
simplex workflows set-outputs <workflow_id> --field title:string --field price:number

# With descriptions (name:type:description)
simplex workflows set-outputs <workflow_id> \
  --field "company_name:string:Name of the company" \
  --field "revenue:number:Annual revenue in USD" \
  --field "is_public:boolean:Whether publicly traded"

# Enum type (name:enum:value1,value2,value3)
simplex workflows set-outputs <workflow_id> \
  --field "status:enum:pending,active,closed" \
  --field "category:enum:tech,healthcare,finance"

# From a JSON file
simplex workflows set-outputs <workflow_id> --file schema.json

# Clear all outputs
simplex workflows set-outputs <workflow_id> --clear
```

| Flag | Short | Description |
|------|-------|-------------|
| `--field` | `-f` | Field as `name:type` or `name:type:description`. Repeatable. For enum: `name:enum:val1,val2` |
| `--file` | | Path to a JSON file containing the schema array |
| `--clear` | | Remove all structured outputs |
| `--json` | | Output raw JSON response |

**Supported types:** `string`, `number`, `boolean`, `array`, `object`, `enum`

**JSON file format** (same schema as the API):
```json
[
  {"name": "company_name", "type": "string", "description": "Name of the company"},
  {"name": "revenue", "type": "number", "description": "Annual revenue in USD"},
  {"name": "is_public", "type": "boolean"},
  {"name": "status", "type": "enum", "enumValues": ["pending", "active", "closed"]},
  {"name": "tags", "type": "array"},
  {"name": "address", "type": "object"}
]
```

### `simplex workflows set-vars` — Set variable schema for a workflow

```bash
# Add fields inline (use ! after the name for required)
simplex workflows set-vars <workflow_id> --field email!:string --field limit:number

# With descriptions (name:type:description)
simplex workflows set-vars <workflow_id> \
  --field "query!:string:Search query to use" \
  --field "max_results:number:Maximum results to return"

# Enum type (name:enum:value1,value2,value3)
simplex workflows set-vars <workflow_id> \
  --field "region:enum:us,eu,asia"

# From a JSON file
simplex workflows set-vars <workflow_id> --file vars_schema.json

# Clear all variables
simplex workflows set-vars <workflow_id> --clear
```

| Flag | Short | Description |
|------|-------|-------------|
| `--field` | `-f` | Variable as `name:type` or `name!:type` (required). Repeatable. For enum: `name:enum:val1,val2` |
| `--file` | | Path to a JSON file containing the variable schema array |
| `--clear` | | Remove all variables |
| `--json` | | Output raw JSON response |

**Supported types:** `string`, `number`, `boolean`, `array`, `object`, `enum`

Append `!` to the variable name to mark it as required (e.g. `email!:string`).

### `simplex workflows update` — Update a workflow's metadata

```bash
simplex workflows update <workflow_id> --metadata "new-value"
```

### `simplex sessions status` — Check session status

```bash
simplex sessions status <session_id>
simplex sessions status <session_id> --watch      # Poll until session completes
```

| Flag | Short | Description |
|------|-------|-------------|
| `--watch` | `-w` | Poll every 2s until the session finishes (shows spinner) |

Returns: In Progress, Success, Paused, Final Message, Outputs, Structured Output.

### `simplex sessions events` — Poll events for a workflow

```bash
simplex sessions events <workflow_id>
simplex sessions events <workflow_id> --since 47
simplex sessions events <workflow_id> --since 0 --limit 20 --json
```

| Flag | Short | Description |
|------|-------|-------------|
| `--since` | `-s` | Event index to start from (default 0). Use `next_index` from previous call. |
| `--limit` | `-l` | Max events to return (default 100) |
| `--json` | | Output raw JSON (for programmatic use) |

Looks up the active session for the workflow and polls events via `poll_events()`. Returns rendered events plus `Next Index`, `Total`, and `Has More` metadata.

### `simplex sessions logs` / `download` / `replay`

```bash
simplex sessions logs <session_id>
simplex sessions download <session_id> --filename report.pdf --output ./report.pdf
simplex sessions download <session_id>                    # Downloads all files as zip
simplex sessions replay <session_id> --output replay.mp4
```

### `simplex login` / `whoami` / `logout`

```bash
simplex login                     # Opens browser for login (recommended)
simplex login --api-key sk-...    # Direct API key (for CI/headless)
simplex whoami                    # Shows current auth status
simplex logout                    # Removes saved credentials
```

Opens your browser to log in via your Simplex account. An API key is created
automatically and saved to `~/.simplex/credentials`. For headless environments
(CI, SSH), use `--api-key` to provide a key directly.

## Variable Input Formats

Variables are passed via `--vars` as inline JSON or a file path:

```bash
# Inline JSON — supports objects, arrays, numbers, booleans
simplex run <id> --vars '{"email":"test@test.com","count":5,"address":{"street":"742 Market St","city":"SF"}}'

# JSON file
simplex run <id> --vars my-variables.json
```

## Event Format

Events are dicts. The event type is in the `event` key:

| Event | Description | Key Fields |
|-------|-------------|------------|
| `RunStarted` | Agent started | `session_id` |
| `RunContent` | Agent text output | `content`, `content_type`, `session_id` |
| `ToolCallStarted` | Tool invocation | `tool` (object with `tool_name`, `tool_args`) |
| `ToolCallCompleted` | Tool result | `tool` (object with `content` result, `tool_call_error` bool) |
| `FlowPaused` | Session paused | `pause_key`, `pause_id`, `pause_type`, `prompt` |
| `FlowResumed` | Session resumed | `pause_key` |
| `AskUserQuestion` | Agent needs user input | `data.tool_use_id`, `data.questions[]` (see below) |
| `RunCompleted` | Agent finished | `content`, `session_id`, `metrics` (with `duration_ms`) |
| `RunError` | Error occurred | `content` (error message) |
| `NewMessage` | Message boundary | Internal, can be ignored |
| `AgentRunning` | Agent is active | `running`, `session_id` |

The `message_url` can be derived from `logs_url` by replacing `/stream` with `/message`.

### AskUserQuestion Event — Human-in-the-loop Bridge

When the browser agent needs user input, it emits an `AskUserQuestion` event. **When monitoring a Simplex session from Claude Code, you MUST bridge this to Claude Code's own `AskUserQuestion` tool so the user can respond interactively.**

#### Event format
```json
{
  "event": "AskUserQuestion",
  "data": {
    "tool_use_id": "toolu_01BuAY2hQm288WTZhfPqPEnn",
    "questions": [
      {
        "question": "Which form field did you mean?",
        "header": "Clarify",
        "options": [
          {"label": "Name field", "description": "The patient name input"},
          {"label": "DOB field", "description": "The date of birth input"}
        ],
        "multiSelect": false
      }
    ]
  }
}
```

#### How to handle in Claude Code

1. **Detect** the `AskUserQuestion` event in `simplex sessions events` JSON output.
2. **Call the `AskUserQuestion` tool** with the `questions` array directly from `data.questions`. The schema is identical — pass `questions` as-is.
3. **Read the user's answer** from the tool result. The answer object maps string question indices to the selected option label, e.g. `{"0": "Name field"}`.
4. **Send the answer back** via CLI:
   ```bash
   simplex send <workflow_id> '{"type":"ask_user_answer","tool_use_id":"...","answers":{"0":"Name field"}}'
   ```

#### Key details
- `questions` is an array (usually 1, max 4)
- Each question has 2-4 `options`
- `multiSelect: true` means multiple options can be selected (comma-separated labels)
- Answer keys are string indices (`"0"`, `"1"`) mapping to the selected option `label`
- Free-text answers work too — if the user picks "Other", send their raw text as the answer value

## How Claude Code Should Monitor Sessions

**ALWAYS use the CLI commands. Do NOT write Python scripts, use the Python SDK directly, or use `--watch` flags. Instead, call the CLI commands in a loop yourself.**

### Recommended flow

```bash
# 1. Start a session
simplex editor -n "My Flow" -u "https://example.com" --json
# Returns: {"session_id": "...", "workflow_id": "...", "logs_url": "...", ...}

# 2. Send instructions
simplex send <workflow_id> "Click the login button"

# 3. Poll for events (call repeatedly with --since to get new events)
simplex sessions events <workflow_id> --json
simplex sessions events <workflow_id> --since <next_index> --json

# 4. Check session status
simplex sessions status <session_id>

# 5. Interrupt if needed
simplex interrupt <workflow_id>
```

### Polling pattern for Claude Code

1. After starting a session or sending a message, call `simplex sessions events <workflow_id> --json` to get events
2. Parse the JSON output — save `next_index` for the next poll
3. Check for `RunCompleted` or `RunError` events to know when the session is done
4. If no terminal event yet, call `simplex sessions status <session_id>` to check `in_progress`
5. If still in progress, wait a few seconds then poll again with `--since <next_index>`
6. If an `AskUserQuestion` event appears, bridge it to the user via Claude Code's `AskUserQuestion` tool, then send the answer back with `simplex send`

### Important rules
- **Do NOT use `--watch`** — it blocks with a spinner and provides no event detail. Poll manually instead.
- **Do NOT write Python scripts** — use the CLI commands via Bash tool.
- **Use `simplex sessions events`** — it returns a batch of events and works well in Claude Code's request-response model. Poll repeatedly with `--since <next_index>` to stream progress.

## Common Patterns

### Start a session from the CLI, then interact
```bash
simplex editor -n "My Flow" -u "https://example.com"
# Returns immediately with workflow ID + link

simplex send <workflow_id> "Click the login button"       # Send a message
simplex interrupt <workflow_id>                   # Stop the agent
```

### Stream events from a session
```bash
simplex sessions events <workflow_id> --json              # Get events as JSON
simplex sessions events <workflow_id> --since 47 --json   # Get only new events
```

### Pass many variables via JSON file
```bash
cat > vars.json << 'EOF'
{
  "business_name": "Acme Plumbing",
  "zip_code": "94103",
  "email": "contact@acme.com",
  "annual_revenue": 500000
}
EOF
simplex run <workflow_id> --vars vars.json --watch
```

### Define structured outputs for a workflow
```bash
simplex workflows set-outputs <workflow_id> \
  --field "company_name:string:Name of the company" \
  --field "revenue:number:Annual revenue in USD" \
  --field "status:enum:pending,active,closed"

# Verify
simplex workflows outputs <workflow_id>
```

### Define variables for a workflow
```bash
simplex workflows set-vars <workflow_id> \
  --field "email!:string:User email address" \
  --field "zip_code!:string:ZIP code" \
  --field "plan:enum:basic,pro,enterprise"

# Verify
simplex workflows vars <workflow_id>
```

### Check what variables a workflow needs before running
```bash
simplex workflows vars <workflow_id>
```

### Get session URLs for programmatic use
```bash
simplex editor -n "Test" -u "https://example.com" --json
# Outputs: {"type": "SessionStarted", "session_id": "...", "workflow_id": "...", "logs_url": "...", ...}
```

### List all workflows
```bash
simplex workflows list
```
