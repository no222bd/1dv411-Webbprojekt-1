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
http://matematikdidaktik.davidsouthmountain.se/

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