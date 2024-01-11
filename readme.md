# Belote client
## 

Communicator
- exchange data with server



SceneManager => UI
-> gets Game state changes
-> send events

GameState
-> players
->score, etc

ex: 
UI sends ready event with players/team names
server deals and return hands + score + round + dealerId + activePlayerId

GameState is updated and event sent

player played -> server -> returns score, round, activePlayedId, 



