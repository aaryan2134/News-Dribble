import { useParams } from "react-router";
import { useQuery } from "react-query";

import Calendar from "components/Calendar";
import RosterList from "components/RosterList";

import NbaService from "services/NbaService";
import { HOUR_MILLISECONDS } from "constants.js";
import useTeams from "hooks/useTeams";
import usePlayers from "hooks/usePlayers";

import styles from "./TeamDetail.module.css";

const TeamDetail = () => {
  const { teamId } = useParams();
  const {
    filteredTeams: [teamData],
    teams,
  } = useTeams({ key: "teamId", value: teamId });
  const { filteredPlayers } = usePlayers({ key: "teamId", value: teamId });

  const { data: calendar, isLoading: isLoadingCalendar } = useQuery(
    `fetch-${teamData?.urlName}-calendar`,
    async () => {
      if (teamData) {
        const response = await NbaService.fetchTeamCalendar(teamData?.urlName);
        return response;
      }
    },
    {
      staleTime: HOUR_MILLISECONDS,
    }
  );

  return (
    <>
    
      <h2>{teamData?.fullName}</h2>
      <div>
          <br></br>
          <a href="https://nft-mint-indol.vercel.app/mint?imgURL=https://i.redd.it/c3rjnv63sar91.png"> Mint Your Team's NFT!!! </a>
        </div>
        <br></br>
        <br></br>
      <section className={styles.container}>
        <RosterList
          roster={filteredPlayers}
          isLoading={!filteredPlayers?.length}
        />
        <Calendar
          teams={teams}
          calendar={calendar}
          isLoading={isLoadingCalendar}
        />
      </section>
      
    </>
  );
};

export default TeamDetail;
