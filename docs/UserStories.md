# User Stories

## Gesamt Zeile in der Statistik

### Beschreibung

Als Küchenchef, der bereits mehrere Jahre mit der App arbeitet, möchte ich eine Insgesamte Statistik für alle Gerichte in den Vergangenen Jahren haben, aus der ich ablesen kann wie viel vom gekochten bzw. bestellten Essen weggeworfen wird. Daraus will ich ablesen können ob ich in der Zukunft eher vorsichtiger oder riskanter agieren soll.

Der Zugriff auf die Gesamtstatistik soll nicht länger als der Zugriff auf die einzelnen Statistiken dauern.

### Akzeptanzkriterien

- Die Statistik wird zu allen Gerichten in einem Bestimmten Zeitraum angezeigt
- Der Zeitraum für diese Statistik kann vom Nutzer verändert werden

## Admin kann Nutzerrechte festlegen

### Beschreibung

Als Mitarbeiter im Sekreteriat mit Adminrechten möchte ich festlegen können, wer die Berechtigungen hat sich einzuloggen, Menüpläne zu Erstellen, Menüpläne zu verändern, Menüpläne zu löschen, die Statistik anzusehen, ausgegebene Mahlzeiten einzutragen, sich zum Essen anzumelden und Nutzerrechte zu bearbeiten. Dadurch ist es möglich, wenn es einen neuen Nutzer gibt, diesem die nötigen Rechte zu geben um ihre Aufgaben in der App zu erledigen.

Ich möchte die Nutzerrechte für jeden einzelnen Nutzer bearbeiten können.

Ich will auch Nutzern, die bisher nicht im System der Kantine sind, die Berechtigung zum Einloggen geben können und sie damit in der App erfassen.

Ich möchte die Rechte der Nutzer basierend auf Rollen vergeben. Also zum Beispiel alle Berechtigungen, die ein Küchenchef braucht.

### Akzeptanzkriterien

- [ ]  Es ist möglich die Rechte von Nutzern zu bearbeiten
- [ ]  Nur jemand mit Adminrechten kann Nutzerrechte bearbeiten
- [ ]  Es ist nicht möglich, das es jemals niemanden mit Adminrechten gibt
- [ ]  Die Berechtigungen können für alle Nutzer, die einen externen Schüleraccount haben vergeben werden
- [ ]  Die Seite für das Verändern von Nutzerrechten soll über das Menü der App erreichbar sein

### Tasks

- [ ]  Es gibt ein Design für eine zusätzliche Seite am Frontend für die Benutzerverwaltung
- [ ]  Am Frontend ist eine zusätzliche Seite Implementiert
- [ ]  Die Seite am Frontend ist an das Backend angeschlossen

### Definition of Done - Qualitätskriterien - Standard

- [ ]  Für die API gibt es Testfälle, für jeden Schnittpunkt, die fehlerfrei funktionieren.
- [ ]  Es gibt eine Testabdeckung über 80%.
- [ ]  Der Code ist “lintet” und entspricht den Stilvorgaben des Projekts
- [ ]  Der Code wurde in einem eigenen Branch implementiert und ein Merge-Request wurde durchgeführt.

### Definition of Done - Qualitätskriterien - Erweitert

- [ ]  Eine Code-Review wurde im Rahmen des Merge-Requests durchgeführt.
- [ ]  UI wurde in unterschiedlichen Browsern getestet.

## Admin kann angemeldete Schüler in das System einspielen

Als Mitarbeiter im Sekreteriat mit Adminrechten will ich die Liste an Schülern, die sich in einem bestimmten Jahr für das Essen angemeldet haben in das System einspielen können. Darauf werden die notwendigen Nutzerrechte vergeben.

## Menüplanansicht und Menüplanerstellung zusammenführen

Ich als Küchenchef möchte die Ansicht für das Erstellen oder Bearbeiten direkt über die Menüplanansicht erreichen können.

## Menüleiste minimieren (Fischer)

Ich als Küchenchef Peter Gartner will die Menüleiste minimieren können, damit ich mehr von der Seite sehen kann.

### Akzeptanzkriterien

- [ ]  Ich möchte die Menüleiste über einen Knopf verkleinern können.
- [ ]  Ich möchte die Menüleiste wieder vergrößern können.
- [ ]  Minimiert soll die Seite nur die Icons anzeigen.

### Definition of Done - Qualitätskriterien - Standard

