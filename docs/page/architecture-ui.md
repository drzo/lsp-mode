# UI Integration Architecture

This document details the user interface integration subsystem of LSP Mode, which handles the presentation layer and integration with Emacs UI components.

## UI Integration Overview

```mermaid
graph TD
    A[UI Integration Layer] --> B[Completion Interface]
    A --> C[Diagnostics Display]
    A --> D[Navigation Components]
    A --> E[Information Display]
    A --> F[Action Interfaces]
    
    B --> G[company-mode Integration]
    B --> H[completion-at-point]
    B --> I[Snippet Expansion]
    
    C --> J[Flycheck/Flymake Backend]
    C --> K[Modeline Indicators]
    C --> L[Overlay System]
    
    D --> M[xref Backend]
    D --> N[imenu Provider]
    D --> O[Navigation Commands]
    
    E --> P[eldoc Integration]
    E --> Q[which-key Integration]
    E --> R[Help System]
    
    F --> S[Code Actions Menu]
    F --> T[Quick Fix Interface]
    F --> U[Refactoring Tools]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#ffebee
    style F fill:#f3e5f5
```

## Completion Integration Architecture

### Company Mode Integration

```mermaid
graph TD
    A[company-mode] --> B[lsp-completion Backend]
    B --> C[LSP Server Request]
    C --> D[textDocument/completion]
    D --> E[Completion Items]
    E --> F[Item Processing]
    F --> G[Candidate Formatting]
    G --> H[Display in Popup]
    
    I[Completion Context] --> J[Trigger Characters]
    I --> K[Position Analysis]
    I --> L[Prefix Extraction]
    
    M[Additional Resolution] --> N[completionItem/resolve]
    M --> O[Documentation]
    M --> P[Additional Text Edits]
    
    Q[Snippet Integration] --> R[yasnippet Expansion]
    Q --> S[Template Processing]
    Q --> T[Placeholder Navigation]
    
    style A fill:#bbdefb
    style B fill:#c8e6c9
    style I fill:#f8bbd9
    style M fill:#ffe0b2
    style Q fill:#f3e5f5
```

### Completion Flow Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant E as Emacs
    participant C as Company
    participant L as LSP Backend
    participant S as Server
    
    U->>E: Type trigger character
    E->>C: company-auto-begin
    C->>L: company-lsp-candidates
    L->>S: textDocument/completion
    S->>L: completion response
    L->>L: Process completion items
    L->>C: Return candidates
    C->>E: Display completion popup
    
    U->>E: Select completion
    E->>C: company-finish
    C->>L: completion item selected
    L->>S: completionItem/resolve (if needed)
    S->>L: resolved item
    L->>E: Insert completion text
    L->>E: Apply additional text edits
    E->>U: Completion applied
```

### Completion Item Processing

```mermaid
graph LR
    A[Raw Completion Item] --> B[Label Processing]
    A --> C[Kind Mapping]
    A --> D[Detail Extraction]
    A --> E[Documentation Parsing]
    
    B --> F[Display Text]
    B --> G[Annotation]
    B --> H[Icon Selection]
    
    C --> I[Kind Icon]
    C --> J[Priority Weight]
    C --> K[Category Grouping]
    
    D --> L[Type Information]
    D --> M[Signature Details]
    
    E --> N[Markdown Rendering]
    E --> O[Popup Content]
    
    P[Final Candidate] --> Q[Display String]
    P --> R[Metadata]
    P --> S[Action Functions]
    
    F --> Q
    I --> Q
    L --> R
    N --> R
    
    style A fill:#e3f2fd
    style P fill:#c8e6c9
```

## Diagnostics Display System

### Multi-Backend Architecture

```mermaid
graph TD
    A[Diagnostics Engine] --> B[LSP Diagnostics Source]
    A --> C[Flycheck Backend]
    A --> D[Flymake Backend]
    A --> E[Custom Backends]
    
    B --> F[textDocument/publishDiagnostics]
    B --> G[Diagnostic Processing]
    B --> H[Severity Mapping]
    
    C --> I[flycheck-define-checker]
    C --> J[Error List Integration]
    C --> K[Modeline Integration]
    
    D --> L[flymake-diagnostic-functions]
    D --> M[Backend Registration]
    D --> N[Report Function]
    
    O[Display Components] --> P[Overlay System]
    O --> Q[Fringe Indicators]
    O --> R[Modeline Status]
    O --> S[Tooltip Display]
    
    style A fill:#e1f5fe
    style B fill:#ffebee
    style O fill:#e8f5e8
