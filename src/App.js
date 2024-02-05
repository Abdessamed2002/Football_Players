import './App.css';
import {useEffect, useState} from 'react';
import SearchIcon from "./search.svg";

// La liga players 2023-07-22
const API_URL = 'https://apiv3.apifootball.com/';
const API_KEY = '4f6afb70a310364eeea8121fb298a679f94d73416c5ac5104aee44567f561fc5';

const PlayerCard = ( {player}) => { // props but specified (distructed)
    // Fonction pour vérifier si l'image existe
    const checkImageExists = (url) => {
        return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        });
    };

    const [imageExists, setImageExists] = useState(true);
    
    useEffect(() => {
        // Vérifier si l'image existe au montage du composant
        checkImageExists(player.player_image)
        .then((exists) => setImageExists(exists))
        .catch(() => setImageExists(false));
    }, [player.player_image]);

    return (
        <div className='player'>
            <div>
                <p>{player.player_name}</p>
            </div>

            <div>
                {imageExists ? (
                    <img
                        src={player.player_image}
                        alt={`Image of ${player.player_name}`}
                    />
                ) : (
                    <img
                        src='https://via.placeholder.com/400'
                    />
                )}
                
            </div>

            <div>
                <span>{player.player_type}</span> <p>{player.player_age} ans</p>
            </div>
        </div>     
    );
}

function App() {
    const [players, setPlayers] = useState([]);   // state to fetch the players into 
    const [searchPlayers, setSearchPlayers] = useState('');  // state to search the players of the team selected

    const searchPlayersTeam = async (team) => {
        setPlayers([]);
        // Make a call to get the list of teams
        const teamsResponse = await fetch(`${API_URL}?action=get_teams&league_id=302&APIkey=${API_KEY}`);
        const teamsData = await teamsResponse.json();
        // Find the specific team by name
        const selectedTeam = teamsData.find((t) => t.team_name === team);
        if (selectedTeam) {
            // Access the "players" property of the selected team
            const players = selectedTeam.players;
            console.log('Players:', players);
            setPlayers(players);
            console.log('Players:', players);
        }
    }; 

    return (
        <div className="app">
            <h1>La Liga Players</h1>
            <div className='search'>
                <input
                    placeholder='Search for a team'
                    value={searchPlayers}
                    onChange={(event) => setSearchPlayers(event.target.value)}
                />
                <img
                    src={SearchIcon}
                    alt='search'
                    onClick={() => searchPlayersTeam(searchPlayers)}
                />
            </div>
            {
                players?.length > 0
                    ? (
                        <div className='container'>
                            {players.map((player) => (
                                    <PlayerCard player={player}/>
                                    )
                                )
                            }
                        </div>
                    ) : (
                        <div className='empty'>
                            <h2>no players found for {searchPlayers}</h2>
                        </div>
                    )
            }         
        </div>
    );
}

export default App;