- [ ]  Für die API gibt es vollständige Testfälle, die fehlerfrei funktionieren.
- [ ]  Es gibt eine Testabdeckung über 80%.
- [ ]  Der Code ist “lintet” und entspricht den Stilvorgaben des Projekts
- [ ]  Der Code wurde in einem eigenen Branch implementiert und ein Merge-Request wurde durchgeführt.

### Definition of Done - Qualitätskriterien - Erweitert

- [ ]  Eine Code-Review wurde im Rahmen des Merge-Requests durchgeführt.
- [ ]  UI wurde in unterschiedlichen Browsern getestet.

## Einloggen mit Schul-Account (Fischer)

Als Schüler will ich mich mit meinem Schul-Account anmelden können, damit ich mir nicht noch ein Passwort merken muss und mir die Registrierung sparen kann.

### Akzeptanzkriterien

- [ ]  Es muss mittels OAuth2 möglich sein, den Schul-Account zur Anmeldung zu benutzen.
- [ ]  Es gibt eine zustandslose Sitzung, welche mit JWTs implementiert wurde.
- [ ]  Es muss auf der Login-Seite eine Option geben um sich mit einem anderen Konto anzumelden.

### Definition of Done - Qualitätskriterien - Standard

- [ ]  Für die API gibt es vollständige Testfälle, die fehlerfrei funktionieren.
- [ ]  Es gibt eine Testabdeckung über 80%.
- [ ]  Der Code ist “lintet” und entspricht den Stilvorgaben des Projekts
- [ ]  Der Code wurde in einem eigenen Branch implementiert und ein Merge-Request wurde durchgeführt.

### Definition of Done - Qualitätskriterien - Erweitert

- [ ]  Eine Code-Review wurde im Rahmen des Merge-Requests durchgeführt.
- [ ]  UI wurde in unterschiedlichen Browsern getestet.

## Prognosen in der Statistik (Reimüller)

Als Küchenchef möchte ich in der Statistik Prognosen für den Konsum eines bestimmten Gerichts sehen, um die richtige Menge bestellen zu können.

Ich will wissen, wie viele Schüler sich bereits für das Gericht angemeldet haben und wie viele sich vorraussichtlich noch anmelden werden bzw. unangemeldet das Gericht konsumieren.

### Akzeptanzkriterien

- [ ]  In der Statistik können Prognosen, für die gegessenen Gerichte angezeigt werden
- [ ]  Es kann eingestellt werden für welches Gericht an welchem Tag die Prognose angezeigt werden soll
- [ ]  Die Prognosen basieren auf Daten, wie bisherigen Anmeldungen, vergangenen Statistiken und Bewertungen

### Tasks

- [ ]  Eine Methode zum Berechnen der Prognose in die Applikation einbauen
- [ ]  In der Statistik die Prognose anzeigen, wenn ein Gericht, das in der Zukunft liegt ausgewählt wurde

### Definition of Done - Qualitätskriterien - Standard

- [ ]  Für die API gibt es Testfälle, für jeden Schnittpunkt, die fehlerfrei funktionieren.
- [ ]  Es gibt eine Testabdeckung über 80%.
- [ ]  Der Code ist “lintet” und entspricht den Stilvorgaben des Projekts
- [ ]  Der Code wurde in einem eigenen Branch implementiert und ein Merge-Request wurde durchgeführt.

### Definition of Done - Qualitätskriterien - Erweitert

- [ ]  Eine Code-Review wurde im Rahmen des Merge-Requests durchgeführt.
- [ ]  UI wurde in unterschiedlichen Browsern getestet.

## Darkmode

Als Benutzer der App möchte ich einen Darkmode aktivieren können um eine angenehmere Ansicht auf die Website zu haben.

## Mobile App/Ansicht für Kunden (David Weißensteiner)

Ich als Schüler möchte eine mobile Ansicht, damit ich mich bequem mit meinem Handy für/von Tagen an-, ab- und ummelden kann. Ich möchte mit möglichst wenig Aufwand, also möglichst wenigen Klicks, mein Essen bestellen.

### Akzeptanzkriterien

- [ ]  Erstellung der Tagesauswahl
- [ ]  Erstellung der Anmeldung / Abmeldung / Ummeldung für einen Tag
- [ ]  Einfache Navigation (wenige Klicks)

### Tasks

- [ ]  Eigener Endpunkt für Kunden
- [ ]  UI für die Auswahl eines Tages (5 Einträge/Cards pro Woche)
- [ ]  UI für das Anmelden, Abmelden und Ummelden (fällt zusammen, vorzugsweise als Karussell)
- [ ]  Status je Tag anzeigen (Angemeldet, Keine Info, Abgemeldet)

