import axios from "axios";

class NbaService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_API_ENDPOINT,
    });

    this.service.interceptors.response.use(
      (response) => {
        // parse response
        if (response?.data?.league?.standard) {
          return response.data.league.standard;
        }

        return response;
      },
      (error) => {
        // generic error handling
        return Promise.reject(error.message);
      }
    );
  }

  fetchPlayers() {
    return this.service.get("/players");
  }

  //working - https://data.nba.net/10s/prod/v1/2022/players/1630173_profile.json
  fetchPlayerStats(playerId) {
    return this.service.get(`/players/${playerId}`);
  }

  fetchTeams() {
    return this.service.get("/teams");
  }

  //working
  fetchTeamCalendar(code) {
    return this.service.get(`/teams/schedule/${code}`);
  }

  fetchStandings() {
    return this.service.get("/standings");
  }

  // -1 to correct the day
  fetchDayGames(date) {
    return this.service.get(`/scoreboard/${date-1}`);
  }

  fetchGame({ date, gameId }) {
    // return this.service.get(`/boxscore/${date}/${gameId}`);
  }

  fetchPeriodPlays({ date, gameId, period }) {
    // return this.service.get(`/period/${date}/${gameId}/${period}`);
  }
}

const service = new NbaService();

export default service;
