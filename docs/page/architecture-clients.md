# Client Management Architecture

This document details the client management subsystem of LSP Mode, which handles the lifecycle, discovery, and coordination of language server clients.

## Client Management Overview

```mermaid
graph TD
    A[Client Manager] --> B[Client Registry]
    A --> C[Server Discovery]
    A --> D[Lifecycle Manager]
    A --> E[Workspace Coordination]
    
    B --> F[Client Definitions]
    B --> G[Capability Mapping]
    B --> H[Priority Resolution]
    
    C --> I[File Type Detection]
    C --> J[Project Analysis]
    C --> K[Server Selection]
    
    D --> L[Server Startup]
    D --> M[Health Monitoring]
    D --> N[Graceful Shutdown]
    
    E --> O[Multi-root Workspaces]
    E --> P[Resource Sharing]
    E --> Q[Conflict Resolution]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#ffebee
```

## Client Registration System

### Client Definition Structure

```mermaid
classDiagram
    class LspClient {
        +String new-connection
        +Function activation-fn
        +String server-id
        +List major-modes
        +String language-id
        +Hash initialization-options
        +Function initialized-fn
        +List ignore-regexps
        +String remote
        +Function custom-settings
    }
    
    class ClientCapabilities {
        +Boolean textDocumentSync
        +Boolean completion
        +Boolean hover
        +Boolean signatureHelp
        +Boolean definition
        +Boolean references
        +Boolean documentSymbol
        +Boolean workspaceSymbol
        +Boolean codeAction
        +Boolean codeLens
        +Boolean documentFormatting
        +Boolean rename
    }
    
    class ConnectionConfig {
        +String type
        +List command
        +String host
        +Number port
        +Hash environment
        +String working-directory
    }
    
    LspClient --> ClientCapabilities
    LspClient --> ConnectionConfig
```

### Client Registration Flow

```mermaid
sequenceDiagram
    participant P as Package Loading
    participant R as Client Registry
    participant D as Discovery Engine
    participant M as Mode Handler
    
    P->>R: Register client definition
    R->>R: Validate client structure
    R->>R: Store in registry
    R->>D: Update discovery rules
    
    Note over P,M: File opened in Emacs
    
    M->>D: Find matching clients
    D->>R: Query registered clients
    R->>D: Return candidates
    D->>M: Best match client
    M->>R: Activate client
```

## Server Discovery and Selection

### Discovery Algorithm

```mermaid
graph TD
    A[File Opened] --> B[Extract Context]
    B --> C[Major Mode]
    B --> D[File Extension]
    B --> E[Project Type]
    B --> F[Directory Structure]
    
    G[Client Matching] --> H[Mode Match]
    G --> I[Pattern Match]
    G --> J[Custom Activation]
    
    H --> K[Score Calculation]
    I --> K
    J --> K
    
    K --> L[Priority Ranking]
    L --> M[Best Client Selection]
    
    M --> N{Multiple Candidates?}
    N -->|Yes| O[User Choice/Config]
    N -->|No| P[Auto Selection]
    
    O --> Q[Selected Client]
    P --> Q
    
    style A fill:#e3f2fd
    style G fill:#e8f5e8
    style K fill:#fff3e0
    style Q fill:#c8e6c9
```

### Multi-Client Coordination

```mermaid
graph LR
    A[Project Root] --> B[Primary Client]
    A --> C[Secondary Clients]
    A --> D[Specialized Clients]
    
    B --> E[TypeScript Server]
    C --> F[ESLint Server]
    C --> G[CSS Server]
    D --> H[Spell Checker]
    D --> I[Formatter]
    
    J[Capability Router] --> K[Route Completion]
    J --> L[Route Diagnostics]
    J --> M[Route Formatting]
    J --> N[Route Code Actions]
    
    K --> E
    L --> F
    M --> I
    N --> E
    N --> F
    
    style A fill:#bbdefb
    style B fill:#c8e6c9
    style C fill:#f8bbd9
    style D fill:#ffe0b2
    style J fill:#f3e5f5
```

## Server Lifecycle Management

### Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Registered
    Registered --> Activating: File opened
    Activating --> Starting: Prerequisites met
    Starting --> Initializing: Process started
    Initializing --> Ready: Handshake complete
    Ready --> Active: First request
    Active --> Busy: Processing request
    Busy --> Active: Request complete
    Active --> Idle: No recent activity
    Idle --> Active: New request
    Active --> Stopping: Workspace closed
    Stopping --> Stopped: Clean shutdown
    Stopped --> Registered: Resources cleaned
    
    Starting --> Failed: Startup error
    Initializing --> Failed: Handshake error
    Active --> Error: Runtime error
    Error --> Restarting: Auto-restart
    Restarting --> Starting: Restart initiated
    Failed --> Registered: Manual reset
    
    state Starting {
        [*] --> CheckPrereqs
        CheckPrereqs --> LaunchProcess: Requirements met
        CheckPrereqs --> InstallDeps: Missing dependencies
        InstallDeps --> LaunchProcess: Dependencies installed
        LaunchProcess --> [*]: Process running
    }
    
    state Active {
        [*] --> Processing
        Processing --> [*]
    }
