# Use Cases
`responsible: Felix Reimüller`

## Menüplan wird erstellt

|UseCaseNummer:|1|
|:---|:---|
|UseCasePackage|Menüplan|
|UseCase Name|Menüplan wird erstellt|
|UseCase Beschreibung|Ein Menüplan für eine Woche wird aus verschiedenen Gerichten erstellt|
|Hauptakteur|Küchenchef|
|Weitere Akteure||
|Vorbedingung|Es gibt noch keinen Menüplan für diesen Zeitraum|
|Nachbedingung|Menüplan wird freigegeben|
|Auslöser|Der Menüplan muss rechtzeitig vor den Bestellungen erstellt werden|
|Normaler Ablauf|Der Küchenchef wählt zunächst die Woche aus, für die der Menüplan gilt. Anschließend muss er eingeben an welchen Tagen gekocht wird. Für jeden dieser Tage müssen nun eine Salat sowie zwischen ein und drei Menüs bestehen aus Vorpeise, Hauptspeise und Nachspeise ausgewählt werden. Hierbei muss er zu allen Gerichten Allergene, Vegan sowie weitere wichtige Eigenschaften angeben. Es muss mindestens ein Vegetarisches Menü verfügbar sein. Darauf wird der Menüplan gespeichert. Zum Schluß beantragt der Küchenchef die Freigabe des Menüplans.|
|Alternativer Ablauf|Nach Erstellung des Menüplans entscheidet sich der Küchenchef nicht gleich die Freigabe anzufragen. Der Menüplan bleibt als Entwurf gespeichert und die Freigabe kann später beantragt werden|

## Menüplan wird geändert

|UseCaseNummer:|2|
|:---|:---|
|UseCasePackage|Menüplan|
|UseCase Name|Menüplan wird geändert|
|UseCase Beschreibung|Ein bereits erstellter Menüplan wird abgeändert|
|Hauptakteur|Küchenchef|
|Weitere Akteure||
|Vorbedingung|Es ist ein änderbarer Menüplan vorhanden|
|Nachbedingung|Freigabe des Menüplans muss erneuert werden<br><br>Kunden benachrichtigen|
|Auslöser|Ein noch unfertiger Menüplan soll ergänzt werden<br><br>Der Menüplan wurde bei der Freigabe abgelehnt<br><br>Wegen einem Zwischenfall kann der alte Menüplan nicht mehr gekocht werden<br><br>Beim Erstellen des Menüplans ist ein Fehler passiert, der nicht bei der Freigabe berücksichtigt wurde|
|NormalerAblauf|Der Küchenchef öffnet den bereits erstellten Menüplan und hat nun die Möglichkeit Gerichte und Menüs hinzuzufügen, zu entfernen oder zu ändern. Hierbei muss er immer noch darauf achten, das ein bis drei Menüs von dennen zumindest eines Vegetarisch ist verfügbar sind. Nach dem Ändern muss die Freigabe erneut angefordert werden.|
|Alternativer Ablauf|Ist der Menüplan bereit veröffentlicht müssen alle Kunden benachrichtigt werden.|

`responsible: Rubens Zambelli`

## Menüplan wird verworfen

|UseCaseNummer:|3|
|---|---|
|UseCasePackage|Menüplan|
|UseCase Name|Menüplan wird verworfen|
|UseCase Beschreibung|Vor der Veröffentlichung kann der Menüplan vom Küchenchef verworfen werden, ist dieser jedoch bereits veröffentlicht kann der Menüplan nicht mehr verworfen werden|
|Hauptakteur|Küchenchef|
|Weitere Akteure|Küchenchef 2|
|Vorbedingung|Es muss bereits ein Menüplan erstellt und gespeichert sein der verworfen werden kann - siehe UseCase _Menüplan wird eingetragen_.|
|Nachbedingung|Aufgrund der Löschung des alten Menüplans muss nun ein neuer erstellt werden. Die Erstellung des neuen Plans muss spätestens bis zum Veröffentlichunsdatum erfolgen|
|Auslöser|Schwerwiegende Fehler im Menüplan werden entdeckt und es wird vom Küchenchef entschieden, dass dieser Menüplan verworfen wird|
|Normaler Ablauf|Wenn der Küchenchef Fehler im Menüplan entdeckt entscheidet dieser ob der Plan verworfen werden soll oder nicht. Verwerfen kann er den Plan mittels Knopfdruck. Wenn der Menüplan verworfen wird muss ein zweiter die Löschung bestätigen|
|Alternativer Ablauf|Menüplan kann nichtmehr verworfen werden, da er bereits veröffentlicht ist|

