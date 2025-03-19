# Vehicle Fleet Scheduler

Ein interaktiver Fahrzeugplaner mit React und MUI, der Fahrzeugbuchungen in einer visuell ansprechenden Gantt-Chart-Ansicht darstellt und eine intuitive Bearbeitung dieser Buchungen per Drag-and-Drop ermöglicht.

## Funktionen

### Gantt-Chart für Fahrzeugbuchungen
- Darstellung von Fahrzeugen als Zeilen und Zeiträumen als Spalten
- Visualisierung von Buchungen als Balken im Diagramm
- Zeitskala mit umschaltbaren Ansichten (Tag, Woche, Monat)
- Farbliche Unterscheidung verschiedener Buchungstypen (z.B. Wartung, Kundenbuchung, Bereitstellung)
- Visuelle Indikatoren für Buchungsstatus (bestätigt, vorläufig, abgeschlossen)

### Interaktive Bearbeitung
- Drag-and-Drop zum Verschieben von Buchungen zwischen Fahrzeugen und Zeiträumen
- Größenänderung von Buchungen (Verlängern/Verkürzen) durch Ziehen der Ränder
- Ansprechende Detailansicht bei Klick auf eine Buchung
- Visuelle Validierung für Überschneidungen und Konflikte
- Animationen für flüssige Übergänge

### Benutzeroberfläche und Bedienkomfort
- Filterpanel für schnelle Ansichtsanpassung (nach Fahrzeugtyp, Zeitraum, Buchungsstatus)
- Zoom-Funktion für die Zeitachse
- Übersichtliche Legende für Farben und Symbole
- Responsive Gestaltung für Desktop- und Tablet-Ansichten

### Visuelle Verbesserungen
- Informative Tooltips bei Hover über Buchungen
- Zusammenfassende Statistiken in einer Dashboardansicht (Auslastung, kommende Buchungen)
- Heatmap-Ansicht der Fahrzeugauslastung als alternative Visualisierung
- Tag/Nacht-Modus mit angepasstem Farbschema

## Projekttstruktur
```
vehicle-fleet-scheduler/
│
├── public/           # Öffentliche Dateien
│   ├── index.html    # HTML-Einstiegspunkt
│   └── favicon.ico   # Anwendungssymbol
│
├── src/              # Quellcode
│   ├── components/   # UI-Komponenten
│   │   ├── BookingBar.jsx            # Buchungsbalken-Komponente
│   │   ├── BookingDetails.jsx        # Buchungsdetailansicht
│   │   ├── DashboardStatistics.jsx   # Statistik-Dashboard
│   │   ├── FilterPanel.jsx           # Filteroptionen
│   │   ├── GanttChart.jsx            # Gantt-Diagramm-Hauptkomponente
│   │   ├── Header.jsx                # Anwendungs-Headerleiste
│   │   ├── TimeScale.jsx             # Zeitskala-Komponente
│   │   ├── VehicleRow.jsx            # Fahrzeugzeile
│   │   └── VehicleUtilizationHeatmap.jsx # Fahrzeugauslastungs-Heatmap
│   │
│   ├── context/      # React Context für Zustandsverwaltung
│   │   └── AppContext.jsx            # Globaler Anwendungskontext
│   │
│   ├── hooks/        # Benutzerdefinierte React-Hooks
│   │   └── useDragDrop.js            # Hook für Drag-and-Drop-Funktionalität
│   │
│   ├── theme/        # Theming und Stilkonfiguration
│   │   └── theme.js                  # Material-UI-Themekonfiguration
│   │
│   ├── utils/        # Hilfsfunktionen
│   │   ├── dateUtils.js              # Datums- und Zeitfunktionen
│   │   └── mockData.js               # Testdatengenerator
│   │
│   ├── App.jsx       # Hauptanwendungskomponente
│   ├── index.css     # Globale CSS-Stile
│   ├── index.js      # Anwendungseinstiegspunkt
│   └── README.md     # Projektdokumentation
│
└── package.json      # Projektabhängigkeiten und Skripte
```

## Technologien
- **React**: Frontend-Bibliothek für die Benutzeroberfläche
- **Material-UI**: Komponenten-Bibliothek für das Design
- **date-fns**: Bibliothek für Datumsmanipulation und -formatierung
- **Context API**: Zustandsverwaltung für die Anwendung

## Mock-Datensatz
- 15 Fahrzeuge mit verschiedenen Typen und Eigenschaften
- Etwa 40 Buchungen über einen Zeitraum von 2-4 Wochen
- Verschiedene Buchungstypen und -stati für eine realistische Darstellung

## Zukünftige Erweiterungen
- Tastaturkürzel für häufige Aktionen
- Druckbare Ansicht des Planungskalenders
- Unterschiedliche Farbschemata/Themes
- Animierte Übergänge zwischen verschiedenen Ansichten
- Statistik-Widgets für die Flottenauslastung

## Author
Zishan Chen