```

### Health Monitoring

```mermaid
graph TD
    A[Health Monitor] --> B[Process Monitor]
    A --> C[Communication Monitor]
    A --> D[Performance Monitor]
    A --> E[Resource Monitor]
    
    B --> F[Process Alive Check]
    B --> G[Exit Code Monitoring]
    B --> H[Restart Detection]
    
    C --> I[Request Timeouts]
    C --> J[Response Validation]
    C --> K[Connection Health]
    
    D --> L[Response Times]
    D --> M[Queue Depths]
    D --> N[Throughput Metrics]
    
    E --> O[Memory Usage]
    E --> P[CPU Usage]
    E --> Q[File Handles]
    
    R[Alert System] --> S[Log Warnings]
    R --> T[Restart Triggers]
    R --> U[User Notifications]
    
    F --> R
    I --> R
    L --> R
    O --> R
    
    style A fill:#e1f5fe
    style R fill:#ffebee
```

## Workspace Management

### Multi-Root Workspace Handling

```mermaid
graph TD
    A[Workspace Manager] --> B[Root Detection]
    A --> C[Client Coordination]
    A --> D[Resource Sharing]
    
    B --> E[Git Repositories]
    B --> F[Project Files]
    B --> G[Config Detection]
    
    C --> H[Per-Root Clients]
    C --> I[Shared Clients]
    C --> J[Client Isolation]
    
    D --> K[File Watchers]
    D --> L[Symbol Indexes]
    D --> M[Cache Management]
    
    N[Multi-Root Example] --> O[frontend/]
    N --> P[backend/]
    N --> Q[docs/]
    
    O --> R[Node.js Client]
    P --> S[Python Client]
    Q --> T[Markdown Client]
    
    U[Shared Services] --> V[Spell Check]
    U --> W[Git Integration]
    U --> X[File Search]
    
    style A fill:#bbdefb
    style N fill:#c8e6c9
    style U fill:#f8bbd9
```

### Resource Coordination

```mermaid
sequenceDiagram
    participant W as Workspace Manager
    participant C1 as Client 1
    participant C2 as Client 2
    participant R as Resource Pool
    
    W->>C1: Start client for workspace A
    C1->>R: Request file watcher
    R->>C1: Assign watcher instance
    
    W->>C2: Start client for workspace B
    C2->>R: Request file watcher
    R->>C2: Share existing watcher
    
    Note over W,R: Resource sharing optimization
    
    C1->>W: File change notification
    W->>W: Route to affected workspaces
    W->>C2: Propagate if relevant
```

## Client Configuration Management

### Configuration Sources

```mermaid
graph LR
    A[Configuration Sources] --> B[Default Values]
    A --> C[Package Settings]
    A --> D[User Customization]
    A --> E[Project Config]
    A --> F[Directory Locals]
    
    G[Configuration Merger] --> H[Precedence Rules]
    G --> I[Type Validation]
    G --> J[Change Detection]
    
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G
    
    G --> K[Final Configuration]
    K --> L[Client Initialization]
    K --> M[Runtime Updates]
    
    style A fill:#e3f2fd
    style G fill:#e8f5e8
    style K fill:#c8e6c9
```

### Dynamic Configuration Updates

```mermaid
sequenceDiagram
    participant U as User
    participant C as Configuration Manager
    participant S as Server
    participant R as Runtime
    
    U->>C: Change setting
    C->>C: Validate new value
    C->>S: workspace/didChangeConfiguration
    S->>R: Apply new configuration
    R->>C: Confirm update
    C->>U: Setting applied
    
    Note over U,R: Live configuration update
```

## Error Recovery and Resilience

### Failure Detection and Recovery

```mermaid
graph TD
    A[Failure Detection] --> B[Process Crash]
    A --> C[Communication Timeout]
    A --> D[Protocol Error]
    A --> E[Resource Exhaustion]
    
    F[Recovery Strategies] --> G[Immediate Restart]
    F --> H[Delayed Restart]
    F --> I[Alternative Client]
    F --> J[Degraded Mode]
    
    B --> G
    C --> H
    D --> I
    E --> J
    
    K[Recovery Policies] --> L[Max Restart Attempts]
    K --> M[Backoff Strategy]
    K --> N[User Notification]
    K --> O[Fallback Options]
    
    G --> K
    H --> K
    I --> K
    J --> K
    
    style A fill:#ffebee
    style F fill:#e8f5e8
    style K fill:#fff3e0
```

### Circuit Breaker Pattern

```mermaid
stateDiagram-v2
    [*] --> Closed
    Closed --> Open: Failure threshold reached
    Open --> HalfOpen: Timeout period elapsed
    HalfOpen --> Closed: Test request succeeds
    HalfOpen --> Open: Test request fails
    
    state Closed {
        [*] --> Normal
        Normal --> CountingFailures: Request failed
        CountingFailures --> Normal: Request succeeded
        CountingFailures --> [*]: Threshold reached
    }
    
    state Open {
        [*] --> Rejecting
        Rejecting --> [*]: Timeout period elapsed
    }
    
    state HalfOpen {
        [*] --> Testing
        Testing --> [*]: Test complete
    }
```

## Performance Optimization

### Client Pool Management

```mermaid
graph TD
    A[Client Pool] --> B[Hot Clients]
    A --> C[Warm Clients]
    A --> D[Cold Clients]
    
    B --> E[Actively Used]
    B --> F[Recently Used]
    
    C --> G[Initialized but Idle]
    C --> H[Pre-warmed]
    
    D --> I[Not Started]
    D --> J[Shutdown]
    
    K[Pool Policies] --> L[Max Pool Size]
    K --> M[Idle Timeout]
    K --> N[Preload Strategy]
    K --> O[Eviction Rules]
    
    style A fill:#bbdefb
    style B fill:#c8e6c9
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style K fill:#e1f5fe
```

This client management architecture ensures efficient coordination of multiple language servers while maintaining system stability and performance through sophisticated lifecycle management and error recovery mechanisms.