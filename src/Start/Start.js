import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Start.css';
import Homelearn from "../image/HOMELEARN.png";
import Kakao from "../image/Kakao.png";

const Start = () => {
  const navigate = useNavigate();

  // REST API KEY와 Redirect URI 설정
  const Rest_api_key = process.env.REACT_APP_KAKAO_REST_API_KEY; // REST API KEY
  const redirect_uri = `http://3.138.127.122:3000/auth/call`; // Redirect URI
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleKakaoClick = () => {
    window.location.href = kakaoURL // 카카오 로그인 URL로 리다이렉트
  };

  return (
    <div className="start-container">
      <div className="content">
        <div className="Start-text">야구의 모든 것을<br />한눈에 담다</div>
        <img src={Homelearn} alt="Homelearn Logo" className="homelearn-logo" />
        <div className="button-container">
          <button className="kakao-button" onClick={handleKakaoClick}>
            <img src={Kakao} alt="Kakao Icon" className="kakao-icon" />
            카카오톡으로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