## Beim Essen abmelden 

|UseCaseNummer:|8|
|---|---|
|UseCasePackage|Benutzeroptionen|
|UseCase Name|Beim Essen abmelden|
|UseCase Beschreibung|Kunden können sich vom Essen austragen wenn sie wissen, dass sie das Essensangebot zu einem bestimmten Zeitpunkt nicht beanspruchen werden. Die Abmeldung muss vor dem Beginn des Küchenbertriebs am jeweiligen Tag passieren. Lehrer sind, z.B. im Fall eines Ausflugs oder einer Schulveranstaltung, in der Lage einen oder mehrere Kunden abzumelden.|
|Hauptakteur|Kunde|
|Weitere Akteure|Lehrer|
|Vorbedingung|Kunde muss eine Jahresanmeldung besitzen|
|Nachbedingung|Kunden wird als "abgemeldet" markiert und die Menge an Essen, welches gekocht werden soll wird angepasst. Erfolgt das Austragen vor dem Einkauf der Zutaten werden diese ebenfalls angepasst|
|Auslöser|Schüler isst an einem oder mehreren Tagen nichts und meldet sich demendsprechend ab|
|Normaler Ablauf|Der Schüler gibt den Zeitraum an in welchem er das Angebot aussetzt. Der Zeitraum kann auch mehrere Tage bzw. mehrere Essensausgaben umfassen. Die Abmeldung wird im System erfasst und der Schüler wird als ausgetragen markiert. Für die anderen Tage bleibt er weiterhin eingetragen. Die Menge an Essen, dass gekocht werden soll wird angepasst|
|Alternativer Ablauf|Kunde meldet sich vor Bestellung ab -> Bestellmenge wird angepasst|

`responsible: Thomas Fischer`

## Statistik wird angezeigt

|UseCaseNummer:|16|
|---|---|
|UseCasePackage|Datenmanagement|
|UseCase Name|Statistik wird angezeigt|
|UseCaseBeschreibung|Die Daten zur Essensausgabe werden in Form von Diagrammen angezeigt.|
|Hauptakteur|Koch|
|Weitere Akteure|-|
|Vorbedingung|Es müssen bereits Daten eingetragen worden sein. siehe UseCase: Daten zur Essensausgabe werden eingetragen|
|Nachbedingung|-|
|Auslöser|Der Küchenchef oder ein Koch öffnet die Seite mit den Statistiken.|
|NormalerAblauf|Ein Koch oder Küchenchef ruft die Statistik auf. Darauf wird sie berechnet und in Form von Diagrammen angezeigt.|
|AlternativerAblauf|Nach dem Aufrufen der Statistik, wird der Zeitrahmen geändert und dadurch nur noch Daten in diesem Zeitraum angezeigt. <br> <br> Nach dem Aufrufen der Statistik, wird ein Filter eingegeben und dadurch nur noch die gefilterten Daten angezeigt.|
## Zwischenfälle werden aus Statistik entfernt

|UseCaseNummer:|17|
|---|---|
|UseCasePackage|Datenmanagement|
|UseCase Name|Zwischenfälle werden aus Statistik entfernt|
|UseCaseBeschreibung|Es werden Tage mit Zwischenfällen wie zum Beispiel: ein kranker Koch, aus den Statistiken entfernt, da sie nicht representativ sind.|
|Hauptakteur|Koch|
|Weitere Akteure|-|
|Vorbedingung|Es müssen bereits Daten, an dem Tag mit dem Zwischenfall, eingetragen worden sein. siehe UseCase: Daten zur Essensausgabe werden eingetragen|
|Nachbedingung|Die Daten, am Tag des Zwischenfalls, werden nicht mehr in der Statistik repräsentiert.|
|Auslöser|Es kommt zu einem Zwischenfall|
|NormalerAblauf|Ein Küchenchef markiert die Tage mit dem Zwischenfall und die Daten an diesen Tagen fließen nicht mehr in die Statistik ein.|
|AlternativerAblauf|-|

`responsible: Team`

## Menüplan wird freigegeben

## Menüplan wird veröffentlicht

## Menüplan wird angezeigt

## Beim Essen anmelden

## Beim Essen ummelden

## Essensbedarf anzeigen

## Kunde registriert sich

## Kunde wird deaktiviert

## Benutzer loggt sich ein

## Benutzer loggt sich aus

## Benutzer ändert Passwort

## Daten zur Essensausgabe werden eingetragen