# LSP Protocol Layer Architecture

This document details the protocol layer architecture of LSP Mode, focusing on the JSON-RPC communication patterns and message handling mechanisms.

## Protocol Stack Overview

```mermaid
graph TD
    A[Application Layer] --> B[LSP Protocol Layer]
    B --> C[JSON-RPC Layer]
    C --> D[Transport Layer]
    D --> E[Process Communication]
    
    A --> F[lsp-mode APIs]
    A --> G[Client Implementations]
    
    B --> H[Message Routing]
    B --> I[Request/Response Handling]
    B --> J[Notification Processing]
    B --> K[Error Handling]
    
    C --> L[Message Serialization]
    C --> M[ID Management]
    C --> N[Content-Length Headers]
    
    D --> O[Stdio Transport]
    D --> P[TCP Transport]
    D --> Q[WebSocket Transport]
    
    E --> R[Language Server Process]
    
    style B fill:#e1f5fe
    style C fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fff3e0
```

## Message Flow Architecture

### Request-Response Pattern

```mermaid
sequenceDiagram
    participant C as Client
    participant M as Message Router
    participant S as Serializer
    participant T as Transport
    participant LS as Language Server
    
    C->>M: Request (method, params)
    M->>M: Generate unique ID
    M->>S: Serialize to JSON-RPC
    S->>T: Add Content-Length header
    T->>LS: Send over transport
    
    LS->>T: Response with ID
    T->>S: Parse Content-Length
    S->>M: Deserialize JSON-RPC
    M->>M: Match ID to pending request
    M->>C: Deliver response/error
    
    Note over C,LS: Asynchronous request-response cycle
```

### Notification Pattern

```mermaid
sequenceDiagram
    participant C as Client
    participant M as Message Router
    participant H as Notification Handler
    participant U as UI Components
    
    Note over C,U: Server-initiated notification
    
    C->>M: Incoming notification
    M->>H: Route by method name
    H->>H: Process notification data
    H->>U: Update UI components
    
    Note over C,U: Client-initiated notification
    
    U->>H: State change event
    H->>M: Create notification
    M->>C: Send to server (no response expected)
```

## Protocol Method Categories

### Document Synchronization

```mermaid
graph LR
    A[Document Sync] --> B[textDocument/didOpen]
    A --> C[textDocument/didChange]
    A --> D[textDocument/willSave]
    A --> E[textDocument/didSave]
    A --> F[textDocument/didClose]
    
    G[Workspace Sync] --> H[workspace/didChangeWatchedFiles]
    G --> I[workspace/didChangeConfiguration]
    G --> J[workspace/didChangeWorkspaceFolders]
    
    style A fill:#bbdefb
    style G fill:#c8e6c9
```

### Language Features

```mermaid
graph TD
    A[Language Features] --> B[Core Features]
    A --> C[Navigation Features]
    A --> D[Edit Features]
    A --> E[Information Features]
    
    B --> F[textDocument/completion]
    B --> G[textDocument/hover]
    B --> H[textDocument/signatureHelp]
    
    C --> I[textDocument/definition]
    C --> J[textDocument/references]
    C --> K[textDocument/implementation]
    C --> L[textDocument/typeDefinition]
    
    D --> M[textDocument/formatting]
    D --> N[textDocument/rangeFormatting]
    D --> O[textDocument/codeAction]
    D --> P[textDocument/rename]
    
    E --> Q[textDocument/documentSymbol]
    E --> R[textDocument/documentHighlight]
    E --> S[textDocument/codeLens]
    E --> T[textDocument/semanticTokens]
    
    style B fill:#e3f2fd
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#f3e5f5
```

## Transport Layer Implementation

### Stdio Transport

```mermaid
graph TD
    A[Stdio Transport] --> B[Process Management]
    A --> C[Stream Handling]
    A --> D[Message Framing]
    
    B --> E[Start Process]
    B --> F[Monitor Health]
    B --> G[Handle Exit]
    
    C --> H[Read stdout]
    C --> I[Write stdin]
    C --> J[Handle stderr]
    
    D --> K[Content-Length Parsing]
    D --> L[Message Assembly]
    D --> M[Buffer Management]
    
    style A fill:#bbdefb
    style B fill:#c8e6c9
    style C fill:#f8bbd9
    style D fill:#ffe0b2
```

### TCP Transport

```mermaid
graph TD
    A[TCP Transport] --> B[Connection Management]
    A --> C[Socket Handling]
    A --> D[Network Protocol]
    
    B --> E[Establish Connection]
    B --> F[Maintain Heartbeat]
    B --> G[Handle Reconnection]
    
    C --> H[Read Socket]
    C --> I[Write Socket]
    C --> J[Buffer I/O]
    
    D --> K[HTTP Upgrade]
    D --> L[WebSocket Protocol]
    D --> M[Custom Protocol]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
```

