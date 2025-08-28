# WikiJS MCP Server

A Model Context Protocol (MCP) server that provides integration with WikiJS, allowing AI assistants to search and retrieve content from your WikiJS knowledge base.

## Overview

This MCP server enables AI assistants to interact with WikiJS instances by providing tools to:
- Search for pages by query string
- Retrieve pages by ID
- Retrieve pages by path and locale
- Get all pages from the wiki

## Configuration for Cursor
```json
{
  "mcpServers": {
    "wikijs-mcp": {
      "command": "npx",
        "args": [
            "wikijs-mcp"
        ],
        "env": {
            "WIKIJS_URL": <your wikijs url>,
            "WIKIJS_API_KEY": <your wikijs api key>
        }
    }
  }
}
```

## Getting a WikiJS API Key

1. Log into your WikiJS instance as an administrator
2. Go to **Administration** > **API Access**
3. Create a new API key with appropriate permissions
4. Copy the generated key to your `.env` file


## Development

1. Clone the repository:
```bash
git clone https://github.com/RicardoCenci/wikijs-mcp.git
cd wikijs-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment template and fill out its contents
```bash
cp env.example .env
```

4. Build the project
If you have `make` installed:
```bash
make build
```

5. Deploy the WikiJS instance for testing

```bash
docker compose up -d
```

## Usage

```bash
npx wikijs-mcp
```

## Environment Variables
| Variable                               | Description                                              | Required | Allowed Values         |Default                    |
|----------------------------------------|----------------------------------------------------------|----------|------------------------|---------------------------|
| `WIKIJS_URL`                           | URL of your WikiJS instance                              | Yes      | -                      | -                         |
| `WIKIJS_API_KEY`                       | WikiJS API key                                           | Yes      | -                      | -                         |
| `TRANSPORT_METHOD`                     | The transport method                                     | No       | stdio, streamable-http | stdio                     |
| `TRANSPORT_OPTIONS_CORS_ORIGIN`        | Cors Origin (only on streamable-http)                    | No       | -                      | *                         |
| `TRANSPORT_OPTIONS_CORS_HEADERS`       | Cors Headers, comma separated (only on streamable-http)  | No       | -                      |Content-Type=mcp-session-id|
| `TRANSPORT_OPTIONS_CORS_METHODS`       | Cors Methods, comma separated (only on streamable-http)  | No       | -                      |GET,POST,OPTIONS           | 
| `TRANSPORT_OPTIONS_SESSION_TIMEOUT_MS` | Session timeout (only on streamable-http)                | No       | -                      |60000                      |

## License
This project is licensed under the MIT License.