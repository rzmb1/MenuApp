# Use Cases

## 1. Menüplan wird eingetragen - Reimüller

|UseCaseNummer:|1|
|:---|:---|
|UseCasePackage|Menüplan|
|UseCase Name|Menüplan wird eingetragen|
|UseCase Beschreibung|Der Menüplan wird erstellt, darauf kann die Freigabe des Menüplans angefragt werden|
|Hauptakteur|Küchenchef|
|Weitere Akteure||
|Vorbedingung|Es wurde noch kein Menüplan für den Zeitraum erstellt|
|Nachbedingung|Menüplan wird freigegeben|
|Auslöser|Der Menüplan muss rechtzeitig vor seinem Beginn erstellt werden|
|Normaler Ablauf|Der Küchenchef trägt in den Menüplan für jeden Tag die Gerichte ein. Es muss für jeden Tag ein Salat, 1-2 Suppen, 2 Hauptspeisen und ein Dessert eingetragen werden. Es muss mindestens eine vegane Hauptspeise geben und auch Informationen zu Allergenen sollen verfügbar sein. Entfallene Tage werden auch eingetragen. Wenn er fertig ist fragt er die Freigabe des Menüplans an|
|Alternativer Ablauf|Nach Erstellung des Menüplans entscheidet sich der Küchenchef nicht gleich die Freigabe anzufragen. Der Menüplan bleibt als Entwurf gespeichert und die Freigabe kann später beantragt werden|

## 2. Menüplan wird geändert - Reimüller

|UseCaseNummer:|2|
|:---|:---|
|UseCasePackage|Menüplan|
|UseCase Name|Menüplan wird geändert|
|UseCase Beschreibung|Ein bereits erstellter Menüplan wird abgeändert|
|Hauptakteur|Küchenchef|
|Weitere Akteure||
|Vorbedingung|Der Menüplan muss bereits erstellt worden sein|
|Nachbedingung|Freigabe des Menüplans muss erneuert werden|
|Auslöser|Der Menüplan wurde bei der Freigabe abgelehnt<br><br>Wegen einem Zwischenfall kann der alte Menüplan nicht mehr gekocht werden<br><br>Beim Erstellen des Menüplans ist ein Fehler passiert, der nicht bei der Freigabe berücksichtigt wurde|
|NormalerAblauf|Der Küchenchef öffnet den bereits erstellten aber noch nicht freigegebenen Menüplan und hat die Möglichkeit einzelne Gerichte zu ändern, zu entfernen oder hinzuzufügen. Die Freigabe muss entsprechend neu angefordert und erneuert werden|
|Alternativer Ablauf|Ist der Menüplan bereits freigegeben, ändert sich der Menüplan zunächst nicht, erst nachdem die Änderungen freigegeben wurden werden sie auch in den Menüplan übernommen|

## 3. Menüplan wird verworfen - Zambelli

|UseCaseNummer:|3|
|---|---|
|UseCasePackage|Menüplan|
|UseCase Name|Menüplan wird verworfen|
|UseCase Beschreibung|Vor der Veröffentlichung kann der Menüplan Problemlos verworfen werden, ist dieser jedoch bereits veröffentlicht kann der Menüplan nicht mehr verworfen werden|
|Hauptakteur|Küchenchef|
|Weitere Akteure|-|
|Vorbedingung|Es muss bereits ein Menüplan erstellt und gespeichert sein der verworfen werden kann - siehe UseCase 1 (Menüplan wird eingetragen). Der Menüplan ist fehlerhaft und soll deshalb verworfen werden|
|Nachbedingung|Aufgrund der Löschung des alten Menüplans muss nun ein neuer erstellt werden. Die erstellung des neuen Plans muss spätestens bis zum Veröffentlichunsdatum erfolgen|
|Auslöser|Fehler im Menüplan werden entdeckt und es wird vom Küchenchef entschieden, dass dieser Menüplan verworfen wird|
|Normaler Ablauf|Küchenchef begutachtet den bereits erstellten Menüplan. Wenn der Küchenchef Fehler im Menüplan entdeckt entscheidet dieser ob der Plan verworfen werden soll oder nicht. Verwerfen kann er den Plan mittels Knopfdruck. Wenn der Menüplan verworfen wird werden die anderen Küchenchefs informiert|
|Alternativer Ablauf|-|

