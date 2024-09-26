import React, { useState, useEffect } from 'react';
import axios from 'axios';
import myScheduleImfo from './myScheduleImfo'; // Import your myScheduleImfo file
import { Homeground } from "../Home/homeground"; // Import Homeground
import "./calendarDetail.css";

const CalendarDetail = ({ month, day }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://3.138.127.122:5000/api/game/${process.env.REACT_APP_API_KEY}`);
        setGames(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (month === null || day === null) {
    return null;
  }

  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');
  const currentYear = new Date().getFullYear();

  const filteredSchedules = games.filter(
    (game) => game.game_date.startsWith(`${formattedMonth}.${formattedDay}`)
  );

  const myFilteredSchedules = myScheduleImfo.filter(
    (schedule) => schedule.month === month && schedule.day === day
  );

  const handleButtonClick1 = () => {
    setIsClicked(!isClicked);
  };

  const handleButtonClick2 = () => {
    window.location.href = 'https://www.ticketlink.co.kr/sports/baseball/schedule#';
  }

  const handleButtonClick = () => {
    handleButtonClick1();
    handleButtonClick2();
  }

  const handlePlusClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter') {
      const newSchedule = {
        month: month,
        day: day,
        text: inputText,
      };
      myScheduleImfo.push(newSchedule); // Add the new schedule to the array
      setShowInput(false);
      setInputText('');
    }
  };

  const getGround = (teamHome) => {
    const homeground = Homeground.find((ground) => ground.team === teamHome);
    return homeground ? homeground.ground : "Unknown";
  };

  return (
    <div className="calenderDCon1">
      <p id='calenderToday'>{currentYear}.{formattedMonth}.{formattedDay}</p>
      <p id='calendertitle1'>경기일정</p>
      <div className='calenderDCon2'>
        <nav className="Cnav1">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          filteredSchedules.map((game, index) => (
            <div className="schedule" key={index}>
              <div className="scheduleCon">
                <div className="scheduleCon1"></div>
                <div className="scheduleCon2">
                  <div className="scheduleImfo">
                    <div id="schedule_title">
                      <p id="title_team1">{game.team_away}</p>
                      <p id="title_vs">VS</p>
                      <p id="title_team2">{game.team_home}</p>
                    </div>
                    <p id="time">{game.game_date}</p>
                    <p id="ground">{getGround(game.team_home)}</p>
                    <button
                      id="reservation"
                      className={isClicked ? "clicked" : ""}
                      onClick={handleButtonClick}
                    >
                      <p id="buttonText">바로예매</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        </nav>
      </div>
      <p id='calendertitle1'>나의 일정</p>
      <div className='myScheduleCon'>
        {myFilteredSchedules.length > 0 && (
          myFilteredSchedules.map((schedule, index) => (
            <div className='mySchedule' key={index}>
              {schedule.text}
            </div>
          ))
        )}
        {showInput && (
          <input
            className='scheduleInput'
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleInputSubmit}
            placeholder="일정을 입력하세요"
          />
        )}
        {!showInput && myFilteredSchedules.length <= 4 && (
          <div className='plusSchedule' onClick={handlePlusClick}>
            +
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDetail;
