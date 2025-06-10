/**
 * Initialize Mermaid for rendering diagrams in the documentation
 */
document.addEventListener('DOMContentLoaded', function() {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true
            },
            sequence: {
                useMaxWidth: true,
                wrap: true
            },
            gantt: {
                useMaxWidth: true
            },
            state: {
                useMaxWidth: true
            },
            pie: {
                useMaxWidth: true
            },
            git: {
                useMaxWidth: true
            }
        });
    }
});