sequenceDiagram
    participant browser
    participant server
    
    note right of browser: Button to send note is clicked, the local javascript changes the html to include the note
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    note right of browser: server has received the note and hopefully has saved it
    server-->>browser: json saying note is created
    deactivate server