## Error Handling and Recovery

### Error Classification

```mermaid
graph TD
    A[Protocol Errors] --> B[Parse Errors]
    A --> C[Invalid Request]
    A --> D[Method Not Found]
    A --> E[Invalid Parameters]
    A --> F[Internal Error]
    
    G[Transport Errors] --> H[Connection Lost]
    G --> I[Process Crashed]
    G --> J[Network Timeout]
    G --> K[I/O Error]
    
    L[Application Errors] --> M[Server Not Started]
    L --> N[Workspace Not Initialized]
    L --> O[Feature Not Supported]
    L --> P[Rate Limit Exceeded]
    
    style A fill:#ffebee
    style G fill:#fff3e0
    style L fill:#f3e5f5
```

### Recovery Strategies

```mermaid
stateDiagram-v2
    [*] --> Normal
    Normal --> ErrorDetected: Error occurs
    ErrorDetected --> Analyzing: Classify error type
    
    Analyzing --> Retry: Transient error
    Analyzing --> Reconnect: Connection issue
    Analyzing --> Restart: Process crash
    Analyzing --> Fallback: Permanent failure
    
    Retry --> Normal: Success
    Retry --> Reconnect: Retry failed
    
    Reconnect --> Normal: Connection restored
    Reconnect --> Restart: Reconnection failed
    
    Restart --> Normal: Process restarted
    Restart --> Fallback: Restart failed
    
    Fallback --> Manual: User intervention needed
    Manual --> Normal: Issue resolved
    
    state Analyzing {
        [*] --> CheckConnection
        CheckConnection --> CheckProcess: Connection OK
        CheckConnection --> ConnectionError: Connection failed
        CheckProcess --> ProcessError: Process died
        CheckProcess --> LogicError: Process alive
    }
```

## Message Routing and Multiplexing

### Router Architecture

```mermaid
graph TD
    A[Message Router] --> B[Incoming Router]
    A --> C[Outgoing Router]
    A --> D[Method Registry]
    A --> E[Handler Registry]
    
    B --> F[Response Handler]
    B --> G[Notification Handler]
    B --> H[Error Handler]
    
    C --> I[Request Dispatcher]
    C --> J[Notification Dispatcher]
    
    D --> K[LSP Methods]
    D --> L[Extension Methods]
    D --> M[Custom Methods]
    
    E --> N[Core Handlers]
    E --> O[Plugin Handlers]
    E --> P[User Handlers]
    
    style A fill:#e1f5fe
    style B fill:#c8e6c9
    style C fill:#f8bbd9
    style D fill:#ffe0b2
    style E fill:#f3e5f5
```

### Request Multiplexing

```mermaid
sequenceDiagram
    participant A as Client A
    participant B as Client B
    participant R as Router
    participant S as Server
    
    A->>R: Request 1 (ID: 100)
    B->>R: Request 2 (ID: 200)
    R->>S: Request 1
    R->>S: Request 2
    
    S->>R: Response 2 (ID: 200)
    S->>R: Response 1 (ID: 100)
    
    R->>B: Response 2
    R->>A: Response 1
    
    Note over A,S: Concurrent request handling
```

## Performance Optimization Patterns

### Request Batching

```mermaid
graph TD
    A[Request Queue] --> B[Batch Collector]
    B --> C[Batch Optimizer]
    C --> D[Batch Sender]
    D --> E[Response Distributor]
    
    B --> F[Time Window]
    B --> G[Size Threshold]
    B --> H[Priority Sorting]
    
    C --> I[Duplicate Removal]
    C --> J[Request Merging]
    C --> K[Dependency Analysis]
    
    E --> L[Response Mapping]
    E --> M[Error Distribution]
    E --> N[Callback Execution]
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#ffebee
```

### Response Caching

```mermaid
graph LR
    A[Cache Manager] --> B[Memory Cache]
    A --> C[Persistent Cache]
    A --> D[Cache Policies]
    
    B --> E[LRU Eviction]
    B --> F[TTL Expiration]
    B --> G[Size Limits]
    
    C --> H[File System]
    C --> I[Database]
    C --> J[Serialization]
    
    D --> K[Invalidation Rules]
    D --> L[Update Strategies]
    D --> M[Consistency Checks]
    
    style A fill:#bbdefb
    style B fill:#c8e6c9
    style C fill:#f8bbd9
    style D fill:#ffe0b2
```

This protocol layer architecture enables efficient, reliable communication between LSP Mode and language servers while maintaining the flexibility to support diverse server implementations and transport mechanisms.