```

### Diagnostic Overlay Management

```mermaid
graph LR
    A[Diagnostic Event] --> B[Overlay Manager]
    B --> C[Clear Old Overlays]
    B --> D[Create New Overlays]
    
    D --> E[Error Overlays]
    D --> F[Warning Overlays]
    D --> G[Info Overlays]
    D --> H[Hint Overlays]
    
    E --> I[Red Underline]
    F --> J[Yellow Underline]
    G --> K[Blue Underline]
    H --> L[Gray Dots]
    
    M[Fringe Indicators] --> N[Error Icons]
    M --> O[Warning Icons]
    M --> P[Info Icons]
    
    Q[Modeline Update] --> R[Error Count]
    Q --> S[Warning Count]
    Q --> T[Status Color]
    
    style A fill:#ffebee
    style B fill:#e8f5e8
    style M fill:#fff3e0
    style Q fill:#f3e5f5
```

### Diagnostic Tooltip System

```mermaid
sequenceDiagram
    participant U as User
    participant E as Emacs
    participant O as Overlay System
    participant T as Tooltip Manager
    participant D as Diagnostic Store
    
    U->>E: Hover over error
    E->>O: Mouse/cursor event
    O->>T: Request tooltip
    T->>D: Get diagnostics for position
    D->>T: Return diagnostic data
    T->>T: Format tooltip content
    T->>E: Display tooltip
    E->>U: Show diagnostic message
    
    Note over U,D: Interactive diagnostic exploration
```

## Navigation and Information Display

### xref Backend Integration

```mermaid
graph TD
    A[xref System] --> B[LSP xref Backend]
    B --> C[Definition Lookup]
    B --> D[Reference Search]
    B --> E[Symbol Search]
    
    C --> F[textDocument/definition]
    C --> G[textDocument/typeDefinition]
    C --> H[textDocument/implementation]
    
    D --> I[textDocument/references]
    D --> J[Result Filtering]
    D --> K[Context Extraction]
    
    E --> L[workspace/symbol]
    E --> M[textDocument/documentSymbol]
    
    N[Result Display] --> O[xref Buffer]
    N --> P[Preview Windows]
    N --> Q[Navigation Commands]
    
    style A fill:#bbdefb
    style B fill:#c8e6c9
    style N fill:#f8bbd9
```

### Symbol Information Architecture

```mermaid
graph LR
    A[Symbol Request] --> B[Document Symbols]
    A --> C[Workspace Symbols]
    
    B --> D[Hierarchical Structure]
    B --> E[Scope Information]
    B --> F[Symbol Kinds]
    
    C --> G[Project-wide Search]
    C --> H[Symbol Ranking]
    C --> I[Fuzzy Matching]
    
    J[Display Components] --> K[imenu Integration]
    J --> L[which-function-mode]
    J --> M[Symbol Tree View]
    
    D --> K
    E --> L
    F --> M
    G --> M
    
    style A fill:#e3f2fd
    style J fill:#e8f5e8
```

## Code Actions and Quick Fixes

### Action Discovery and Presentation

```mermaid
graph TD
    A[Code Action Request] --> B[textDocument/codeAction]
    B --> C[Available Actions]
    C --> D[Action Categorization]
    
    D --> E[Quick Fixes]
    D --> F[Refactorings]
    D --> G[Source Actions]
    
    H[Action Interface] --> I[Context Menu]
    H --> J[Keyboard Shortcuts]
    H --> K[Modeline Indicators]
    
    I --> L[Right-click Menu]
    J --> M[lsp-execute-code-action]
    K --> N[Lightbulb Icon]
    
    O[Action Execution] --> P[Apply Edits]
    O --> Q[Execute Commands]
    O --> R[Show Choices]
    
    style A fill:#e1f5fe
    style D fill:#f3e5f5
    style H fill:#e8f5e8
    style O fill:#fff3e0
```

### Action Execution Flow

```mermaid
sequenceDiagram
    participant U as User
    participant E as Emacs
    participant A as Action Manager
    participant S as Server
    participant W as Workspace
    
    U->>E: Request code actions
    E->>A: Get available actions
    A->>S: textDocument/codeAction
    S->>A: Return action list
    A->>E: Present action menu
    E->>U: Display actions
    
    U->>E: Select action
    E->>A: Execute selected action
    A->>S: Apply workspace edits
    S->>W: Modify files
    W->>A: Confirm changes
    A->>E: Update buffers
    E->>U: Show results