## Einfachere Statistikseite (Justus Arndt)

Ich, als 45-jähriger Koch mit Frau und zwei Kindern, möchte die Statistiken einfacher anzeigen lassen können, da die jetzige Version der Statistikseite, welche ich mehrmals pro Woche benutze, für mich unübersichtlich und umständlich zu navigieren ist.

### Tasks

- [ ]  Mehrere Buttons zur Auswahl der anzuzeigenden Statistik in die Applikation einbauen
- [ ]  Die jeweilige Statistik durch Drücken des zugehörigen Buttons anzeigen lassen.

### Akzeptanzkriterien

- [ ]  Die jeweilige anzuzeigende Statistik kann über den zugehörigen Button ausgewählt werden.
- [ ]  Die jeweilige anzuzeigende Statistik wird unterhalb aller Buttons angezeigt.
- [ ]  Die jeweilige anzuzeigende Statistik wird in einer passenden Größe angezeigt, sodass diese ohne Scrollen angezeigt wird.
- [ ]  Die bereits existierten Statistiken werden (das Web-Design ausgenommen) genauso angezeigt wie vorher.

### Definition of Done - Qualitätskriterien - Standard

- [ ]  Für die API gibt es vollständige Testfälle, die fehlerfrei funktionieren.
- [ ]  Es gibt eine Testabdeckung über 80%.
- [ ]  Der Code ist “lintet” und entspricht den Stilvorgaben des Projekts
- [ ]  Der Code wurde in einem eigenen Branch implementiert und ein Merge-Request wurde durchgeführt.

### Definition of Done - Qualitätskriterien - Erweitert

- [ ]  Eine Code-Review wurde im Rahmen des Merge-Requests durchgeführt.
- [ ]  UI wurde in unterschiedlichen Browsern getestet.

## Synchronisiertes Benachrichtigungssystem

Ich als David Weißensteiner möchte
Benachrichtigungen, wie die Veröffentlichung eines neuen Menüplans, sofort angezeigt bekommen, ohne die Website neu laden zu mussen.

## Kompakteres Menü

Ich als durchschnittlicher Nutzer der Webseite möchte die Menüleiste minimieren, damit der Seiteninhalt größer ist.

## Bewertungen für Gerichte (Rubens Zambelli)

Als Kunde der Kantine möchte ich Gerichte bewerten können, um die Qualität der Gerichte zu verbessern und in Zukunft mehr Essen zu erhalten welches mir zusagt.

### **Akzeptanzkriterien**

- [ ]  Nachdem ich mich für ein Gericht angemeldet habe und dieses ausgegeben wurde kann ich in der App eine Bewertung abgeben.
- [ ]  Ich kann das Gericht mit 1 bis 5 Sternen bewerten.
- [ ]  Wenn ich auf den Anmeldungsbildschirm komme, wird mir, neben den Bildern der Gerichte, die durschnittliche Sternebwertung aller Nutzer angezeigt.
- [ ]  Meine eigene Bewertung kann ich nach dem Essen bequem in der mobilen Applikation über den Anmeldungsbildschirm abgeben und jederzeit wieder ändern.
- [ ]  Meine Bewertung wird an alle Küchenchefs weitergeleitet, diese können die Bewertung in der Statistik-Ansicht und bei der Menüplanerstellung sehen.
- [ ]  Die App zeigt mir eine Bestätigung an, dass meine Bewertung erfolgreich abgeschickt wurde.

### Definition of Done - Qualitätskriterien - Standard

- [ ]  Die Benutzererfahrung soll möglichst intuitiv sein und so wenige clicks wie möglich beinhalten
- [ ]  Für die API gibt es Testfälle, für jeden Schnittpunkt, die fehlerfrei funktionieren.
- [ ]  Es gibt eine Testabdeckung über 80%.
- [ ]  Der Code ist “lintet” und entspricht den Stilvorgaben des Projekts
- [ ]  Der Code wurde in einem eigenen Branch implementiert und ein Merge-Request wurde durchgeführt.

### Definition of Done - Qualitätskriterien - Erweitert

- [ ]  Eine Code-Review wurde im Rahmen des Merge-Requests durchgeführt.
- [ ]  UI wurde in unterschiedlichen Browsern getestet.
- [ ]  Die Mobile-View wurde getestet und ist verwendbar.