## 4. Menüplan wird freigegeben

## 5. Menüplan wird angezeigt

## 6. Schüler tragen sich beim essen ein 

## 7. Schüler tragen sich beim essen um

## 8. Schüler tragen sich vom essen aus - Zambelli

|UseCaseNummer:|8|
|---|---|
|UseCasePackage|Schüler_und_Leher_Aktionen|
|UseCase Name|Schüler tragen sich vom essen aus|
|UseCase Beschreibung|Schüler können sich jeder Zeit vom Essen austragen wenn sie wissen, dass sie das Essensangebot zu einem bestimmten Zeitpunkt nicht beanspruchen werden. Die Abmeldung muss vor dem Zeitpunkt der jeweiligen Essensausgabe passieren|
|Hauptakteur|Schüler|
|Weitere Akteure|-|
|Vorbedingung|Schüler muss beim Essen eingetragen sein - siehe UseCase 6 (Schüler tragen sich beim essen ein) |
|Nachbedingung|Schüler wird als "nicht angemeldet" markiert und die Menge an Essen, welches gekocht werden soll wird angepasst. Erfolgt das Austragen vor dem Einkauf der Zutaten werden diese ebenfalls angepasst|
|Auslöser|Schüler isst an einem oder mehreren Tagen nichts und meldet sich demendsprechend ab|
|Normaler Ablauf|Der Schüler gibt den Zeitraum an in welchem er das Angebot aussetzt. Der Zeitraum kann auch mehrere Tage bzw. mehrere Essensausgaben umfassen. Die Abmeldung wird im System erfasst und der Schüler wird als ausgetragen markiert. Für die anderen Tage bleibt er weiterhin eingetragen|
|Alternativer Ablauf|-

## 9. Voraussichtlich erscheinende Schüler für das Essen werden angezeigt

## 10. Schüler registrieren sich

## 11. Abgemeldete Schüler werden im System als solche markiert

## 12. Schüler loggen sich ein

## 13. Schüler loggen sich aus

## 14. Schüler ändern Passwort

## 15. Tatsächliche Essensausgabe wird eingetragen

## 16. Statistik zur Essensausgabe wird angezeit - Fischer

|UseCaseNummer:|16|
|---|---|
|UseCasePackage|Anzeige_und_Management_von_Daten|
|UseCase Name|Statistik zur Essensausgabe wird angezeigt|
|UseCaseBeschreibung|Es werden alle möglichen Statistiken berechnet und angezeigt, wie zum Beispiel durchschnittliche Anzahl kommender Schüler, durchschnittliche Anzahl gegessener Mahlzeiten,... . Dies dient dazu dem Küchenchef verschiedene Entscheidungen zu erleichtern, wie zum Beispiel: Menge der zu bestellenden Zutaten.|
|Hauptakteur|Küchenchef|
|Weitere Akteure|Koch|
|Vorbedingung|Verschiedene Daten müssen eingetragen worden sein. siehe usecase 15|
|Nachbedingung|-|
|Auslöser|Der Küchenchef oder ein Koch öffnet den Tab mit den Statistiken.|
|NormalerAblauf|Die Statistiken werden berechnet und angezeigt.|
|AlternativerAblauf|-|
## 17. Zwischenfälle werden aus der Statistik entfernt - Fischer

|UseCaseNummer:|17|
|---|---|
|UseCasePackage|Anzeige_und_Management_von_Daten|
|UseCase Name|Zwischenfälle werden aus der Statistik entfernt|
|UseCaseBeschreibung|Es werden verschiedene Zwischenfälle, z.b: spontan geschlossene Kantine, aus den Statistiken entfernt, da sie nicht representativ sind.|
|Hauptakteur|Küchenchef|
|Weitere Akteure|Koch|
|Vorbedingung|Es müssen bereits Daten eingetragen worden sein.|
|Nachbedingung|Die Daten, am Tag des Zwischenfalls, werden nicht mehr in der Statistik repräsentiert.|
|Auslöser|Ein Zwischenfall passiert.|
|NormalerAblauf|Ein Küchenchef markiert die Tage mit einem Zwischenfall und die Daten an diesen Tagen fliesen nicht mehr in die Statistik ein.|
|AlternativerAblauf|-|