```

## Modeline and Headerline Integration

### Modeline Components Architecture

```mermaid
graph TD
    A[Modeline Manager] --> B[LSP Status]
    A --> C[Server Status]
    A --> D[Diagnostic Counts]
    A --> E[Active Features]
    
    B --> F[Connection Indicator]
    B --> G[Mode Indicator]
    B --> H[Progress Indicator]
    
    C --> I[Server Name]
    C --> J[Health Status]
    C --> K[Performance Metrics]
    
    D --> L[Error Count]
    D --> M[Warning Count]
    D --> N[Total Issues]
    
    E --> O[Code Actions Available]
    E --> P[Completion Active]
    E --> Q[Lens Enabled]
    
    style A fill:#bbdefb
    style B fill:#c8e6c9
    style C fill:#f8bbd9
    style D fill:#ffe0b2
    style E fill:#f3e5f5
```

### Headerline Breadcrumb System

```mermaid
graph LR
    A[Breadcrumb Manager] --> B[Symbol Hierarchy]
    A --> C[File Path]
    A --> D[Namespace Chain]
    
    B --> E[Current Function]
    B --> F[Containing Class]
    B --> G[Module/Package]
    
    C --> H[Project Root]
    C --> I[Directory Path]
    C --> J[File Name]
    
    D --> K[Namespace Path]
    D --> L[Import Context]
    
    M[Display Logic] --> N[Truncation Rules]
    M --> O[Click Handlers]
    M --> P[Update Triggers]
    
    style A fill:#e1f5fe
    style M fill:#e8f5e8
```

## Lens and Semantic Token Display

### Code Lens Integration

```mermaid
graph TD
    A[Code Lens Manager] --> B[Lens Requests]
    A --> C[Lens Display]
    A --> D[Lens Actions]
    
    B --> E[textDocument/codeLens]
    B --> F[codeLens/resolve]
    B --> G[Refresh Triggers]
    
    C --> H[Overlay Creation]
    C --> I[Text Insertion]
    C --> J[Visual Styling]
    
    D --> K[Command Execution]
    D --> L[Quick Actions]
    D --> M[Navigation Links]
    
    N[Lens Types] --> O[Reference Counts]
    N --> P[Test Runners]
    N --> Q[Debug Launchers]
    N --> R[Implementation Links]
    
    style A fill:#bbdefb
    style B fill:#c8e6c9
    style C fill:#f8bbd9
    style D fill:#ffe0b2
    style N fill:#f3e5f5
```

### Semantic Token Highlighting

```mermaid
graph LR
    A[Semantic Tokens] --> B[Token Request]
    A --> C[Delta Updates]
    A --> D[Token Processing]
    
    B --> E[textDocument/semanticTokens/full]
    C --> F[textDocument/semanticTokens/full/delta]
    D --> G[Token Decoding]
    
    G --> H[Token Types]
    G --> I[Token Modifiers]
    G --> J[Position Mapping]
    
    H --> K[namespace]
    H --> L[class]
    H --> M[function]
    H --> N[variable]
    
    I --> O[readonly]
    I --> P[static]
    I --> Q[deprecated]
    
    R[Font Lock Integration] --> S[Face Assignment]
    R --> T[Overlay Management]
    R --> U[Priority Handling]
    
    style A fill:#e3f2fd
    style G fill:#e8f5e8
    style R fill:#c8e6c9
```

## Performance Optimization Patterns

### UI Update Throttling

```mermaid
graph TD
    A[Update Requests] --> B[Throttle Manager]
    B --> C[Debounce Timer]
    B --> D[Rate Limiter]
    B --> E[Priority Queue]
    
    C --> F[Delay Rapid Updates]
    D --> G[Limit Update Frequency]
    E --> H[Process High Priority First]
    
    I[Update Types] --> J[Critical Updates]
    I --> K[Standard Updates]
    I --> L[Background Updates]
    
    J --> M[Immediate Processing]
    K --> N[Debounced Processing]
    L --> O[Idle Processing]
    
    P[Performance Metrics] --> Q[Update Latency]
    P --> R[CPU Usage]
    P --> S[Memory Usage]
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style I fill:#fff3e0
    style P fill:#ffebee
```

### Lazy Loading and Caching

```mermaid
graph LR
    A[Resource Manager] --> B[Lazy Loaders]
    A --> C[Cache Systems]
    A --> D[Preload Strategies]
    
    B --> E[On-Demand Loading]
    B --> F[Viewport-Based Loading]
    B --> G[User-Triggered Loading]
    
    C --> H[Completion Cache]
    C --> I[Symbol Cache]
    C --> J[Diagnostic Cache]
    
    D --> K[Predictive Loading]
    D --> L[Background Preparation]
    D --> M[Warm-up Routines]
    
    style A fill:#bbdefb
    style B fill:#c8e6c9
    style C fill:#f8bbd9
    style D fill:#ffe0b2
```

This UI integration architecture ensures seamless integration with Emacs' native UI systems while providing rich, responsive language-aware features through sophisticated caching, throttling, and lazy loading mechanisms.