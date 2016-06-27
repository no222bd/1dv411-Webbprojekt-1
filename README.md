# 1dv411-Webbprojekt-1
Projekt Matematikdidaktik i kursen 1DV411 Webbprojekt 1

##Deltagare  
Svante Arvedsson (ba222ec)  
Maria Nygren (mn22nw)  
Nils-Jacob Olsson (no222bd)  
Christoffer Holmgren (ch222kv)  
Jennifer Nord (jn222iw)  
David Söderberg (ds222hz)  

## Körbar applikation
http://www2.kau.se/jorrbomm/kubus/

## Installations instruktioner
1. Ladda ner repo
2. Kontrollera att php ligger i miljövariabler.
3. Kör kommandot ```php composer.phar install``` i rooten för projektet.
4. Kopiera filen ```api/.htaccess.example``` och döp om den till ```.htaccess```.
5. Öppna ```.htaccess``` och ändra ```{folder}``` till den mapp detta projekt ligger i, inut i root mappen för webbservern.
4. Öppna upp projektet i localhost.
5. Du kan nu köra applikationen.


## Backend uppdatering
Om klassers namn eller sökväg ändras så behöver man köra ```php composer.phar dump-autoload```.

##Checklista före pull request
1. Går koden genom enhetstesterna?
2. Går koden genom manuella funktionstester? Testa sådant som kan tänkas ha påverkats av det som har ändrats.

##Checklista före merge
1. Går koden genom enhetstesterna?
2. Går koden genom manuella funktionstester? Testa sådant som kan tänkas ha påverkats av det som har ändrats.

Om koden ej går igenom testerna, ta då kontakt med skaparen av pull requesten och be denne att åtgärda felen.

##Checklista vid konflikt
Gå till din skapade branch (git checkout your-branch). Kör kommandot: git merge master. Lös konflikterna. Därefter återupprepa checklista-före pull-request.
